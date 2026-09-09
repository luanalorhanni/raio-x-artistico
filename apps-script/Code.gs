// =====================================================
// Raio X Artístico — Webhook do Google Sheets
// =====================================================
//
// Como usar (2 modos):
//
// MODO A - Script bound à planilha (recomendado):
//   1. Crie a planilha. Em Extensões → Apps Script cola tudo isto.
//   2. Deixa SHEET_ID = '' (vazio).
//
// MODO B - Script standalone (criado em script.google.com):
//   1. Crie a planilha separadamente.
//   2. Copia o ID dela: na URL https://docs.google.com/spreadsheets/d/{ESTE_ID}/edit
//   3. Preenche SHEET_ID com esse ID abaixo.
//
// Continuação (ambos modos):
// 4. Troca o SECRET abaixo por algo aleatório (uuidgenerator.net).
// 5. Salva (Ctrl+S), dá nome ao projeto.
// 6. Clica em Deploy → New deployment.
//    - Type: Web app
//    - Description: webhook raio-x-artistico
//    - Execute as: Me (sua conta)
//    - Who has access: Anyone
//    - Deploy → autoriza acesso (vai pedir login Google e mostrar tela de "app não verificado",
//      clica em Advanced → Go to ... → Allow)
// 7. Copia a "Web app URL" que aparece (algo como
//    https://script.google.com/macros/s/AKfyc.../exec)
// 8. Guarde os dois valores para configurar as env vars do projeto:
//    - SHEETS_WEBHOOK_SECRET: o SECRET que você definiu (item 4)
//    - SHEETS_WEBHOOK_URL: a Web app URL do item 7

const SECRET = 'TROCAR_PARA_UMA_STRING_ALEATORIA';
const SHEET_NAME = 'Respostas';
// Pra script standalone (criado em script.google.com), preencha o SHEET_ID
// com o ID da planilha (a parte entre /d/ e /edit na URL).
// Pra script bound (criado em Extensões → Apps Script dentro da planilha),
// deixe SHEET_ID = '' e o script usa a planilha onde está vinculado.
const SHEET_ID = '';

function getSpreadsheet() {
  if (SHEET_ID) return SpreadsheetApp.openById(SHEET_ID);
  const active = SpreadsheetApp.getActiveSpreadsheet();
  if (!active) {
    throw new Error('Script standalone sem SHEET_ID configurado. Preencha a constante SHEET_ID com o ID da planilha.');
  }
  return active;
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    if (body.secret !== SECRET) {
      return json({ ok: false, error: 'unauthorized' });
    }
    const ss = getSpreadsheet();
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
