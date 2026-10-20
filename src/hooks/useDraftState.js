import { useState, useEffect } from 'react';

const isBlank = (v) =>
  v === null ||
  v === undefined ||
  (typeof v === 'string' && v.trim() === '') ||
  (Array.isArray(v) && v.every(isBlank));

/**
 * useState that survives navigation and page reloads by mirroring the value
 * into localStorage. Used for unpublished drafts so a student who switches
 * pages mid-way doesn't lose what they wrote. Blank values clear the draft.
 */
export function useDraftState(key, initialValue) {
  const storageKey = `wilt_draft_v1_${key}`;

  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw !== null ? JSON.parse(raw) : initialValue;
    } catch (e) {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      if (isBlank(value) || JSON.stringify(value) === JSON.stringify(initialValue)) {
        localStorage.removeItem(storageKey);
      } else {
        localStorage.setItem(storageKey, JSON.stringify(value));
      }
    } catch (e) {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey, value]);

  return [value, setValue];
}

export default useDraftState;
