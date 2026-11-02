/**
 * WILT reviews: Google Apps Script for the "WILT Reviews" Google Sheet.
 *
 * SETUP (about 5 minutes, done once):
 * 1. Create a Google Sheet named "WILT Reviews". In row 1 type these headers:
 *      Timestamp | Name | College | Rating | Review | User ID | Approved
 * 2. In the sheet: Extensions > Apps Script. Delete what's there, paste this whole file.
 * 3. Change SECRET below to a long random string (e.g. 40 random letters/numbers).
 * 4. Deploy > New deployment > type "Web app".
 *      Execute as: Me      Who has access: Anyone
 *    Click Deploy, allow access, and copy the "Web app URL".
 * 5. In Vercel > WILT project > Settings > Environment Variables, add:
 *      REVIEWS_SCRIPT_URL = the Web app URL
 *      REVIEWS_SECRET     = the same secret as below
 *    Then redeploy the site.
 *
 * APPROVING REVIEWS: new reviews arrive with Approved = no.
 * Change it to "yes" for the ones that should appear on the site.
 * (The site refreshes its copy every 5 minutes.)
 */

const SECRET = 'CHANGE-ME-to-a-long-random-string';
const SHEET_NAME = ''; // leave empty to use the first sheet

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return SHEET_NAME ? ss.getSheetByName(SHEET_NAME) : ss.getSheets()[0];
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// Approved reviews only
function doGet(e) {
  if (!e || !e.parameter || e.parameter.secret !== SECRET) return json_({ error: 'unauthorised' });
  const rows = sheet_().getDataRange().getValues();
  const reviews = [];
  for (let i = 1; i < rows.length; i++) {
    const [timestamp, name, college, rating, review, userId, approved] = rows[i];
    if (String(approved).trim().toLowerCase() !== 'yes') continue;
    reviews.push({
      id: 'r' + (i + 1),
      timestamp: timestamp instanceof Date ? timestamp.toISOString() : String(timestamp),
      name: String(name),
      college: String(college),
      rating: Number(rating),
      review: String(review)
    });
  }
  return json_({ reviews: reviews });
}

// New review, saved as not approved
function doPost(e) {
  let data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return json_({ error: 'bad request' });
  }
  if (data.secret !== SECRET) return json_({ error: 'unauthorised' });

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    sheet_().appendRow([
      new Date(),
      String(data.name || '').slice(0, 40),
      String(data.college || '').slice(0, 60),
      Number(data.rating) || '',
      String(data.review || '').slice(0, 500),
      String(data.userId || '').slice(0, 80),
      'no'
    ]);
  } finally {
    lock.releaseLock();
  }
  return json_({ ok: true });
}
