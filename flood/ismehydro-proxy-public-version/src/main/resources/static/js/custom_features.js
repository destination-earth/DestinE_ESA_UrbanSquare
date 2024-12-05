/**
 * Copyright (c) 2024 Mozaika, Ltd.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
Variations

Except as contained in this notice, the name of Mozaika, Ltd. shall not be used in advertising or otherwise to promote the sale, use or other dealings in this Software without prior written authorization from Mozaika, Ltd.
 */

function addMarker(LonLat,text){
    LonLat = ol.proj.fromLonLat([LonLat[0], LonLat[1]]);
	var iconStyle = new ol.style.Style({
		image: new ol.style.Icon({
		  anchor: [0.5, 46],
		  anchorXUnits: 'fraction',
		  anchorYUnits: 'pixels',
		  src: 'https://www.geocodezip.net/mapIcons/google-maps-gps-icon-14.jpg',
		  scale: 0.1
		})
	  
	  });
	  var labelStyle = new ol.style.Style({
		text: new ol.style.Text({
		  font: '12px Calibri,sans-serif',
		  overflow: true,
		  fill: new ol.style.Fill({
			color: '#000'
		  }),
		  stroke: new ol.style.Stroke({
			color: '#fff',
			width: 3
		  }),
		  offsetY: -12
		})
	  });
	  var style = [iconStyle, labelStyle];

	const p1 = new ol.Feature({
		geometry: new ol.geom.Point(LonLat),
		name: text,
	  });
	  
	  var v = new ol.layer.Vector({
      source: new ol.source.Vector({
        features: [p1]
      }),
      style: function(feature) {
        labelStyle.getText().setText(feature.get('name'));
        return style;
      }
    });

 //   source.addFeature(p1);
    userMap.getLayers().push(v);
    initLayersVisibility();
//	userMap.addLayer(v);  

}


function addLine(coordinates,mfctype,name){

	  const lineFeature = new ol.Feature({
		  geometry: new ol.geom.LineString(coordinates),
	  });
  
	  const lineStyle = new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: colorRamps[`centerline`], // Blue color for the line
        width: 1,
        lineDash: [4,8],
      }),
	  });
  
	  const lineSource = new ol.source.Vector({
		features: [lineFeature],
	  });
  
	  const lineLayer = new ol.layer.Vector({
        title:name,
        MFCType:mfctype,
        source: lineSource,
        style: lineStyle,
	  });
    //  source.addFeature(lineFeature);
//	  userMap.addLayer(lineLayer);
        userMap.getLayers().push(lineLayer);
        initLayersVisibility();
}

function addPolygon(coordinatesPolygon,mfctype,name){

    var source = new ol.source.Vector();
	//Vector Layer
	var vector = new ol.layer.Vector({
        title:name,
        MFCType:mfctype,
		    source: source,
		style: new ol.style.Style({
			fill: new ol.style.Fill({
				color: colorRamps['fairway'][colorRamps['fairway'].length - 1],//colorRamps[`fairway`],//'rgba(255, 255, 255, 0.1)'
			}),
			stroke: new ol.style.Stroke({
				color: colorRamps['fairway'][colorRamps['fairway'].length - 1],//colorRamps[`fairway`],
			//	lineDash: lineDash ?  lineDash : null, //or other combinations
				width: 2
			}),
			
		 //    image: new ol.style.Circle({
		 // 	   radius: 10,
		 // 	   fill: new ol.style.Fill({
		 // 		   color: '#ffcc33'
		 // 	   })
		 //    })
		})
	});
	//The polygon here must be an array of coordinates
	var plygon = new ol.geom.Polygon([coordinatesPolygon])
 //   var plygon = new ol.geom.LineString(coordinates);
	//Polygon feature class
	var feature = new ol.Feature({
		geometry: plygon,
		name: 'Line'
	});

	 source.addFeature(feature);
	// console.log(vector.getSource().getFeatures().length);
	 userMap.addLayer(vector); 

	// userMap.getLayers().push(vectorLayer);
	 initLayersVisibility();

}


function pointsTransform(coordinatesPolygon){
    let result = [];

    for(let j =0; j < coordinatesPolygon.length;j++){
        var pointTransform = ol.proj.fromLonLat([coordinatesPolygon[j][0], coordinatesPolygon[j][1]]);
        if(isNaN(pointTransform[0]) == false && isNaN(pointTransform[1])==false)
            result.push(pointTransform);    
    }
    return result;


}

function fairway(coordinates,mfctype,name){

    if(document.getElementById(SLIDER_RANGE_START))
        currentDate = document.getElementById(SLIDER_RANGE_START).innerHTML;

    let prevLat = 0;
    let prevLong = 0;
    var coordinatesPolygon = new Array();
    tmp = []
    for (var i = 0; i < coordinates.length; i++) {

        coords = coordinates[i].split(',');
        let date = coords[0];

        if(parseInt(date.replace(/-/g,""),10) ==  parseInt(currentDate.replace(/-/g,""),10) ){
            
            let lat = parseFloat(coords[2]);
            let lon = parseFloat(coords[1]);
            if(prevLong > 0 && prevLat > 0){
                let dist = haversine(lat,lon, prevLat, prevLong);
                if(dist > 10000){
                    let area = pointsTransform(coordinatesPolygon);
                    addPolygon(area,mfctype,name);

                    // tmp = coordinatesPolygon[coordinatesPolygon.length-1];
                    // area = pointsTransform(tmp);
                    // addPolygon(area,mfctype,name);
                    // tmp = [];             
                    // tmp = coordinatesPolygon[coordinatesPolygon.length-1];
                    coordinatesPolygon = [];
                }
            }
    
            prevLat = lat;
            prevLong = lon;
            // if(tmp.length == 1){
            //   tmp.push([lat, lon]);
            //   // const area = pointsTransform(tmp);
            //   // addPolygon(area,mfctype,name);
            //   // tmp = [];
            // }
            coordinatesPolygon.push([lat, lon]);

        }


    }
    
    if(coordinatesPolygon.length > 0){
        const area = pointsTransform(coordinatesPolygon);
        addPolygon(area,mfctype,name);
        coordinatesPolygon = [];	
    }
}

function fairwayCenter(coordinates,mfctype,name){

    if(document.getElementById(SLIDER_RANGE_START))
        currentDate = document.getElementById(SLIDER_RANGE_START).innerHTML;

    var coordinatesPolygon = new Array();
    let init = false;
    for (var i = 0; i < coordinates.length; i++) {

        items = coordinates[i].split(',');
        let date = items[0];

        if(parseInt(date.replace(/-/g,""),10) ==  parseInt(currentDate.replace(/-/g,""),10) ){
            let lat = parseFloat(items[2]);
            let lon = parseFloat(items[1]);
             let newRoad = parseFloat(items[3]);
             if (newRoad== -999)
              continue;
             if(newRoad==0)
            {
                if(coordinatesPolygon.length > 0){
              
                      coordinatesPolygon = coordinatesPolygon.sort((a, b) => a[0] - b[0]);
                      const area = pointsTransform(coordinatesPolygon);
                      addLine(area,mfctype,name);
                      coordinatesPolygon = [];
                    

                }
            }
        //    addMarker([lat, lon],i.toString());
            if(coordinatesPolygon.length==0 && newRoad==0 || coordinatesPolygon.length > 0)
            {
              coordinatesPolygon.push([lat, lon]);
            }
          //  coordinatesPolygon.push([lat, lon]);

        }

    }

    if(coordinatesPolygon.length > 0){
        coordinatesPolygon = coordinatesPolygon.sort((a, b) => a[0] - b[0]);
        const area = pointsTransform(coordinatesPolygon);
        addLine(area,mfctype,name);
    }

}

function polygonStringToArray(polygonStr) {
  // Remove the "Polygon((" prefix and "))" suffix
 // const cleanedStr = polygonStr.replace("Polygon((", "").replace("))", "");
 const cleanedStr = polygonStr.replace("((", "").replace("))", "");
  // Split the string by ', ' to get individual coordinate pairs
  const coordPairs = cleanedStr.split(", ");
  
  // Map each coordinate pair to an array of [longitude, latitude] numbers
  const coordinatesArray = coordPairs.map(coord => {
      const [lon, lat] = coord.split(" ").map(Number);  // Convert strings to numbers
      return [lon, lat];  // Return as a pair [lon, lat]
  });
  
  return coordinatesArray;
}


function drawArea(coordinates,color,name){

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
    title:name,
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

function building(coordinates,mfctype,name){
  let count = 0;
  for(let i =0; i < coordinates.length;i++){
    const items = coordinates[i].split(",Polygon");

      if(items.length > 1){
        const coords = polygonStringToArray(items[1]);
        drawArea(coords,colorRamps[mfctype] ,name);
        count++;
      }
    
  }
  document.getElementById('building').innerText = `Buildings affected: ${count}`;
}

function road(coordinates,mfctype,name){
  let count = 0;
  for(let i =0; i < coordinates.length;i++){
    const items = coordinates[i].split(",Polygon");

      if(items.length > 1){
        const coords = polygonStringToArray(items[1]);
        drawArea(coords,colorRamps[mfctype] ,name);
        count++;
      }
    
  }
   document.getElementById('road').innerText = `Roads affected: ${count}`;
}


function forest(coordinates,mfctype,name){
  let count = 0;
  for(let i =0; i < coordinates.length;i++){
    const items = coordinates[i].split(",Polygon");

      if(items.length > 1){
        const coords = polygonStringToArray(items[1]);
        drawArea(coords,colorRamps[mfctype] ,name);
        count++;
      }
    
  }
   document.getElementById('forest').innerText = `Forest affected: ${count}`;
}