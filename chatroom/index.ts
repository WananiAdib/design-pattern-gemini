// mediator/instructions.md (or initial code)

interface ChatRoomMediator {
	broadcast(message: string, sender: User): void;
}

class ChatRoom implements ChatRoomMediator {
	constructor(private users: User[] = []) {}

	register(user: User) {
		this.users.push(user);
		user.connect(this);
	}

	broadcast(message: string, sender: User): void {
		for (const connection of this.users) {
			if (connection.name !== sender.name) {
				connection.receive(message, sender.name);
			}
		}
	}
}

class User {
	public name: string;
	// PROBLEM: Every user has to maintain a list of every other user!
	public mediator: ChatRoomMediator;
	constructor(name: string, mediator: ChatRoomMediator) {
		this.name = name;
		this.mediator = mediator;
	}

	public connect(mediator: ChatRoomMediator) {
		this.mediator = mediator;
	}

	// A user sends a message by looping through their personal connections
	public send(message: string): void {
		console.log(`\n[${this.name}] Sending: "${message}"`);
		this.mediator.broadcast(message, this);
	}

	public receive(message: string, from: string): void {
		console.log(
			`  -> [${this.name}] received message from [${from}]: "${message}"`,
		);
	}
}

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
