export function getUserId() {
  const userStr = localStorage.getItem('bglow_user');
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      return user.id || 'guest';
    } catch (e) {
      return 'guest';
    }
  }
  return 'guest';
}

export function getRoutine() {
  const data = localStorage.getItem('bglow_routine_' + getUserId());
  if (data) return JSON.parse(data);
  return { morning: [], night: [] };
}

export function saveRoutine(routine) {
  localStorage.setItem('bglow_routine_' + getUserId(), JSON.stringify(routine));
}


export function getSpecialSchedule() {
  const data = localStorage.getItem('bglow_special_schedule_' + getUserId());
  if (data) return JSON.parse(data);
  return { morning: {}, night: {} }; // e.g. { morning: { 1: [steps...], 3: [steps...] } }
}

export function saveSpecialSchedule(schedule) {
  localStorage.setItem('bglow_special_schedule_' + getUserId(), JSON.stringify(schedule));
}

export function getTodayDateString() {
  const now = new Date();
  return `${now.getFullYear()}_${now.getMonth() + 1}_${now.getDate()}`;
}

export function getProgress() {
  const key = `bglow_progress_${getUserId()}_${getTodayDateString()}`;
  const data = localStorage.getItem(key);
  if (data) return JSON.parse(data);
  return { morning: [], night: [] };
}

export function saveProgress(progress) {
  const key = `bglow_progress_${getUserId()}_${getTodayDateString()}`;
  localStorage.setItem(key, JSON.stringify(progress));
}

export function getStreak() {
  const data = localStorage.getItem('bglow_streak_' + getUserId());
  if (data) return JSON.parse(data);
  return { current: 0, best: 0, lastDate: null, completedDays: Array(7).fill(false) };
}

export function saveStreak(streak) {
  localStorage.setItem('bglow_streak_' + getUserId(), JSON.stringify(streak));
}

export function clearUserData() {
  // Obsolete: Data is now scoped per-user. We don't delete it.
}

export async function syncUserData(fields) {
  const userId = getUserId();
  if (userId && userId !== 'guest') {
    try {
      await fetch(`http://localhost:8000/api/user/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields)
      });
    } catch (e) {
      console.error("Gagal sinkronisasi data ke server:", e);
    }
  }
}
