Imagine you're developing an e-commerce platform that allows customers to configure and build their own custom computers. A Computer object is quite complex, with many components like CPU, RAM, storage (SSD/HDD), GPU, power supply, and an operating system. Many of these components are optional, have default values, or can be specified in various combinations.

Trying to manage all these configuration options using a single, large constructor (or multiple overloaded constructors) quickly becomes unmanageable and leads to very unreadable client code.

Here's the problem code, focusing on the "God constructor" smell:

```typescript
// Product: The complex object we want to build
class Computer {
	private cpu: string;
	private ramGB: number;
	private storageGB: number; // SSD or HDD
	private gpu: string | null;
	private powerSupplyWatts: number;
	private operatingSystem: string | null;
	private hasWifi: boolean;
	private hasBluetooth: boolean;

	// This is the "bad smell" - a large constructor with many parameters,
	// especially optional ones, making it hard to read and use correctly.
	constructor(
		cpu: string,
		ramGB: number,
		storageGB: number,
		gpu: string | null = null, // Optional GPU
		powerSupplyWatts: number = 500, // Default PSU
		operatingSystem: string | null = "Windows 10", // Default OS
		hasWifi: boolean = true, // Default Wi-Fi
		hasBluetooth: boolean = true // Default Bluetooth
	) {
		this.cpu = cpu;
		this.ramGB = ramGB;
		this.storageGB = storageGB;
		this.gpu = gpu;
		this.powerSupplyWatts = powerSupplyWatts;
		this.operatingSystem = operatingSystem;
		this.hasWifi = hasWifi;
		this.hasBluetooth = hasBluetooth;

		console.log("\n--- Building Computer via Direct Constructor Call ---");
		console.log(
			`CPU: ${this.cpu}, RAM: ${this.ramGB}GB, Storage: ${this.storageGB}GB`
		);
		console.log(
			`GPU: ${this.gpu || "Integrated"}, PSU: ${
				this.powerSupplyWatts
			}W, OS: ${this.operatingSystem || "None"}`
		);
		console.log(
			`Wi-Fi: ${this.hasWifi ? "Yes" : "No"}, Bluetooth: ${
				this.hasBluetooth ? "Yes" : "No"
			}`
		);
	}

	public getSpecs(): string {
		const parts = [
			`CPU: ${this.cpu}`,
			`RAM: ${this.ramGB}GB`,
			`Storage: ${this.storageGB}GB`,
			`GPU: ${this.gpu || "Integrated"}`,
			`PSU: ${this.powerSupplyWatts}W`,
			`OS: ${this.operatingSystem || "None"}`,
			`Wi-Fi: ${this.hasWifi ? "Yes" : "No"}`,
			`Bluetooth: ${this.hasBluetooth ? "Yes" : "No"}`,
		];
		return `Computer Specs: ${parts.join(", ")}.`;
	}
}

// Client directly using the problematic constructor:
// It's hard to read what each parameter means, especially nulls and booleans.
const officePC = new Computer(
	"Intel i5-12400",
	8,
	256,
	null,
	400,
	"Windows 10 Pro",
	true,
	false
);
console.log(officePC.getSpecs());

const gamingPC = new Computer(
	"AMD Ryzen 9 7950X",
	32,
	1000,
	"NVIDIA RTX 4080",
	850,
	"Windows 11 Home",
	true,
	true
);
console.log(gamingPC.getSpecs());

const server = new Computer(
	"Intel Xeon E3",
	64,
	4000,
	null,
	1000,
	"Ubuntu Server 22.04 LTS",
	false,
	false
);
console.log(server.getSpecs());

// Problem: The constructor is bloated. Order of optional parameters is confusing.
// It's not immediately clear what each boolean or number means without looking at the definition.
// This is the classic "telescoping constructor" anti-pattern.
```

Your Task:

Refactor the Computer creation process using the Builder Design Pattern to eliminate this "God constructor" and provide a fluent, readable way to build various computer configurations.

Here's what you should aim for:

Product (Computer class):

Modify its constructor to be private or default (e.g., no-argument constructor).
Add setters for its properties, which will primarily be used by the builder. These setters can be public or package-private (in TypeScript, often public if not in a separate module, or simply set directly if properties are public for the builder).
Builder Interface (IComputerBuilder):

Define an interface that declares step-by-step methods for building each part of the computer (e.g., setCPU(cpu: string), setRAM(ramGB: number), addGPU(gpu: string), installOS(os: string), etc.).
Crucially, all these building methods should return this (the builder instance) to allow for method chaining (fluent API).
Include a build(): Computer (or getResult(): Computer) method that returns the fully constructed Computer object.
Concrete Builder (ComputerBuilder):

Implement the IComputerBuilder interface.
Hold a private instance of the Computer product that it's currently assembling. Initialize this in the builder's constructor.
Each building method will configure the properties of this internal Computer instance.
The build() method will return the assembled Computer and (optionally, but good practice) reset the builder's internal state to allow for building a new object.
Expected Usage After Refactoring:

```typescript
// Using your concrete builder:
const officePC = new ComputerBuilder()
	.setCPU("Intel i5-12400")
	.setRAM(8)
	.setStorage(256)
	.setPowerSupply(400)
	.installOS("Windows 10 Pro")
	.disableBluetooth() // Example of specific optional feature handling
	.build(); // This returns the final Computer object

console.log(officePC.getSpecs());

const gamingPC = new ComputerBuilder()
	.setCPU("AMD Ryzen 9 7950X")
	.setRAM(32)
	.setStorage(1000) // Defaults to SSD unless specified otherwise
	.addGPU("NVIDIA RTX 4080")
	.setPowerSupply(850)
	.installOS("Windows 11 Home")
	.enableWifi()
	.enableBluetooth()
	.build();

console.log(gamingPC.getSpecs());

const server = new ComputerBuilder()
	.setCPU("Intel Xeon E3")
	.setRAM(64)
	.setStorage(4000)
	.setPowerSupply(1000)
	.installOS("Ubuntu Server 22.04 LTS")
	.disableWifi()
	.disableBluetooth()
	.build();

console.log(server.getSpecs());
```

This new example should much more clearly demonstrate the "constructor smell" and how the Builder pattern creates a more readable,
flexible, and robust way to construct complex objects.

Share your refactored TypeScript code when you're ready for feedback! Good luck!
