// Page-wise word chunking with overlap, page number preserved for citations
export function chunkPages(pages, size = 220, overlap = 40) {
  const out = [];
  pages.forEach((text, i) => {
    const words = text.replace(/\s+/g, ' ').trim().split(' ').filter(Boolean);
    for (let s = 0; s < words.length; s += size - overlap) {
      const piece = words.slice(s, s + size).join(' ');
      if (piece.length > 40) out.push({ text: piece, page: i + 1 });
      if (s + size >= words.length) break;
    }
  });
  return out.map((c, index) => ({ ...c, index }));
}
