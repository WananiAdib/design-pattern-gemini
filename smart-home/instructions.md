Imagine you're building a system for a smart home. You have various smart devices, and you want to control them using a generic remote control. Currently, your RemoteControl directly calls methods on the SmartLight. This works, but it makes it hard to add features like:

Logging all operations executed.
Implementing undo/redo functionality.
Creating macros (sequences of commands).
Queuing commands for later execution.
The tight coupling between the RemoteControl and SmartLight's specific methods prevents these features from being added easily and generically.

Here's the initial code:

TypeScript

```ts
// Receiver: The actual device/object that performs the action
class SmartLight {
	private isOn: boolean = false;
	private brightness: number = 100;

	turnOn(): void {
		this.isOn = true;
		console.log("Light is ON.");
	}

	turnOff(): void {
		this.isOn = false;
		console.log("Light is OFF.");
	}

	setBrightness(level: number): void {
		this.brightness = Math.max(0, Math.min(100, level));
		console.log(`Light brightness set to ${this.brightness}%.`);
	}

	getStatus(): string {
		return `Light is ${this.isOn ? "ON" : "OFF"} at ${
			this.brightness
		}% brightness.`;
	}
}

// Invoker: A simple remote control that directly interacts with the light
class RemoteControl {
	private light: SmartLight; // Tightly coupled to SmartLight

	constructor(light: SmartLight) {
		this.light = light;
	}

	pressOnButton(): void {
		// Specific action directly tied to light
		console.log("Remote: Pressing ON button.");
		this.light.turnOn();
	}

	pressOffButton(): void {
		// Specific action directly tied to light
		console.log("Remote: Pressing OFF button.");
		this.light.turnOff();
	}

	pressDimButton(level: number): void {
		// Specific action directly tied to light
		console.log(`Remote: Pressing DIM button to ${level}%.`);
		this.light.setBrightness(level);
	}
}

// Usage:
const livingRoomLight = new SmartLight();
const remote = new RemoteControl(livingRoomLight);

remote.pressOnButton();
remote.pressDimButton(50);
remote.pressOffButton();

console.log(livingRoomLight.getStatus());
```

Your Task:

Refactor the RemoteControl and SmartLight interaction using the Command Design Pattern.

The Command pattern encapsulates a request as an object, thereby letting you parameterize clients with different requests, queue or log requests, and support undoable operations.

Here's what you should aim for:

Command Interface
Define an interface for all commands (e.g., Command) with a single method, execute().

Concrete Command Classes
Create a separate class for each specific action you want to perform (e.g., TurnOnLightCommand, TurnOffLightCommand, SetBrightnessCommand).

Each concrete command class should hold a reference to the SmartLight (the Receiver) it operates on.
Their constructors should accept the SmartLight instance and any parameters needed for the action (e.g., brightness level for SetBrightnessCommand).
Their execute() method will call the appropriate method on the SmartLight (e.g., turnOn(), setBrightness(level)).
Invoker (RemoteControl)
Modify the RemoteControl to:

No longer hold a direct reference to SmartLight for specific actions. Instead, it should hold a Command object.
Have a method (e.g., setCommand(command: Command)) to configure which command is associated with its button(s).
Have a generic method (e.g., pressButton()) that simply calls command.execute(). This method should not know anything about the concrete command or the receiver.
Expected Usage After Refactoring:

TypeScript

```ts
const livingRoomLight = new SmartLight(); // The Receiver

// Create specific commands, associating them with the receiver
const turnOnCommand = new TurnOnLightCommand(livingRoomLight);
const turnOffCommand = new TurnOffLightCommand(livingRoomLight);
const dimLightCommand = new SetBrightnessCommand(livingRoomLight, 30); // Dim to 30%

const remote = new RemoteControl(); // The Invoker

// Set commands for the remote and press the "button"
remote.setCommand(turnOnCommand);
remote.pressButton(); // Output: Light is ON.

remote.setCommand(dimLightCommand);
remote.pressButton(); // Output: Light brightness set to 30%.

remote.setCommand(turnOffCommand);
remote.pressButton(); // Output: Light is OFF.

console.log(livingRoomLight.getStatus());
```

This pattern makes the RemoteControl highly flexible, allowing it to control any device or perform any action simply by providing it with a different Command object.

Share your refactored TypeScript code when you're ready for feedback! Good luck!
