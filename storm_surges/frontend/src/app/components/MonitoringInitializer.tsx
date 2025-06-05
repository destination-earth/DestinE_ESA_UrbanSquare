'use client';

import { useEffect } from 'react';
import { initializeMonitoring } from '../../services/monitoring.service';
import { monitoringConfig } from '../../config/monitoring.config';

export default function MonitoringInitializer() {
  useEffect(() => {
    initializeMonitoring(monitoringConfig);
  }, []);

  return null; // This component doesn't render anything
}