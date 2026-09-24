export const capitalize = (value: string) => {
  return value
    .trim()
    .split(/\s+/)
    .map((word) =>
      word ? word[0].toUpperCase() + word.slice(1).toLowerCase() : ""
    )
    .join(" ");
};
