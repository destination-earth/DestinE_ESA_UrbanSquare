# ☁️​ Air pollution

## User requirements

Users will have the past and present view of the pollution in their territory and its comparison to the World Health Organisation standards. The demonstrator will integrate examples of relevant policies (for example, transforming roads into walking street, Low Emission Zone deployment, etc) to support decision making and WhatIf scenario simulations.

## High resolution modelling

Besides the retrieval of CAMS data (Global and European forecasts depending on the region of interest) the main block of processing relates to the Murmuration’s high resolution modelling of Air Quality (NO2), that is described in this paper that we presented in the Living Planet Symposium13. It is relevant to model NO2 on a high resolution (1km*1km) as this gas is directly related to human activities and mainly transportation, thus providing a relevant action leverage for city planners and local stakeholders. We do not intend to perform high resolution modelling for other gazes (for instance Ozone, CO) or particules (PM2.5 and PM10) as the resolution provided by CAMS (10km*10km) provides sufficient results on a city scale.

This high resolution modelling follows 3 major steps:
• A programed « Flow » (using the Prefect orchestrator) that fetches data from CAMS and stores them on an S3 storage. Followed by harmonization and consolidated of existing historical data in a zarr file on the area and time of interest.
• Prediction : a programed Flow that uses the pretrained model on an NFS file system, fetches the zarr file and stores the result stack in a new zarr file (that gets updated with each new CAMS data – daily updates)
• Comparison: with the standard for air quality for short and long term exposures to pollution by World Health Organization
• Update of the visualization interface – either by re-generating WMS layers or by preparing CSV files for quick access and “consumption” by the interface
