// Imagine these are UI components that need weather data
interface Display {
	update(weatherStation: WeatherStation): void;
}
class TemperatureDisplay implements Display {
	update(weatherStation: WeatherStation): void {
		console.log(
			`Temperature Display: Current Temp: ${weatherStation.getTemperature()}°C`
		);
	}
}

class HumidityDisplay implements Display {
	update(weatherStation: WeatherStation): void {
		console.log(
			`Humidity Display: Current Humidity: ${weatherStation.getHumidity()}%`
		);
	}
}

// The subject that holds and updates weather data
class WeatherStation {
	private temperature: number = 0;
	private humidity: number = 0;

	private displays: Display[] = [];

	public attach(display: Display) {
		this.displays.push(display);
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
		for (const display of this.displays) {
			display.update(this);
		}
	}

	// Getters for state (could be used by displays if needed, but not in current 'bad' code)
	public getTemperature(): number {
		return this.temperature;
	}
	public getHumidity(): number {
		return this.humidity;
	}
}

// --- Usage ---
const station = new WeatherStation();
station.attach(new TemperatureDisplay());
station.attach(new HumidityDisplay());

station.setMeasurements(25, 65);
station.setMeasurements(28, 60);
station.setMeasurements(23, 70);
