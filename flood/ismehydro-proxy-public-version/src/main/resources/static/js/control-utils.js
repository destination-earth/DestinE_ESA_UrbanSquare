/**
 * Copyright (c) 2024 Mozaika, Ltd.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
Variations

Except as contained in this notice, the name of Mozaika, Ltd. shall not be used in advertising or otherwise to promote the sale, use or other dealings in this Software without prior written authorization from Mozaika, Ltd.
 */

function goHome() {
    this.getMap().getView().setCenter(ol.proj.fromLonLat(homeView["center"]));
    this.getMap().getView().setZoom(homeView["zoom"]);
}

function removeAllIteractions(){
    userMap.removeInteraction(drawPoint);
    userMap.removeInteraction(drawBox); 
}

function addPointInteraction(){
    removeAllIteractions();
    userMap.addInteraction(drawPoint);
}

function addBoxInteraction(){
    removeAllIteractions();
    singleClick = new ol.interaction.Select();
    userMap.addInteraction(singleClick);
    userMap.addInteraction(drawBox);
}

function addSelect() {
    removeAllIteractions();
    singleClick = new ol.interaction.Select();
    userMap.addInteraction(singleClick);

     singleClick .getFeatures().on('add', function (event) {
     var properties = event.element.getProperties();
     if(properties.id)
        selectedFeatureID = properties.id;       
    });
 }

 function removeRegularFeature(searchId){
    let features = drawSource.getFeatures();
    if (features != null && features.length > 0) {
        for (x in features) {
            let properties = features[x].getProperties();
            let id = properties.id;
            let json = properties.json;
            if (id == searchId) {
                let type = isPoint(userDrawnInteraction) ? JSON_POINTS : JSON_POLYGONS;
                setJson(type,json);
                drawSource.removeFeature(features[x]);
                selectedFeatureID = -1;
                setTrashButtonVisibility();
                return;
            }
        }
    }
 }

 function removeFloodFeature(){
    let features = drawFlood.getFeatures();
    if (features != null && features.length > 0) {
        for (x in features) {
            drawFlood.removeFeature(features[x]);
        }
    }
 }

 function removeSelectedFeature({ _searchId = -1 } = {}) { // (A)
    let searchId = selectedFeatureID;

    if(_searchId!==-1){
        searchId = _searchId;
    }

    removeRegularFeature(searchId);
    removeFloodFeature();
   
}

function mapToPng(){
    getMapAsBase64().then(
        function(base64Map) {

            const link = document.createElement('a');
            link.href = base64Map;
            link.download = DOWNLOAD_IMAGE_NAME; 

            document.body.appendChild(link);
 
            link.click();
        
            document.body.removeChild(link);
        },
      );
}
