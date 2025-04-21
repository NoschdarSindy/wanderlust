export const pluralize = (count, noun, nounOnly = false) => {
  const suffix = noun === "child" ? "ren" : "s";
  return `${!nounOnly ? count + " " : ""}${noun}${count !== 1 || nounOnly ? suffix : ""}`;
};

export const getCssVariable = (variableName: string): string => {
  const formattedVariableName = variableName.startsWith("--")
    ? variableName
    : `--${variableName}`;

  const result = getComputedStyle(document.documentElement)
    .getPropertyValue(formattedVariableName)
    .trim();

  if (result) return result;
  console.warn(`CSS variable ${formattedVariableName} not found`);
};

export const formatDateRange = (start: string, end: string) =>
  `${new Date(start).toLocaleDateString("en-GB")} to ${new Date(end).toLocaleDateString("en-GB")}`;

export default getCssVariable;
