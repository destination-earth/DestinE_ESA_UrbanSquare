/**
 * Copyright (c) 2024 Mozaika, Ltd.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
Variations

Except as contained in this notice, the name of Mozaika, Ltd. shall not be used in advertising or otherwise to promote the sale, use or other dealings in this Software without prior written authorization from Mozaika, Ltd.
 */
const DEBUG = true;
// https://colordesigner.io/gradient-generator
PREFIX = '';

if (DEBUG==true){
    PREFIX = 'vendors/arcgis/';
}
// HTML CONSTANTS
//const FLOOD_URL                     = 'http://172.16.7.83:8080/demo';
const FLOOD_URL                     = '/floodAPIURL';
const NAVIGATION_TAB_NAME_LAYERS    = 'Layers';
const NAVIGATION_TAB_NAME_LEGEND    = 'Legend';
const NAVIGATION_TAB_NAME_BASEMAP   = 'Basemap';
const NAVIGATION_TAB_NAME_FLOOD     = 'Flood simulation';

const CONTAINER_WRAPPER  = 'wrapper';
const CONTAINER_MAP      = 'map';
const CONTAINER_LEGEND   = 'legend';
const CONTAINER_LAYERS   = 'layers';
const CONTAINER_BASEMAPS = 'basemaps';
const CONTAINER_FLOOD    = 'flood';
const CONTAINER_SETTINGS = 'settings';
const CONTAINER_SIDEBAR  = "mySidenav";
const NAVIGATION_TITLE   = "navTitle";
const TRASH_BUTTON       = 'trash';


const MODEL_NAME            = '#featuresModel';
const BUTTON_WRITE_FEATURES = '#buttonWriteFeatures';
const MAP_FEATURES          = '#MMAPFeatures';
const BASEMAP_LIST          = 'basemapList';
const spinner               = 'spinner';

const SLIDER_RANGE_START            = "rangeStart";
const SLIDER_RANGE_END              = "rangeEnd";
const TIME_SLIDER                   = "time-slider";
const TIME_SLIDER_PLAY_PAUSE_BUTTON = 'play-pause';
const TIME_SLIDER_PANEL             = "slider-panel";
// HTML CONSTANTS
const NAV_WIDTH      = 400;
const TIME_INTERVAL = 500;
const JSON_POLYGONS = "polygons";
const JSON_POINTS   = "points";
const DATE_FORMAT   = 'yyyy-MM-dd';

const TELEMAC_POINT_SIZE = 4;
const SATELLITE_POINT_SIZE = 8;

const MAX_ZOOM = 18;//13; // change scale if u want higher zoom

const DOWNLOAD_IMAGE_NAME = 'map.png';
const TELEMAC_VARIABLES = [`velocityU`,`velocityV`,`friction`,`surface`,`depth`,`bottom`,'fairway','ZC'];
const POINT_VARIABLES =  [`turbidity`,`reflectance`];
const CUSTOM_LAYERS = ['fairway','fairwaycenterline','building','road','forest'];

const LEGACY_FAIRWAY_START = '2022-09-01'
const LEGACY_FAIRWAY_END = '2022-12-31'

const VIEWAREAS = {

    "Default":{
        "center" : [ 24.90350862519013, 42.76544804268769],
        "zoom":8,
    },

    "Danube":{
        "center":[25.04160803432457,  44.09230992430757],
        "zoom":8,
    },
    "Lom":{
        "center":[ 22.974592263125025,  43.82180644215174], // [    23.22727781,  43.83171387],
        "zoom":13,
    },
    "Svishtov":{
        "center":[ 25.190398393693716,  43.66690451023115],//[25.34375746,43.62387092],
        "zoom":13,
    },
    "Silistra":{
        "center":[26.807096342682435, 44.097422249485504], // [27.26429125, 44.12272254],
        "zoom":13,
    },
    "Arda":{
        "center":[25.452745911792366,41.555639539328844],
        "zoom":8,
    },
    "Vehtino":{
        "center":[ 25.00301641997659, 41.552348773432556 ],
        "zoom":13,
    },
    "Djebel":{
        "center":[   25.299106699338587,  41.49249449365293 ],
        "zoom":13,
    },
    "Krumovgrad":{
        "center":[ 25.65154749523651,  41.470259537003756 ],
        "zoom":13,
    },
    "Ivaylovgrad":{
        "center":[25.99144237529005 , 41.61757240715295 ],
        "zoom":13,
    },

    "Kyrdjali":{
        "center":[25.2544443575542 , 41.66515502165715],
        "zoom":13,
    },

    "StudenKladenec":{
        "center":[25.513433124881047 , 41.6344371832337],
        "zoom":13,
    },


    "Rositsa":{
        "center":[25.171419,43.124239],
        "zoom":13,
    },
    
}


const colorRamps = {};
colorRamps["UNKNOWN"] = [1,"#FFFFFF"];
colorRamps[`ZC`]=[1,'#d748e7',100,'#d748e7'];

colorRamps["building"] = '#FF0000';
colorRamps["road"] = '#ED9121';
colorRamps["forest"] = '#07FF00';
// ===================================== BLOB =========================================


colorRamps[`Reflectance`] = [
    0.01,"#d3d18d",
    0.02,"#c7c57f",
    0.03,"#bbb971",
    0.04,"#afae64",
    0.05,"#a4a256",
    0.06,"#989749",
    0.07,"#8c8c3c",
    0.08,"#81812e",
    0.09,"#757620",
    0.1,"#6a6b10",
];


colorRamps[`Turbidity`] = [
    0.1,"#fffb8e",
    0.2,"#efec80",
    0.3,"#e0dd72",
    0.4,"#d0ce65",
    0.5,"#c1bf57",
    0.6,"#b2b14a",
    0.7,"#a3a23d",
    0.8,"#95942f",
    0.9,"#868721",
    1,"#787911",
];

colorRamps[`SoilMoisture`] = [ // ok
    0.02,"#9489f8",
    0.04,"#8579e4",
    0.06,"#7569d0",
    0.08,"#665abd",
    0.1,"#574aa9",
    0.12,"#483c97",
    0.14,"#392e84",
    0.16,"#2a2072",
    0.18,"#191261",
    0.2,"#050550",
];

colorRamps[`SolarIrradiance`] = [ // ok
    250,"#2f2ff9", 
    255,"#005fff", 
    260,"#007bff",
    265,"#008fff", 
    270,"#009eff",
    275,"#00aae5",
    280,"#00b5ba",
    285,"#00be8d",
    290,"#00c662",
    295,"#26cb3a",
];



colorRamps[`SnowCover`] = [ // ok
    0.2,"#ffffff", 
    0.4,"#ececec", 
    0.6,"#d9d9d9",
    0.8,"#c6c6c6", 
    1,"#b4b4b4",
    1.2,"#a2a2a2",
    1.4,"#909090",
    1.6,"#7f7f7f",
    1.8,"#6e6e6e",
    2,"#5e5e5e",
];

colorRamps[`AirTemperature`] = [ // ??
    250,"#50f92f", 
    255,"#00ef68", 
    260,"#00e29c",
    265,"#00d3ce", 
    270,"#00c2fd",
    275,"#00b0ff",
    280,"#009bff",
    285,"#0082ff",
    290,"#0061ff",
    295,"#0a2bf5",
];

colorRamps[`VegetationIndex`] = [ // OK
    0.1,"#1b9438",
    0.2,"#188833",
    0.3,"#147d2d",
    0.4,"#117128",
    0.5,"#0d6623",
    0.6,"#0a5b1e",
    0.7,"#07501a",
    0.8,"#054515",
    0.9,"#033b10",
    1,"#02310b",
];

colorRamps[`SkinTemperature`] = [ // OK
    250,"#06ffdf", 
    255,"#00ffd4", 
    260,"#00ffc7",
    265,"#00ffb8", 
    270,"#00ffa7",
    275,"#00ff95",
    280,"#00ff80",
    285,"#00ff68",
    290,"#00ff4c",
    295,"#00ff24",
];


colorRamps[`LiquidPrecipitation`] = [ // ok
    0.5,"#4c43f9",
    1,"#403ee3",
    1.5,"#3439ce",
    2.5,"#2a34b8",
    3,"#212fa3",
    3.5,"#19298f",
    4,"#13237a",
    4.5,"#0e1e66",
    5,"#0a1853",
    5.5,"#081240",
];

colorRamps[`SolidPrecipitation`] = [ // ok
    0.25,"#bcc2c4",
    0.5,"#afb4b6",
    0.75,"#a2a7a8",
    1,"#96999b",
    1.25,"#898c8d",
    1.5,"#7d7f80",
    1.75,"#717373",
    2,"#656666",
    2.25,"#595a5a",
    2.5,"#4e4e4e",
];


colorRamps[`Temperature`] = [ // ok
    3,'#800000',
    6,'#96081c',
    9,'#ab1634',
    12,'#be254e',
    15,'#cf3569',
    18,'#de4785',
    21,'#eb59a3',
    24,'#f46dc1',
    27,'#fb81e0',
    30,'#ff96ff'
];



colorRamps[`Discharge`] = [
    400,'#00b3ff',
    800,'#46b6f9',
    1200,'#63b8f4',
    1600,'#78bbee',
    2000,'#8abee9',
    2400,'#99c1e3',
    2800,'#a8c3dd',
    3200,'#b4c6d8',
    3600,'#c1c9d2',
    4000,'#cccccc'
];


// colorRamps[`WaterLevel`] = [
//     50,'#2799ff',
//     100,'#698ffe',
//     150,'#9581f6',
//     200,'#b972e8',
//     250,'#d660d4',
//     300,'#ed4bba',
//     350,'#fd369b',
//     400,'#ff257a',
//     450,'#ff2358',
//     500,'#ff3333'
// ];


colorRamps[`velocityU`] = [
    0.2,"#fefe0e",
    0.4,"#fff200",
    0.6,"#ffe500",
    0.8,"#ffd900",
    1,"#ffcc00",
    1.2,"#ffc000",
    1.4,"#ffb400",
    1.6,"#ffa700",
    1.8,"#ff9b00",
    2,"#ff8f0a",
];


colorRamps[`velocityV`] = [
    0.2,"#fe0ea6",
    0.4,"#ff0097",
    0.6,"#ff0088",
    0.8,"#ff0079",
    1,"#ff0069",
    1.2,"#ff0059",
    1.4,"#ff0048",
    1.6,"#ff0037",
    1.8,"#ff0024",
    2,"#ff0a0a",
];

colorRamps[`friction`] = [
    0.02,"#583605",
    0.04,"#523407",
    0.06,"#4d3309",
    0.08,"#47310b",
    0.1,"#422f0d",
    0.12,"#3d2d0f",
    0.14,"#382b11",
    0.16,"#342912",
    0.18,"#2f2614",
    0.2,"#2b2415",
];

colorRamps[`surface`] = [
    2,'#08ff31',
    4,'#11e82c',
    6,'#15d126',
    8,'#17bb21',
    10,'#17a61d',
    12,'#169018',
    14,'#147c14',
    16,'#126810',
    18,'#0f550c',
    20,'#0c4208',
];

colorRamps[`depth`] = [
    2,"#4e08ff",
    4,"#430ee9",
    6, "#3a11d2",
    8, "#3112bd",
    10, "#2912a7",
    12, "#221292",
    14, "#1c107d",
    16, "#170e69",
    18, "#120c55",
    20, "#0f0842",
];


colorRamps[`bottom`] = [
    2,"#0000ff",
    4,"#0071ff",
    6,"#00e3ff",
    8,"#00ffaa",
    10,"#00ff39",
    12,"#39ff00",
    14,"#aaff00",
    16,"#ff7100",
    18,"#ff7100",
    20,"#ff0000",
];


//=======================================
//colorRamps[`fairway`] = '#009291';
// colorRamps[`fairway`] = [
//     2,"#dbff00",
//     4,"#cdfd00",
//     6,"#bffb00",
//     8,"#b0f800",
//     10,"#a0f600",
//     12,"#90f400",
//     14,"#7ef100",
//     16,"#6aef00",
//     18,"#52ec00",
//     20,"#30e901",
// ];
colorRamps[`fairway`] = [
    2,"#ddff00",
    4,"#b4f834",
    6,"#8def4f",
    8,"#67e564",
    10,"#40d976",
    12,"#09cc84",
    14,"#00bf8e",
    16,"#00b194",
    18,"#00a396",
    20,"#009494",
];

colorRamps[`fairwaycenterline`] = '#000000';


colorRamps[`elevation`] = [

];

colorRamps[`WaterLevel`] = [

    2,"#ffffff",
    4,"#fff4fa",
    6,"#feeafa",
    8,"#f7e1fd",
    10,"#ead9ff",
    12,"#d6d4ff",
    14,"#bbd1ff",
    16,"#98cfff",
    18,"#68ceff",
    20,"#00ccff",
    
    // 1,"#06d0fe",
    // 2,"#6ed1ff",
    // 3,"#9dd2ff",
    // 4,"#bcd4ff",
    // 5,"#d7d7ff",
    // 6,"#eadbff",
    // 7,"#f8e2fe",
    // 8,"#ffeafb",
    // 9,"#fff4fa",
    // 10,"#ffffff"
    ];
    

colorRamps[`flood`] = [

// 2,"#ffffff",
// 4,"#fff4fa",
// 6,"#feeafa",
// 8,"#f7e1fd",
// 10,"#ead9ff",
// 12,"#d6d4ff",
// 14,"#bbd1ff",
// 16,"#98cfff",
// 18,"#68ceff",
// 20,"#00ccff",

// // 1,"#06d0fe",
// // 2,"#6ed1ff",
// // 3,"#9dd2ff",
// // 4,"#bcd4ff",
// // 5,"#d7d7ff",
// // 6,"#eadbff",
// // 7,"#f8e2fe",
// // 8,"#ffeafb",
// // 9,"#fff4fa",
// // 10,"#ffffff"
];





// toastr.options = {
//     "closeButton": true,
//     "debug": false,
//     "newestOnTop": true,
//     "progressBar": false,
//     "positionClass": "toast-bottom-right",
//     "preventDuplicates": true,
//     "onclick": null,
//     "showDuration": "300",
//     "hideDuration": "1000",
//     "timeOut": "5000",
//     "extendedTimeOut": "1000",
//     "showEasing": "swing",
//     "hideEasing": "linear",
//     "showMethod": "fadeIn",
//     "hideMethod": "fadeOut"
//   }