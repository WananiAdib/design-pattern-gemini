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
