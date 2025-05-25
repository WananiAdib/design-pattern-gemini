Exercise 5: Integrating Legacy Data
Imagine you're building a new reporting system. You have a modern NewReportingService that's designed to work with data in a specific, structured format. However, your organization also has an older LegacyAnalyticsAPI that provides data, but in a completely different, outdated format. You can't modify the LegacyAnalyticsAPI (it's a third-party library or a complex legacy system), and you don't want to change your NewReportingService as it's built to modern standards.

Your goal is to use the data from the LegacyAnalyticsAPI with your NewReportingService without altering either of them directly.

Here's the initial code:

```ts
// The new reporting service expects data in this specific format
interface ReportData {
	name: string;
	value: number;
}

class NewReportingService {
	public generateReport(data: ReportData[]): void {
		console.log("\n--- Generating New Report ---");
		if (data.length === 0) {
			console.log("No data to report.");
			return;
		}
		data.forEach((item) => {
			console.log(`Report Item: ${item.name}: ${item.value}`);
		});
		console.log("--- Report Generated ---\n");
	}
}

// A legacy system that provides data in an incompatible format
class LegacyAnalyticsAPI {
	public getRawTrafficData(): number[] {
		console.log("LegacyAnalyticsAPI: Fetching raw traffic data...");
		return [1200, 1500, 1300, 1800]; // Raw numbers, no names or specific labels
	}

	public getOldUserMetrics(): { userId: number; metric: number }[] {
		console.log("LegacyAnalyticsAPI: Fetching old user metrics...");
		return [
			{ userId: 101, metric: 50 },
			{ userId: 102, metric: 75 },
			{ userId: 103, metric: 60 },
		];
	}
}

// Problem: You can't directly use data from LegacyAnalyticsAPI with NewReportingService.
// For example, this would cause a TypeScript error:
/*
const legacyApi = new LegacyAnalyticsAPI();
const rawTraffic = legacyApi.getRawTrafficData();
const reportingService = new NewReportingService();
reportingService.generateReport(rawTraffic); // Type 'number[]' is not assignable to type 'ReportData[]'.
*/
```

Your Task:

Refactor this system using the Adapter Design Pattern.

The Adapter pattern allows objects with incompatible interfaces to collaborate. It converts the interface of a class into another interface that clients expect.

Here's what you should aim for:

Identify the Target Interface: This is ReportData[], the format NewReportingService expects.
Identify the Adaptee: This is LegacyAnalyticsAPI, the class with the incompatible interface.
Create an Adapter Class: Design a new class (e.g., LegacyAnalyticsAdapter). This class will be responsible for translating the data.
Implement the Target Interface (conceptually): The adapter should provide methods that return data in the ReportData[] format.
Hold an Adaptee Instance: The LegacyAnalyticsAdapter should contain an instance of LegacyAnalyticsAPI.
Translate Data: Inside the adapter's methods, call the appropriate methods of the LegacyAnalyticsAPI and transform its returned data into the ReportData[] format.
Expected Usage after Refactoring:

```ts
const legacyApi = new LegacyAnalyticsAPI();
const adapter = new LegacyAnalyticsAdapter(legacyApi);
const reportingService = new NewReportingService();

// Now, use the adapter to get data compatible with NewReportingService
const trafficData = adapter.getTrafficReportData();
reportingService.generateReport(trafficData);
// Expected output: Report items for raw traffic data, e.g., "Traffic 1: 1200", "Traffic 2: 1500"

const userMetrics = adapter.getUserMetricsReportData();
reportingService.generateReport(userMetrics);
// Expected output: Report items for user metrics, e.g., "User 101: 50", "User 102: 75"
```

Provide your refactored TypeScript code when you're ready for feedback! Good luck!
