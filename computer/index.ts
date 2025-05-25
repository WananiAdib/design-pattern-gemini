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
	constructor() {
		this.cpu = "";
		this.ramGB = 0;
		this.storageGB = 0;
		this.gpu = null;
		this.powerSupplyWatts = 500;
		this.operatingSystem = "Windows 10";
		this.hasWifi = true;
		this.hasBluetooth = true;
	}

	public setCPU(cpu: string): void {
		this.cpu = cpu;
	}

	public setRAM(ramGB: number): void {
		this.ramGB = ramGB;
	}

	public setStorage(storageGB: number): void {
		this.storageGB = storageGB;
	}

	public setGPU(gpu: string | null): void {
		this.gpu = gpu;
	}

	public setPowerSupply(powerSupplyWatts: number): void {
		this.powerSupplyWatts = powerSupplyWatts;
	}

	public setOperatingSystem(operatingSystem: string | null): void {
		this.operatingSystem = operatingSystem;
	}

	public setHasWifi(hasWifi: boolean): void {
		this.hasWifi = hasWifi;
	}

	public setHasBluetooth(hasBluetooth: boolean): void {
		this.hasBluetooth = hasBluetooth;
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

interface IComputerBuilder {
	setCPU(cpu: string): this;
	setRAM(ramGB: number): this;
	setStorage(storageGB: number): this;
	setGPU(gpu: string): this;
	setPowerSupply(powerSupplyWatts: number): this;
	installOS(operatingSystem: string): this;
	enableWifi(): this;
	disableWifi(): this;
	enableBluetooth(): this;
	disableBluetooth(): this;
	build(): Computer;
}

class ComputerBuilder implements IComputerBuilder {
	private computer: Computer;

	constructor() {
		this.computer = new Computer();
	}

	setCPU(cpu: string): this {
		this.computer.setCPU(cpu);
		return this;
	}

	setRAM(ramGB: number): this {
		this.computer.setRAM(ramGB);
		return this;
	}

	setStorage(storageGB: number): this {
		this.computer.setStorage(storageGB);
		return this;
	}

	setGPU(gpu: string): this {
		this.computer.setGPU(gpu);
		return this;
	}

	setPowerSupply(powerSupplyWatts: number): this {
		this.computer.setPowerSupply(powerSupplyWatts);
		return this;
	}

	installOS(operatingSystem: string): this {
		this.computer.setOperatingSystem(operatingSystem);
		return this;
	}

	enableWifi(): this {
		this.computer.setHasWifi(true);
		return this;
	}

	disableWifi(): this {
		this.computer.setHasWifi(false);
		return this;
	}

	enableBluetooth(): this {
		this.computer.setHasBluetooth(true);
		return this;
	}

	disableBluetooth(): this {
		this.computer.setHasBluetooth(false);
		return this;
	}

	build(): Computer {
		return this.computer;
	}
}

// Client directly using the problematic constructor:
// It's hard to read what each parameter means, especially nulls and booleans.
// const officePC = new Computer(
// 	"Intel i5-12400",
// 	8,
// 	256,
// 	null,
// 	400,
// 	"Windows 10 Pro",
// 	true,
// 	false
// );
// console.log(officePC.getSpecs());

// const gamingPC = new Computer(
// 	"AMD Ryzen 9 7950X",
// 	32,
// 	1000,
// 	"NVIDIA RTX 4080",
// 	850,
// 	"Windows 11 Home",
// 	true,
// 	true
// );
// console.log(gamingPC.getSpecs());

// const server = new Computer(
// 	"Intel Xeon E3",
// 	64,
// 	4000,
// 	null,
// 	1000,
// 	"Ubuntu Server 22.04 LTS",
// 	false,
// 	false
// );
// console.log(server.getSpecs());

// Problem: The constructor is bloated. Order of optional parameters is confusing.
// It's not immediately clear what each boolean or number means without looking at the definition.
// This is the classic "telescoping constructor" anti-pattern.
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
	.setGPU("NVIDIA RTX 4080")
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
