// monitoring.service.ts
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
  message?: string;
}

class MonitoringService {
  private config: MonitoringConfig;

  constructor(config: MonitoringConfig) {
    this.config = config;
    console.log('🚀 Monitoring Service initialized with config:', {
      endpoint: config.endpoint,
      datastreamName: config.datastreamName,
      apiKey: config.apiKey.substring(0, 10) + '...' // Show only first 10 chars for security
    });
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
    console.log('📊 Monitoring Service - Preparing to send log with params:', params);
    
    const timestamp = this.formatTimestamp();
    console.log('⏰ Generated timestamp:', timestamp);

    const actualStormSurge = params.stormSurge / 10;
  console.log('🌊 Storm surge conversion:', params.stormSurge, '→', actualStormSurge);
    
  const logEntry: LogEntry = {
    "@timestamp": timestamp,
    service_name: "urban-square-sea-level-rise",
    event_timestamp: timestamp,
    event_type: "sea_level_rise_map_generated",
    user_id: params.userId,
    confidence_level: params.confidenceLevel.toLowerCase(),
    ssp: params.selectedSSP || "ssp126",
    year: params.selectedYear,
    storm_surge: actualStormSurge,  // Use the converted value
    message: `User generated sea level rise map for year ${params.selectedYear} with SSP ${params.selectedSSP || "ssp126"}, confidence level ${params.confidenceLevel}, and storm surge ${actualStormSurge}m`
  };

    console.log('📦 Log entry to be sent:', JSON.stringify(logEntry, null, 2));

    const url = `https://${this.config.endpoint}/elasticsearch/${this.config.datastreamName}/_doc/?pretty`;
    console.log('🌐 Sending to URL:', url);

    try {
      console.log('🔑 Authorization header:', `ApiKey ${this.config.apiKey.substring(0, 10)}...`);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `ApiKey ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logEntry),
      });

      console.log('📬 Response status:', response.status, response.statusText);
      
      if (!response.ok) {
        console.error('❌ Failed to send monitoring log:', response.status, response.statusText);
        const responseText = await response.text();
        console.error('❌ Response body:', responseText);
      } else {
        console.log('✅ Monitoring log sent successfully!');
        const responseData = await response.json();
        console.log('✅ Response data:', responseData);
      }
    } catch (error) {
      console.error('❌ Error sending monitoring log:', error);
      console.error('❌ Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
    }
  }
}

// Create a singleton instance
let monitoringServiceInstance: MonitoringService | null = null;

export const initializeMonitoring = (config: MonitoringConfig) => {
  console.log('🎯 Initializing Monitoring Service...');
  monitoringServiceInstance = new MonitoringService(config);
};

export const getMonitoringService = (): MonitoringService => {
  if (!monitoringServiceInstance) {
    console.error('❌ Monitoring service not initialized!');
    throw new Error('Monitoring service not initialized. Call initializeMonitoring first.');
  }
  console.log('✅ Returning monitoring service instance');
  return monitoringServiceInstance;
};

export type { MonitoringConfig, LogEntry };