export const currentTimeSeconds = () => {
  return Math.floor(Date.now() / 1000);
};

export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function convertMsToDisplayTime(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}
