/**
 * Copyright (c) 2024 Mozaika, Ltd.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
Variations

Except as contained in this notice, the name of Mozaika, Ltd. shall not be used in advertising or otherwise to promote the sale, use or other dealings in this Software without prior written authorization from Mozaika, Ltd.
 */
function writeMapProperty(stringProperty,myJSON){
    ismosProps = map['properties'];
    ismosProps[stringProperty] = myJSON;
    map['properties'] = ismosProps;
    console.log(JSON.stringify(map['properties']));
}

function isEqualsJson(obj1,obj2){
    keys1 = Object.keys(obj1);
    keys2 = Object.keys(obj2);

    //return true when the two json has same length and all the properties has same value key by key
    return keys1.length === keys2.length && Object.keys(obj1).every(key=>obj1[key]==obj2[key]);
}

function jsonExists(array,item){
    for(let i =0; i < array.length;i++){
        if(isEqualsJson(array[i],item)==true)
            return i;
    } 
    return -1;
}

function setJson(property,object){
    let ismosProps = map.properties;

    if(!ismosProps.hasOwnProperty(property)){
        ismosProps[property] = [];
    }

    let index = jsonExists(ismosProps[property],object);

    if(index==-1){
        ismosProps[property].push(object);
    }else{
        ismosProps[property].splice(index, 1);
    }

    if( ismosProps[property].length==0){
        delete ismosProps[property];
    }
    console.log(ismosProps);
    map.properties = ismosProps;  
}


function getEdges(result){

    result = {
        "leftTopLong":   result["minLong"],
        "leftTopLat":result["maxLat"],

        "leftBottomLong":  result["minLong"],
        "leftBottomLat":result["minLat"],

        "rightTopLong":  result["maxLong"],
        "rightTopLat":result["maxLat"],

        "rightBottomLong":  result["maxLong"],
        "rightBottomLat":result["minLat"],


        // "leftBottom": [  result["minLat"],  result["minLong"]  ],
        // "rightBottom": [  result["minLat"],  result["maxLong"]  ],
        // "rightTop": [  result["maxLat"],  result["maxLong"]  ],
        // "leftTop": [  result["maxLat"],  result["minLong"]  ],
    }
    return result;
}

function findMinMax(pol){
    
    result = {
        
        "minLong":99999,
        "minLat":99999,
        "maxLong":-1,
        "maxLat":-1,
    };
    
    pol.forEach(point => {
        // longtitude
        if (point[0] < result["minLong"])
            result["minLong"] = point[0];
        if (point[0] > result["maxLong"])
            result["maxLong"] = point[0];
        // latitude
        if (point[1] < result["minLat"])
            result["minLat"] = point[1]
        if (point[1] > result["maxLat"])
            result["maxLat"] = point[1] 
    });
    
    return getEdges(result);
   // return result;

}

function findAverageCoords(matches){
    let lat = 0;
    let long = 0;
    for( let i=0; i< matches.length;i++){
        lat += matches[i]["center"][0];
        long += matches[i]["center"][1];
    }
    lat = lat / matches.length;
    long = long / matches.length;
    let result = {
        "center":[  lat,  long],
        "zoom":11,
    //    "zoom":9
    }
    return result;
}

function getMatches(locations){
    const keys = Object.keys(VIEWAREAS);

    matches = []
    for(let j =0; j <  locations.length;j++){
        let location = locations[j].toLowerCase();

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            let lowerKey = key.toLowerCase();
            
            if(location.includes(lowerKey)){//   if(lowerKey==location){
                matches.push(VIEWAREAS[key]);
            }
          }
    }

    return matches;
}

function getLocationView(locations){

    matches = getMatches(locations);

    if(matches.length==1){
        return matches[0];
    }else if(matches.length > 1){
        let result = findAverageCoords(matches);
        return result;
    }
    return VIEWAREAS["Default"];
}

function changeMapView(locations){
    console.log(locations);
    locationData = getLocationView(locations);

    if(userMap){
        homeView = locationData;
        userMap.getView().setCenter(ol.proj.fromLonLat(homeView["center"]));
        userMap.getView().setZoom(homeView["zoom"]);
    }else{
        console.log("ERROR map object is null!");
    }

}

function dismiss()
{
    removeSelectedFeature({_searchId:featureID});
    $(MODEL_NAME).modal('hide');
}

function showModal(){
    $(MODEL_NAME).modal({backdrop:'static', keyboard:false});
    $(MODEL_NAME).modal('show');
    let btn = $(BUTTON_WRITE_FEATURES);
    btn.prop("disabled", true);   // Or `false`
    $('.selectall[type="checkbox"]').prop('checked', false);
}

function setOkState(){
    let selectedchecktxt = $(`${MAP_FEATURES} input:checked`).map(function(){
        return $(this).next('label').text();
    }).get();

    let state = !(selectedchecktxt.length > 0);
    let btn = $(BUTTON_WRITE_FEATURES);
    btn.prop("disabled", state);   // Or `false`
}

function isPoint(obj){
    // if minLot,minLat,maxLot,maxLat are not present we assume it is a point
    return Object.keys(obj).length < 4; 
}

function writeFeatures(){

    let ismosProps  = map.properties;
    let type = isPoint(userDrawnInteraction) ? JSON_POINTS : JSON_POLYGONS;
    let idx = jsonExists(ismosProps[type],userDrawnInteraction);

    let selectedchecktxt = $(`${MAP_FEATURES} input:checked`).map(function(){
       return $(this).attr("value");
    }).get();

    ismosProps[type][idx]["characteristics"] = [];
    selectedchecktxt.forEach(element => {

        ismosProps[type][idx]["characteristics"].push({
            "MFCType":element,
            "amount":""
        });

    });


    console.log(ismosProps[type][idx]);
    map.properties = ismosProps;   
    $(MODEL_NAME).modal('hide');
}

function stringToDate(date){
    let parts =date.split('-');
    let mydate = new Date(parts[0], parts[1] - 1, parts[2]); 
    return mydate;
}

function date2str(x, y) {
    var z = {
        M: x.getMonth() + 1,
        d: x.getDate(),
        h: x.getHours(),
        m: x.getMinutes(),
        s: x.getSeconds()
    };
    y = y.replace(/(M+|d+|h+|m+|s+)/g, function(v) {
        return ((v.length > 1 ? "0" : "") + z[v.slice(-1)]).slice(-2)
    });

    return y.replace(/(y+)/g, function(v) {
        return x.getFullYear().toString().slice(-v.length)
    });
}

function toggleLayerVisibility(index) {
    let currentIndex = 0;
    let layers = userMap.getLayers();

    layers.forEach(layer => {
        const title = layer.get('title');
        if (typeof title != "undefined") {
            if(currentIndex==index){
                let state = layer.getVisible();
                layer.setVisible(!state);
            }
            currentIndex++;
        }
    });
}


function createLegend(colorRamp,itemTitle){

    let legend = document.getElementById(CONTAINER_LEGEND);
    let content = document.createElement("div");
    content.className = "legend-item-title";
    let title = document.createElement("label");
    title.innerHTML =	itemTitle;
    content.appendChild(title);

    for(let i =0; i < colorRamp.length-2; i+=2){

        let titleInfo = document.createElement("div");
        let colorInfo = document.createElement("div");
        colorInfo.className = "legend-item-row-info-color";
        const value = colorRamp[i];
        const color = colorRamp[i+1];
        const nextValue = colorRamp[i+2];
        colorInfo.style.backgroundColor = color;

        let colorInfoText = document.createElement("span");
        colorInfoText.className = "legend-item-row-info";

        let cInfo = '';

        if (colorRamp.length > 4)
            cInfo = `${value} - ${nextValue}`;
        colorInfoText.innerHTML = cInfo;

        titleInfo.appendChild(colorInfo);
        titleInfo.appendChild(colorInfoText);
        content.appendChild(titleInfo);

    }

    legend.appendChild(content);

}

function initLayersVisibility(){
    var s= document.getElementById(CONTAINER_LAYERS);
 //   s.innerHTML = '<ul>\n';
    let html = '<ul style="padding:0;">\n';
    let index = 0;
    let layers = userMap.getLayers();
    layers.forEach(element => {
        const title = element.get('title');
        if (typeof title != "undefined") {
            visible = element.getVisible();
            html +=  ` <li> <input type="checkbox" id=" ${title}_${index}" value=" ${title}_${index}" onclick="toggleLayerVisibility(${index})" ${ visible==true ? 'checked' : 'unchecked'} > <label for=" ${title}_${index}"> ${title}</label>   </li> `;  
            index++;
        }
    });
    html += '</ul>\n';
    s.innerHTML = html;
}

function getColorRampFromKey(colorRampKey){

    colorRampKey = colorRampKey.toLowerCase();
    const keys = Object.keys(colorRamps);
    const values = Object.values(colorRamps);
    for (let i = 0; i < keys.length; i++) {
        let key;
        if(DEBUG==true){
            if( keys[i].indexOf(PREFIX) !== -1 ){
                key = keys[i].replace(PREFIX, "");
            } 
        }else{
            key = keys[i];
        }

        if(!key){
            key = keys[i]; 
        }

        key = key.toLowerCase();
        const value = values[i];
        if(colorRampKey.indexOf(key) !=-1){//if(key==colorRampKey){
            return value;
        }

    }
    return colorRamps["UNKNOWN"];
}

function smoothLoad(layer){
    let key = layer.toLowerCase();
    if(key=='reflectance' || key == 'turbidity'){
        return -1;
    }
    return 3;
}

function initMapLayers(){


    osmLayer = new ol.layer.Tile({
        system:true,
        visible:false,
        source: new ol.source.OSM(),
        maxZoom: MAX_ZOOM,
        crossOrigin: "Anonymous"
    });

    satelliteLayer =  new ol.layer.Tile({
        system:true,
        source: new ol.source.XYZ({
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          maxZoom: MAX_ZOOM,
          crossOrigin: "Anonymous"
        })
    });
}

function initElevation(){
    const numSteps = 500;
    for (var i = 0; i < numSteps; i+=10) {
    // Calculate the color value based on the step

    //var colorValue = '#' + ('FF000' + i.toString(16)).slice(-6); // Convert decimal to hex
	//var colorValue = '#' + ('FF0' + i.toString(16)+ 'FF').slice(-6) ; // Convert decimal to hex
	//var colorValue = '#' + ('F0F' + i.toString(16)+ '00').slice(-6) ; // Convert decimal to hex
	//var colorValue = '#' + ('F0F' + i.toString(16)+ 'F0').slice(-6) ;

        var colorValue;
        if (i <= numSteps / 2) {
            colorValue = '#' + ('F0F' + i.toString(16)+ 'F0').slice(-6) ;
        } else {
            // For the upper half, transition from green to white
            colorValue = '#' + ('F0F' + i.toString(16)+ '00').slice(-6) ;
        }

        colorRamps['elevation'].push(i, colorValue);
    };
}

function initFlood(){
    // Define the starting and ending RGB values
    const startColor = [255, 255, 255]; // RGB values of "#06d0fe"
    const endColor = [6, 208, 254]; // RGB values of white

    // // Calculate the step size for each RGB channel
    // const stepSizeR = (endColor[0] - startColor[0]) / 499;
    // const stepSizeG = (endColor[1] - startColor[1]) / 499;
    // const stepSizeB = (endColor[2] - startColor[2]) / 499;
    const numColors = 500;
    for (let i = 0; i < numColors; i++) {
        const ratio = i / (numColors - 1);

        const red = Math.round(startColor[0] + ratio * (endColor[0] - startColor[0]));
        const green = Math.round(startColor[1] + ratio * (endColor[1] - startColor[1]));
        const blue = Math.round(startColor[2] + ratio * (endColor[2] - startColor[2]));
        let hexColor = "#" + ((1 << 24) + (red << 16) + (green << 8) + blue).toString(16).slice(1);
        colorRamps['flood'].push(i / 100,hexColor);
    }


}

function initColorRamps(){
    initElevation();
    initFlood(); 
}

function selectBasemap(basemap){
    let idx = basemap.src.indexOf("osm");;
    let osmVisible = false;

    if(idx != -1){
        osmVisible = true;
    }

    satelliteLayer.setVisible(!osmVisible);
    osmLayer.setVisible(osmVisible);

    $(`ul#${BASEMAP_LIST}`).find('li').removeClass('selected_basemap');
    basemap.parentNode.classList.add("selected_basemap");
}

function showTimeseries(){

    let showTimeSeries = false;

    if(ismosProps.from && ismosProps.to){
        if(ismosProps.from  != ismosProps.to){
            showTimeSeries = true;
            from = ismosProps.from;
            to   = ismosProps.to;
        }
    }

    return showTimeSeries;
}


function isTelemacVariable(vari){

    if(vari.indexOf(' ') !=-1){
        vari = vari.split(' ')[0];
    }

 //   const variables = [`velocityU`,`velocityV`,`friction`,`surface`,`depth`,`bottom`,'fairway','ZC'];    

    vari = vari.toLowerCase();
    for(let i=0; i < TELEMAC_VARIABLES.length; i++){
        let lowerKey = TELEMAC_VARIABLES[i].toLocaleLowerCase();
        if(vari.indexOf(lowerKey) !=-1)

            return true;
    }

    return false;

}

function getPointSize(type){
    // const isTVar        = isTelemacVariable(type);
    // return TELEMAC_POINT_SIZE;
    // if(isTVar){
    //     return TELEMAC_POINT_SIZE;
    // }
    if(type=='WaterLevel'){
        return ["array", ["/", 62, ["resolution"]], ["/", 85, ["resolution"]]];
    }

    const isTVar        = isTelemacVariable(type);
    if(isTVar){
        return ["array", ["/", 40, ["resolution"]], ["/", 40, ["resolution"]]];
    }

    if(type=='Reflectance' || type=='Turbidity'){
        return ["array", ["/", 2200, ["resolution"]], ["/", 1500, ["resolution"]]];
    }

    return ["array", ["/", 5700, ["resolution"]], ["/", 7900, ["resolution"]]];
}

function isPointVariable(vari){

    if(vari.indexOf(' ') !=-1){
        vari = vari.split(' ')[0];
    }

//    const variables = [`turbidity`,`reflectance`];    

    vari = vari.toLowerCase();
    for(let i=0; i < POINT_VARIABLES.length; i++){
        let lowerKey = POINT_VARIABLES[i].toLocaleLowerCase();
        if(vari.indexOf(lowerKey) !=-1)
        
            return true;
    }

    return false;

}

function isCustomLayer(vari){

    vari = vari.toLowerCase();
    for(let i=0; i < CUSTOM_LAYERS.length; i++){
        let lowerKey = CUSTOM_LAYERS[i].toLocaleLowerCase();
        if(vari.indexOf(lowerKey) !=-1)
        
            return true;
    }

    return false;
    
}

function isLegacyLayerFairway(){
    let f = ismosProps.from.length > 0 ?  ismosProps.from : from;
    let t = ismosProps.to.length > 0 ?  ismosProps.to : to;


    if(f && t){

        const start = parseInt(LEGACY_FAIRWAY_START.replace(/-/g,""),10);
        const end = parseInt(LEGACY_FAIRWAY_END.replace(/-/g,""),10);
        
        const result = parseInt(f.replace(/-/g,""),10) >= start && parseInt(t.replace(/-/g,""),10) <= end;
        return result;
    }

    return true;



}

function findEndDate(items){
    // let result = null;
    // for(i= items.length-1;i >0;i--){
    //     if(items[i].length > 0){
    //         if(items[i].indexOf('|') !== -1){
    //             result = items[i].split('|')[0];
    //         }else{
    //             result = items[i].split(',')[0];
    //         }
    //         return result;
    //     }
    // }
    // return result;

    let result = null;
    for(i= items.length-1;i >0;i--){
        if(items[i].length > 0){
            date = null;

            if(items[i].indexOf('|') !== -1){
                date = items[i].split('|')[0];
            }else{
                date = items[i].split(',')[0];
            }

            if(result==null){
                result = date;
            }
              
            if(parseInt(date.replace(/-/g,""),10) >  parseInt(result.replace(/-/g,""),10) ){
                result = date;
            }
        }
    }
    return result;

}

function closeTooltip(){
    overlay.setPosition(undefined);
    return false;
}

function hideSpinner(){
    let elem = document.getElementById('spinner');

    if(elem)
        elem.style.display = 'none';
}

function showSpinner(){
    let elem = document.getElementById('spinner');

    if(elem)
        elem.style.display = 'block';
}

function generateLayerName(layer){
    return layer["name"] ? layer["name"]: `Untitled layer ${userMap.getLayers().A.length-2}`;
}

async function getMapAsBase64(){
    return new Promise((resolve) => {
        userMap.once('rendercomplete', function () {
          const mapCanvas = document.createElement('canvas');
          const size = userMap.getSize();
          mapCanvas.width = size[0];
          mapCanvas.height = size[1];
          const mapContext = mapCanvas.getContext('2d');
          Array.prototype.forEach.call(
            userMap.getViewport().querySelectorAll('.ol-layer canvas, canvas.ol-layer'),
              function (canvas) {
                if (canvas.width > 0) {
                  const opacity =
                    canvas.parentNode.style.opacity || canvas.style.opacity;
                  mapContext.globalAlpha = opacity === '' ? 1 : Number(opacity);
                  let matrix;
                  const transform = canvas.style.transform;
                  if (transform) {
                    // Get the transform parameters from the style's transform matrix
                    matrix = transform
                      .match(/^matrix\(([^\(]*)\)$/)[1]
                      .split(',')
                      .map(Number);
                  } else {
                    matrix = [
                      parseFloat(canvas.style.width) / canvas.width,
                      0,
                      0,
                      parseFloat(canvas.style.height) / canvas.height,
                      0,
                      0,
                    ];
                  }
                  // Apply the transform to the export map context
                  CanvasRenderingContext2D.prototype.setTransform.apply(
                    mapContext,
                    matrix
                  );
                  const backgroundColor = canvas.parentNode.style.backgroundColor;
                  if (backgroundColor) {
                    mapContext.fillStyle = backgroundColor;
                    mapContext.fillRect(0, 0, canvas.width, canvas.height);
                  }
                  mapContext.drawImage(canvas, 0, 0);
                }
              }
            );
    
          mapContext.globalAlpha = 1;
          mapContext.setTransform(1, 0, 0, 1, 0, 0);
          const mapBase64 = mapCanvas.toDataURL();
          resolve(mapBase64);
        });
    
        userMap.renderSync();
      });
}

function haversine(lat1, lon1, lat2, lon2) {
    // Radius of the Earth in kilometers
    const R = 6371;

    // Convert degrees to radians
    function toRadians(degree) {
        return degree * (Math.PI / 180);
    }

    // Convert the latitudes and longitudes from degrees to radians
    const lat1Rad = toRadians(lat1);
    const lon1Rad = toRadians(lon1);
    const lat2Rad = toRadians(lat2);
    const lon2Rad = toRadians(lon2);

    // Difference in coordinates
    const dLat = lat2Rad - lat1Rad;
    const dLon = lon2Rad - lon1Rad;

    // Haversine formula
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1Rad) * Math.cos(lat2Rad) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // Calculate the distance
    const distance = R * c * 1000; // Convert kilometers to meters;
    return distance;
}


function fetchAndProcessFile(url) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: url,
            type: 'GET',
            success: function(res) {
                let items = res.split('\n');
				items.shift();
				items = extractCoordinates(items);
                console.log("File content processed: ", items); // Process the file here
                resolve(items); // Resolve the promise with the file content
            },
            error: function(err) {
                console.error("Error fetching the file:", err);
                reject(err); // Reject the promise if there is an error
            }
        });
    });
}

function initFloodSimulation(){
	document.getElementById('simulation').addEventListener('click', function () {
		if(simulationPoint){
			const waterLevel = document.getElementById('water_level').value;
    
			// Get the value of the text input (datepicker)
			const date = document.getElementById('datepicker').value;
			const dataToSend = {
				start_point: simulationPoint,  // This is your list of coordinates
				date: date,       // Additional properties
				volume: Number(waterLevel),                // You can add any number of properties
			};
			
			showSpinner();
			fetch(FLOOD_URL, {
	
				method: 'POST', // Specify the HTTP method
				headers: {
					'Content-Type': 'application/json' // Specify the content type
				},
				body: JSON.stringify(dataToSend) // Convert array to JSON
			})
			.then(response => response.json()) // Parse the JSON response
			.then(items => {
				clearMap();
				document.getElementById('building').innerText = ``;
				document.getElementById('road').innerText = ``;
				document.getElementById('forest').innerText = ``;
				if(items.length==0){
					alert("NO ELEVATION DATA FOR THE SELECTED POINT!");
				}
				for(let i =0; i < items.length;i++){
					let legend = false;
					if(items[i]["sLayer"].toLowerCase()=='WaterLevel'){
						legend = true;
					}
					getLayerFromBlob(items[i],legend);
				}

				hideSpinner();

			//	console.log('Success:', data);
			})
			.catch((error) => {
				console.error('Error:', error);
			});
		}else{
			alert("Point not selected!");
		}
	});
}




function extractCoordinates(data) {
    return data.map(item => {
        // Extract the portion within the Polygon((...))
        const match = item.match(/Polygon\(\(([^)]+)\)\)/);
        if (match) {
            // Extract the coordinate string from the match
            const coordString = match[1];

            // Convert the coordinate string to a 2D array
            return coordString
                .split(', ')
                .map(coord => {
                    const [lat, lng] = coord.split(' ');
                    return [parseFloat(lat), parseFloat(lng)];
                });
        }
        return [];
    });
}


function initUserFloodConfigPoint(){

    // Store the drag pan interaction for later restoration
    const dragPan = userMap.getInteractions().getArray().find(function (interaction) {
        return interaction instanceof ol.interaction.DragPan;
    });

    // Add interaction for drawing points
    let drawInteraction;

    const addDrawPointInteraction = () => {
        if (drawInteraction) {
            userMap.removeInteraction(drawInteraction);  // Remove any existing interaction
        }

        // Disable map panning while drawing
        userMap.removeInteraction(dragPan);

        drawInteraction = new ol.interaction.Draw({
            source: drawFlood,  // Add drawn feature to vector source
            type: 'Point'   // Drawing points
        });

        // Event listener to handle when drawing is complete
        drawInteraction.on('drawend', function (event) {
            const feature = event.feature;  // Get the drawn feature
            const geometry = feature.getGeometry();  // Get the geometry of the point

            // Get the point coordinates
            const coordinates = geometry.getCoordinates();
            console.log('Point Coordinates (in map projection):', coordinates);

            // Log in Lon/Lat
            const lonLat = ol.proj.toLonLat(coordinates);
			// Since OpenLayers expects LonLat, swap back to [longitude, latitude]
			const LatLon = [lonLat[1], lonLat[0]];

			// Create a point geometry using the swapped LonLat coordinates
			const point = new ol.geom.Point(LatLon);

			// If necessary, transform the point to the map's projection (e.g., EPSG:3857)
			point.transform('EPSG:4326', 'EPSG:3857');
			const p = geometry.getCoordinates();
					//	const lonLat = ol.proj.transform(coordinates, 'EPSG:3857', 'EPSG:4326');

			simulationPoint = LatLon;
            console.log('Point Coordinates (Lon/Lat):', lonLat);
            // Update the content of an element with ID 'point-coordinates' with the Lat/Lon coordinates
            // document.getElementById('point-coordinates').innerText = `
            //     Point Coordinates (Lon, Lat): [${lonLat[0].toFixed(6)}, ${lonLat[1].toFixed(6)}]
            // `;
            // Remove the draw interaction after the point is drawn
            userMap.removeInteraction(drawInteraction);

            // Re-enable map panning
            userMap.addInteraction(dragPan);
			setTrashButtonVisibility();
        });

        userMap.addInteraction(drawInteraction);
    };

    // Button click event to enable point drawing
    document.getElementById('drawPointButton').addEventListener('click', function () {
		clearCoords();
		removeFloodFeature();
        addDrawPointInteraction();
    });
}