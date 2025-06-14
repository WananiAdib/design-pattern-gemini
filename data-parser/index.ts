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

// A class with direct, repetitive logic for each file type
export class DataProcessor {
	public processCsvFile(filePath: string): void {
		console.log(`\n--- Processing CSV file: ${filePath} ---`);
		// 1. Open file (simulated)
		console.log(`Opening CSV file: ${filePath}`);
		// Simulated raw data for a CSV file
		const rawCsvData =
			"id,name,value\n1,ProductA,150\n2,ProductB,250\n3,ProductC,50";
		console.log("File opened.");

		// 2. Parse CSV data
		console.log("Parsing CSV data...");
		const records: DataRecord[] = rawCsvData
			.split("\n")
			.slice(1)
			.map((row) => {
				const [id, name, value] = row.split(",");
				return { id: id, name: name, value: parseInt(value) };
			});
		console.log(`Parsed ${records.length} records.`);

		// 3. Analyze data (CSV specific analysis or common)
		console.log("Analyzing data for CSV...");
		let sumOfValues = 0;
		records.forEach((r) => (sumOfValues += r.value as number));
		const analysis: AnalysisResult = {
			totalRecords: records.length,
			primaryMetricName: "Total Value",
			primaryMetricValue: sumOfValues,
			filePath: filePath,
			notes: `Total value from CSV is ${sumOfValues}.`,
		};
		console.log("Analysis complete.");

		// 4. Generate and publish report (CSV specific report)
		console.log("Generating CSV report...");
		console.log("----- CSV Data Report -----");
		console.log(`File Processed: ${analysis.filePath}`);
		console.log(`Total Records Analyzed: ${analysis.totalRecords}`);
		console.log(
			`${analysis.primaryMetricName}: ${analysis.primaryMetricValue}`
		);
		console.log(`Additional Notes: ${analysis.notes}`);
		console.log("---------------------------");
		console.log("Report published.");

		// 5. Close file (simulated)
		console.log(`Closing CSV file: ${filePath}`);
		console.log("File closed.");
	}

	public processTxtFile(filePath: string): void {
		console.log(`\n--- Processing TXT file: ${filePath} ---`);
		// 1. Open file (simulated)
		console.log(`Opening TXT file: ${filePath}`);
		// Simulated raw data for a TXT file: each line is "key:value"
		const rawTxtData =
			"id:item001\nvalue:10\ncategory:alpha\nid:item002\nvalue:20\nname:thing\nid:item003\nvalue:30";
		console.log("File opened.");

		// 2. Parse TXT data
		console.log("Parsing TXT data...");
		const lines = rawTxtData.split("\n");
		const tempRecords: { [id: string]: Partial<DataRecord> } = {};
		let currentId: string | null = null;
		lines.forEach((line) => {
			const [key, val] = line.split(":");
			if (key === "id") {
				currentId = val;
				if (!tempRecords[currentId])
					tempRecords[currentId] = { id: currentId };
			} else if (currentId && tempRecords[currentId]) {
				if (key === "value") {
					tempRecords[currentId].value = parseInt(val);
				} else {
					tempRecords[currentId][key] = val;
				}
			}
		});
		const records: DataRecord[] = Object.values(
			tempRecords
		) as DataRecord[];
		console.log(`Parsed ${records.length} records.`);

		// 3. Analyze data (TXT specific analysis or common)
		console.log("Analyzing data for TXT...");
		const averageValue =
			records.reduce((sum, r) => sum + ((r.value as number) || 0), 0) /
			(records.length || 1);
		const analysis: AnalysisResult = {
			totalRecords: records.length,
			primaryMetricName: "Average Value",
			primaryMetricValue: averageValue,
			filePath: filePath,
			notes: `Average value from TXT is ${averageValue.toFixed(2)}.`,
		};
		console.log("Analysis complete.");

		// 4. Generate and publish report (TXT specific report)
		console.log("Generating TXT report...");
		console.log("***** TXT File Summary *****");
		console.log(`Source Document: ${analysis.filePath}`);
		console.log(`Number of Entries: ${analysis.totalRecords}`);
		console.log(
			`${
				analysis.primaryMetricName
			}: ${analysis.primaryMetricValue.toFixed(2)}`
		);
		console.log(`Remarks: ${analysis.notes}`);
		console.log("****************************");
		console.log("Report published.");

		// 5. Close file (simulated)
		console.log(`Closing TXT file: ${filePath}`);
		console.log("File closed.");
	}
	// If we wanted to add a JSONProcessor, we'd copy and paste much of the structure.
}

// --- Client Usage (Initial) ---
const initialProcessor = new DataProcessor();
initialProcessor.processCsvFile("documents/finances.csv");
initialProcessor.processTxtFile("logs/serverlog.txt");
