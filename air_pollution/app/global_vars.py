import json
import os
from dataclasses import dataclass

import numpy as np
import pandas as pd
import xarray as xr
from datacuber.s3 import access_dataset_from_S3
from datacuber.utils import clip_dataset_with_geodf, read_shapefile
from PIL import Image


@dataclass(frozen=True)
class IndicatorThreshold:
    name: str
    value: float
    color: str = "#8E190C"


@dataclass(frozen=True)
class AirQualityStandard:
    standard_id:str
    standard_name:str
    no2:int
    pm2p5:int
    pm10:int
    o3:int


StandardsCatalogue = dict[str, AirQualityStandard]

who_standard = AirQualityStandard(standard_id="who", standard_name="WHO", no2=25, pm2p5=15, pm10=45, o3=80)
anses_standard = AirQualityStandard(standard_id="anses", standard_name="ANSES", no2=30, pm2p5=25, pm10=50, o3=100)

standards_catalogue: StandardsCatalogue = {
    standard.standard_id: standard
    for standard in [
        who_standard,
        anses_standard,
    ]
}


data_dir = os.getenv("APP_DATA", default="data")
assets_dir = os.getenv("APP_ASSETS", default="assets")
s3_cloud = os.getenv("S3_CLOUD")
print(f"{s3_cloud=}")

global_zone = "Toulouse"
shapefile_for_maps = f"{data_dir}/shapefiles/merged_quartier_communes.geojson"

gdf = read_shapefile(shapefile_for_maps)
gdf = gdf.set_crs("epsg:4326")

shapefile_name_col = "libelle"
neighborhood_list = sorted(gdf[shapefile_name_col].unique())

logo = Image.open(f"{assets_dir}/images/murmuration_logo.png")

shap_values = pd.read_csv(f"{data_dir}/toulouse_shap_values.csv")
input_variables = {
    "ERA5_uvb": "UV",
    "ERA5_tp": "Precipitations",
    "OSM_max_highway_score": "Biggest Road",
    "OSM_sum_highway_score": "Number of Roads",
    "CAMS_no2_conc": "NO2 CAMS interp",
    "CAMS_no2_conc_high": "NO2 CAMS",
    "ERA5_t2m": "Surface Temperature",
    "ERA5_blh": "Boundary Layer",
    "ERA5_windspeed": "Wind",
    "road_traffic": "Road Traffic",
    "ERA5_skt": "Skin Temperature",
    "HDX_population_density_frequency": "Population Density",
}
shap_values = shap_values.rename(columns=input_variables)

dataset_description = (
    pd.read_csv(f"{data_dir}/global_dataset_description.csv")
    .rename(columns={"Unnamed: 0": "index"})
    .set_index("index")
)
dataset_description = dataset_description.rename(columns=input_variables)

toulouse_df = pd.read_csv(f"{data_dir}/toulouse_input.csv")
toulouse_df = toulouse_df.rename(columns=input_variables)


icons = {
    "UV": "bi bi-sun-fill",
    "Precipitations": "bi bi-cloud-rain-heavy-fill",
    "Biggest Road": "bi bi-signpost-2",
    "Number of Roads": "bi bi-signpost-2",
    "NO2 CAMS interp": "bi bi-cloud-fog2-fill",
    "NO2 CAMS": "bi bi-cloud-fog2-fill",
    "Surface Temperature": "bi bi-thermometer-sun",
    "Boundary Layer": "bi bi-sunset-fill",
    "Wind": "bi bi-wind",
    "Road Traffic": "bi bi-car-front-fill",
    "Skin Temperature": "bi bi-thermometer-sun",
    "Population Density": "bi bi-people-fill",
}

if os.path.exists("../s3_cred_ovh.json"):
    with open("../s3_cred_ovh.json", "r") as f:
        data = json.load(f)
        s3_key = data["s3_key"]
        s3_secret = data["s3_secret"]
    s3_url = "https://s3.gra.io.cloud.ovh.net"
    s3_path = "data1/air-quality/level2/no2_1km"
elif s3_cloud == "ovh-de":
    s3_key = os.getenv("OVH_DE_S3_ACCESS_KEY")
    s3_secret = os.getenv("OVH_DE_S3_SECRET_KEY")
    s3_url = "https://s3.gra.io.cloud.ovh.net"
    s3_path = "data1/air-quality/level2/no2_1km"
elif s3_cloud == "wekeo":
    s3_key = os.getenv("WEKEO_S3_ACCESS_KEY")
    s3_secret = os.getenv("WEKEO_S3_SECRET_KEY")
    s3_url = "https://s3.waw2-1.cloudferro.com"
    s3_path = "dev-rd/datacubes"


pollutant_ds = access_dataset_from_S3(
    f"s3://{s3_path}/toulouse_urban_square_v2_1km.zarr",
    s3_key,
    s3_secret,
    s3_url,
)


if os.path.exists("s3_cred.json"):
    with open("s3_cred.json", "r") as f:
        data = json.load(f)
        s3_key = data["s3_key"]
        s3_secret = data["s3_secret"]
else:
    s3_key = os.getenv("WEKEO_S3_ACCESS_KEY")
    s3_secret = os.getenv("WEKEO_S3_SECRET_KEY")

scenario_ds = access_dataset_from_S3(
    "s3://dev-rd/datacubes/toulouse_urban_square_v3_1km_test_scenarios.zarr",
    s3_key,
    s3_secret,
)
scenario_ds = scenario_ds.rename(
    {
        "no2_prediction_scenario_road_traffic_0": "no2_prediction_scenario_road_traffic_0.0",
        "no2_prediction_scenario_road_traffic_2": "no2_prediction_scenario_road_traffic_2.0",
    }
)

# # S3 WEKEO
# pollutant_ds = access_dataset_from_S3(
#     "s3://dev-rd/datacubes/toulouse_urban_square_v2_1km.zarr",
#     s3_key,
#     s3_secret,
#     s3_url="https://s3.waw2-1.cloudferro.com",
# )

pollutant_ds = pollutant_ds.rio.write_crs("epsg:4326")
pollutant_ds = clip_dataset_with_geodf(pollutant_ds, gdf, all_touched=False)
pollutant_ds = pollutant_ds.resample(time="1D").mean()
if "spatial_ref" in list(pollutant_ds.coords):
    print("there is spatial ref")
    pollutant_ds = pollutant_ds.drop_vars("spatial_ref")
global_dataset = pollutant_ds

pollutant_name = "no2_prediction"

min_date = str(pollutant_ds.time.values[0]).split("T")[0]
max_date = str(pollutant_ds.time.values[-1]).split("T")[0]

# Save time series CSV
state_no2_ts = pollutant_ds.mean(["latitude", "longitude"]).to_dataframe()
# state_maqi_ts_dict = state_maqi_ts.to_dict("records")
state_no2_ts.to_csv(f"{data_dir}/no2_ts_{global_zone}_D_{min_date}_{max_date}.csv")


# under_10_ds = (
#     pollutant_ds[pollutant_name]
#     .where(pollutant_ds[pollutant_name] > 25)
#     .count(dim="time")
#     .astype("float32")
# ).to_dataset(name=pollutant_name)
# under_10_ds = clip_dataset_with_geodf(under_10_ds, gdf, all_touched=False)

# Save map csv
state_maqi_map = pollutant_ds.mean("time").to_dataframe()

# state_maqi_map_dict = state_maqi_map.to_dict("records")
state_maqi_map.to_csv(
    f"{data_dir}/no2_map_concentrations_{global_zone}_{min_date}_{max_date}.csv",
)

# Save map tiff
bT = pollutant_ds[pollutant_name]
bT = bT.rio.set_spatial_dims(x_dim="longitude", y_dim="latitude")
bT.rio.write_crs("epsg:4326", inplace=True)
bT.rio.to_raster(
    f"{data_dir}/no2_map_concentrations_{global_zone}_{min_date}_{max_date}.tiff"
)

cmax = int(np.nanmax(global_dataset[pollutant_name]))
print("CMAX: ", cmax)

nb_hex_dict = {"Toulouse": 30}
global_zoom = 9.5

color_bad = "rgb(224, 13, 58)"
color_mid = "rgb(252, 244, 171)"
color_good = "rgb(107, 194, 227)"
colors = ["teal", color_mid, "#FF7F11", color_bad]

agregation_types = {"Day": "D", "Week": "W", "Month": "MS"}

state_data = {
    "start_date": min_date,
    "end_date": max_date,
    "min_date": min_date,
    "max_date": max_date,
    "nb_hex": nb_hex_dict.get(global_zone),
    "cmax": cmax,
    "zoom": global_zoom,
    "zone": {
        "type": "all",
        "all": global_zone,
        "name": global_zone,
    },
    "standard":"who",
    "variable": "Concentrations",
    "no2_map_csv_path": f"{data_dir}/no2_map_concentrations_{global_zone}_{min_date}_{max_date}.csv",
    "no2_map_tiff_path": f"{data_dir}/no2_map_concentrations_{global_zone}_{min_date}_{max_date}.tiff",
}

ts_data = {
    "start_date": min_date,
    "end_date": max_date,
    "zone": {
        "type": "all",
        "all": global_zone,
        "name": global_zone,
    },
    "standard":"who",
    "agregation": "Day",
    "no2_ts_csv_path": f"{data_dir}/no2_ts_{global_zone}_D_{min_date}_{max_date}.csv",
}

scenario_colors = {
    "0%": "#0E8783",
    "50%": "#BAD59F",
    "150%": "#FDC56E",
    "200%": "#E21338",
}
