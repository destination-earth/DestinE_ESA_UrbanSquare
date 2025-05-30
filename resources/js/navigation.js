/**
 * Copyright (c) 2024 Mozaika, Ltd.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
Variations

Except as contained in this notice, the name of Mozaika, Ltd. shall not be used in advertising or otherwise to promote the sale, use or other dealings in this Software without prior written authorization from Mozaika, Ltd.
 */
function closeNav() {
    document.getElementById(CONTAINER_SIDEBAR).style.width = "0";
}

function openNav(title) {
    var s= document.getElementById(NAVIGATION_TITLE);
    s.innerHTML = title;
    document.getElementById(CONTAINER_SIDEBAR).style.width = `${NAV_WIDTH}px`;
}

function legendTab(){
    document.getElementById(CONTAINER_LEGEND).style.display   = 'block';
    document.getElementById(CONTAINER_LAYERS).style.display   = 'none';
    document.getElementById(CONTAINER_BASEMAPS).style.display = 'none';
    document.getElementById(CONTAINER_FLOOD).style.display    = 'none';

    openNav(NAVIGATION_TAB_NAME_LEGEND);
}

function layersTab(){
    document.getElementById(CONTAINER_LEGEND).style.display   = 'none';
    document.getElementById(CONTAINER_LAYERS).style.display   = 'block';
    document.getElementById(CONTAINER_BASEMAPS).style.display = 'none';
    document.getElementById(CONTAINER_FLOOD).style.display    = 'none';

    openNav(NAVIGATION_TAB_NAME_LAYERS);
}

function basemapTab(){
    document.getElementById(CONTAINER_LEGEND).style.display   = 'none';
    document.getElementById(CONTAINER_LAYERS).style.display   = 'none';
    document.getElementById(CONTAINER_BASEMAPS).style.display = 'block';
    document.getElementById(CONTAINER_FLOOD).style.display    = 'none';

    openNav(NAVIGATION_TAB_NAME_BASEMAP);
}

function floodTab(){
    document.getElementById(CONTAINER_LEGEND).style.display   = 'none';
    document.getElementById(CONTAINER_LAYERS).style.display   = 'none';
    document.getElementById(CONTAINER_BASEMAPS).style.display = 'none';
    document.getElementById(CONTAINER_FLOOD).style.display    = 'block';
    
    openNav(NAVIGATION_TAB_NAME_FLOOD);
}

function warningTab(){
    var alertElement = document.getElementById("alert");

    // Remove 'display: none;' by setting the display to an empty string or another value like 'block'
    alertElement.style.display = "block";
}

function toggleTimeSlider(){

    let slider = document.getElementById(TIME_SLIDER_PANEL);
    
    if (slider.style.display === "none") {
        slider.style.display = "flex";
    } else {
        slider.style.display = "none";
    }
    
}