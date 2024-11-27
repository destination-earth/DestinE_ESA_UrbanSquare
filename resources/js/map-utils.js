/**
 * Copyright (c) 2024 Mozaika, Ltd.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
Variations

Except as contained in this notice, the name of Mozaika, Ltd. shall not be used in advertising or otherwise to promote the sale, use or other dealings in this Software without prior written authorization from Mozaika, Ltd.
 */
function initControls(){
	return ol.control.defaults().extend([
		new Control({
			"icon":"home",
			"class":"home",
			"title":"Home",
			"callback":goHome}),
		new Control({
			"icon":"list",
			"title":"Legend",
			"class":"list",
            "callback":legendTab}),
		new Control({
			"icon":"layers",
			"title":"Layers",
			"class":"layers",
            "callback":layersTab}),
		new Control({
			"icon":"border-all",
			"title":"Basemap",		
			"class":"basemap",
            "callback":basemapTab}),
        new Control({
            "id":'flood-simulation',
            "icon":"drop",
            "title":"Flood-simulation",
            "class":"flood-simulation",
            "callback":floodTab}),
        new Control({
            "id":'check alert',
            "icon":"warning",
            "title":"Check-alert",
            "class":"check-alert",
            "callback":warningTab}),
        new Control({
            "icon":"clock",
            "title":"Time slider",		
            "class":"time-slider",
            "callback":toggleTimeSlider}),
        new Control({
            "icon":"cursor",
            "title":"Cursor",
            "class":"cursor",
            "callback":removeAllIteractions}),
        new Control({
            "icon":"media-record",
            "title":"Draw point",
            "class":"point",
            "callback":addPointInteraction}),
        new Control({
            "icon":"media-stop",
            "title":"Draw box",
            "class":"box",
            "callback":addBoxInteraction}),
        new Control({
            "id":TRASH_BUTTON,
            "icon":"trash",
            "title":"Trash",
            "class":"trash",
            "callback":removeSelectedFeature}),
        new Control({
            "id":"Map to png",
            "icon":"image",
            "title":"Map to image",
            "class":"download-png",
            "callback":mapToPng}),           
		]);

}



function setTrashButtonVisibility(){
    setTimeout(() => { // for proper get features work
        let isVisible = drawSource.getFeatures().length > 0;
        if(isVisible==false){
            isVisible = drawFlood.getFeatures().length > 0;
        }
        const trashButton = document.getElementById(TRASH_BUTTON);
        if(trashButton)
            trashButton.style.display = isVisible ? 'block' : 'none';
    }, 10);
}

function setId(evt){
    featureID = featureID + 1;
    evt.feature.setProperties({
        'id': featureID,
        'json':userDrawnInteraction
    });
}

function getCoordinates(coords){
    result = {};
    let lonLatItems = [];
    let coordinates = coords[0];
    const isArray   = Array.isArray(coordinates);

    if(!isArray){
        coordinates = [[coords[0],coords[1]],[]];
    }

    for(let i=0; i < coordinates.length-1;i++){
        let lonLat = ol.proj.toLonLat(coordinates[i]);
        lonLatItems.push(lonLat);
    }


    if(lonLatItems.length > 1){
        result = findMinMax(lonLatItems);

    }else{
        result = {
            "longitude":lonLatItems[0][0],
            "latitude":lonLatItems[0][1]
        };
    }
    
    return result;
}

function doWork(coords){
    userDrawnInteraction = getCoordinates(coords);
    let type = isPoint(userDrawnInteraction) ? JSON_POINTS : JSON_POLYGONS;
    setJson(type,userDrawnInteraction);
    setTrashButtonVisibility();
    showModal();
}

function initDrawingPoint(){

    drawPoint = new ol.interaction.Draw({
        source: drawSource,
        type: 'Point',
    });

    drawPoint.on('drawend', function(evt){
                // Check the name of the drawSource
		let feature = evt.feature;
		let coords = feature.getGeometry().getCoordinates();
        doWork(coords);
        setId(evt);
        userMap.removeInteraction(drawPoint);
    });

}

function initDrawingBox(){

    drawBox = new ol.interaction.Draw({
        source: drawSource,
        type: 'Circle',
        geometryFunction: new ol.interaction.Draw.createBox 
    });

    drawBox.on('drawend', function(evt){

		var feature = evt.feature;
		var coords = feature.getGeometry().getCoordinates();
        doWork(coords);
        setId(evt);    
    });

}

function initSingleClick(){
    singleClick = new ol.interaction.Select();
    userMap.addInteraction(singleClick);

     singleClick .getFeatures().on('add', function (event) {
        let properties = event.element.getProperties();
        if(properties.id)
            selectedFeatureID = properties.id;      
    });
}

function initInteractions(){

    initSingleClick();
    initDrawingPoint();
    initDrawingBox();

}



function displayFeatureInfo (evt) {
    const pixel = evt.pixel;
    const coordinate = evt.coordinate;
    const featureAndLayer = userMap.forEachFeatureAtPixel(pixel, function (feature,layer) {
        return [feature,layer];
    });
    if (featureAndLayer) {
        let title   = '';
        let measure = '';
        const value   = featureAndLayer[0].get('value');

        if(featureAndLayer[1]){
            title = featureAndLayer[1].get('title') ? featureAndLayer[1].get('title') : '';
            measure = featureAndLayer[1].get('measure') ? featureAndLayer[1].get('measure') : '';
        }

        if(title){
            let idx = title.indexOf("Fairway");
            if(title.indexOf("ZC")==-1 && idx<0)
                if(value){
                    let res = `<code class="code-content">${title} : ${value} ${measure}</code>`;
                    content.innerHTML = res;
                    overlay.setPosition(coordinate);
                }
        }

                    
    } else {
        closeTooltip();
    }
}




function initTooltip(){
	container = document.getElementById('popup');
	content = document.getElementById('popup-content');

	overlay = new ol.Overlay({
		element: container,
		autoPan: {
		  animation: {
			duration: 250,
		  },
		},
	  });
	  
}

function doTooltip(){
    userMap.on('pointermove', function (evt) {
		if (evt.dragging) {
            closeTooltip();
		  return;
		}

        try {
            displayFeatureInfo(evt);
          } catch (error) {

          }

	  });

      userMap.on('click', function (evt) {
		displayFeatureInfo(evt);
	  }); 
}

function layerCommonConfig(features,layer,items,legend=true){

    const vectorSource = new ol.source.Vector({
        features,
    });

    let layerColorRamp = getColorRampFromKey(layer["MFCType"]);
    let size = getPointSize(layer["MFCType"]);
    let color = [
        'interpolate',
        ['linear'],
        ['get', 'value']
    ];
    color = color.concat(layerColorRamp);
    const vectorLayer = new ol.layer.WebGLPoints ({
        source: vectorSource,
        willReadFrequently:true,
        style: {
            symbol: {
            symbolType: 'square',
            size: size,
            color:color,
              opacity: 0.8,
            },
          },
        items:items,
        mfctype:layer["MFCType"],
        title:generateLayerName(layer),
        measure:layer["measure"] ? layer["measure"]: '' ,
        maxZoom: MAX_ZOOM,
    });

    if(userMap){
        userMap.getLayers().push(vectorLayer);
        if(isCustomLayer(layer["MFCType"])==false){
            initLayersVisibility();
        }
        if(legend==true){
            createLegend(layerColorRamp,generateLayerName(layer));
        }

    }
 
}

function getFeatureFromData(data){

    if(data.length==3){
        let lat = parseFloat(data[0]);
        let lon = parseFloat(data[1]);
        let value = parseFloat(data[2]);
        const point = new ol.geom.Point(ol.proj.fromLonLat([
            lon, lat
        ]));
  
        return new ol.Feature({
            value:value,
            geometry: point,
        });

    }else{

        let date = data[0];
        let lat = parseFloat(data[1]);
        let lon = parseFloat(data[2]);
        let value = data[3];//Math.round(data[3]*10)/10;
        const point = new ol.geom.Point(ol.proj.fromLonLat([
            lon, lat
        ]));
  
        return new ol.Feature({
            value:value,
            date:date,
            geometry: point,
        });


    }
}

function writeMapFeatures(items){
    const features = [];

    if(document.getElementById(SLIDER_RANGE_START))
        currentDate = document.getElementById(SLIDER_RANGE_START).innerHTML;



    endDateInData = findEndDate(items);
    if(Date.parse(endDateInData)){
        // if(parseInt(currentDate.replace(/-/g,""),10) >  parseInt(endDateInData.replace(/-/g,""),10) ){
        //     return features;
        // }
    }


    for(let i =0; i < items.length; i++){

        let dateLatLongVal = null;
        if(items[i].indexOf('|') !== -1){
            dateLatLongVal = items[i].split('|');
        }else{
            dateLatLongVal = items[i].split(',');
        }

        if (dateLatLongVal[0] != 'latitude' && dateLatLongVal[0] != 'longitude'){

            if(dateLatLongVal.length==3){
                features.push(getFeatureFromData(dateLatLongVal));  
            }else{
                let date = dateLatLongVal[0];

                if(currentDate){
                    // if(parseInt(date.replace(/-/g,""),10) >  parseInt(currentDate.replace(/-/g,""),10) ){
                    //     break;
                    // }
        
                    if(parseInt(date.replace(/-/g,""),10) ==  parseInt(currentDate.replace(/-/g,""),10) ){
                        features.push(getFeatureFromData(dateLatLongVal));  
                    }
                }
            }

        }
 
    }

    return features;

}

function writeCustomMapFeatures(items,MFCType,name){

    if (MFCType.toLowerCase()=='fairway'){
        fairway(items,MFCType,name);
    }

    if (MFCType.toLowerCase()=='fairwaycenterline'){
        fairwayCenter(items,MFCType,name);
    }

    if (MFCType.toLowerCase()=='building'){
        building(items,MFCType,name);
    }

    if (MFCType.toLowerCase()=='road'){
        road(items,MFCType,name);
    }

    if (MFCType.toLowerCase()=='forest'){
        forest(items,MFCType,name);
    }
}

function processLayer(items,layer,legend=true){
    
    if(isCustomLayer(layer["MFCType"])==true && isLegacyLayerFairway()==false ){
        writeCustomMapFeatures(items,layer["MFCType"],layer["MFCType"],layer["name"]);
    }else{
        let features = writeMapFeatures(items);
        layerCommonConfig(features,layer,items,legend);
    }

}

function getLayerFromBlob(layer,legend=true){
    let items = layer["sLayer"].split('\n');
    processLayer(items,layer,legend);
}

async function getLayerFromURL(layer,legend=true){
    $.ajax({
        url: layer["url"],
        type: 'GET',
        async:false,
        success: function(res) {
            let items = res.split('\n');
            processLayer(items,layer,legend);
        }

    });   
}

function layerProcessing(layers,legend){

    if(layers){

        const layersCount = layers.length;
        if(layersCount==0){
            hideSpinner();
        }
        let layersAdded = 0 ;
        layers.forEach( (layer) => {
    
            const isUrlSet = layer.hasOwnProperty('url') && layer["url"].length>0;

            if(isUrlSet){
                getLayerFromURL(layer,legend);
            }else{
                getLayerFromBlob(layer,legend);
            }


            layersAdded++;
            if(layersAdded==layersCount){
       //         hideSpinner();
            }

        })
    }

    // if(ismosProps.layers){

    //     const layersCount = ismosProps.layers.length;
    //     if(layersCount==0){
    //         hideSpinner();
    //     }
    //     let layersAdded = 0 ;
    //     ismosProps.layers.forEach( (layer) => {
    
    //         const isUrlSet = layer.hasOwnProperty('url') && layer["url"].length>0;

    //         if(isUrlSet){
    //             getLayerFromURL(layer,legend);
    //         }else{
    //             getLayerFromBlob(layer,legend);
    //         }


    //         layersAdded++;
    //         if(layersAdded==layersCount){
    //    //         hideSpinner();
    //         }

    //     })
    // }
}

function createUserLayers(legend=true){
    ismosProps = map.properties;

    if(ismosProps.layers.length){
        layers =  [...ismosProps.layers];
    }


    layerProcessing(layers,legend);
    
}


function clearMap(){

  //  let layers = userMap.getLayers();
    // for(let i =0; i< layers.A.length;i++){
    //     const isSystem = layers[i]["system"];//layers.A[i].getSource().getFeatures()[0].get('system');
    //     if(isSystem==false){
    //         userMap.removeLayer(layers.A[i]);
    //     }
    // }

    const layers = [...userMap.getLayers().getArray()]
 //   layers.forEach((layer) => userMap.removeLayer(layer))

    layers.forEach((layer) => {
        const isSystem = layer.get('system');
        if(isSystem==null){
            userMap.removeLayer(layer);
        }

    });

    let legend = document.getElementById(CONTAINER_LEGEND);
    if(legend)
        legend.innerHTML = '';

    let l = document.getElementById(CONTAINER_LAYERS);
    if(l)
        l.innerHTML = '';
}

function emptyMapProperties(){
    
    map['properties'] = {
        "from":"",
        "to":"",
        "layers":[]
    }

}

function createDrawSource(){
    return new ol.source.Vector({
		wrapX: false,
	});
}

function createFloodDrawing(){
    return new ol.source.Vector({
		wrapX: false,
	});
}

function writeMapBody(myJSON){
    clearMap();
    map['properties'] = myJSON;
    console.log(JSON.stringify(map['properties']));  
    initSlider();
	if(showTimeseries()==false){
		hideSliderButton();
	}else{
		showSliderButton();
	}
    createUserLayers();
    emptyMapProperties();
}