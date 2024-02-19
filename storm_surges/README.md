# 🌩️​ Storm surges

The process involves assessing the impact of storm surges and sea level rise under various scenarios. Digital Elevation Model (DEM) tiles, essentially digital representations of terrain, are used for this analysis. To expedite the computation, smaller tiles (pieces of the DEM) are created for vector calculations.

One significant step involves aligning the Copernicus Water-bodies dataset, which is stored globally, with the DEM tiles. The water bodies information is cropped to match the extent of the DEM tile, allowing for a layer representing these water bodies. Pixels with a value of zero in the DEM (indicating the absence of elevation information) are vectorized, and objects intersecting with the open sea, defined by the Precise Coastline Vector, are marked as Layer 1.

The analysis then considers sea level rise scenarios, particularly focusing on the IPCC AR6 SSP119 scenario from 2020. Elevation data from the DEM is adjusted based on this scenario's sea level rise, and areas below the current sea level are marked as Protected Areas (Layer 2). For other scenarios (SSP119, 126, 245, 370, and 585), similar calculations are applied, marking pixels with values below zero as Potentially Flooded Areas (Layer 3). This process involves up-sampling and cropping the data to align with DEM boundaries.

In the context of storm surge scenarios, an additional value is added to the sea level, ranging from 0m to 5m, depending on the specific scenario of inundation. Pixels with values other than zero in this context are marked as Layer 4, representing land unaffected by the analyzed scenarios.

The results are organized into layers, including Waterbodies, Sea, Protected Area, Potential Flooded Area, and Land. The hierarchical order of these layers determines the visualization outcome, ensuring that different aspects are displayed in a meaningful way. Overall, this detailed process allows for a comprehensive analysis of the potential impacts of storm surges and sea level rise under different conditions.

![InundataionV2](https://github.com/destination-earth/DestinE_ESA_UrbanSquare/assets/58464670/43d1f919-129b-4c9f-91ba-a615c4db32b5)
