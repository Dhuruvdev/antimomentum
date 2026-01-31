import { jsPDF } from "jspdf";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";

export async function exportToPdf(title: string, content: string) {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text(title, 20, 20);
  
  // Add content
  doc.setFontSize(12);
  const splitText = doc.splitTextToSize(content, 170);
  doc.text(splitText, 20, 40);
  
  doc.save(`${title.replace(/\s+/g, '_')}.pdf`);
}

export async function exportToDocx(title: string, content: string) {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: title,
                bold: true,
                size: 32,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "\n" + content,
                size: 24,
              }),
            ],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${title.replace(/\s+/g, '_')}.docx`);
}
