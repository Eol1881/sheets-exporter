export type SheetsExportConfig = {
    spreadsheetId: string;
    credentialsPath: string;
};
export declare class SheetsExporter {
    private sheets;
    private config;
    constructor(config?: Partial<SheetsExportConfig>);
    private getClient;
    appendRows({ sheetName, rows }: {
        sheetName: string;
        rows: (string | number)[][];
    }): Promise<void>;
}
