import { Resend } from 'resend';
import { SECTIONS } from './fields.js';

const NOTIFY_TO = process.env.NOTIFY_EMAIL || 'REDACTED_EMAIL';
const FROM = process.env.RESEND_FROM || 'Raio X Artístico <onboarding@resend.dev>';

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function slug(s) {
  return String(s || 'diagnostico')
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40) || 'diagnostico';
}

function buildHtmlPreview(id, data) {
  // Pequena seleção de campos pra o corpo do email (não a planilha inteira — o PDF tem tudo).
  const highlight = [
    ['Nome artístico', data.nome_artistico],
    ['Nome completo', data.nome_completo],
    ['Idade', data.idade],
    ['Cidade / Estado', data.cidade_estado],
    ['Telefone', data.telefone],
    ['E-mail', data.email],
    ['Instagram', data.instagram],
    ['Mercado', data.mercado],
    ['Grande sonho', data.grande_sonho],
    ['Comprometimento', data.comprometimento != null ? `${data.comprometimento}/10` : null],
  ];

  const rows = highlight
    .filter(([, v]) => v != null && String(v).trim() !== '')
    .map(([k, v]) => `
      <tr>
        <td style="padding:6px 12px 6px 0;color:#6E6651;font-size:13px;vertical-align:top;width:160px;">${esc(k)}</td>
        <td style="padding:6px 0;color:#1A1712;font-size:14px;">${esc(v)}</td>
      </tr>
    `).join('');

  const sectionsCount = SECTIONS.filter(s =>
    s.fields.some(([f]) => data[f] != null && String(data[f]).trim() !== '')
  ).length;

  return `
<!doctype html>
<html><body style="margin:0;padding:24px;background:#FAF7EE;font-family:-apple-system,Segoe UI,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border:1px solid #E8DFC4;border-radius:12px;overflow:hidden;">
    <div style="background:#1A1712;padding:24px 32px;">
      <div style="color:#C9A84C;font-size:11px;letter-spacing:2px;font-weight:600;">RAIO X ARTÍSTICO</div>
      <div style="color:#F0EAD6;font-size:22px;font-weight:700;margin-top:6px;">Novo diagnóstico recebido</div>
    </div>
    <div style="padding:24px 32px;">
      <p style="margin:0 0 16px;color:#1A1712;font-size:15px;line-height:1.6;">
        <strong>${esc(data.nome_artistico || 'Artista sem nome informado')}</strong> acabou de enviar o diagnóstico estratégico.
      </p>
      <table style="width:100%;border-collapse:collapse;margin:8px 0 20px;">${rows}</table>
      <p style="margin:0 0 4px;color:#6E6651;font-size:13px;">
        O PDF completo com todas as ${sectionsCount} seções respondidas está anexado a este email.
      </p>
      <p style="margin:0;color:#6E6651;font-size:13px;">Diagnóstico #${id}</p>
    </div>
    <div style="padding:16px 32px;background:#FAF7EE;color:#8A8069;font-size:12px;text-align:center;">
      Giovanni Feghalli — Gestão de Carreira Artística
    </div>
  </div>
</body></html>
  `.trim();
}

export async function sendDiagnosticoEmail({ id, data, pdfBuffer }) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY não configurada');
  }
  const resend = new Resend(process.env.RESEND_API_KEY);
  const subjectName = data.nome_artistico || data.nome_completo || 'artista';
  const subjectCity = data.cidade_estado ? ` (${data.cidade_estado})` : '';

  const result = await resend.emails.send({
    from: FROM,
    to: [NOTIFY_TO],
    replyTo: data.email || undefined,
    subject: `Novo diagnóstico: ${subjectName}${subjectCity}`,
    html: buildHtmlPreview(id, data),
    attachments: [
      {
        filename: `diagnostico-${id}-${slug(subjectName)}.pdf`,
        content: pdfBuffer,
      },
    ],
  });

  if (result.error) {
    throw new Error(result.error.message || JSON.stringify(result.error));
  }
  return result.data;
}
