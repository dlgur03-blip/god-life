export function getTodayStr() {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Seoul' });
}

export function formatDate(date: Date) {
  return date.toLocaleDateString('en-CA', { timeZone: 'Asia/Seoul' });
}
