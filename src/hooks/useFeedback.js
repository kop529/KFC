import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export function useFeedback() {
  const [feedback, setFeedback] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all feedback on mount
  const fetchFeedback = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('school_feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching feedback:', error);
        return;
      }

      if (data) {
        // Map snake_case from DB to camelCase for the frontend
        const formattedData = data.map(item => ({
          id: item.id,
          zoneId: item.zone_id,
          category: item.category,
          text: item.text,
          timestamp: item.created_at,
          upvotes: item.upvotes || 0
        }));
        setFeedback(formattedData);
      }
    } catch (err) {
      console.error('Unexpected error fetching feedback:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Only fetch if Supabase is configured
    if (import.meta.env.VITE_SUPABASE_URL) {
      fetchFeedback();
    } else {
      console.warn("Supabase credentials missing. Feedback will not load.");
      setIsLoading(false);
    }
  }, [fetchFeedback]);

  const addFeedback = async (zoneId, category, text) => {
    // Optimistic UI update
    const newEntry = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2),
      zoneId,
      category,
      text,
      timestamp: new Date().toISOString(),
      upvotes: 0
    };
    
    setFeedback(prev => [newEntry, ...prev]);

    if (!import.meta.env.VITE_SUPABASE_URL) return newEntry;

    try {
      const { error } = await supabase
        .from('school_feedback')
        .insert([
          {
            zone_id: zoneId,
            category: category,
            text: text,
            // created_at is handled by Postgres automatically
          }
        ]);

      if (error) {
        console.error('Error saving feedback:', error);
        // Revert optimistic update on failure
        setFeedback(prev => prev.filter(f => f.id !== newEntry.id));
      }
    } catch (err) {
      console.error('Unexpected error saving feedback:', err);
      setFeedback(prev => prev.filter(f => f.id !== newEntry.id));
    }

    return newEntry;
  };

  const getFeedbackForZone = (zoneId) => {
    return feedback.filter(f => f.zoneId === zoneId).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  const getZoneCounts = () => {
    const counts = {};
    feedback.forEach(f => {
      counts[f.zoneId] = (counts[f.zoneId] || 0) + 1;
    });
    return counts;
  };

  return { feedback, isLoading, addFeedback, getFeedbackForZone, getZoneCounts };
}
