
export const dateText = (d: string): string => {
  const date = new Date(`${d}T01:00:00`);
  return !isNaN(date.getTime()) ? date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }) : "?";
}

export const dateRange = (start: string, end: string): string =>
  [start, end].map(dateText).join("—");