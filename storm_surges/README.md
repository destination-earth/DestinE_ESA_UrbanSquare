# 🌩️​ Storm surges

The process involves assessing the impact of storm surges and sea level rise under various scenarios. Digital Elevation Model (DEM) tiles, essentially digital representations of terrain, are used for this analysis.

One significant step involves aligning the Copernicus Land Cover Waterbodies  dataset, which is stored globally, with the DEM tiles. The water bodies information is cropped to match the extent of the DEM tile, allowing for a layer representing these water bodies. Pixels with a value of zero in the DEM (indicating the absence of elevation information) are added as Sea Areas to the same Layer 1 (Blue).

The analysis then considers sea level rise scenarios, particularly focusing on the IPCC AR6 SSP119 scenario from 2020. Elevation data from the DEM is adjusted based on this scenario's sea level rise, and areas below the current sea level are marked as Protected Areas (Layer 2 - Green). For other scenarios (SSP119, 126, 245, 370, and 585), similar calculations are applied, marking pixels with values below zero as Potentially Flooded Areas (Layer 3 - Red). This process involves up-sampling and cropping the data to align with DEM boundaries.

In the context of storm surge scenarios, an additional value is added to the sea level, ranging from 0m to 5m, depending on the specific scenario of inundation. Pixels with values other than zero in this context are marked as Layer 4 (Orange), representing land unaffected by the analyzed scenarios.

The results are organized into layers, including Waterbodies and Sea, Protected Area, Potential Flooded Area, and Land. The hierarchical order of these layers determines the visualization outcome, ensuring that different aspects are displayed in a meaningful way. Overall, this detailed process allows for a comprehensive analysis of the potential impacts of storm surges and sea level rise under different conditions.

![InundataionV2](https://github.com/destination-earth/DestinE_ESA_UrbanSquare/assets/58464670/43d1f919-129b-4c9f-91ba-a615c4db32b5)
![innundationLegend_V2](https://github.com/destination-earth/DestinE_ESA_UrbanSquare/assets/58464670/63ad1d82-e915-41fb-bcc1-802d4c84e339)
