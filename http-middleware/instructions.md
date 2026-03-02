### Exercise: HTTP Request Middleware Pipeline

Imagine you are building a lightweight web framework. When an HTTP request comes in, it needs to go through several security and validation checks before the actual business logic is executed.

Currently, your `Server` class has a massive, bloated monolithic method to handle all of this. It's rigid, hard to test, and adding a new check (like CORS or Logging) requires modifying this core method.

Here is the initial "problem" code:

```typescript
// server.initial.ts

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
const server = new MonolithicServer();

// Success
console.log(server.handleRequest({ ipAddress: "192.168.1.1", authToken: "secret-token-123", path: "/api/data", body: { key: "value" } }));

// Fails Auth
console.log(server.handleRequest({ ipAddress: "192.168.1.2", authToken: "bad-token", path: "/api/data", body: { key: "value" } }));

// Fails Validation
console.log(server.handleRequest({ ipAddress: "192.168.1.1", authToken: "admin-token-999", path: "/api/data", body: null }));

// Fails Rate Limit (spamming the same IP)
server.handleRequest({ ipAddress: "10.0.0.1", authToken: "secret-token-123", path: "/api/test", body: {} });
server.handleRequest({ ipAddress: "10.0.0.1", authToken: "secret-token-123", path: "/api/test", body: {} });
server.handleRequest({ ipAddress: "10.0.0.1", authToken: "secret-token-123", path: "/api/test", body: {} });
server.handleRequest({ ipAddress: "10.0.0.1", authToken: "secret-token-123", path: "/api/test", body: {} });
server.handleRequest({ ipAddress: "10.0.0.1", authToken: "secret-token-123", path: "/api/test", body: {} });
server.handleRequest({ ipAddress: "10.0.0.1", authToken: "secret-token-123", path: "/api/test", body: {} });
console.log(server.handleRequest({ ipAddress: "10.0.0.1", authToken: "secret-token-123", path: "/api/test", body: {} }));

```

### Your Task:

Refactor this server system using the **Chain of Responsibility Design Pattern**.

Here's what you should aim for:

1. **Middleware Interface/Abstract Class:** Define an abstract class `AbstractMiddleware` (or interface) that includes a `setNext(middleware: AbstractMiddleware)` method and a `handle(req: HttpRequest): string` method.
*Hint: The base class can implement `handle` so it automatically calls `this.next.handle(req)` if a next handler exists, returning a generic error (like "404 Not Found") if it reaches the end of the chain without being handled.*
2. **Concrete Middleware Classes:**
Create a separate class for each distinct step:
* `RateLimitMiddleware`
* `AuthMiddleware`
* `ValidationMiddleware`
* `ControllerMiddleware` (The final one that actually returns the 200 OK).


*Inside each middleware, check the condition. If it fails, return the error string immediately (breaking the chain). If it passes, call `super.handle(req)` to pass it to the next link in the chain.*
3. **Client Configuration:**
In your usage code, instantiate the middleware objects, link them together into a pipeline, and pass the incoming requests into the first middleware of the chain.

### Expected Usage After Refactoring:

```typescript
// --- Client Usage (After Refactoring) ---

// 1. Instantiate the middleware
const rateLimiter = new RateLimitMiddleware();
const authenticator = new AuthMiddleware();
const validator = new ValidationMiddleware();
const controller = new ControllerMiddleware(); // The actual business logic

// 2. Build the pipeline chain
rateLimiter
    .setNext(authenticator)
    .setNext(validator)
    .setNext(controller);

// 3. Send requests to the START of the pipeline
console.log(rateLimiter.handle({ 
    ipAddress: "192.168.1.1", 
    authToken: "secret-token-123", 
    path: "/api/data", 
    body: { key: "value" } 
}));

// (Run the other test cases against `rateLimiter.handle(...)` as well)

```

Create your `middleware/instructions.md` and `index.ts` files in your workspace. Share your refactored TypeScript code whenever you're ready for feedback!