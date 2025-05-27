Imagine you're building a content management system (CMS). Documents in this system go through various stages in their lifecycle:

Draft: The document is being written or edited. Authors can modify the content.
Moderation: The document has been submitted for review. It cannot be edited by the author at this stage. Moderators can approve or reject it.
Published: The document is approved and live. It can be viewed by the public. Admins might be able to unpublish it or archive it.
Archived: The document is no longer live but is kept for records. It generally cannot be edited or re-published directly from this state without specific actions.
The challenge is to manage the document's behavior (what actions are allowed) and transitions between these states in a clean, organized way, without putting all the logic into massive if/else or switch statements within the main Document class. You want to easily add new states (e.g., ScheduledForPublishing) or change transition rules without major refactoring of existing state logic.

Here's the initial code, which centralizes all state-dependent logic:

```typescript
// document.initial.ts

type DocumentStateType = "Draft" | "Moderation" | "Published" | "Archived";
export type UserRole = "Author" | "Moderator" | "Admin";

export class Document {
	private state: DocumentStateType;
	public content: string;
	public readonly author: string; // The user who created the document

	constructor(author: string) {
		this.author = author;
		this.state = "Draft";
		this.content = "";
		console.log(`Document created by ${author}. Initial state: Draft`);
	}

	public setContent(
		content: string,
		currentUser: UserRole,
		currentUserName: string
	): void {
		console.log(
			`\nAttempting to set content by ${currentUserName} (${currentUser}). Current state: ${this.state}`
		);
		if (this.state === "Draft") {
			if (currentUser === "Author" && currentUserName === this.author) {
				this.content = content;
				console.log("✅ Content updated.");
			} else {
				console.log(
					"❌ Only the original author can edit content in Draft state."
				);
			}
		} else {
			console.log(`❌ Cannot set content in ${this.state} state.`);
		}
	}

	public requestReview(currentUser: UserRole, currentUserName: string): void {
		console.log(
			`\nAttempting to request review by ${currentUserName} (${currentUser}). Current state: ${this.state}`
		);
		if (this.state === "Draft") {
			if (currentUser === "Author" && currentUserName === this.author) {
				this.state = "Moderation";
				console.log(
					`✅ Document moved to Moderation by ${currentUserName}.`
				);
			} else {
				console.log(
					"❌ Only the original author can request a review for their document."
				);
			}
		} else {
			console.log(`❌ Cannot request review from ${this.state} state.`);
		}
	}

	public approve(currentUser: UserRole, currentUserName: string): void {
		console.log(
			`\nAttempting to approve by ${currentUserName} (${currentUser}). Current state: ${this.state}`
		);
		if (this.state === "Moderation") {
			if (currentUser === "Moderator" || currentUser === "Admin") {
				this.state = "Published";
				console.log(
					`✅ Document approved and Published by ${currentUserName}.`
				);
			} else {
				console.log(
					`❌ ${currentUser} (${currentUserName}) does not have permission to approve.`
				);
			}
		} else {
			console.log(`❌ Cannot approve document in ${this.state} state.`);
		}
	}

	public reject(currentUser: UserRole, currentUserName: string): void {
		console.log(
			`\nAttempting to reject by ${currentUserName} (${currentUser}). Current state: ${this.state}`
		);
		if (this.state === "Moderation") {
			if (currentUser === "Moderator" || currentUser === "Admin") {
				this.state = "Draft";
				console.log(
					`✅ Document rejected by ${currentUserName}. Moved back to Draft.`
				);
			} else {
				console.log(
					`❌ ${currentUser} (${currentUserName}) does not have permission to reject.`
				);
			}
		} else {
			console.log(`❌ Cannot reject document in ${this.state} state.`);
		}
	}

	public unpublish(currentUser: UserRole, currentUserName: string): void {
		console.log(
			`\nAttempting to unpublish by ${currentUserName} (${currentUser}). Current state: ${this.state}`
		);
		if (this.state === "Published") {
			if (currentUser === "Admin") {
				this.state = "Draft"; // Or could be "Archived" depending on exact rules
				console.log(
					`✅ Document unpublished by ${currentUserName}. Moved back to Draft.`
				);
			} else {
				console.log(
					`❌ ${currentUser} (${currentUserName}) does not have permission to unpublish.`
				);
			}
		} else {
			console.log(
				`❌ Cannot unpublish document from ${this.state} state.`
			);
		}
	}

	public archive(currentUser: UserRole, currentUserName: string): void {
		console.log(
			`\nAttempting to archive by ${currentUserName} (${currentUser}). Current state: ${this.state}`
		);
		if (
			this.state === "Published" ||
			this.state === "Draft" ||
			this.state === "Moderation"
		) {
			if (currentUser === "Admin") {
				this.state = "Archived";
				console.log(`✅ Document archived by ${currentUserName}.`);
			} else {
				console.log(
					`❌ ${currentUser} (${currentUserName}) does not have permission to archive.`
				);
			}
		} else if (this.state === "Archived") {
			console.log("ℹ️ Document is already archived.");
		} else {
			console.log(`❌ Cannot archive document from ${this.state} state.`);
		}
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

// --- Client Usage (Initial) ---
const alice = "Alice";
const bob = "Bob";
const charlie = "Charlie";
const dave = "Dave";

const doc = new Document(alice);
doc.printStatus();

doc.setContent("My first article about the State Pattern.", "Author", alice);
doc.printStatus();

doc.requestReview("Author", alice);
doc.printStatus();

// Try to edit while in review by author (should fail)
doc.setContent("Adding a small correction during review.", "Author", alice);
doc.printStatus();

// Another author tries to approve (should fail permission)
doc.approve("Author", bob);
doc.printStatus();

// Moderator approves
doc.approve("Moderator", charlie);
doc.printStatus();

// Author tries to unpublish (should fail permission)
doc.unpublish("Author", alice);
doc.printStatus();

// Admin unpublishes
doc.unpublish("Admin", dave);
doc.printStatus();

// Author requests review again for the now draft document
doc.requestReview("Author", alice);
doc.printStatus();

// Admin rejects the document (sends back to draft)
doc.reject("Admin", dave);
doc.printStatus();

// Admin archives the document
doc.archive("Admin", dave);
doc.printStatus();

// Try actions in Archived state (e.g., setContent, approve - should fail)
doc.setContent("Trying to edit archived doc", "Author", alice);
doc.approve("Moderator", charlie);
doc.printStatus();
```

Your Task:
Refactor the Document class using the State Design Pattern. Your goal is to:

Decentralize state-specific logic from the Document class.
Encapsulate the behavior associated with each state into separate classes.
Allow for easy addition of new states or modification of state transitions without altering the Document (Context) class or other unrelated state classes.
Here's what you should aim for:
UserRole Type:

The UserRole type ("Author" | "Moderator" | "Admin") can remain as defined.
DocumentContext Class (refactored Document):

This class will be the context for the states. It will hold a reference to the current state object (e.g., private currentState: IDocumentState).
It will have methods like setContent(), requestReview(), approve(), reject(), unpublish(), archive(). These methods will delegate the call to the currentState object.
It will have a method transitionTo(state: IDocumentState) which current state objects will call to change the document's state.
It will store the document's content and author.
The constructor should initialize the document with an initial state (e.g., DraftState).
IDocumentState Interface:

Create an interface (e.g., IDocumentState) that defines the common methods for all states. These methods will represent the actions that can be performed on the document.
Each method in the interface should accept the DocumentContext instance as a parameter (to allow states to change the context's state or access its data), the currentUser: UserRole, and currentUserName: string.
Example methods:
getName(): string; (for logging or UI purposes)
setContent(context: DocumentContext, content: string, currentUser: UserRole, currentUserName: string): void;
requestReview(context: DocumentContext, currentUser: UserRole, currentUserName: string): void;
approve(context: DocumentContext, currentUser: UserRole, currentUserName: string): void;
reject(context: DocumentContext, currentUser: UserRole, currentUserName: string): void;
unpublish(context: DocumentContext, currentUser: UserRole, currentUserName: string): void;
archive(context: DocumentContext, currentUser: UserRole, currentUserName: string): void;
Concrete State Classes:

Create concrete classes for each document state: DraftState, ModerationState, PublishedState, and ArchivedState.
Each class will implement the IDocumentState interface.
Inside each method of a concrete state:
Implement the logic specific to that action within that state. This includes checking permissions based on currentUser and currentUserName (e.g., comparing currentUserName with context.author).
If the action is valid and results in a state change, the state object will call context.transitionTo(new NextState()).
If an action is not permitted in the current state or by the current user, it should log an appropriate message (or throw an error).
Expected Usage After Refactoring:

```ts
// UserRole type remains the same
// import { UserRole } from './document.initial'; // If you put it in a separate file

// These would now be your new classes
// import { DocumentContext, DraftState, ModerationState, PublishedState, ArchivedState } from './document.state';

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
```

This refactoring will demonstrate how the State pattern helps to create more maintainable and extensible systems when an object's behavior is heavily dependent on its state.
