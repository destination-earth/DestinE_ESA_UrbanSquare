from typing import List

import numpy as np
import pandas as pd
import plotly.express as px
import plotly.figure_factory as ff
from datacuber.plots import add_layer, plot_hexbin_map, set_mapbox_token
from datacuber.utils import clip_dataset_with_polygon
from global_vars import shapefile_name_col, toulouse_shp, variable_dict
from plotly.subplots import make_subplots

set_mapbox_token()


def apply_basic_layout(fig):
    # Layout to apply to all plots: transparent background, white font color etc.
    fig = fig.update_layout(
        plot_bgcolor="rgba(43, 43, 43, 0)",
        paper_bgcolor="rgba(43, 43, 43, 0)",
        yaxis_gridcolor="rgba(0, 0, 0, 0.17)",
        xaxis_gridcolor="rgba(0, 0, 0, 0)",
        xaxis_showline=False,
        font_color="#e5e6ec",
    )
    # Don't show the zeroline
    fig.update_yaxes(zeroline=False)
    return fig


def plot_uh_map(
    df,
    zone=None,
    variable="uh_wavg",
    variable_name="Classified LST",
    showscale=True,
    title=None,
    unit="",
    zoom=9.5,
    nb_hex=100,
    opacity=0.9,
):
    print("Plotting uh map...")
    center_lat = None
    center_lon = None
    gdf = toulouse_shp
    agg_func = np.mean
    if zone is not None:
        gdf = toulouse_shp.loc[toulouse_shp[shapefile_name_col] == zone]
        zoom = 13.2
        nb_hex = None
    # df = ds_zone.to_dataframe().reset_index()
    if variable == "uh_req":
        # df = df.loc[(df["season"] == season)]
        # df.loc[~((df["uh_req"] >= 1)), :] = np.nan
        # df = df.fillna(0)
        # center_lat = 43.6
        # center_lon = 1.43
        cmap = [[0, "rgba(0,0,0,0)"], [1, "#9E0142"]]
        agg_func = np.max
    else:
        # df = df.loc[df["season"] == season]
        cmap = "Spectral_r"
    fig = plot_hexbin_map(
        df,
        variable,
        variable_name,
        nb_hexagon=nb_hex,
        zoom=zoom,
        title=title,
        center_lat=center_lat,
        center_lon=center_lon,
        geodf=gdf,
        agg_func=agg_func,
        cmin=0,
        cmax=variable_dict.get(variable).get("cmax"),
        cmap=cmap,
        geodf_color="rgba(43,43,43,0.9)",
        opacity=opacity,
    )
    fig.update_layout(margin=dict(l=10, r=10, t=10, b=10))
    fig = apply_basic_layout(fig)
    fig = fig.update_layout(
        coloraxis_showscale=showscale, title_x=0.05, title_font_size=14
    )
    print("Plotted !")
    return fig


def plot_two_uh_maps(
    df1,
    df2,
    titles: List[str],
    zone=None,
    variable="uh_wavg",
    variable_name="Classified LST",
    unit="",
    zoom=13.2,
    nb_hex=None,
    cmap="Spectral_r",
    opacity=0.9,
    mapbox_style="satellite",
):
    fig = make_subplots(
        rows=1,
        cols=2,
        shared_xaxes=True,
        shared_yaxes=True,
        horizontal_spacing=0.01,
        specs=[[{"type": "mapbox"}, {"type": "mapbox"}]],
        subplot_titles=(titles[0], titles[1]),
    )

    fig1 = plot_uh_map(
        df1,
        zone=zone,
        variable=variable,
        variable_name=variable_name,
        unit=unit,
        zoom=zoom,
        nb_hex=nb_hex,
        title=titles[0],
        opacity=opacity,
    )
    fig.add_trace(
        fig1.data[0],
        row=1,
        col=1,
    ).update_traces(colorscale=cmap)

    fig2 = plot_uh_map(
        df2,
        zone=zone,
        variable=variable,
        variable_name=variable_name,
        unit=unit,
        zoom=zoom,
        nb_hex=nb_hex,
        title=titles[1],
        opacity=opacity,
    )
    fig.add_trace(
        fig2.data[0],
        row=1,
        col=2,
    ).update_traces(colorscale=cmap)

    cmax = variable_dict.get(variable).get("cmax")

    fig.update_traces(marker_line_width=0)

    center_lat = (df1.latitude.min() + df1.latitude.max()) / 2
    center_lon = (df1.longitude.min() + df1.longitude.max()) / 2

    # Add layers for geospatial data if provided
    geodf_name = None
    layers = add_layer(
        toulouse_shp, geodf_name, geodf_color="rgb(158, 1, 66)", geodf_width=2
    )

    fig = apply_basic_layout(fig)
    fig.update_layout(
        coloraxis=dict(
            colorscale=cmap,
            cmin=0,
            cmax=cmax,
            colorbar_title=variable_name + f"<br>{unit}",
        ),
        showlegend=True,
        margin=dict(l=20, r=10, t=40, b=20),
        mapbox_layers=layers,
        mapbox_accesstoken="pk.eyJ1IjoibXVydWdlc2gyNDAxIiwiYSI6ImNrZzZidGFmbTEycnkyc3IyaHI5NmtpMzEifQ.RS4HygJeZBVtKidpm149pA",
        mapbox_style=mapbox_style,
        mapbox_zoom=zoom,
        mapbox_center={"lat": center_lat, "lon": center_lon},
        mapbox2_layers=layers,
        mapbox2_accesstoken="pk.eyJ1IjoibXVydWdlc2gyNDAxIiwiYSI6ImNrZzZidGFmbTEycnkyc3IyaHI5NmtpMzEifQ.RS4HygJeZBVtKidpm149pA",
        mapbox2_style=mapbox_style,
        mapbox2_zoom=zoom,
        mapbox2_center={"lat": center_lat, "lon": center_lon},
    )
    return fig


def plot_uh_image(ds, season, variable="uh_wavg", variable_name="Classified LST"):
    data_array = ds.sel(season=season)[variable].values
    fig = px.imshow(
        data_array,
        zmin=0,
        zmax=7,
        color_continuous_scale="Spectral_r",
        labels={"color": variable_name},
    )
    fig = apply_basic_layout(fig)
    fig.update_layout(
        yaxis_gridcolor="rgba(0, 0, 0, 0)",
        xaxis_gridcolor="rgba(0, 0, 0, 0)",
        margin=dict(l=0, r=0, t=10, b=10),
        xaxis_showticklabels=False,
        yaxis_showticklabels=False,
        yaxis_showline=False,
        xaxis_showline=False,
        yaxis_zeroline=False,
        xaxis_zeroline=False,
    )
    return fig


def plot_uh_ts(ds_zone, zone_name="Toulouse", variables=["temperature_2m", "lst"]):
    print("PLOT UH TS...")
    ds_zone = ds_zone[variables]
    df = ds_zone.to_dataframe()[variables]
    fig = px.line(
        df.rename(
            columns={
                variable: variable_dict.get(variable).get("name")
                for variable in variables
            }
        ),
        color_discrete_sequence=["#7a6bbf", "#8FD2A4"],
    ).update_traces(hovertemplate=None)
    fig = apply_basic_layout(fig)
    fig.update_layout(
        title=f"<b>Surface temperature vs Air temperature</b><br><i>{zone_name}</i>",
        title_x=0.48,
        yaxis_title="Temperature (°C)",
        hovermode="x unified",
        title_font_size=14,
        legend=dict(title=None, orientation="h", yanchor="bottom", y=-0.4, x=0.3),
    )
    fig.update_xaxes(title=None, tickangle=35)
    return fig


def plot_lst_comparison(df1, df2):
    df = pd.concat([df1, df2], axis=1)
    fig = px.line(
        df,
        title="<b>LST comparison</b>",
        color_discrete_sequence=["#7a6bbf", "#8FD2A4"],
    ).update_traces(hovertemplate=None)
    fig = apply_basic_layout(fig)
    fig.update_xaxes(title=None, tickangle=45)
    fig.update_yaxes(title="Temperature (°C)")
    fig.update_layout(
        legend_title=None,
        hovermode="x unified",
        margin=dict(l=80, r=20, t=60, b=20),
        title_font_size=14,
    )
    return fig


def plot_bar_temp(df):
    fig = px.bar(
        df,
        x="name",
        y="areas_km²",
        color="mean",
        color_continuous_scale="Spectral_r",
        labels={
            "mean": "Temperature (°C)",
            "name": "Temp Class",
            "areas_km²": "Areas (km²)",
        },
    )
    fig.update_yaxes(title="Areas (km2)")
    fig.update_xaxes(title=None, tickangle=45)
    fig = apply_basic_layout(fig)
    fig = fig.update_layout(coloraxis_showscale=False, barcornerradius=5)
    return fig


def plot_comparison_bar_temp(df, date1, date2):
    fig = px.bar(
        df,
        x="name",
        y="areas_km²",
        color="date",
        barmode="group",
        color_discrete_map={date1: "#00B1FF", date2: "#09C269"},
        labels={
            "mean": "Temperature (°C)",
            "name": "Temp Class",
            "areas_km²": "Areas (km²)",
        },
    )
    fig.update_yaxes(title="Areas (km2)")
    fig.update_xaxes(title=None, tickangle=45)
    fig = apply_basic_layout(fig)
    fig.update_layout(
        coloraxis_showscale=False,
        barcornerradius=5,
        margin=dict(t=30, r=10),
        legend=dict(title=None, orientation="h", yanchor="top", y=1.2, x=0.2),
    )
    return fig
