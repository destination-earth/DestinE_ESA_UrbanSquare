/**
 * Copyright (c) 2024 Mozaika, Ltd.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
Variations

Except as contained in this notice, the name of Mozaika, Ltd. shall not be used in advertising or otherwise to promote the sale, use or other dealings in this Software without prior written authorization from Mozaika, Ltd.
 */

let simulationPoint = null;

// name, minlon, minlat, maxlon, maxlat
// DamIvaylovgradPolygon -  25.8734893438269 , 41.5704775244059 , 26.1093954067532 , 41.6646672899
// DamKyrdjaliPolygon -  25.1685896533879 , 41.6163443912927 , 25.3402990617205 , 41.7139656520216
// DamStudenKladenecPolygon -  25.3840343066925 , 41.6003233691586 , 25.6428319430696 , 41.6685509973088
function drawPolygon(){

	var coordinates = [  
		[ 43.551757133144328,25.072128136453376 ], 
		[ 43.548118212979276,25.844070654077758 ],
		 [ 43.818616162618099,25.835284316478784 ],
		  [ 43.821333094843183, 25.075893709710076 ],
		   [ 43.551757133144328, 25.072128136453376 ] 
		// [ 43.22439536543668 , 25.047877703025996], 
		// [42.99832316964626, 25.047877703025996],
	
		// [ 42.99832316964626,25.379527483299434],
		// [ 43.22439536543668, 25.379527483299434], 
		// [ 43.22439536543668 , 25.047877703025996]
];
   //Declare a new array
   var coordinatesPolygon = new Array();
   //Cycle traversal transfers longitude and latitude to the projection coordinate system of "EPSG:4326"
   for (var i = 0; i < coordinates.length; i++) {
	//   var pointTransform = ol.proj.fromLonLat([coordinates[i][0], coordinates[i][1]], "EPSG:4326");
		var pointTransform = ol.proj.fromLonLat([
			coordinates[i][1], coordinates[i][0],'EPSG:4326', 'EPSG:3857'
		]);
	   coordinatesPolygon.push(pointTransform);
   }

   var source = new ol.source.Vector();
   //Vector Layer
   var vector = new ol.layer.Vector({
		system:true,
	   source: source,
	   style: new ol.style.Style({
		   fill: new ol.style.Fill({
			   color: 'rgba(255, 255, 255, 0.1)'
		   }),
		   stroke: new ol.style.Stroke({
			   color: 'red',
			   width: 2
		   }),
		   image: new ol.style.Circle({
			   radius: 10,
			   fill: new ol.style.Fill({
				   color: '#ffcc33'
			   })
		   })
	   })
   });
   //The polygon here must be an array of coordinates
   var plygon = new ol.geom.Polygon([coordinatesPolygon])
   //Polygon feature class
   var feature = new ol.Feature({
	   geometry: plygon,
   });
	console.log(feature);
	source.addFeature(feature);
	console.log(vector.getSource().getFeatures().length);
	userMap.addLayer(vector);  
}

function drawPolygon2(coordinates,color){

	//Declare a new array
	var coordinatesPolygon = new Array();
	//Cycle traversal transfers longitude and latitude to the projection coordinate system of "EPSG:4326"
	for (var i = 0; i < coordinates.length; i++) {
	 //   var pointTransform = ol.proj.fromLonLat([coordinates[i][0], coordinates[i][1]], "EPSG:4326");
		 var pointTransform = ol.proj.fromLonLat([
			 coordinates[i][1], coordinates[i][0],'EPSG:4326', 'EPSG:3857'
		 ]);
		coordinatesPolygon.push(pointTransform);
	}
 
	var source = new ol.source.Vector();
	//Vector Layer
	var vector = new ol.layer.Vector({
		system:true,
		source: source,
		style: new ol.style.Style({
		 fill: new ol.style.Fill({
			 color: 'rgba(255, 255, 255, 0.1)'
		 }),
		 stroke: new ol.style.Stroke({
			 color: color,
			 width: 2
		 }),
		 image: new ol.style.Circle({
			 radius: 10,
			 fill: new ol.style.Fill({
				 color: '#ffcc33'
			 })
		 })
	 })
	});
	//The polygon here must be an array of coordinates
	var plygon = new ol.geom.Polygon([coordinatesPolygon])
	//Polygon feature class
	var feature = new ol.Feature({
		geometry: plygon,
	});
	 console.log(feature);
	 source.addFeature(feature);
	 console.log(vector.getSource().getFeatures().length);
	 userMap.addLayer(vector);  
 }
 
function clearCoords(){
	// document.getElementById('rectangle-coordinates').innerText = '';
	// document.getElementById('point-coordinates').innerText = '';
}

function initUserFloodConfigPolygon(){

    // Store the drag pan interaction for later restoration
    const dragPan = userMap.getInteractions().getArray().find(function (interaction) {
        return interaction instanceof ol.interaction.DragPan;
    });

    // Custom geometry function to ensure rectangle is drawn
    const createBox = function (coordinates, geometry) {
        const start = coordinates[0];
        const end = coordinates[1];

        const minX = Math.min(start[0], end[0]);
        const minY = Math.min(start[1], end[1]);
        const maxX = Math.max(start[0], end[0]);
        const maxY = Math.max(start[1], end[1]);

        const rectCoords = [
            [minX, minY],
            [minX, maxY],
            [maxX, maxY],
            [maxX, minY],
            [minX, minY]
        ];

        if (!geometry) {
            geometry = new ol.geom.Polygon([rectCoords]);
        } else {
            geometry.setCoordinates([rectCoords]);
        }

        return geometry;
    };

    // Add interaction for drawing rectangles (constrained polygon)
    let drawInteraction;

    const addDrawRectangleInteraction = () => {
        if (drawInteraction) {
            userMap.removeInteraction(drawInteraction);  // Remove any existing interaction
        }

        // Disable map panning while drawing
        userMap.removeInteraction(dragPan);

        drawInteraction = new ol.interaction.Draw({
            source: drawFlood,  // Add drawn feature to vector source
            type: 'LineString',   // Start with a LineString (we'll convert to a rectangle)
            geometryFunction: createBox,  // Use the custom geometry function
            maxPoints: 2  // Limit to two points (diagonal corners)
        });

        // Event listener to handle when drawing is complete
        drawInteraction.on('drawend', function (event) {
            const feature = event.feature;  // Get the drawn feature
            const geometry = feature.getGeometry();  // Get the geometry of the rectangle

            // Get the bounding box (extent) of the rectangle
            const extent = geometry.getExtent();
            console.log('Bounding Box (Extent):', extent);
			// Convert the extent to latitude/longitude (EPSG:4326)
			const transformedExtent = ol.proj.transformExtent(extent, 'EPSG:3857', 'EPSG:4326');

            document.getElementById('rectangle-coordinates').innerText = `
                South-West (Lon, Lat): [${transformedExtent[0].toFixed(6)}, ${transformedExtent[1].toFixed(6)}]
                North-East (Lon, Lat): [${transformedExtent[2].toFixed(6)}, ${transformedExtent[3].toFixed(6)}]
            `;

            // Log the rectangle's coordinates in Lon/Lat
            const coordinates = geometry.getCoordinates();
            console.log('Rectangle Coordinates:', coordinates);

            // Remove the draw interaction after the rectangle is drawn
            userMap.removeInteraction(drawInteraction);

            // Re-enable map panning
            userMap.addInteraction(dragPan);
			setTrashButtonVisibility();
        });

        userMap.addInteraction(drawInteraction);
    };

    // Button click event to enable rectangle drawing
    // document.getElementById('drawRectangleButton').addEventListener('click', function () {
	// 	clearCoords();
	// 	removeFloodFeature();
    //     addDrawRectangleInteraction();
    // });

}

function initMap(){
// Loop through each step
	initColorRamps();
	//getContext('2d', { willReadFrequently: true });
	initMapLayers();

	initSlider();
	initTooltip();
	drawSource = createDrawSource();
	drawFlood = createFloodDrawing();
//	homeView = getLocationView(['Rositsa']);
	homeView = getLocationView(['Danube']);
	console.log(homeView);

	if(document.getElementById(CONTAINER_MAP)){
		userMap = new ol.Map({
			controls: initControls(),
	//		projection: 'EPSG:4326',
			target: CONTAINER_MAP,
			overlays: [overlay],
		//	layers: [rasterLayer, vectorLayer],
			layers: [
	
				 osmLayer,
				 satelliteLayer,

				new ol.layer.Vector({
					system:true,
					source: drawSource,
					name:"tmp",
					// displayName:"displayName2",
				}),


				new ol.layer.Vector({
					system:true,
					source: drawFlood,
					style: function (feature) {
						// Define different styles for points and polygons
						const geometryType = feature.getGeometry().getType();
						if (geometryType === 'Point') {
							return new ol.style.Style({
								image: new ol.style.Circle({
									radius: 5,
									fill: new ol.style.Fill({
														color: 'rgba(0, 0, 255, 0.1)',
									}),
									stroke: new ol.style.Stroke({
										color: 'red',
										width: 2
									})
								})
							});
						} else if (geometryType === 'Polygon') {
							return new ol.style.Style({
								stroke: new ol.style.Stroke({
									color: 'blue',
									width: 2
								}),
								fill: new ol.style.Fill({
									color: 'rgba(0, 0, 255, 0.1)'
								})
							});
						}
					}
				})

			//	polygonFeatureT
			],
			view: new ol.View({
			center: ol.proj.fromLonLat(homeView["center"]),
			  zoom: homeView["zoom"],
			  maxZoom: MAX_ZOOM,
			})
		});
		//addCsvLayer();
	// 	dummy();
	}else{
		console.log("MAP OBJECT DOES NOT EXIST!");
	}
//===========================================
	//initUserFloodConfigPolygon();
	initUserFloodConfigPoint();
    // Add interaction for drawing rectangle
    // Store the drag pan interaction for later restoration

//============================================
	function ignoreerror() { return true } window.onerror=ignoreerror();

	createUserLayers();

	initInteractions();
    setTrashButtonVisibility();

	if(showTimeseries()==false){
		hideSliderButton();
	}else{
		showSliderButton();
	}

	doTooltip();
	hideSpinner();
}

async function initApp(){
	initMap();

	initFloodSimulation();

}

initApp();
