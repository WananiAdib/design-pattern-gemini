
interface HttpRequest {
    ipAddress: string;
    authToken: string | null;
    body: any;
    path: string;
}

class MonolithicServer {
    // Simulated database/state
    private requestCounts = new Map<string, number>();
    private validTokens = ["secret-token-123", "admin-token-999"];

    public handleRequest(req: HttpRequest): string {
        console.log(`\n--- Incoming Request to ${req.path} from ${req.ipAddress} ---`);

        // 1. Rate Limiting Check
        const count = this.requestCounts.get(req.ipAddress) || 0;
        if (count > 5) {
            console.log("❌ Rate Limit Exceeded.");
            return "429 Too Many Requests";
        }
        this.requestCounts.set(req.ipAddress, count + 1);
        console.log("✅ Rate Limit Check Passed.");

        // 2. Authentication Check
        if (!req.authToken || !this.validTokens.includes(req.authToken)) {
            console.log("❌ Authentication Failed.");
            return "401 Unauthorized";
        }
        console.log("✅ Authentication Passed.");

        // 3. Data Validation Check (simulated generic check)
        if (req.path === "/api/data" && !req.body) {
            console.log("❌ Validation Failed: Missing body.");
            return "400 Bad Request";
        }
        console.log("✅ Validation Passed.");

        // 4. Actual Request Processing (Business Logic)
        console.log(`Processing business logic for ${req.path}...`);
        return "200 OK - Request Processed Successfully";
    }
}

// --- Client Usage (Initial) ---
const middlewareServer = new MonolithicServer();

// Success
console.log(middlewareServer.handleRequest({ ipAddress: "192.168.1.1", authToken: "secret-token-123", path: "/api/data", body: { key: "value" } }));

// Fails Auth
console.log(middlewareServer.handleRequest({ ipAddress: "192.168.1.2", authToken: "bad-token", path: "/api/data", body: { key: "value" } }));

// Fails Validation
console.log(middlewareServer.handleRequest({ ipAddress: "192.168.1.1", authToken: "admin-token-999", path: "/api/data", body: null }));

// Fails Rate Limit (spamming the same IP)
middlewareServer.handleRequest({ ipAddress: "10.0.0.1", authToken: "secret-token-123", path: "/api/test", body: {} });
middlewareServer.handleRequest({ ipAddress: "10.0.0.1", authToken: "secret-token-123", path: "/api/test", body: {} });
middlewareServer.handleRequest({ ipAddress: "10.0.0.1", authToken: "secret-token-123", path: "/api/test", body: {} });
middlewareServer.handleRequest({ ipAddress: "10.0.0.1", authToken: "secret-token-123", path: "/api/test", body: {} });
middlewareServer.handleRequest({ ipAddress: "10.0.0.1", authToken: "secret-token-123", path: "/api/test", body: {} });
middlewareServer.handleRequest({ ipAddress: "10.0.0.1", authToken: "secret-token-123", path: "/api/test", body: {} });
console.log(middlewareServer.handleRequest({ ipAddress: "10.0.0.1", authToken: "secret-token-123", path: "/api/test", body: {} }));
