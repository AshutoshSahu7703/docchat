import pdf from 'pdf-parse/lib/pdf-parse.js';
// returns array of page texts
export async function extractPages(file) {
  if (file.mimetype !== 'application/pdf') {
    const t = file.buffer.toString('utf8');
    const words = t.split(/\s+/); const pages = [];
    for (let i = 0; i < words.length; i += 400) pages.push(words.slice(i, i + 400).join(' '));
    return pages;
  }
  const pages = [];
  await pdf(file.buffer, {
    pagerender: async (p) => {
      const tc = await p.getTextContent();
      const text = tc.items.map((i) => i.str).join(' ');
      pages.push(text);
      return text;
    },
  });
  return pages;
}
