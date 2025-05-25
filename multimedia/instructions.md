Imagine you're developing a multimedia application. Playing a simple audio or video file often involves interacting with multiple underlying components: an audio decoder, a video renderer, a codec converter, perhaps subtitle renderers, etc. If the client (e.g., your user interface) has to directly manage all these low-level interactions, the client code becomes complex, tightly coupled to the subsystem's implementation details, and hard to maintain.

You want to provide a simpler, unified interface for common multimedia tasks, shielding the client from the underlying complexity.

Here's the initial code demonstrating the problem:

```ts
// Subsystem components (these represent complex internal logic)

class AudioPlayer {
	playAudio(fileName: string, format: string): void {
		console.log(
			`AudioPlayer: Playing audio '${fileName}' in ${format} format.`
		);
		// ... imagine complex audio decoding and playback logic here
	}
	stopAudio(): void {
		console.log("AudioPlayer: Stopping audio.");
	}
}

class VideoPlayer {
	playVideo(fileName: string, resolution: string): void {
		console.log(
			`VideoPlayer: Playing video '${fileName}' at ${resolution}.`
		);
		// ... imagine complex video decoding and rendering logic here
	}
	stopVideo(): void {
		console.log("VideoPlayer: Stopping video.");
	}
}

class CodecConverter {
	convert(fileName: string, fromFormat: string, toFormat: string): string {
		console.log(
			`CodecConverter: Converting '${fileName}' from ${fromFormat} to ${toFormat}.`
		);
		// ... imagine complex conversion logic here
		return `${fileName.split(".")[0]}.${toFormat}`;
	}
}

// Client code that currently has to manage all these complexities
// This class is tightly coupled to multiple subsystem components.
class MultimediaApp {
	private audioPlayer = new AudioPlayer();
	private videoPlayer = new VideoPlayer();
	private converter = new CodecConverter();

	playMedia(
		fileName: string,
		mediaType: "audio" | "video",
		targetFormat: string,
		resolution?: string
	): void {
		console.log(
			`\nMultimediaApp: Attempting to play ${mediaType} file: ${fileName}`
		);
		if (mediaType === "audio") {
			const originalFormat = fileName.split(".").pop() || "";
			const convertedFile = this.converter.convert(
				fileName,
				originalFormat,
				targetFormat
			);
			this.audioPlayer.playAudio(convertedFile, targetFormat);
		} else if (mediaType === "video" && resolution) {
			// For simplicity, let's assume video often doesn't need conversion here,
			// or the conversion logic would be more complex and involve video player specifics.
			this.videoPlayer.playVideo(fileName, resolution);
		} else {
			console.log("Unsupported media type or missing parameters.");
		}
	}

	stopAllMedia(): void {
		console.log("\nMultimediaApp: Stopping all media...");
		this.audioPlayer.stopAudio();
		this.videoPlayer.stopVideo();
	}
}

// Usage:
const app = new MultimediaApp();
app.playMedia("song.mp3", "audio", "wav");
app.playMedia("movie.avi", "video", "mp4", "1080p");
app.stopAllMedia();

// Problem: The client (MultimediaApp) needs to know about AudioPlayer, VideoPlayer, CodecConverter,
// and orchestrate their methods correctly. This makes the client fragile to changes
// in the subsystem and increases its complexity.
```

Your Task:

Refactor this multimedia system using the Facade Design Pattern.

The Facade pattern provides a simplified, higher-level interface to a set of interfaces in a subsystem. It makes the subsystem easier to use.

Here's what you should aim for:

Keep Subsystem Components: The AudioPlayer, VideoPlayer, and CodecConverter classes will remain as they are, representing the complex internals.
Create a Facade Class: Design a new class (e.g., MediaPlayerFacade).
Encapsulate Subsystem: The MediaPlayerFacade should contain instances of the subsystem components.
Provide Simplified Interface: The MediaPlayerFacade should offer a few high-level methods that represent common tasks (e.g., playAudio(fileName: string), playVideo(fileName: string, resolution: string), stopPlayback()).
Delegate and Orchestrate: Inside the Facade's methods, orchestrate the calls to the appropriate subsystem components to perform the requested task. The client should only interact with this facade.
Expected Usage After Refactoring:

```ts
const mediaPlayer = new MediaPlayerFacade(); // Client now only interacts with the Facade

mediaPlayer.playAudio("my_podcast.mp3"); // Facade handles conversion if needed internally
mediaPlayer.playVideo("my_movie.mp4", "1080p");
mediaPlayer.stopPlayback();
```

Provide your refactored TypeScript code when you're ready for feedback! Good luck!
