import os
import subprocess

import pandas as pd
import xarray as xr
from datacuber.s3 import access_dataset_from_S3, read_credentials
from datacuber.utils import read_shapefile

data_dir = os.getenv("APP_DATA", default="data")
s3_cloud = os.getenv("S3_CLOUD")
print(f"{s3_cloud=}")

if os.path.exists("../s3_cred_ovh.json"):
    s3_key, s3_secret = read_credentials("../s3_cred_ovh.json")
    s3_url = "https://s3.gra.io.cloud.ovh.net"
    s3_path = "data1/urban-heat/level2/flow1"
elif s3_cloud == "ovh-de":
    s3_key = os.getenv("OVH_DE_S3_ACCESS_KEY")
    s3_secret = os.getenv("OVH_DE_S3_SECRET_KEY")
    s3_url = "https://s3.gra.io.cloud.ovh.net"
    s3_path = "data1/urban-heat/level2/flow1"
elif s3_cloud == "wekeo":
    s3_key = os.getenv("WEKEO_S3_ACCESS_KEY")
    s3_secret = os.getenv("WEKEO_S3_SECRET_KEY")
    s3_url = "https://s3.waw2-1.cloudferro.com"
    s3_path = "sti-storage/dev/urban-square" 


uh_season_ds = access_dataset_from_S3(
    f"s3://{s3_path}/UH_product_results_season.zarr", s3_key, s3_secret, s3_url
)

uh_season_100m_ds = access_dataset_from_S3(
    f"s3://{s3_path}/UH_product_results_season_100m.zarr", s3_key, s3_secret, s3_url
)

season_info = pd.read_csv(f"{data_dir}/season_images_info.csv")

uh_stats = pd.read_csv(f"{data_dir}/uh_stats_season.csv")

toulouse_shp = read_shapefile(f"{data_dir}/merged_quartier_communes.geojson")
shapefile_name_col = "libelle"

variable_dict = {
    "uh_wavg": {"name": "LST Classified", "unit": "", "cmax": 8},
    "uh_req": {"name": "Urban Heat Island", "unit": "", "cmax": 1},
    "diff_lst_temp": {
        "name": "LST Difference to Air Temperature",
        "unit": "Diff (°C)",
        "cmax": 20,
    },
    "temperature_2m": {"name": "Air Temperature", "unit": "Temp (°C)", "cmax": 40},
    "lst": {"name": "Surface Temperature", "unit": "Temp (°C)", "cmax": 50},
}

state_data = {"zone1": {"type": "all", "all": "Toulouse"}}
