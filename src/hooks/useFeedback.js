import { useState, useEffect, useCallback, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export function useFeedback() {
  const queryClient = useQueryClient();
  const [isOnCooldown, setIsOnCooldown] = useState(false);
  const [upvotedIds, setUpvotedIds] = useState(new Set());
  const COOLDOWN_MS = 60 * 1000; // 60 seconds

  // Initialize and manage cooldown timer
  useEffect(() => {
    const last = parseInt(localStorage.getItem('last_feedback_time') || '0', 10);
    const remaining = COOLDOWN_MS - (Date.now() - last);
    if (remaining > 0) {
      setIsOnCooldown(true);
      const timer = setTimeout(() => setIsOnCooldown(false), remaining);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    try {
      const storedUpvotes = localStorage.getItem('upvoted_feedback_ids');
      if (storedUpvotes) {
        const parsed = JSON.parse(storedUpvotes);
        if (Array.isArray(parsed)) setUpvotedIds(new Set(parsed));
      }
    } catch (err) {
      console.error('[useFeedback] error loading upvotes:', err);
    }
  }, []);

  const { data: feedback = [], isLoading } = useQuery({
    queryKey: ['feedback'],
    queryFn: async () => {
      if (!supabase) return [];
      
      const { data, error } = await supabase
        .from('school_feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[useFeedback] fetch error:', error.message);
        throw error;
      }

      return (data || []).map(item => ({
        id: item.id,
        zoneId: item.zone_id,
        category: item.category,
        text: item.text,
        timestamp: item.created_at,
        upvotes: item.upvotes || 0,
      }));
    }
  });

  const addFeedback = async (zoneId, category, text) => {
    // Spam protection check
    const last = parseInt(localStorage.getItem('last_feedback_time') || '0', 10);
    if (Date.now() - last < COOLDOWN_MS) {
      console.warn('[useFeedback] Spam protection active.');
      return null;
    }

    // Length limit validation (Server-side equivalent fallback)
    if (!text || text.trim().length === 0 || text.length > 300) {
      console.warn('[useFeedback] Invalid text length.');
      return null;
    }

    // Optimistic update — shows immediately in the UI
    const tempId = uuidv4();
    const newEntry = {
      id: tempId,
      zoneId,
      category,
      text,
      timestamp: new Date().toISOString(),
      upvotes: 0,
    };
    
    queryClient.setQueryData(['feedback'], (old = []) => [newEntry, ...old]);

    if (!supabase) return newEntry; // no DB configured — optimistic only

    try {
      const { data, error } = await supabase
        .from('school_feedback')
        .insert([{ zone_id: zoneId, category, text }])
        .select()
        .single();

      if (error) {
        console.error('[useFeedback] insert error:', error.message, error.details, error.hint, error.code);
        // Revert the optimistic update and surface the error
        queryClient.setQueryData(['feedback'], (old = []) => old.filter(f => f.id !== tempId));
        return { error: error.message || 'Insert failed' };
      }

      // Replace optimistic entry with real DB row (gets the real UUID + created_at)
      if (data) {
        queryClient.setQueryData(['feedback'], (old = []) => old.map(f =>
          f.id === tempId
            ? { id: data.id, zoneId: data.zone_id, category: data.category, text: data.text, timestamp: data.created_at, upvotes: 0 }
            : f
        ));
      }
    } catch (err) {
      console.error('[useFeedback] unexpected insert error:', err);
      queryClient.setQueryData(['feedback'], (old = []) => old.filter(f => f.id !== tempId));
      return null;
    }

    // Mark successful submission for cooldown
    localStorage.setItem('last_feedback_time', Date.now().toString());
    setIsOnCooldown(true);
    setTimeout(() => setIsOnCooldown(false), COOLDOWN_MS);

    return newEntry;
  };

  const getFeedbackForZone = useCallback((zoneId) =>
    feedback
      .filter(f => f.zoneId === zoneId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
    [feedback]
  );

  const zoneCountsMemo = useMemo(() => {
    const counts = {};
    feedback.forEach(f => {
      if (f.zoneId && f.zoneId !== 'general') {
        counts[f.zoneId] = (counts[f.zoneId] || 0) + 1;
      }
    });
    return counts;
  }, [feedback]);

  const getZoneCounts = useCallback(() => zoneCountsMemo, [zoneCountsMemo]);

  const upvoteFeedback = async (id) => {
    if (upvotedIds.has(id)) return;

    // Optimistic update
    queryClient.setQueryData(['feedback'], (old = []) =>
      old.map(f => f.id === id ? { ...f, upvotes: (f.upvotes || 0) + 1 } : f)
    );
    
    setUpvotedIds(prev => {
      const newSet = new Set([...prev, id]);
      localStorage.setItem('upvoted_feedback_ids', JSON.stringify(Array.from(newSet)));
      return newSet;
    });

    if (!supabase) return;

    try {
      // Atomic increment via Supabase RPC (see supabase_tutorial.md for the SQL function)
      const { error } = await supabase.rpc('increment_upvotes', { row_id: id });
      if (error) console.error('[useFeedback] upvote error:', error.message);
    } catch (err) {
      console.error('[useFeedback] upvote error:', err);
    }
  };

  return { feedback, isLoading, addFeedback, getFeedbackForZone, getZoneCounts, upvoteFeedback, upvotedIds, isOnCooldown };

}
