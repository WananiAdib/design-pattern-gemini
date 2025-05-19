Consider this TypeScript code simulating a simple weather station that updates displays:

TypeScript

```ts
// weather.ts

// Imagine these are UI components that need weather data
class TemperatureDisplay {
    update(temperature: number): void {
        console.log(`Temperature Display: Current Temp: ${temperature}°C`);
    }
}

class HumidityDisplay {
    update(humidity: number): void {
        console.log(`Humidity Display: Current Humidity: ${humidity}%`);
    }
}

// The subject that holds and updates weather data
class WeatherStation {
    private temperature: number = 0;
    private humidity: number = 0;

    // The WeatherStation holds direct references to specific displays
    private temperatureDisplay: TemperatureDisplay;
    private humidityDisplay: HumidityDisplay;

    constructor() {
        // The WeatherStation is tightly coupled to these concrete display types
        this.temperatureDisplay = new TemperatureDisplay();
        this.humidityDisplay = new HumidityDisplay();
    }

    // Method to update weather measurements
    public setMeasurements(temperature: number, humidity: number): void {
        console.log("\n--- WeatherStation: New measurements received ---");
        this.temperature = temperature;
        this.humidity = humidity;
        // When measurements change, it manually calls update on each display
        this.measurementsChanged();
    }

    // This method directly calls update on specific display instances
    private measurementsChanged(): void {
        // If we add a new display type (e.g., PressureDisplay), we MUST
        // modify this method to add a call for it.
        this.temperatureDisplay.update(this.temperature);
        this.humidityDisplay.update(this.humidity);
    }

    // Getters for state (could be used by displays if needed, but not in current 'bad' code)
    public getTemperature(): number { return this.temperature; }
    public getHumidity(): number { return this.humidity; }
}

// --- Usage ---
const station = new WeatherStation();

station.setMeasurements(25, 65);
station.setMeasurements(28, 60);
station.setMeasurements(23, 70);
```

Critique:

The WeatherStation class is responsible not only for managing the weather data but also for knowing which specific display objects need to be updated and how to update them (by calling their update methods directly).

Tight Coupling: The WeatherStation is tightly coupled to the concrete TemperatureDisplay and HumidityDisplay classes.
Violation of OCP: Adding a new type of display (e.g., a pressure display, a forecast display) requires modifying the WeatherStation class, specifically the measurementsChanged method, to add calls for the new display type.
Lack of Flexibility: It's difficult to add or remove displays dynamically at runtime without modifying the WeatherStation's constructor or adding complex management logic within it.
This is a classic scenario for the Observer Design Pattern.

Your Task:

Refactor the weather station code using the Observer Design Pattern.

The Observer pattern defines a one-to-many dependency between objects so that when one object changes state, all its dependents are notified and updated automatically.

Think about:

What is the Subject (the object being observed)?
What is the Observer (the object that wants to be notified)?
How can an Observer subscribe to the Subject?
How can an Observer unsubscribe?
How does the Subject notify its subscribed Observers without knowing their concrete types?
What information should the notification carry?
Implement the refactoring in TypeScript. Share your code when you're ready for feedback!