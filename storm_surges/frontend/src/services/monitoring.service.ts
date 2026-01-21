interface MonitoringConfig {
  endpoint: string;
  datastreamName: string;
  apiKey: string;
}

interface LogEntry {
  "@timestamp": string;
  service_name: string;
  event_timestamp: string;
  event_type: string;
  user_id: string;
  confidence_level: string;
  ssp: string;
  year: string;
  storm_surge: number;
}

class MonitoringService {
  private config: MonitoringConfig;

  constructor(config: MonitoringConfig) {
    this.config = config;
  }

  private formatTimestamp(): string {
    return new Date().toISOString();
  }

  async sendLog(params: {
    userId: string;
    confidenceLevel: string;
    selectedSSP: string | null;
    selectedYear: string;
    stormSurge: number;
  }): Promise<void> {
    const timestamp = this.formatTimestamp();
    const actualStormSurge = params.stormSurge / 10;
    const logEntry: LogEntry = {
      "@timestamp": timestamp,
      service_name: "urban-square-sea-level-rise",
      event_timestamp: timestamp,
      event_type: "sea_level_rise_map_generated",
      user_id: params.userId,
      confidence_level: params.confidenceLevel.toLowerCase(),
      ssp: params.selectedSSP || "ssp126",
      year: params.selectedYear,
      storm_surge: actualStormSurge,
    };

    const url = `https://${this.config.endpoint}/elasticsearch/${this.config.datastreamName}/_doc/?pretty`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `ApiKey ${this.config.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(logEntry),
      });

      if (!response.ok) {
        console.error(
          "Failed to send monitoring log:",
          response.status,
          response.statusText
        );
        const responseText = await response.text();
        console.error("Response body:", responseText);
      } else {
        const responseData = await response.json();
      }
    } catch (error) {
      console.error("Error sending monitoring log:", error);
      console.error("Error details:", {
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      });
    }
  }
}

// Create a singleton instance
let monitoringServiceInstance: MonitoringService | null = null;

export const initializeMonitoring = (config: MonitoringConfig) => {
  monitoringServiceInstance = new MonitoringService(config);
};

export const getMonitoringService = (): MonitoringService => {
  if (!monitoringServiceInstance) {
    console.error("Monitoring service not initialized!");
    throw new Error(
      "Monitoring service not initialized. Call initializeMonitoring first."
    );
  }
  return monitoringServiceInstance;
};

export type { MonitoringConfig, LogEntry };
