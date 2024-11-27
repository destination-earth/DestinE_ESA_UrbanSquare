/**
 * Copyright (c) 2024 Mozaika, Ltd.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
Variations

Except as contained in this notice, the name of Mozaika, Ltd. shall not be used in advertising or otherwise to promote the sale, use or other dealings in this Software without prior written authorization from Mozaika, Ltd.
 */
function isPlaying(){
    let content = document.getElementById(TIME_SLIDER_PLAY_PAUSE_BUTTON);
    let cls = content.firstChild.className;
    let result = cls.indexOf("play");
    return result ===-1;
}

function refreshLayers(){

    let layers = userMap.getLayers();
    // Get the layers collection from the map
    let removed_layers = 0;

    // Create a copy of the layers array to safely iterate over it
    let layersArray = layers.getArray().slice();

    layersArray.forEach(layer => {
        if (layer !== undefined) {
            let visible = layer.getVisible();
            
            if (visible) {
 
                const mfctype = layer.get('MFCType');
        //        const title = layer.get('title');      
  
                if (mfctype !== undefined) {
                    if (isCustomLayer(mfctype)) {
                        const polygon = layer.get('polygon');
                        userMap.removeLayer(layer);
                        removed_layers++;
                //        writeCustomMapFeatures(items, mfctype);
                    } else {
                        const items = layer.get('items');
                        if (items && items.length > 0) {
                            // var startTime = performance.now();
                      //      let features = writeMapFeatures(items);
                            let source = layer.getSource();
                            source.clear();
                    //        source.addFeatures(features);
                            // var endTime = performance.now();
                            // console.log(`Call to doSomething took ${endTime - startTime} milliseconds`);
                        }
                    }
                }
                
            }
        }
    });
    createUserLayers(legend=false);
    console.log(`Removed ${removed_layers} layers.`);
    // layers.forEach(layer => {

    //     if(layer != undefined){

    //         visible = layer.getVisible();
        
    //         if(visible){
    //             const items   = layer.get('items');
    //             const mfctype = layer.get('MFCType');
    //             const title = layer.get('title');
    //             if(items && items.length >0){
    //                 if(mfctype != undefined){
    //                     if(isCustomLayer(mfctype)){
    //                         console.log(title);
    //                         userMap.removeLayer(layer);
    //                         removed_layers++;
    //                      //   writeCustomMapFeatures(items,mfctype);
    //                     }else{
    //                     //    var startTime = performance.now();
    //                         let features =  writeMapFeatures(items);
    //                         let source = layer.getSource();
    //                         source.clear();
    //                         source.addFeatures(features);
    //                     // var endTime = performance.now();
    //                     // console.log(`Call to doSomething took ${endTime - startTime} milliseconds`);
    //                     }
    //                 }
    
    //             }
    //         }
    //     }
        

    // });
    console.log(removed_layers);
}

function animate(){

    return new Promise((resolve,reject)=>{
        setSliderValue(true);
        refreshLayers();
        resolve("done")
    })

}

function play() {
    timeAnimation =   setTimeout(()=>{
        animate().then(d=>{

            console.log("WORKING");
        }).then( play ); // call the setTimeout function again
    },TIME_INTERVAL);
  }

function toggleStartStop(){

    let is_playing =  isPlaying();
    let setClass = 'cil-media-play';

    if(!is_playing){
        setClass = 'cil-media-pause';
        play();
    }else{
        clearTimeout(timeAnimation);
    }

    let content = document.getElementById(TIME_SLIDER_PLAY_PAUSE_BUTTON);
    content.firstChild.className = setClass;
}

function initSlider(){
    ismosProps = map.properties;
    if(ismosProps.to && ismosProps.from){
        let endVal = stringToDate(ismosProps.to) - stringToDate(ismosProps.from);
        const diffDays = Math.ceil(endVal / (1000 * 60 * 60 * 24)); 
    
        if(document.getElementById(SLIDER_RANGE_START))
            document.getElementById(SLIDER_RANGE_START).innerHTML = ismosProps.from;
        if(document.getElementById(SLIDER_RANGE_END))
            document.getElementById(SLIDER_RANGE_END).innerHTML = ismosProps.to;
        if(document.getElementById(TIME_SLIDER))
            document.getElementById(TIME_SLIDER).max = diffDays;
    }
    
}

function hideSliderButton(){
    const sliderButton = document.getElementsByClassName("time-slider");
    if(sliderButton){
        sliderButton[0].style.display   = 'none';
    }
}

function showSliderButton(){
    const sliderButton = document.getElementsByClassName("time-slider");
    if(sliderButton){
        sliderButton[0].style.display   = 'flex';
    }
}


function setSliderValue(autoIncrement=false){

    if(from==null)      return;
    if(to==null)        return;
    if(from.length==0)  return;
    if(to.length==0)    return;

    let step = 0;
    // let tto = stringToDate(ismosProps.to);
    // let startDate = stringToDate(ismosProps.from);
    // let currentDate =  stringToDate(ismosProps.from);
    let tto = stringToDate(to);
    let startDate = stringToDate(from);
    let currentDate =  stringToDate(from);

    if(autoIncrement){
        step = 1;
    }

    let value = parseInt(document.getElementById(TIME_SLIDER).value) + step;

    currentDate.setDate(startDate.getDate()+value);
    if(currentDate>tto){
        currentDate = startDate;
        value = 0;
    }
    let showDate = date2str(currentDate,DATE_FORMAT);
    document.getElementById(SLIDER_RANGE_START).innerText =  showDate;

    if(autoIncrement){
        document.getElementById(TIME_SLIDER).value = value;
    }else{
        refreshLayers();
    }

}

