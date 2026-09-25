/** Replaces {placeholders} in content strings, e.g. "Showing {count} of {total}". */
export const fillTemplate = (template: string, values: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
