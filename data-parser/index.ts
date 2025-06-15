// Common interfaces (you can keep these or adapt them)
export interface DataRecord {
	id: string | number;
	[key: string]: any; // Allow other properties
	value?: number; // A common field for analysis
}

export interface AnalysisResult {
	totalRecords: number;
	primaryMetricName: string;
	primaryMetricValue: number;
	filePath: string;
	notes: string;
}

abstract class AbstractDataProcessor {
	public processFile(filepath: string) {
		this.openFile(filepath);
		const parsed = this.parseData(filepath);
		const analysisResult = this.analyzeData(parsed);
		const report = this.generateReport(analysisResult);
		this.publishReport(report);
		this.closeFile(filepath);
	}
	openFile(filepath: string): void {
		console.log(`Opening CSV file: ${filepath}`);
	}
	abstract parseData(filepath: string): DataRecord[];

	protected analyzeData(records: DataRecord[]): AnalysisResult {
		let sumOfValues = 0;
		records.forEach((r) => (sumOfValues += r.value as number));
		return {
			totalRecords: records.length,
			primaryMetricName: "Total Value",
			primaryMetricValue: sumOfValues,
			filePath: "unavailable",
			notes: `Total value  is ${sumOfValues}.`,
		};
	}

	abstract generateReport(analysisResult: AnalysisResult): string;
	publishReport(report: string): void {
		console.log("Report published.");
	}
	closeFile(filePath: string): void {
		console.log("File closed.");
	}
}

class CSVDataProcessor extends AbstractDataProcessor {
	public parseData(filepath: string): DataRecord[] {
		const rawcsvdata =
			"id,name,value\n1,producta,150\n2,productb,250\n3,productc,50";
		console.log("file opened.");

		// 2. parse csv data
		console.log("parsing csv data...");
		const records: DataRecord[] = rawcsvdata
			.split("\n")
			.slice(1)
			.map((row) => {
				const [id, name, value] = row.split(",");
				return { id: id, name: name, value: parseInt(value) };
			});
		console.log(`parsed ${records.length} records.`);
		return records;
	}

	public generateReport(analysisResult: AnalysisResult): string {
		console.log("Generating CSV report...");
		const report = `----- CSV Data Report -----\nFile Processed: ${analysisResult.filePath}\nTotal Records Analyzed: ${analysisResult.totalRecords}\n${analysisResult.primaryMetricName}: ${analysisResult.primaryMetricValue}\nAdditional Notes: ${analysisResult.notes}\n---------------------------`;
		return report;
	}
}

class TextDataProcessor extends AbstractDataProcessor {
	public parseData(filepath: string): DataRecord[] {
		const rawcsvdata =
			"id,name,value\n1,producta,150\n2,productb,250\n3,productc,50";
		console.log("file opened.");

		// 2. parse csv data
		console.log("parsing csv data...");
		const records: DataRecord[] = rawcsvdata
			.split("\n")
			.slice(1)
			.map((row) => {
				const [id, name, value] = row.split(",");
				return { id: id, name: name, value: parseInt(value) };
			});
		console.log(`parsed ${records.length} records.`);
		return records;
	}

	public generateReport(analysisResult: AnalysisResult): string {
		console.log("Generating CSV report...");
		const report = `----- CSV Data Report -----\nFile Processed: ${analysisResult.filePath}\nTotal Records Analyzed: ${analysisResult.totalRecords}\n${analysisResult.primaryMetricName}: ${analysisResult.primaryMetricValue}\nAdditional Notes: ${analysisResult.notes}\n---------------------------`;
		return report;
	}
}

// --- Client Usage (After Refactoring) ---
const csvProcessor = new CSVDataProcessor();
csvProcessor.processFile("documents/finances.csv");

const txtProcessor = new TextDataProcessor();
txtProcessor.processFile("logs/serverlog.txt");
