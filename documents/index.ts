// document.initial.ts

type DocumentStateType = "Draft" | "Moderation" | "Published" | "Archived";
export type UserRole = "Author" | "Moderator" | "Admin";

abstract class DocumentState {
	protected context: DocumentContext;

	constructor(documentContext: DocumentContext) {
		this.context = documentContext;
	}

	public abstract getName(): string;
	public abstract setContent(
		content: string,
		currentUser: UserRole,
		currentUserName: string
	): void;
	public abstract requestReview(
		currentUser: UserRole,
		currentUserName: string
	): void;
	public abstract approve(
		currentUser: UserRole,
		currentUserName: string
	): void;
	public abstract reject(
		currentUser: UserRole,
		currentUserName: string
	): void;
	public abstract unpublish(
		currentUser: UserRole,
		currentUserName: string
	): void;
	public abstract archive(
		currentUser: UserRole,
		currentUserName: string
	): void;
}

export class DocumentContext {
	private state: DocumentState;
	public content: string;
	public readonly author: string; // The user who created the document

	constructor(author: string) {
		this.author = author;
		this.state = new DraftState(this);
		this.content = "";
		console.log(`Document created by ${author}. Initial state: Draft`);
	}

	public transitionTo(state: DocumentState) {
		this.state = state;
	}

	public setContent(
		content: string,
		currentUser: UserRole,
		currentUserName: string
	): void {
		this.state.setContent(content, currentUser, currentUserName);
	}

	public requestReview(currentUser: UserRole, currentUserName: string): void {
		this.state.requestReview(currentUser, currentUserName);
	}

	public approve(currentUser: UserRole, currentUserName: string): void {
		this.state.approve(currentUser, currentUserName);
	}

	public reject(currentUser: UserRole, currentUserName: string): void {
		this.state.reject(currentUser, currentUserName);
	}

	public unpublish(currentUser: UserRole, currentUserName: string): void {
		this.state.unpublish(currentUser, currentUserName);
	}

	public archive(currentUser: UserRole, currentUserName: string): void {
		this.state.archive(currentUser, currentUserName);
	}

	public printStatus(): void {
		const contentPreview =
			this.content.length > 30
				? `${this.content.substring(0, 30)}...`
				: this.content;
		console.log(
			`--- STATUS --- Document (Author: ${this.author}): State: ${this.state}, Content: "${contentPreview}"`
		);
	}
}
export class DraftState extends DocumentState {
	constructor(context: DocumentContext) {
		super(context);
	}
	getName(): string {
		return "Draft";
	}
	setContent(
		content: string,
		currentUser: UserRole,
		currentUserName: string
	): void {
		if (
			currentUser === "Author" &&
			currentUserName === this.context.author
		) {
			this.context.content = content;
			console.log("✅ Content updated.");
		} else {
			console.log(
				"❌ Only the original author can edit content in Draft state."
			);
		}
	}
	requestReview(currentUser: UserRole, currentUserName: string): void {
		if (
			currentUser === "Author" &&
			currentUserName === this.context.author
		) {
			console.log("Document submitted for review.");
			this.context.transitionTo(new ModerationState(this.context));
		} else {
			console.log("Only the author can request a review.");
		}
	}
	approve(currentUser: UserRole, currentUserName: string): void {
		console.log("Cannot approve from Draft state.");
	}
	reject(currentUser: UserRole, currentUserName: string): void {
		console.log("Cannot reject from Draft state.");
	}
	unpublish(currentUser: UserRole, currentUserName: string): void {
		console.log("Cannot unpublish from Draft state.");
	}
	archive(currentUser: UserRole, currentUserName: string): void {
		console.log("Cannot archive from Draft state.");
	}
}
export class ModerationState extends DocumentState {
	constructor(context: DocumentContext) {
		super(context);
	}
	getName(): string {
		return "Moderation";
	}
	setContent(
		content: string,
		currentUser: UserRole,
		currentUserName: string
	): void {
		console.log("Cannot set content in Moderation state.");
	}
	requestReview(currentUser: UserRole, currentUserName: string): void {
		console.log("Cannot request review in Moderation state.");
	}
	approve(currentUser: UserRole, currentUserName: string): void {
		if (currentUser === "Moderator" || currentUser === "Admin") {
			console.log("Document approved.");
			this.context.transitionTo(new PublishedState(this.context));
		} else {
			console.log("Only moderators or admins can approve.");
		}
	}
	reject(currentUser: UserRole, currentUserName: string): void {
		if (currentUser === "Admin") {
			console.log("Document rejected.");
			this.context.transitionTo(new DraftState(this.context));
		} else {
			console.log("Only admins can reject.");
		}
	}
	unpublish(currentUser: UserRole, currentUserName: string): void {
		console.log("Cannot unpublish from Moderation state.");
	}
	archive(currentUser: UserRole, currentUserName: string): void {
		console.log("Cannot archive from Moderation state.");
	}
}
export class PublishedState extends DocumentState {
	constructor(context: DocumentContext) {
		super(context);
	}
	getName(): string {
		return "Published";
	}
	setContent(
		content: string,
		currentUser: UserRole,
		currentUserName: string
	): void {
		console.log("Cannot set content in Published state.");
	}
	requestReview(currentUser: UserRole, currentUserName: string): void {
		console.log("Cannot request review in Published state.");
	}
	approve(currentUser: UserRole, currentUserName: string): void {
		console.log("Cannot approve in Published state.");
	}
	reject(currentUser: UserRole, currentUserName: string): void {
		console.log("Cannot reject in Published state.");
	}
	unpublish(currentUser: UserRole, currentUserName: string): void {
		if (currentUser === "Admin") {
			console.log("Document unpublished.");
			this.context.transitionTo(new DraftState(this.context));
		} else {
			console.log("Only admins can unpublish.");
		}
	}
	archive(currentUser: UserRole, currentUserName: string): void {
		console.log("Cannot archive from Published state.");
	}
}
export class ArchivedState extends DocumentState {
	constructor(context: DocumentContext) {
		super(context);
	}
	getName(): string {
		return "Archived";
	}
	setContent(
		content: string,
		currentUser: UserRole,
		currentUserName: string
	): void {
		console.log("Cannot set content in Archived state.");
	}
	requestReview(currentUser: UserRole, currentUserName: string): void {
		console.log("Cannot request review in Archived state.");
	}
	approve(currentUser: UserRole, currentUserName: string): void {
		console.log("Cannot approve in Archived state.");
	}
	reject(currentUser: UserRole, currentUserName: string): void {
		console.log("Cannot reject in Archived state.");
	}
	unpublish(currentUser: UserRole, currentUserName: string): void {
		console.log("Cannot unpublish from Archived state.");
	}
	archive(currentUser: UserRole, currentUserName: string): void {
		console.log("Cannot archive from Archived state.");
	}
}

// --- Client Usage (After Refactoring) ---
const alice = "Alice";
const bob = "Bob"; // Another user, could be an author of a different document
const charlie = "Charlie"; // A moderator
const dave = "Dave"; // An admin

const myDoc = new DocumentContext(alice); // Initial state is DraftState internally
myDoc.printStatus();

myDoc.setContent("My updated article on the State Pattern!", "Author", alice);
myDoc.printStatus();

myDoc.requestReview("Author", alice);
myDoc.printStatus(); // Should be in Moderation state

// Alice (author) tries to edit while in Moderation (should be denied by ModerationState)
myDoc.setContent("A quick edit while under review.", "Author", alice);
myDoc.printStatus();

// Bob (another author) tries to approve (should be denied by ModerationState due to role)
myDoc.approve("Author", bob);
myDoc.printStatus();

// Charlie (moderator) approves
myDoc.approve("Moderator", charlie);
myDoc.printStatus(); // Should be in Published state

// Alice (author) tries to unpublish (should be denied by PublishedState due to role)
myDoc.unpublish("Author", alice);
myDoc.printStatus();

// Dave (admin) unpublishes
myDoc.unpublish("Admin", dave);
myDoc.printStatus(); // Should be back in Draft state (or your chosen logic)

// Alice requests review again
myDoc.requestReview("Author", alice);
myDoc.printStatus();

// Dave (admin) decides to reject this version
myDoc.reject("Admin", dave); // Admins might also have reject capability
myDoc.printStatus(); // Should be back in Draft state

// Dave (admin) archives the document from Draft state
myDoc.archive("Admin", dave);
myDoc.printStatus(); // Should be in Archived state

// Try actions in Archived state (should be denied by ArchivedState)
myDoc.setContent("Trying to edit archived doc.", "Author", alice);
myDoc.approve("Moderator", charlie);
myDoc.unpublish("Admin", dave); // e.g. cannot unpublish from archived
myDoc.printStatus();
