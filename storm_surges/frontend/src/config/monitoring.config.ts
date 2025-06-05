import { MonitoringConfig } from '../services/monitoring.service';

// Configuration for different environments
const monitoringConfigs: Record<string, MonitoringConfig> = {
  e2e: {
    endpoint: 'monitoring.e2e-2.desp.space',
    datastreamName: 'urbansquare.ext.monitoring-default',
    apiKey: 'OWdrQ2daWUJMTmVjVVRBRDdpWHE6SF9obG1tUkZSaGlsaEVMdmVTQzhkZw=='
  },
  production: {
    // These can be set via environment variables when deploying to production
    endpoint: process.env.NEXT_PUBLIC_MONITORING_ENDPOINT || 'monitoring.prod.desp.space',
    datastreamName: process.env.NEXT_PUBLIC_MONITORING_DATASTREAM || 'urbansquare.ext.monitoring-default',
    apiKey: process.env.NEXT_PUBLIC_MONITORING_API_KEY || ''
  }
};

// Get the current environment (default to 'e2e' for development)
const currentEnvironment = process.env.NEXT_PUBLIC_ENVIRONMENT || 'e2e';

export const monitoringConfig = monitoringConfigs[currentEnvironment] || monitoringConfigs.e2e;