// visitor/instructions.md (or initial code)

abstract class Employee {
	constructor(
		public name: string,
		public salary: number,
	) {}
	abstract accept(visitor: EmployeeVisitor): void;
}

interface EmployeeVisitor {
	visitDeveloper(dev: Developer): void;
	visitManager(manager: Manager): void;
}

class BonusCalculatorVisitor implements EmployeeVisitor {
	visitDeveloper(dev: Developer): void {
		console.log(dev.salary * 0.1); // Devs get 10% bonus
	}
	visitManager(manager: Manager): void {
		console.log(manager.salary * 0.2 + manager.teamSize * 1000);
	}
}

class XMLReportVisitor implements EmployeeVisitor {
	visitDeveloper(dev: Developer): void {
		console.log(
			`<developer><name>${dev.name}</name><salary>${dev.salary}</salary></developer>`,
		); // Devs get 10% bonus
	}
	visitManager(manager: Manager): void {
		console.log(
			`<manager><name>${manager.name}</name><teamSize>${manager.teamSize}</teamSize></manager>`,
		);
	}
}

class Developer extends Employee {
	accept(visitor: EmployeeVisitor): void {
		visitor.visitDeveloper(this);
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
	accept(visitor: EmployeeVisitor): void {
		visitor.visitManager(this);
	}
}

// --- Client Usage (Initial) ---
// const company: Employee[] = [
// 	new Developer("Alice", 80000),
// 	new Manager("Bob", 120000, 5),
// ];

// console.log("--- Generating Reports ---");
// for (const employee of company) {
// 	console.log(employee.generateReport());
// }

// console.log("\n--- Calculating Bonuses ---");
// for (const employee of company) {
// 	console.log(`${employee.name}'s Bonus: $${employee.calculateBonus()}`);
// }
const company: Employee[] = [
	new Developer("Alice", 80000),
	new Manager("Bob", 120000, 5),
];

// Now, the operations are extracted into their own classes!
const reportVisitor = new XMLReportVisitor();
const bonusVisitor = new BonusCalculatorVisitor();

console.log("--- Generating Reports ---");
for (const employee of company) {
	// We pass the operation (visitor) into the element
	employee.accept(reportVisitor);
}

console.log("\n--- Calculating Bonuses ---");
for (const employee of company) {
	employee.accept(bonusVisitor);
}
