interface HttpRequest {
	ipAddress: string;
	authToken: string | null;
	body: any;
	path: string;
}

abstract class AbstractMiddleware {
	private nextMiddleware: AbstractMiddleware | undefined = undefined;

	public setNext(middleware: AbstractMiddleware): AbstractMiddleware {
		this.nextMiddleware = middleware;
		return this.nextMiddleware;
	}

	public handle(request: HttpRequest): string {
		if (this.nextMiddleware) {
			return this.nextMiddleware.handle(request);
		}
		return "";
	}
}

class RateLimitMiddleware extends AbstractMiddleware {
	private requestCounts = new Map<string, number>();

	public handle(request: HttpRequest): string {
		console.log(
			`\n--- Incoming Request to ${request.path} from ${request.ipAddress} ---`,
		);

		const count = this.requestCounts.get(request.ipAddress) || 0;
		if (count > 5) {
			console.log("❌ Rate Limit Exceeded.");
			return "429 Too Many Requests";
		}
		this.requestCounts.set(request.ipAddress, count + 1);
		console.log("✅ Rate Limit Check Passed.");

		return super.handle(request);
	}
}

class AuthenticationMiddleware extends AbstractMiddleware {
	private validTokens = ["secret-token-123", "admin-token-999"];

	public handle(request: HttpRequest): string {
		if (
			!request.authToken ||
			!this.validTokens.includes(request.authToken)
		) {
			console.log("❌ Authentication Failed.");
			return "401 Unauthorized";
		}
		console.log("✅ Authentication Passed.");
		return super.handle(request);
	}
}
class DataValidationMiddleware extends AbstractMiddleware {
	public handle(request: HttpRequest): string {
		if (request.path === "/api/data" && !request.body) {
			console.log("❌ Validation Failed: Missing body.");
			return "400 Bad Request";
		}
		console.log("✅ Validation Passed.");
		return super.handle(request);
	}
}

class ControllerMiddleware extends AbstractMiddleware {
	public handle(request: HttpRequest): string {
		// 4. Actual Request Processing (Business Logic)
		console.log(`Processing business logic for ${request.path}...`);
		return "200 OK - Request Processed Successfully";
	}
}

// Client Usage
const middlewareServer = new RateLimitMiddleware();

const authenticator = new AuthenticationMiddleware();
const validator = new DataValidationMiddleware();
const controller = new ControllerMiddleware();

middlewareServer.setNext(authenticator).setNext(validator).setNext(controller);

// Success
console.log(
	middlewareServer.handle({
		ipAddress: "192.168.1.1",
		authToken: "secret-token-123",
		path: "/api/data",
		body: { key: "value" },
	}),
);

// Fails Auth
console.log(
	middlewareServer.handle({
		ipAddress: "192.168.1.2",
		authToken: "bad-token",
		path: "/api/data",
		body: { key: "value" },
	}),
);

// Fails Validation
console.log(
	middlewareServer.handle({
		ipAddress: "192.168.1.1",
		authToken: "admin-token-999",
		path: "/api/data",
		body: null,
	}),
);

// Fails Rate Limit (spamming the same IP)
middlewareServer.handle({
	ipAddress: "10.0.0.1",
	authToken: "secret-token-123",
	path: "/api/test",
	body: {},
});
middlewareServer.handle({
	ipAddress: "10.0.0.1",
	authToken: "secret-token-123",
	path: "/api/test",
	body: {},
});
middlewareServer.handle({
	ipAddress: "10.0.0.1",
	authToken: "secret-token-123",
	path: "/api/test",
	body: {},
});
middlewareServer.handle({
	ipAddress: "10.0.0.1",
	authToken: "secret-token-123",
	path: "/api/test",
	body: {},
});
middlewareServer.handle({
	ipAddress: "10.0.0.1",
	authToken: "secret-token-123",
	path: "/api/test",
	body: {},
});
middlewareServer.handle({
	ipAddress: "10.0.0.1",
	authToken: "secret-token-123",
	path: "/api/test",
	body: {},
});
console.log(
	middlewareServer.handle({
		ipAddress: "10.0.0.1",
		authToken: "secret-token-123",
		path: "/api/test",
		body: {},
	}),
);
