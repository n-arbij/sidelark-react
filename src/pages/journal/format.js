const dateFormatter = new Intl.DateTimeFormat([], {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

export function formatDate(value) {
  return dateFormatter.format(new Date(value));
}

export function previewOf(content, limit = 140) {
  const text = content.trim();
  return text.length > limit ? `${text.slice(0, limit).trim()}...` : text;
}

export function colorFor(id) {
  const colors = ['#90e2f4', '#f6c85f', '#f6a6a6', '#b8e0c8', '#d5c6f2'];
  return colors[Number(id) % colors.length];
}
