# Setting up the order sheet

The website can record every basket order in a Google Sheet, giving it a sequential order number (NN-0001, NN-0002, …). The setup takes about 10 minutes and must be done by someone signed in to the Google account that will own the sheet. We recommend the business account, **naturallynella3@gmail.com**, where the order emails already arrive.

Until this is set up, the website still works. It gives each order a random number like NN-261116-K7Q2 instead.

## 1. Create the sheet

1. Sign in to Google as the business account.
2. Go to [sheets.new](https://sheets.new) to create a blank spreadsheet.
3. Click "Untitled spreadsheet" at the top left and name it **Naturally Nella Orders**.

## 2. Add the script

1. In the sheet's menu, choose **Extensions → Apps Script**. A code editor opens in a new tab.
2. Delete the code that is already there (`function myFunction() {…}`).
3. Copy everything in [`orders.gs`](orders.gs) and paste it into the editor.
4. Click the **Save** icon (the floppy disk).
5. Click "Untitled project" at the top and name it **Naturally Nella Orders**.

## 3. Run setup once

1. In the toolbar, check the function drop-down shows **setup**, then click **Run**.
2. Google asks for permission:
   - Click **Review permissions** and choose the business account.
   - You'll see "Google hasn't verified this app". That's expected, because it's your own script. Click **Advanced**, then **Go to Naturally Nella Orders (unsafe)**.
   - Click **Allow**.
3. Go back to the spreadsheet tab. There's now an **Orders** tab with rosewood column headings.

## 4. Publish it for the website

1. In the Apps Script tab, click **Deploy → New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Fill in:
   - **Description:** Website orders
   - **Execute as:** Me (the business account)
   - **Who has access:** Anyone

   "Anyone" lets the website send orders in. It does **not** let anyone open or read the sheet. The sheet stays private.
4. Click **Deploy**. Approve the permissions again if asked.
5. Copy the **Web app URL**. It starts with `https://script.google.com/macros/s/` and ends with `/exec`.
6. Send that URL to Devon so it can be added to the website.

To check it worked, open the URL in a browser. It should say "The Naturally Nella order sheet is running."

## 5. Share the sheet

In the spreadsheet, click **Share** and add Danelle's and Cathy's own email addresses as **Editors** so they can update orders from their phones (Google Sheets app). Only share it with people who handle orders, because it holds customers' names, phone numbers and addresses.

## Using the sheet

Each order is a new row at the bottom:

- **Status:** a drop-down. New → Invoiced → Paid → Packed → Sent / collected. Use **Not received** if the order is in the sheet but the WhatsApp message never arrived (the customer didn't press send), and **Cancelled** if it falls through.
- **Paid:** tick when the money reflects.
- **Total:** the amount owed, next to Paid. For local delivery it excludes the delivery fee (the Notes column says so), because that fee depends on distance and goes on the invoice. Amounts are numbers, so selecting the column shows their sum at the bottom right.
- **Map** and **Location pin:** tap to open Google Maps with directions.
- **Notes:** free for your own notes.

Filter or sort with **Data → Create a filter**. Deleting a row is fine. Order numbers never repeat, even after deleting.

## Changing the script later

After editing the code in Apps Script, click **Deploy → Manage deployments**, click the pencil icon, set **Version** to **New version** and click **Deploy**. This keeps the same URL, so the website doesn't need changing. Creating a *new deployment* instead gives a new URL, and the website would need updating.

If you change the columns (for example after updating the script), run **setup** again from the Apps Script editor to rewrite the headings. Rows added before the change keep their old column positions, so delete or move them first.
