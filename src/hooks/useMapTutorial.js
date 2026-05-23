import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'map_tutorial_seen';
const TOTAL_STEPS = 5; // 0=welcome, 1=zone-highlight, 2=panel-pointer, 3=modal-pointer, 4=done

/**
 * Manages the one-time first-visit tutorial on the map page.
 *
 * Returns:
 *   showTutorial  — boolean, whether to render <MapTutorial>
 *   step          — 0-3  (3 = "done" banner)
 *   demoZoneId    — randomly-selected zone id for the walkthrough
 *   nextStep()    — advance one step; step 3 marks tutorial complete
 *   skipTutorial()— immediately mark complete and dismiss
 */
export function useMapTutorial() {
  // Always use the Sports Track as the tutorial demo zone
  const demoZoneId = 'sports-track';

  const [showTutorial, setShowTutorial] = useState(false);
  const [step, setStep] = useState(0);

  // On mount — only show if the user has never completed the tutorial
  useEffect(() => {
    const seen = localStorage.getItem(STORAGE_KEY);
    if (!seen) {
      setShowTutorial(true);
    }
  }, []);

  const markSeen = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, '1');
    setShowTutorial(false);
  }, []);

  const nextStep = useCallback(() => {
    setStep(prev => {
      const next = prev + 1;
      if (next >= TOTAL_STEPS - 1) {
        // Show done banner briefly then dismiss
        setTimeout(markSeen, 2200);
        return next;
      }
      return next;
    });
  }, [markSeen]);

  const skipTutorial = useCallback(() => {
    markSeen();
  }, [markSeen]);

  const startTutorial = useCallback(() => {
    setStep(0);
    setShowTutorial(true);
  }, []);

  return { showTutorial, step, demoZoneId, nextStep, skipTutorial, startTutorial };
}
