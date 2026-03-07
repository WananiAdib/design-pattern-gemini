### Exercise: Text Editor Undo Feature

The Memento pattern is used to capture and externalize an object's internal state so that the object can be restored to this state later, **without violating encapsulation**.

Imagine you are building a text editor and want to implement an "Undo" feature. Currently, the client code (the UI or application logic) handles the undo history by directly reaching into the editor, copying its public fields, and manually overwriting them later.

If the `TextEditor` ever changes how it stores data (e.g., using an array of lines instead of a single string), the client's undo logic will completely break.

Here is the initial "problem" code:

```typescript
// memento/instructions.md (or initial code)

// The Originator
class TextEditor {
	// PROBLEM: These fields have to be public so the client can save them.
	// This breaks encapsulation!
	public content: string = "";
	public cursorPosition: number = 0;

	public type(text: string): void {
		this.content += text;
		this.cursorPosition += text.length;
		console.log(
			`[Typing] Content: "${this.content}" | Cursor: ${this.cursorPosition}`,
		);
	}
}

// --- Client Usage (Initial) ---
const editor = new TextEditor();

// The Client is acting as the Caretaker, but it knows way too much about the Editor's internals.
const historyStack: { content: string; cursor: number }[] = [];

// Action 1
editor.type("Hello ");
historyStack.push({ content: editor.content, cursor: editor.cursorPosition }); // ❌ Reaching into internals

// Action 2
editor.type("World!");
historyStack.push({ content: editor.content, cursor: editor.cursorPosition }); // ❌ Reaching into internals

// Action 3
editor.type(" This is a typo.");

console.log("\n--- Executing Undo ---");

// The client manually overwrites the editor's state
const previousState = historyStack.pop();
if (previousState) {
	editor.content = previousState.content;
	editor.cursorPosition = previousState.cursor;
	console.log(
		`[Undo] Content: "${editor.content}" | Cursor: ${editor.cursorPosition}`,
	);
}
```

### Your Task:

Refactor this system using the **Memento Design Pattern**.

Here's what you should aim for:

1. **The Memento (`EditorMemento`):**
   Create a class to hold the snapshot of the editor's state. It should have `readonly` properties for `content` and `cursorPosition` (set via its constructor). _Crucially, it should not contain any logic._
2. **Refactor the Originator (`TextEditor`):**

- Change `content` and `cursorPosition` to be `private`. The client should no longer be able to touch them directly.
- Add a `save()` method that returns a new `EditorMemento` containing the current state.
- Add a `restore(memento: EditorMemento)` method that takes a memento and overwrites its internal state with the memento's state.

3. **The Caretaker (`HistoryManager`):**
   Create a class to manage the history. It should hold a private array of `EditorMemento` objects.

- Add a `push(memento: EditorMemento)` method.
- Add an `undo(editor: TextEditor)` method that pops the last memento off the stack and passes it to the editor's `restore()` method. _Notice how the Caretaker never actually reads or modifies the strings inside the Memento!_

### Expected Usage After Refactoring:

```typescript
// --- Client Usage (After Refactoring) ---

const editor = new TextEditor();
const history = new HistoryManager();

editor.type("Hello ");
history.push(editor.save()); // Client asks Editor to save itself, passes the opaque Memento to History

editor.type("World!");
history.push(editor.save());

editor.type(" This is a typo.");

console.log("\n--- Executing Undo ---");
history.undo(editor); // "Hello World!"
history.undo(editor); // "Hello "
```

Create your `memento/instructions.md` and `index.ts` files and share your code when you've got it working!
