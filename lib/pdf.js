import PDFDocument from 'pdfkit';
import { SECTIONS } from './fields.js';

const GOLD = '#C9A84C';
const DARK = '#1A1712';
const MUTED = '#6E6651';

function formatDate(d) {
  return new Date(d).toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export async function generateDiagnosticoPDF({ id, createdAt, data }) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margin: 56,
      info: {
        Title: `Raio X Artístico — ${data.nome_artistico || 'Diagnóstico'} (#${id})`,
        Author: 'Giovanni Feghalli',
        Subject: 'Diagnóstico estratégico de carreira artística',
      },
    });

    const chunks = [];
    doc.on('data', c => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // Header
    doc.fillColor(GOLD).fontSize(10).text('RAIO X ARTÍSTICO', { align: 'left', characterSpacing: 2 });
    doc.moveDown(0.2);
    doc.fillColor(DARK).fontSize(24).text(data.nome_artistico || '(sem nome artístico)', { align: 'left' });
    doc.fillColor(MUTED).fontSize(10).text(
      `Diagnóstico #${id} • Enviado em ${formatDate(createdAt)}`,
      { align: 'left' }
    );
    doc.moveDown(0.5);
    doc.strokeColor(GOLD).lineWidth(1).moveTo(56, doc.y).lineTo(539, doc.y).stroke();
    doc.moveDown(1);

    for (const section of SECTIONS) {
      const hasAny = section.fields.some(([f]) => data[f] !== undefined && data[f] !== null && String(data[f]).trim() !== '');
      if (!hasAny) continue;

      if (doc.y > 720) doc.addPage();

      doc.fillColor(GOLD).fontSize(9).text(
        `SEÇÃO ${String(section.num).padStart(2, '0')} / 15`,
        { characterSpacing: 1.5 }
      );
      doc.fillColor(DARK).fontSize(15).text(section.title);
      doc.moveDown(0.6);

      for (const [field, label] of section.fields) {
        const raw = data[field];
        if (raw === undefined || raw === null || String(raw).trim() === '') continue;

        if (doc.y > 740) doc.addPage();

        doc.fillColor(MUTED).fontSize(9).text(label, { paragraphGap: 2 });
        doc.fillColor(DARK).fontSize(11).text(String(raw), {
          paragraphGap: 8,
          lineGap: 2,
        });
      }

      doc.moveDown(0.8);
    }

    // Footer
    const range = doc.bufferedPageRange();
    for (let i = 0; i < range.count; i++) {
      doc.switchToPage(range.start + i);
      doc.fillColor(MUTED).fontSize(8).text(
        `Página ${i + 1} de ${range.count}  •  Giovanni Feghalli — Gestão de Carreira Artística`,
        56,
        doc.page.height - 40,
        { align: 'center', width: doc.page.width - 112 }
      );
    }

    doc.end();
  });
}
