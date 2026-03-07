// The Originator
class TextEditor {
	private content: string = "";
	private cursorPosition: number = 0;

	public type(text: string): void {
		this.content += text;
		this.cursorPosition += text.length;
		console.log(
			`[Typing] Content: "${this.content}" | Cursor: ${this.cursorPosition}`,
		);
	}

	public save(): EditorMemento {
		return new EditorMemento(this.content, this.cursorPosition);
	}

	public restore(memento: EditorMemento): void {
		this.content = memento.content;
		this.cursorPosition = memento.cursorPositon;
	}
}

class EditorMemento {
	readonly content: string;
	readonly cursorPositon: number;

	constructor(content: string, cursorPositon: number) {
		this.content = content;
		this.cursorPositon = cursorPositon;
	}
}

class HistoryManager {
	constructor(private history: EditorMemento[] = []) {}

	push(memento: EditorMemento): void {
		this.history.push(memento);
	}
	undo(editor: TextEditor) {
		let latest = this.history.pop();
		if (latest === undefined) {
			latest = new EditorMemento("", 0);
		}
		editor.restore(latest);
	}
}

// --- Client Usage (Initial) ---
const editor = new TextEditor();
const historyManager = new HistoryManager();

editor.type("Hello ");
historyManager.push(editor.save()); // Client asks Editor to save itself, passes the opaque Memento to History

editor.type("World!");
historyManager.push(editor.save());

editor.type(" This is a typo.");

console.log("\n--- Executing Undo ---");
historyManager.undo(editor); // "Hello World!"
historyManager.undo(editor); // "Hello "
