/**
 * Take the student straight to the writing notebook on the home page, from
 * anywhere in the app, and put the cursor in it.
 *
 * - Already on the home page: tell the notebook to scroll into view and focus.
 * - Anywhere else: remember the request, switch to the home page, and the
 *   notebook picks it up when it mounts.
 */
const FLAG = 'wilt:go-write';
export const WRITE_EVENT = 'wilt:write';

export const goWrite = (currentView, setCurrentView) => {
  if (currentView === 'notepad') {
    window.dispatchEvent(new Event(WRITE_EVENT));
    return;
  }
  try {
    sessionStorage.setItem(FLAG, '1');
  } catch {
    /* storage blocked: the event below still covers a fast mount */
  }
  setCurrentView('notepad');
  window.scrollTo(0, 0);
  // In case the notebook is already mounted by the time this runs
  setTimeout(() => window.dispatchEvent(new Event(WRITE_EVENT)), 450);
};

/** Called once by the notebook when it mounts: was it asked for? */
export const consumeWriteRequest = () => {
  try {
    if (sessionStorage.getItem(FLAG)) {
      sessionStorage.removeItem(FLAG);
      return true;
    }
  } catch {
    /* ignore */
  }
  return false;
};
