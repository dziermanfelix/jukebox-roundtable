export const currentTimeSeconds = () => {
  return Math.floor(Date.now() / 1000);
};

export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
