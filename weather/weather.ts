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