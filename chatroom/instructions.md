### Exercise: The "Spaghetti" Chat Room

The Mediator pattern is used to reduce chaotic dependencies between objects. Instead of components talking directly to each other (which creates a messy, tightly-coupled web), they all talk to a central "Mediator" object, which handles the routing.

Imagine you are building a chat application. Currently, every user has to hold a direct reference to _every other user_ in order to send messages. If a new user joins, you have to manually update everyone's friend list. This is the classic $O(N^2)$ "spaghetti" coupling problem.

Here is the initial "problem" code:

```typescript
// mediator/instructions.md (or initial code)

class User {
	public name: string;
	// PROBLEM: Every user has to maintain a list of every other user!
	private connections: User[] = [];

	constructor(name: string) {
		this.name = name;
	}

	public connect(user: User): void {
		this.connections.push(user);
	}

	// A user sends a message by looping through their personal connections
	public send(message: string): void {
		console.log(`\n[${this.name}] Sending: "${message}"`);
		for (const connection of this.connections) {
			connection.receive(message, this.name);
		}
	}

	public receive(message: string, from: string): void {
		console.log(
			`  -> [${this.name}] received message from [${from}]: "${message}"`,
		);
	}
}

// --- Client Usage (Initial) ---
const alice = new User("Alice");
const bob = new User("Bob");
const charlie = new User("Charlie");
const dave = new User("Dave");

// PROBLEM: The Client has to wire everyone together manually.
// If Dave joins, we have to update Alice, Bob, and Charlie.
alice.connect(bob);
alice.connect(charlie);
alice.connect(dave);

bob.connect(alice);
bob.connect(charlie);
bob.connect(dave);

charlie.connect(alice);
charlie.connect(bob);
charlie.connect(dave);

dave.connect(alice);
dave.connect(bob);
dave.connect(charlie);

alice.send("Hey everyone, is the server down?");
bob.send("Yeah, I can't connect either.");
```

### Your Task:

Refactor this system using the **Mediator Design Pattern**.

Here's what you should aim for:

1. **The Mediator Interface (`ChatRoomMediator`):**
   Create an interface (or an abstract class) with a method to send messages: `broadcast(message: string, sender: User): void`.
2. **The Concrete Mediator (`ChatRoom`):**
   Create a class that implements the mediator interface.

- It should maintain a single array of `User` objects.
- It needs a method to `register(user: User)`. (Bonus: When registering, it should assign itself as the user's mediator).
- Inside `broadcast`, it should loop through all registered users and call their `receive()` method, _skipping the user who sent the message_.

3. **Refactor the Colleague (`User`):**

- Remove the `connections` array and the `connect()` method. The `User` should no longer know about other users!
- Add a property to hold a reference to the `ChatRoomMediator`.
- Update the `send()` method to simply pass the message to the mediator: `this.chatRoom.broadcast(message, this)`.

### Expected Usage After Refactoring:

```typescript
// --- Client Usage (After Refactoring) ---

// 1. Create the central Mediator
const generalChat = new ChatRoom();

// 2. Create the users
const alice = new User("Alice", generalChat);
const bob = new User("Bob", generalChat);
const charlie = new User("Charlie", generalChat);
const dave = new User("Dave", generalChat);

// 3. Register users to the mediator
generalChat.register(alice);
generalChat.register(bob);
generalChat.register(charlie);
generalChat.register(dave);

// Users just send messages to the room, knowing nothing about who else is there!
alice.send("Hey everyone, is the server down?");
bob.send("Yeah, I can't connect either.");
```

Create your `mediator/instructions.md` and `index.ts` files. Share your refactored TypeScript code whenever you're ready!
