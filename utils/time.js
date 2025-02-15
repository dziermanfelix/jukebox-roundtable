export const currentTimeSeconds = () => {
  return Math.floor(Date.now() / 1000);
};

export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function convertMsToDisplayTime(ms) {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor(ms / (1000 * 60 * 60));

  const h = hours > 0 ? (hours > 10 ? String(hours).padStart(2, '0') + ':' : hours + ':') : '';
  const m = hours > 0 ? String(minutes).padStart(2, '0') + ':' : minutes + ':';
  const s = String(seconds).padStart(2, '0');

  return h + m + s;
}
