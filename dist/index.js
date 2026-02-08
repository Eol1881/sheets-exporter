"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SheetsExporter = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const googleapis_1 = require("googleapis");
dotenv_1.default.config();
const loadConfig = () => {
    const spreadsheetId = process.env.SPREADSHEET_ID;
    if (!spreadsheetId)
        throw new Error("Missing required env var: SPREADSHEET_ID");
    const credentialsPath = path_1.default.resolve(process.env.GOOGLE_SERVICE_ACCOUNT_PATH || "./credentials.json");
    return { spreadsheetId, credentialsPath };
};
class SheetsExporter {
    constructor(config) {
        this.sheets = null;
        const envConfig = loadConfig();
        this.config = { ...envConfig, ...config };
    }
    async getClient() {
        if (this.sheets)
            return this.sheets;
        const auth = new googleapis_1.google.auth.GoogleAuth({
            keyFile: this.config.credentialsPath,
            scopes: ["https://www.googleapis.com/auth/spreadsheets"],
        });
        this.sheets = googleapis_1.google.sheets({ version: "v4", auth });
        return this.sheets;
    }
    async appendRows({ sheetName, rows }) {
        if (rows.length === 0)
            return;
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
exports.SheetsExporter = SheetsExporter;
