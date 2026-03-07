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
