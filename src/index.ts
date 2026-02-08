import dotenv from "dotenv";
import path from "path";
import { google, sheets_v4 } from "googleapis";

dotenv.config();

export type SheetsExportConfig = {
  spreadsheetId: string;
  credentialsPath: string;
};

const loadConfig = (): SheetsExportConfig => {
  const spreadsheetId = process.env.SPREADSHEET_ID;
  if (!spreadsheetId) throw new Error("Missing required env var: SPREADSHEET_ID");

  const credentialsPath = path.resolve(process.env.GOOGLE_SERVICE_ACCOUNT_PATH || "./credentials.json");

  return { spreadsheetId, credentialsPath };
};

export class SheetsExporter {
  private sheets: sheets_v4.Sheets | null = null;
  private config: SheetsExportConfig;

  constructor(config?: Partial<SheetsExportConfig>) {
    const envConfig = loadConfig();
    this.config = { ...envConfig, ...config };
  }

  private async getClient(): Promise<sheets_v4.Sheets> {
    if (this.sheets) return this.sheets;

    const auth = new google.auth.GoogleAuth({
      keyFile: this.config.credentialsPath,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    this.sheets = google.sheets({ version: "v4", auth });
    return this.sheets;
  }

  async appendRows({ sheetName, rows }: { sheetName: string; rows: (string | number)[][] }): Promise<void> {
    if (rows.length === 0) return;

    const client = await this.getClient();
    await client.spreadsheets.values.append({
      spreadsheetId: this.config.spreadsheetId,
      range: `${sheetName}!A1`,
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: rows },
    });
  }
}
