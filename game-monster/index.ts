class Weapon implements Cloneable<Weapon> {
    constructor(public name: string, public damage: number) {}
    clone(): Weapon {
        return new Weapon(this.name, this.damage)
    }
}

class Monster implements Cloneable<Monster>{
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

    clone(): Monster {
        return new Monster(this.name,this.health,this.speed,this.weapon.clone())
    }
}

interface Cloneable<T> {
    clone(): T;
}

// --- Client Usage (Initial) ---

// 1. The designers created a base template for a Poison Goblin
const baseGoblin = new Monster("Poison Goblin", 50, 15, new Weapon("Poison Dagger", 10));
baseGoblin.display();

// PROBLEM: The Spawner needs to spawn 3 more identical goblins.
// It has to tightly couple itself to the Monster constructor and know all the stats!
const goblin2 = baseGoblin.clone()
const goblin3 = baseGoblin.clone()
const goblin4 = baseGoblin.clone()

goblin2.name = "Elite Goblin";
goblin2.weapon.name = "Venomous Strike";
goblin2.weapon.damage = 50;

console.log("--- Checking Clones ---");
baseGoblin.display(); // Should STILL be "Poison Dagger" with 10 dmg
goblin2.display();    // Should be "Venomous Strike" with 50 dmg
