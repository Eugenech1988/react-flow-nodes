const VARIABLE_PATTERN = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;

export const extractVariables = (text: string): string[] => {
  const uniqueVariables: string[] = [];
  const seenNames = new Set<string>();
  const pattern = new RegExp(VARIABLE_PATTERN);
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    const variableName = match[1];
    if (!seenNames.has(variableName)) {
      seenNames.add(variableName);
      uniqueVariables.push(variableName);
    }
  }

  return uniqueVariables;
};
