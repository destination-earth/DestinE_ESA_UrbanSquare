import numpy as np
import pandas as pd
import xarray as xr
from datacuber.utils import clip_dataset_with_geodf
from global_vars import (
    dataset_description,
    global_zone,
    global_zoom,
    nb_hex_dict,
    standards_catalogue,
    state_data,
)


def reset_zone(state):
    print("Zone resetted")
    if state is None:
        state = state_data
    else:
        state["zone"] = {
            "type": "all",
            "all": global_zone,
            "name": global_zone,
        }
        state["nb_hex"] = nb_hex_dict[global_zone]
        state["zoom"] = global_zoom
    return state


def get_under_10_ds(global_dataset, state, gdf, pollutant="no2_prediction"):
    # Crop global dataset along time
    pollution_ds = global_dataset.sel(
        time=slice(state.get("start_date"), state.get("end_date"))
    )
    # Create under 10 dataset
    standard = standards_catalogue[state["standard"]]
    under_10_ds = (
        pollution_ds[pollutant]
        .where(pollution_ds[pollutant] > standard.no2)
        .count(dim="time")
        .astype("float32")
    ).to_dataset(name=pollutant)
    # Clip with global shapefile
    under_10_ds = clip_dataset_with_geodf(under_10_ds, gdf, all_touched=False)
    return under_10_ds


def compute_statistics(df, state, pollutant_name="no2_prediction"):
    nb_jours = (
        pd.to_datetime(state.get("end_date")) - pd.to_datetime(state.get("start_date"))
    ).days + 1
    average_pollution = np.round(float(df[pollutant_name].mean()), 1)
    standard = standards_catalogue[state["standard"]]
    maqi_under_10 = df.loc[df[pollutant_name] > standard.no2]
    nb_depassement = len(maqi_under_10)
    worst_pollution = round(df[pollutant_name].max(), 2)
    max_index = df[pollutant_name].idxmax()
    worst_day = str(df.loc[max_index, "time"]).split(" ")[0]
    return {
        "nb_jours": nb_jours,
        "average_pollution": average_pollution,
        "nb_depassement": nb_depassement,
        "worst_pollution": worst_pollution,
        "worst_day": worst_day,
    }


def categorize_value(variable, value):
    # Get quartiles
    low_threshold = dataset_description.loc["25%", variable]
    high_threshold = dataset_description.loc["75%", variable]

    if value < low_threshold:
        return "low"
    elif value >= low_threshold and value <= high_threshold:
        return "average"
    else:
        return "high"


def closest_point(point, points):
    """Find closest point from a list of points."""
    from scipy.spatial.distance import cdist

    return points[cdist([point], points).argmin()]


def get_values_df_from_state(df, state):
    if state.get("zone").get("type") == "neighborhood":
        shap_df = None
    elif state.get("zone").get("type") == "point":
        lat, lon = state.get("zone").get("point")
        df["point"] = [(x, y) for x, y in zip(df["latitude"], df["longitude"])]
        lat, lon = closest_point(state.get("zone").get("point"), list(df.point))
        shap_df = (
            df.loc[(df["latitude"] == lat) & (df["longitude"] == lon)]
            .drop(["latitude", "longitude", "point"], axis=1)
            .iloc[0]
            .sort_values()
        )
    else:  # if state.get("zone").get("type")=="all":
        shap_df = (
            df.mean(numeric_only=True).drop(["latitude", "longitude"]).sort_values()
        )
    return shap_df
