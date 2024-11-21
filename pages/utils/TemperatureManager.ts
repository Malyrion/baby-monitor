class TemperatureManager {
    private static instance: TemperatureManager;
    private temperature: number = -1; // Default value if no updates yet
  
    private constructor() {}
  
    static getInstance() {
      if (!TemperatureManager.instance) {
        TemperatureManager.instance = new TemperatureManager();
      }
      return TemperatureManager.instance;
    }
  
    getTemperature(): number {
      return this.temperature;
    }
  
    setTemperature(temp: number): void {
      this.temperature = temp;
    }
  }
  
  export default TemperatureManager;
  