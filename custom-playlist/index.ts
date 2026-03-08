// iterator/instructions.md (or initial code)
interface SongIterator {
	hasNext(): boolean;
	next(): Song | null;
}

class PlaylistIterator implements SongIterator {
	private index = 0;
	constructor(private songs: Song[]) {}

	hasNext() {
		return this.index < this.songs.length;
	}

	next() {
		if (!this.hasNext()) {
			return null;
		}
		return this.songs[this.index++];
	}
}

class Song {
	constructor(
		public title: string,
		public artist: string,
	) {}
}

class Playlist {
	private songs: Song[] = [];

	public addSong(song: Song): void {
		this.songs.push(song);
	}

	public createIterator(): SongIterator {
		return new PlaylistIterator(this.songs);
	}
}

// --- Client Usage (Initial) ---
const myPlaylist = new Playlist();
myPlaylist.addSong(new Song("Bohemian Rhapsody", "Queen"));
myPlaylist.addSong(new Song("Stairway to Heaven", "Led Zeppelin"));
myPlaylist.addSong(new Song("Hotel California", "Eagles"));

// The client asks the collection for an iterator.
// It NO LONGER KNOWS that the playlist uses an array under the hood!
const iterator = myPlaylist.createIterator();

console.log("--- Playing Songs ---");
while (iterator.hasNext()) {
	const song = iterator.next();
	if (song) {
		console.log(`Playing: ${song.title} by ${song.artist}`);
	}
}
