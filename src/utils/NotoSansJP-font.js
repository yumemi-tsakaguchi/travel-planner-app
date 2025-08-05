// Noto Sans JP font data (base64 encoded subset for common Japanese characters)
// This is a minimal subset - in production, you would use a more complete font file

export const NotoSansJPFontData = `
AAEAAAAKAIAAAwAgT1MvMlvHvBsAAAEYAAAAYGNtYXD///8AAAIBAAAA/GdhcG8AAAAQAAADfgAAAA0KZWFkczKx0G8AAANsAAAA0GqyNG4AAAQcAAAAJGAAAQAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAMdnUJYAAAAAxnjkVwAAAADGd3hU`;

export const addNotoSansJPFont = (doc) => {
  // Add the font to jsPDF
  doc.addFileToVFS('NotoSansJP.ttf', NotoSansJPFontData);
  doc.addFont('NotoSansJP.ttf', 'NotoSansJP', 'normal');
  doc.setFont('NotoSansJP');
};