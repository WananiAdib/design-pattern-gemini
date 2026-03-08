// visitor/instructions.md (or initial code)

abstract class Employee {
	constructor(
		public name: string,
		public salary: number,
	) {}

	// PROBLEM: Every time we want a new operation, we must modify the base class and ALL subclasses.
	abstract calculateBonus(): number;
	abstract generateReport(): string;
}

class Developer extends Employee {
	calculateBonus(): number {
		return this.salary * 0.1; // Devs get 10% bonus
	}

	generateReport(): string {
		return `<developer><name>${this.name}</name><salary>${this.salary}</salary></developer>`;
	}
}

class Manager extends Employee {
	constructor(
		name: string,
		salary: number,
		public teamSize: number,
	) {
		super(name, salary);
	}

	calculateBonus(): number {
		return this.salary * 0.2 + this.teamSize * 1000; // Managers get 20% + $1000 per team member
	}

	generateReport(): string {
		return `<manager><name>${this.name}</name><teamSize>${this.teamSize}</teamSize></manager>`;
	}
}

// --- Client Usage (Initial) ---
const company: Employee[] = [
	new Developer("Alice", 80000),
	new Manager("Bob", 120000, 5),
];

console.log("--- Generating Reports ---");
for (const employee of company) {
	console.log(employee.generateReport());
}

console.log("\n--- Calculating Bonuses ---");
for (const employee of company) {
	console.log(`${employee.name}'s Bonus: $${employee.calculateBonus()}`);
}
