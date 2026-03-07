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
