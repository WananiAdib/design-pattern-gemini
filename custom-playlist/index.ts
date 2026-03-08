// iterator/instructions.md (or initial code)

class Song {
	constructor(
		public title: string,
		public artist: string,
	) {}
}

class Playlist {
	// PROBLEM: The internal collection is public.
	// The client is tightly coupled to the fact that this is an Array.
	public songs: Song[] = [];

	public addSong(song: Song): void {
		this.songs.push(song);
	}
}

// --- Client Usage (Initial) ---
const myPlaylist = new Playlist();
myPlaylist.addSong(new Song("Bohemian Rhapsody", "Queen"));
myPlaylist.addSong(new Song("Stairway to Heaven", "Led Zeppelin"));
myPlaylist.addSong(new Song("Hotel California", "Eagles"));

// The client has to manually iterate using array-specific logic
console.log("--- Playing Songs ---");
for (let i = 0; i < myPlaylist.songs.length; i++) {
	const song = myPlaylist.songs[i];
	console.log(`Playing: ${song.title} by ${song.artist}`);
}
