// =====================================================
// Raio X Artístico — Webhook do Google Sheets
// =====================================================
//
// Como usar:
// 1. Crie uma planilha no Google Sheets.
// 2. Abra Extensões → Apps Script.
// 3. Apaga o conteúdo padrão e cola TUDO deste arquivo.
// 4. Troca o SECRET abaixo por algo aleatório (ex: gere em uuidgenerator.net).
// 5. Salva (Ctrl+S), dá um nome ao projeto.
// 6. Clica em Deploy → New deployment.
//    - Type: Web app
//    - Description: webhook raio-x-artistico
//    - Execute as: Me (sua conta)
//    - Who has access: Anyone
//    - Deploy → autoriza acesso (vai pedir login Google e mostrar tela de "app não verificado",
//      clica em Advanced → Go to ... → Allow)
// 7. Copia a "Web app URL" que aparece (algo como
//    https://script.google.com/macros/s/AKfyc.../exec)
// 8. Manda pra Claude:
//    - O SECRET que você definiu (a string aleatória do item 4)
//    - A Web app URL do item 7

const SECRET = 'TROCAR_PARA_UMA_STRING_ALEATORIA';
const SHEET_NAME = 'Respostas';

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    if (body.secret !== SECRET) {
      return json({ ok: false, error: 'unauthorized' });
    }
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) sheet = ss.insertSheet(SHEET_NAME);

    if (body.action === 'appendRow') {
      if (!Array.isArray(body.row)) {
        return json({ ok: false, error: 'row deve ser array' });
      }
      sheet.appendRow(body.row);
      return json({ ok: true });
    }

    if (body.action === 'ensureHeader') {
      if (!Array.isArray(body.header)) {
        return json({ ok: false, error: 'header deve ser array' });
      }
      const lastCol = sheet.getLastColumn();
      const existing = lastCol > 0
        ? sheet.getRange(1, 1, 1, lastCol).getValues()[0]
        : [];
      const hasHeader = existing.some(v => v !== '' && v != null);
      if (!hasHeader) {
        sheet.getRange(1, 1, 1, body.header.length).setValues([body.header]);
        sheet.getRange(1, 1, 1, body.header.length).setFontWeight('bold');
        sheet.setFrozenRows(1);
      }
      return json({ ok: true, alreadyHadHeader: hasHeader });
    }

    return json({ ok: false, error: 'unknown action: ' + body.action });
  } catch (err) {
    return json({ ok: false, error: String(err && err.message || err) });
  }
}

function doGet() {
  return json({ ok: true, service: 'raio-x-artistico-sheets-webhook' });
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
