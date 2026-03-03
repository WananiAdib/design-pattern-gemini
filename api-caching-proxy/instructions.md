### Exercise: API Caching Proxy

Imagine you are building an application that frequently fetches video metadata from a third-party API (like YouTube). Network requests are slow, and the API provider charges you based on the number of requests you make.

Currently, your application directly uses the 3rd-party library class, meaning if a user clicks on the same video 5 times, it makes 5 expensive network requests.

Here is the initial "problem" code:

```typescript
// proxy/instructions.md (or initial code)

// 1. The Subject Interface (What both the Real Object and Proxy will implement)
interface ThirdPartyYouTubeLib {
    getVideoInfo(id: string): string;
}

// 2. The Real Subject (The actual, expensive 3rd-party service)
class ThirdPartyYouTubeClass implements ThirdPartyYouTubeLib {
    public getVideoInfo(id: string): string {
        // Simulating a slow network request
        console.log(`[Network Request] Fetching video info for ID: ${id}... (Takes 2 seconds)`);
        
        // In reality, this would be an HTTP call returning JSON
        return `Video Data for [${id}]: Title, Description, View Count...`;
    }
}

// 3. The Client code using the service directly
class YouTubeManager {
    private service: ThirdPartyYouTubeLib;

    constructor(service: ThirdPartyYouTubeLib) {
        this.service = service;
    }

    public renderVideoPage(id: string): void {
        console.log(`\n--- User requested page for video ${id} ---`);
        const info = this.service.getVideoInfo(id);
        console.log(`Rendering UI with: ${info}`);
    }
}

// --- Client Usage (Initial) ---
const realService = new ThirdPartyYouTubeClass();
const manager = new YouTubeManager(realService);

// The user clicks the same video multiple times, or multiple users view the trending video
manager.renderVideoPage("cat_video_123");
manager.renderVideoPage("cat_video_123"); // ❌ Expensive network request happens again!
manager.renderVideoPage("news_update_001");
manager.renderVideoPage("cat_video_123"); // ❌ And again!

```

### Your Task:

Refactor this system using the **Proxy Design Pattern** to implement a caching layer.

The Proxy pattern provides a surrogate or placeholder for another object to control access to it. A *Caching Proxy* specifically intercepts requests, checks if the result is already in a local cache, returns it if so, and only forwards the request to the real object if there is a cache miss.

Here's what you should aim for:

1. **Create the Proxy Class (`CachedYouTubeClass`):**
* It must implement the `ThirdPartyYouTubeLib` interface (so the `YouTubeManager` doesn't know the difference between the proxy and the real service).
* It should hold a private reference to the real service (`ThirdPartyYouTubeClass`).
* It should maintain an internal cache (e.g., a `Map<string, string>` or a simple object dictionary) to store the results of previous requests.


2. **Implement the Proxy Logic:**
* When `getVideoInfo(id)` is called on the proxy, check if the `id` exists in the cache.
* If it **does**, return the cached string immediately and log that it was retrieved from the cache (saving a network call).
* If it **does not**, delegate the call to the *real* service, store the result in the cache, and then return the result.


3. **Client Configuration:**
* Instantiate the `ThirdPartyYouTubeClass`.
* Instantiate the `CachedYouTubeClass`, passing the real service into it.
* Pass the *proxy* object into the `YouTubeManager` instead of the real service.



### Expected Output After Refactoring:

When the client calls `renderVideoPage` multiple times for `"cat_video_123"`, you should see the `[Network Request]` log only on the *first* call. Subsequent calls should print a log indicating a cache hit, completely skipping the real network request.

Create your `proxy/instructions.md` and `index.ts` files and share your refactored TypeScript code whenever you're ready!