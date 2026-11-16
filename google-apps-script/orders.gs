/**
 * Naturally Nella order list.
 *
 * Paste this into the Google Sheet's Apps Script editor (Extensions > Apps Script),
 * run setup() once, then deploy it as a web app. Full steps: SETUP.md next to this file.
 *
 * The website POSTs each basket order here. The script gives it the next order
 * number (NN-0001, NN-0002, ...), adds a row to the "Orders" tab and returns the
 * number, which the website then puts in the WhatsApp message and order email.
 *
 * Nothing here is secret: the repo is public and the web app URL is in the website.
 */

const SHEET_NAME = "Orders";

const HEADERS = [
  "Order", "Date", "Status", "Paid", "Total", "Name", "Phone", "Email",
  "Delivery", "Address", "Map", "Location pin",
  "Items", "Subtotal", "Delivery fee", "Notes",
];

// Shows amounts as R95, R1,250 while keeping them numbers that Sheets can add up.
const RAND_FORMAT = '"R"#,##0';

const STATUSES = ["New", "Invoiced", "Paid", "Packed", "Sent / collected", "Not received", "Cancelled"];

const COL = Object.fromEntries(HEADERS.map((h, i) => [h, i + 1]));

/** Run once from the Apps Script editor to create and format the Orders tab. */
function setup() {
  const ss = SpreadsheetApp.getActive();
  ss.setSpreadsheetTimeZone("Africa/Johannesburg");
  const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME, 0);

  sheet.getRange(1, 1, 1, HEADERS.length)
    .setValues([HEADERS])
    .setFontWeight("bold")
    .setBackground("#8c4446")
    .setFontColor("#ffffff");
  sheet.setFrozenRows(1);

  const widths = { Order: 90, Date: 130, Status: 130, Paid: 50, Total: 80, Name: 140, Phone: 120, Email: 180,
    Delivery: 200, Address: 260, Map: 120, "Location pin": 120, Items: 360, Subtotal: 80,
    "Delivery fee": 150, Notes: 240 };
  Object.entries(widths).forEach(([h, w]) => sheet.setColumnWidth(COL[h], w));

  // Remove the blank "Sheet1" Google adds to new spreadsheets.
  const blank = ss.getSheetByName("Sheet1");
  if (blank && blank.getLastRow() === 0 && ss.getSheets().length > 1) ss.deleteSheet(blank);
}

/** Visiting the web app URL in a browser shows this, which is a quick way to check it is live. */
function doGet() {
  return ContentService.createTextOutput("The Naturally Nella order sheet is running.");
}

/** Receives an order from the website and returns { ok, number }. */
function doPost(e) {
  let data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return json({ ok: false, error: "Bad request" });
  }
  if (data._honey) return json({ ok: false, error: "Rejected" }); // spam bot filled the hidden field
  if (!text(data.name) || !text(data.phone) || !text(data.items)) {
    return json({ ok: false, error: "Missing details" });
  }

  // The lock stops two orders arriving together from getting the same number.
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const props = PropertiesService.getScriptProperties();
    const next = Number(props.getProperty("lastOrder") || 0) + 1;
    const number = "NN-" + String(next).padStart(4, "0");

    const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
    const row = [];
    row[COL.Order - 1] = number;
    row[COL.Date - 1] = new Date();
    row[COL.Status - 1] = "New";
    row[COL.Paid - 1] = false;
    row[COL.Name - 1] = cell(data.name, 100);
    // The leading ' stores it as text, so Sheets keeps the leading 0 (082...) instead of making it a number.
    row[COL.Phone - 1] = "'" + text(data.phone).slice(0, 40);
    row[COL.Email - 1] = cell(data.email, 200);
    row[COL.Delivery - 1] = cell(data.delivery, 100);
    row[COL.Address - 1] = cell(data.address, 400);
    row[COL.Map - 1] = link(data.map, "Map");
    row[COL["Location pin"] - 1] = link(data.pin, "Pin");
    row[COL.Items - 1] = cell(data.items, 3000);
    // Amounts arrive as text like "R95" or "R300 (excl. delivery)"; store the number.
    const total = amount(data.total);
    const fee = amount(data.deliveryFee);
    row[COL.Total - 1] = total === null ? cell(data.total, 40) : total;
    row[COL.Subtotal - 1] = amount(data.subtotal) === null ? cell(data.subtotal, 20) : amount(data.subtotal);
    row[COL["Delivery fee"] - 1] = fee === null ? cell(data.deliveryFee, 40) : fee; // e.g. "Added to your invoice"
    row[COL.Notes - 1] = /excl\. delivery/.test(text(data.total))
      ? "Total excludes delivery. Add the delivery fee to the invoice."
      : "";
    sheet.appendRow(row);

    const r = sheet.getLastRow();
    sheet.getRange(r, COL.Date).setNumberFormat("d mmm yyyy, hh:mm");
    sheet.getRange(r, COL.Status).setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(STATUSES, true).build()
    );
    sheet.getRange(r, COL.Paid).insertCheckboxes();
    sheet.getRange(r, COL.Items).setWrap(true);
    [COL.Total, COL.Subtotal, COL["Delivery fee"]].forEach((c) => sheet.getRange(r, c).setNumberFormat(RAND_FORMAT));

    props.setProperty("lastOrder", String(next));
    return json({ ok: true, number: number });
  } finally {
    lock.releaseLock();
  }
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/** "R1,250" or "R95 (excl. delivery)" -> 1250 or 95; anything else -> null. */
function amount(v) {
  const m = text(v).match(/^R\s?([\d,]+(?:\.\d+)?)/);
  if (!m) return null;
  const n = Number(m[1].replace(/,/g, ""));
  return isFinite(n) && n >= 0 && n < 1000000 ? n : null;
}

function text(v) {
  return String(v == null ? "" : v).trim();
}

/** Plain text for a cell. A leading = + - @ would make Sheets treat it as a formula, so escape it. */
function cell(v, max) {
  const s = text(v).slice(0, max);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

/** A clickable link, but only to Google Maps (the only links the website sends). */
function link(url, label) {
  const s = text(url);
  if (!/^https:\/\/www\.google\.com\/maps\/[^"]*$/.test(s) || s.length > 600) return "";
  return '=HYPERLINK("' + s + '","' + label + '")';
}
