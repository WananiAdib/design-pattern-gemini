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
	private command: Command | null;
	constructor() {
		this.command = null;
	}
	setCommand(command: Command) {
		this.command = command;
	}

	pressButton() {
		if (!this.command) {
			throw Error("You need to set a command");
		}
		this.command.execute();
	}
}

interface Command {
	execute(): void;
}

class TurnOnLightCommand implements Command {
	private smartLight: SmartLight;
	constructor(smartLight: SmartLight) {
		this.smartLight = smartLight;
	}
	execute(): void {
		this.smartLight.turnOn();
	}
}

class TurnOffLightCommand implements Command {
	private smartLight: SmartLight;
	constructor(smartLight: SmartLight) {
		this.smartLight = smartLight;
	}
	execute(): void {
		this.smartLight.turnOff();
	}
}

class SetBrightnessCommand implements Command {
	private smartLight: SmartLight;
	private level: number;
	constructor(smartLight: SmartLight, level: number) {
		this.smartLight = smartLight;
		this.level = level;
	}
	execute(): void {
		this.smartLight.setBrightness(this.level);
	}
}

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
