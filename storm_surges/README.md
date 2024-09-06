# 🌩️​ Sea Level Rise and Storm Surges

## Scope
The application consists of 30m resolution global maps of inundation risk due to sea level rise (SLR) and potential storm surges, and it allows the user to assess the impact of future flood events on the most vulnerable coastal areas, under various what-if scenarios. The what-if scenarios can be run for six model years between 2040-2150, and are configured based on five global Shared Socioeconomic Pathways (SSPs) and seven storm surge heights. 

## Data
- Global Copernicus Digital Elevation Model (DEM) at 30m (https://spacedata.copernicus.eu/collections/copernicus-digital-elevation-model).

- Copernicus Land Cover Waterbodies (https://viewer.esa-worldcover.org/worldcover/?language=en&bbox=-347.6953125,-83.44032649527307,347.6953125,83.44032649527307&overlay=false&bgLayer=OSM&date=2024-09-02&layer=WORLDCOVER_2021_MAP).

- SLR projections by IPCC AR6 (https://www.ipcc.ch/report/ar6/syr/downloads/report/IPCC_AR6_SYR_LongerReport.pdf). [Note: this is applicable only to the global sea, no other waterbodies are inluded.]



### Inundation Layer Modelling

As a first step, the Copernicus waterbodies layer is aligned with the DEM tiles. Then the elevation baseline values are adjusted by using the data for the SSP119 scenario in 2020 at medium confidence level. Areas below the current sea level are marked as Protected Areas (green): since these areas are not currently at risk of inundation, we assume they are protected by infrastructure.

For each what-if scenario, the extent of the inundation is computed by marking pixels with DEM values below zero as Potentially Flooded Areas (red). This process involves up-sampling and cropping the data to align with DEM boundaries.

In the context of storm surge scenarios, an additional value is added to the sea level, ranging from 0m to 5m, depending on the specific scenario of inundation. 

Overall, this detailed process allows for a comprehensive analysis of the potential impacts of storm surges and sea level rise under different conditions.

<p align="center">
  <img src="https://github.com/destination-earth/DestinE_ESA_UrbanSquare/blob/main/storm_surges/docs/architecture.png" width="55%" height="55%">
  <img src="https://github.com/destination-earth/DestinE_ESA_UrbanSquare/blob/main/storm_surges/docs/schematics.png" width="35%" height="35%">
</p>
<p align="center"><em>Inundation risk algorithm architecture and schematics.</em></p>


## What-if Scenarios

The tool allows the user to run different what-if scenarios for any area of the globe. Below are the descriptions of the what-if parameters.

The scenarios can be run for six model years between 2040-2150, and are configured based on five global Shared Socioeconomic Pathways (SSPs) and seven storm surge heights (0-5m).

The definition of the five Shared Socioeconomic Pathway (SSP) scenarios are described below (more details IPCC_AR6_SYR_LongerReport.pdf), and they range from optimistic to pessimistic scenarios.

SSP119:  holds warming to approximately 1.5°C above 1850-1900 in 2100 after slight overshoot (median) and implies net zero CO2 emissions around the middle of the century.
 	
SSP126:  stays below 2.0°C warming relative to 1850-1900 (median) with implied net zero emissions in the second half of the century.
 	
SSP245:  is approximately in line with the upper end of aggregate Nationally Determined Contribution emission levels by 2030. SR1.5 assessed temperature projections for NDCs to be between 2.7 and 3.4°C by 2100, corresponding to the upper half of projected warming under SP245. New or updated NDCs by the end of 2020 did not significantly change the emissions projections up to 2030, although more countries adopted 2050 net zero targets in line with SSP119 or SSP126. The SSP245 scenario deviates mildly from a ‘no-additional- climate-policy’ reference scenario, resulting in a best-estimate 	warming around 2.7°C by the end of the 21st century relative to 	1850-1900.
 	
SSP370: is a medium to high reference scenario resulting from no additional climate policy under the SSP3 socioeconomic development narrative. SSP370 has particularly high non-CO2 emissions, including high aerosols emissions.
 	
SSP585: is a high reference scenario with no additional climate policy. Emission levels as high as SSP585 are not obtained by Integrated 	Assessment Models (IAMs) under any of the SSPs other than the fossil fueled SSP5 socioeconomic development pathway.

When configuring the scenario, the user can choose between low and medium confidence levels, where, ad reported by the IPCC, the low confidence level indicates that there is 20% chance that the event may occur, while a 50% chance for the medium confidence level.



<p align="center">
  <img src="https://github.com/destination-earth/DestinE_ESA_UrbanSquare/blob/main/storm_surges/docs/GUI.png"  width="90%" height="95%">
  <img src="https://github.com/destination-earth/DestinE_ESA_UrbanSquare/blob/main/storm_surges/docs/legend.png" width="15%" height="15%">
</p>
<p align="center"><em>What-if scenario configuration parameters and example output.</em></p>


## Integration with DestinE

The capabilities of the sea level rise and storm surge component of Urban Square will be greatly enhanced with the integration with the DestinE data service. In particular, the inundation products in Europe will become more robust and higher in resolution thanks to the EEA 10 m digital elevation model and the use of the sea level projections from the climate change adaptation digital twin, at 5km resolution.

<p align="center">
  <img src="https://github.com/destination-earth/DestinE_ESA_UrbanSquare/blob/main/storm_surges/docs/destine.jpg" width="65%" height="65%">
</p>
<p align="center"><em></em></p>