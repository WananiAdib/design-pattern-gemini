Looking at your `README.md` progress, you only have three patterns left in the entire list! Let's tackle the **Iterator Pattern**.

### Exercise: The Custom Playlist

The **Iterator Pattern** provides a way to access the elements of an aggregate object (like a list, tree, or graph) sequentially without exposing its underlying representation.

Imagine you are building a music player. Currently, your `Playlist` class stores songs in a public array. The client code directly loops over this array. If you ever decide to change the internal data structure of `Playlist` (for example, to a Linked List to make inserting songs faster, or a Tree to group by album), all the client code that relies on `.length` and `[i]` will break.

Here is the initial "problem" code:

```typescript
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
```

### Your Task:

Refactor this system using the **Iterator Design Pattern**.

Here's what you should aim for:

1. **The Iterator Interface (`SongIterator`):**
   Create an interface that defines the standard methods for iterating.

- `hasNext(): boolean` - Returns true if there are more elements.
- `next(): Song | null` - Returns the next element and advances the internal pointer.

2. **The Concrete Iterator (`PlaylistIterator`):**
   Create a class that implements `SongIterator`.

- Its constructor should take the collection it needs to iterate over (e.g., the `Playlist` object or its internal array).
- It should maintain a private `currentIndex` integer to keep track of where it is in the iteration.
- Implement `hasNext()` and `next()` based on that index.

3. **The Iterable Collection Interface / Implementation (`Playlist`):**

- Change the `songs` array in `Playlist` to be `private`.
- Add a method to `Playlist` called `createIterator(): SongIterator`. This method should return a new instance of your `PlaylistIterator`.

### Expected Usage After Refactoring:

```typescript
// --- Client Usage (After Refactoring) ---

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
```

Create your `iterator/instructions.md` and `index.ts` files. Share your refactored TypeScript code whenever you're ready!
