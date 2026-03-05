class Weapon {
    constructor(public name: string, public damage: number) {}
}

class Monster {
    public name: string;
    public health: number;
    public speed: number;
    public weapon: Weapon;

    constructor(name: string, health: number, speed: number, weapon: Weapon) {
        this.name = name;
        this.health = health;
        this.speed = speed;
        this.weapon = weapon;
    }

    public display(): void {
        console.log(`[${this.name}] HP: ${this.health} | Speed: ${this.speed} | Weapon: ${this.weapon.name} (+${this.weapon.damage} dmg)`);
    }
}

// --- Client Usage (Initial) ---

// 1. The designers created a base template for a Poison Goblin
const baseGoblin = new Monster("Poison Goblin", 50, 15, new Weapon("Poison Dagger", 10));
baseGoblin.display();

// PROBLEM: The Spawner needs to spawn 3 more identical goblins.
// It has to tightly couple itself to the Monster constructor and know all the stats!
const goblin2 = new Monster("Poison Goblin", 50, 15, new Weapon("Poison Dagger", 10));
const goblin3 = new Monster("Poison Goblin", 50, 15, new Weapon("Poison Dagger", 10));
const goblin4 = new Monster("Poison Goblin", 50, 15, new Weapon("Poison Dagger", 10));

// PROBLEM 2: What if we want to clone a monster's *current* state?
// Let's say baseGoblin finds a sword. If we want to clone him now, 
// we have to manually copy every single property.
baseGoblin.weapon = new Weapon("Iron Sword", 25);
const clonedMutatedGoblin = new Monster(baseGoblin.name, baseGoblin.health, baseGoblin.speed, new Weapon(baseGoblin.weapon.name, baseGoblin.weapon.damage));
