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

class LegacyAnalyticsAdapter {
	private legacyAnalyticsAPI: LegacyAnalyticsAPI;

	constructor(legacyAnalyticsAPI: LegacyAnalyticsAPI) {
		this.legacyAnalyticsAPI = legacyAnalyticsAPI;
	}

	public getTrafficReportData(): ReportData[] {
		return this.legacyAnalyticsAPI
			.getRawTrafficData()
			.map((value, index) => ({
				name: `Traffic ${index + 1}`,
				value: value,
			}));
	}
	public getUserMetricsReportData(): ReportData[] {
		return this.legacyAnalyticsAPI.getOldUserMetrics().map((value) => ({
			name: `User ${value.userId}`,
			value: value.metric,
		}));
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
