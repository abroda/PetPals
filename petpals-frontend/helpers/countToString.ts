export const countToString = (count: number) => {
  return count < 1000
    ? count.toString()
    : count < 1000000
    ? Math.floor(count / 1000).toString() + "K"
    : count < 1000000000
    ? Math.floor(count / 1000000).toString() + "M"
    : count < 1000000000000
    ? Math.floor(count / 1000000000).toString() + "B"
    : Math.floor(count / 1000000000000).toString() + "T";
};
