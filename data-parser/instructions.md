Imagine you're building a utility that can process different types of data files (e.g., CSV files, plain TXT files). The overall process for handling each file is similar: open the file, extract data, analyze the data, generate a report, and then close the file. However, the exact way data is extracted and how the final report is formatted will depend on the file type.

You want to create a flexible system where new file processors can be added easily without duplicating the common processing logic.

Here's some initial code that handles CSV and TXT files with a lot of duplicated structural logic:

```ts
// data-processor.initial.ts

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
```

Your Task:
Refactor the data processing logic using the Template Method Design Pattern.
You want to create an abstract base class that defines the overall processing algorithm (the "template method"), while allowing subclasses to provide specific implementations for certain steps.

Here's what you should aim for:
Interfaces (DataRecord, AnalysisResult): These can remain as defined or you can adapt them as needed.

AbstractDataProcessor (Abstract Class):

This class will define the template method, let's call it processFile(filePath: string). This method is final (or effectively final by not being overridden) and outlines the skeleton of the data processing algorithm.
The processFile method will call a sequence of other methods, some concrete (implemented in the abstract class) and some abstract (to be implemented by subclasses).
Sequence within processFile:
openFile(filePath: string): void - A concrete method in AbstractDataProcessor. (e.g., logs opening)
parseData(filePath: string): DataRecord[] - An abstract method. Subclasses will implement this to read the file content and parse it into DataRecord[]. For simulation, subclasses can define their own raw string data internally based on the filePath.
analyzeData(records: DataRecord[]): AnalysisResult - A concrete method in AbstractDataProcessor. This will perform a common analysis (e.g., calculate total records and sum/average of a value field if present). This method can be protected if subclasses might need to call it or extend it in more complex scenarios (making it a hook), but for this exercise, a common implementation is fine.
generateReport(analysisResult: AnalysisResult): string - An abstract method. Subclasses will implement this to format the analysisResult into a string report.
publishReport(report: string): void - A concrete method in AbstractDataProcessor. (e.g., logs the report string to the console)
closeFile(filePath: string): void - A concrete method in AbstractDataProcessor. (e.g., logs closing)
Concrete Handler Classes (CsvDataProcessor, TxtDataProcessor):

These classes will extend AbstractDataProcessor.
They will provide concrete implementations for the abstract methods:
parseData(filePath: string): DataRecord[]
generateReport(analysisResult: AnalysisResult): string
Expected Usage After Refactoring:

```ts
// --- Client Usage (After Refactoring) ---

// const csvProcessor = new CsvDataProcessor();
// csvProcessor.processFile("documents/finances.csv");

// const txtProcessor = new TxtDataProcessor();
// txtProcessor.processFile("logs/serverlog.txt");

// Optional: If you add a JSON processor
// const jsonProcessor = new JsonDataProcessor();
// jsonProcessor.processFile("api/data.json");
```

This structure will allow you to easily add new processors (e.g., JsonDataProcessor, XmlDataProcessor) by simply creating a new subclass and implementing the specific parsing and reporting steps, while reusing all the common logic from AbstractDataProcessor.

Good luck, and share your refactored TypeScript code when you're ready!
