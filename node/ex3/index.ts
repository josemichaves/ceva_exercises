export function getCapitalizeFirstWord(name: string | null): string {
  if (name == null) {
    throw new Error("Failed to capitalize first word with null");
  }
  if (!name) {
    return name;
  }
  return name
    .split(" ")
    .map((n) =>
      n.length >= 1
        ? n.substring(0, 1).toUpperCase() + n.substring(1).toLowerCase()
        : n
    )
    .join(" ");
}
