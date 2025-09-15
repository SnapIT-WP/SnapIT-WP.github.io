const DATA_ENTRY_SHEET_NAME = "Sheet1";
const TIME_STAMP_COLUMN_NAME = "Timestamp";
const FOLDER_ID = "";

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
      DATA_ENTRY_SHEET_NAME
    );
    if (!sheet) {
      throw new Error(`Sheet '${DATA_ENTRY_SHEET_NAME}' not found`);
    }

    const formData = e.postData.contents ? JSON.parse(e.postData.contents) : {};

    // Prepare data for sheet
    const rowData = {
      ...formData,
      [TIME_STAMP_COLUMN_NAME]: new Date().toISOString(),
    };

    appendToGoogleSheet(rowData, sheet);

    return ContentService.createTextOutput(
      JSON.stringify({
        status: "success",
        message: "Data submitted successfully",
      })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    console.error(error);
    return ContentService.createTextOutput(
      JSON.stringify({
        status: "error",
        message: error.toString(),
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
/**
 * Appends data to the Google Sheet
 */
function appendToGoogleSheet(data, sheet) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

  // If sheet is empty, create headers
  if (headers.length === 0 || headers[0] === "") {
    const newHeaders = Object.keys(data);
    sheet.getRange(1, 1, 1, newHeaders.length).setValues([newHeaders]);
    headers = newHeaders;
  }

  // Map data to header columns
  const rowData = headers.map((header) => data[header] || "");
  sheet.appendRow(rowData);
}
