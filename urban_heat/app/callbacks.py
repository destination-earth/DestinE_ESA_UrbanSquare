import dash
import dash_bootstrap_components as dbc
import numpy as np
import pandas as pd
from dash import Input, Output, State, callback, ctx, dcc, html
from datacuber.utils import clip_dataset_with_polygon
from global_vars import (
    season_info,
    shapefile_name_col,
    toulouse_shp,
    uh_season_100m_ds,
    uh_season_ds,
    uh_stats,
    variable_dict,
)
from layout import season_list
from plots import (
    plot_bar_temp,
    plot_lst_comparison,
    plot_two_uh_maps,
    plot_uh_map,
    plot_uh_ts,
)

map_config = {
    "displaylogo": False,
    "toImageButtonOptions": {
        "format": "png",  # one of png, svg, jpeg, webp
        "filename": "urbansquare_murmuration_image",
        "height": 700,
        "width": 900,
        "scale": 5,  # Multiply title/legend/axis/canvas sizes by this factor
    },
    "responsive": True,
}


@callback(
    Output("uh-map-div", "children"),
    State("dropdown-season1", "value"),
    State("dropdown-season2", "value"),
    State("dropdown-neighborhood1", "value"),
    State("dropdown-neighborhood2", "value"),
    State("dropdown-variable", "value"),
    Input("param-validate-btn", "n_clicks"),
)
def update_map_with_season_and_neighborhood(
    season1, season2, neighborhood1, neighborhood2, variable_value, validate_btn
):
    button_id = ctx.triggered_id
    print(button_id)

    if season1 is None:
        season1 = season_list[0]

    if button_id == "param-validate-btn" and validate_btn is not None:
        variable_value = get_variable_id_from_name(variable_value)

        # Get the right dataset
        if neighborhood1 is not None:  # high resolution ds
            ds_to_plot = uh_season_ds[[variable_value]]
        else:  # sparse resolution ds
            ds_to_plot = uh_season_100m_ds[[variable_value]]

        # Plot maps comparison of seasons
        if season2 is not None:
            if neighborhood1 is not None:
                # clip dataset
                ds_to_plot = clip_dataset_with_polygon(
                    ds_to_plot,
                    toulouse_shp.loc[
                        toulouse_shp[shapefile_name_col] == neighborhood1
                    ].geometry,
                )

            df_season_1 = ds_to_plot.sel(season=season1).to_dataframe().reset_index()
            df_season_2 = ds_to_plot.sel(season=season2).to_dataframe().reset_index()
            uh_maps = plot_two_uh_maps(
                df_season_1,
                df_season_2,
                titles=[" ".join(season1.split("_")), " ".join(season2.split("_"))],
                zone=neighborhood1,
                variable=variable_value,
                variable_name=variable_dict.get(variable_value).get("name"),
                unit=variable_dict.get(variable_value).get("unit"),
                # zoom=zoom,
                # nb_hex=nb_hex,
                # opacity=opacity,
                # mapbox_style=mapbox_style
            )
            uh_map_div = html.Div(
                dcc.Graph(
                    figure=uh_maps,
                    id="uh-map1",
                    style={"height": "100%"},
                    config=map_config,
                ),
                className="background-and-border",
            )

        # Plot maps comparison neighborhoods
        elif neighborhood2 is not None:
            ds_to_plot = ds_to_plot.sel(season=season1)

            # clip dataset
            ds_to_plot_neighborhood1 = clip_dataset_with_polygon(
                ds_to_plot,
                toulouse_shp.loc[
                    toulouse_shp[shapefile_name_col] == neighborhood1
                ].geometry,
            )
            df_neighborhood1 = ds_to_plot_neighborhood1.to_dataframe().reset_index()
            uh_map1 = plot_uh_map(
                df_neighborhood1,
                neighborhood1,
                variable=variable_value,
                variable_name=variable_dict.get(variable_value).get("name"),
                showscale=False,
                title=neighborhood1,
            )

            ds_to_plot_neighborhood2 = clip_dataset_with_polygon(
                ds_to_plot,
                toulouse_shp.loc[
                    toulouse_shp[shapefile_name_col] == neighborhood2
                ].geometry,
            )
            df_to_plot_neighborhood2 = (
                ds_to_plot_neighborhood2.to_dataframe().reset_index()
            )
            uh_map2 = plot_uh_map(
                df_to_plot_neighborhood2,
                neighborhood2,
                variable=variable_value,
                variable_name=variable_dict.get(variable_value).get("name"),
                title=neighborhood2,
            )
            uh_map_div = dbc.Row(
                [
                    dbc.Col(
                        dcc.Graph(
                            figure=uh_map1,
                            id="uh-map1",
                            style={"height": "100%"},
                            config=map_config,
                        )
                    ),
                    dbc.Col(
                        dcc.Graph(
                            figure=uh_map2,
                            id="uh-map2",
                            style={"height": "100%"},
                            config=map_config,
                        )
                    ),
                ],
                style={"overflowX": "hidden"},
                className="background-and-border",
            )

        else:
            if neighborhood1 is not None:
                # clip dataset
                ds_to_plot = clip_dataset_with_polygon(
                    ds_to_plot,
                    toulouse_shp.loc[
                        toulouse_shp[shapefile_name_col] == neighborhood1
                    ].geometry,
                )
            df_to_plot = ds_to_plot.sel(season=season1).to_dataframe().reset_index()
            uh_map = plot_uh_map(
                df_to_plot,
                neighborhood1,
                variable=variable_value,
                variable_name=variable_dict.get(variable_value).get("name"),
            )
            uh_map_div = html.Div(
                dcc.Graph(
                    figure=uh_map,
                    id="uh-map1",
                    style={"height": "100%"},
                    config=map_config,
                ),
                className="background-and-border",
            )
            # uh_map = plot_uh_image(uh_season_ds, season_value)
        return uh_map_div

    # No click on validate
    else:
        return dash.no_update


@callback(
    Output("statistics-div", "children"),
    State("dropdown-season1", "value"),
    Input("param-validate-btn", "n_clicks"),
)
def update_stats(season, validate_btn):
    button_id = ctx.triggered_id

    if button_id == "param-validate-btn" and validate_btn is not None:
        season_str = " ".join(season.split("_"))
        df = uh_stats.loc[uh_stats["season_year"] == season]
        df = df.loc[df["type_uh"] == "uh_wavg"]
        df["name"] = [
            str(int(cla)) + " - " + str(round(temp, 2)) + "°C"
            for cla, temp in zip(df.temperature_class.tolist(), df["mean"].tolist())
        ]
        fig = plot_bar_temp(df)
        return [
            html.H5(
                f"Statistics: {season_str}",
                style={"height": "10%", "font-size": "2vh"},
                className="div-selection",
            ),
            html.Div(
                dcc.Graph(figure=fig, style={"height": "100%"}, config=map_config),
                style={"height": "90%"},
            ),
        ]


@callback(
    Output("main-store", "data"),
    State("main-store", "data"),
    State("uh-map1", "figure"),
    State("dropdown-neighborhood1", "value"),
    State("dropdown-neighborhood2", "value"),
    Input("param-validate-btn", "n_clicks"),
    Input("uh-map1", "clickData"),
    Input("uh-map1", "selectedData"),
    # Input("uh-map2", "clickData"),
)
def change_state(
    state,
    map1,
    neighborhood1,
    neighborhood2,
    validate_btn,
    uhmap1_click,
    uhmap1_selection,
    # uhmap2_click,
):
    trigger = ctx.triggered[0].get("prop_id")
    print("***************************************")
    print("TRIGGER : ", trigger)

    if trigger == "param-validate-btn.n_clicks":
        if neighborhood1 is not None:
            state["zone1"] = {"type": "shapefile", "shapefile": neighborhood1}
        else:
            state["zone1"] = {"type": "all", "all": "Toulouse"}
        if neighborhood2 is not None:
            state["zone2"] = {"type": "shapefile", "shapefile": neighborhood2}
        else:
            state["zone2"] = None

    elif trigger == "uh-map1.clickData" and uhmap1_click is not None:
        location = uhmap1_click["points"][0]["location"]
        result_dict = None
        features = map1["data"][0]["geojson"]["features"]
        for d in features:
            if d.get("id") == location:
                result_dict = d
                break
        coords = result_dict["geometry"]["coordinates"]
        x = [p[0] for p in coords[0]]
        y = [p[1] for p in coords[0]]
        centroid = (sum(x) / len(coords[0]), sum(y) / len(coords[0]))
        lon, lat = np.round(centroid, 3)
        state["zone1"] = {
            "type": "click",
            "click": [lat, lon],
        }
    elif trigger == "uh-map1.selectedData" and uhmap1_selection is not None:
        # Get selected locations
        points = uhmap1_selection["points"]
        locations = []
        for point in points:
            loc = point["location"]
            locations.append(loc)

        # Get corresponding hexagons
        result_dict = None
        features = map1["data"][0]["geojson"]["features"]
        for d in features:
            if d.get("id") == location:
                result_dict = d
                break
        coords = result_dict["geometry"]["coordinates"]
        x = [p[0] for p in coords[0]]
        y = [p[1] for p in coords[0]]
        print(points)
    print("NEW STATE : ", state)
    print("***************************************")
    return state


@callback(Output("uh-ts", "figure"), Input("main-store", "data"))
def update_ts_with_season_and_neighborhood(state):
    zone1 = state.get("zone1")
    zone2 = state.get("zone2")

    # If no neighborhood selected
    ds_zone = uh_season_100m_ds.mean(["latitude", "longitude"])
    zone_name = "Toulouse"

    if zone2 is None or zone2 == zone1:
        # If zone 1
        if zone1 is not None:
            ds_zone = get_data_from_zone(zone1)
            zone_name = zone1.get(zone1.get("type"))

        uh_ts = plot_uh_ts(
            ds_zone,
            zone_name,
        )
    else:
        # Get dataframe for zone 1
        ds_zone1 = get_data_from_zone(zone1)
        df_zone1 = ds_zone1.to_dataframe()[["lst"]].rename(
            columns={"lst": str(zone1.get(zone1.get("type")))}
        )

        # Get dataframe for zone 2
        ds_zone2 = get_data_from_zone(zone2)
        df_zone2 = ds_zone2.to_dataframe()[["lst"]].rename(
            columns={"lst": str(zone2.get(zone2.get("type")))}
        )

        uh_ts = plot_lst_comparison(df_zone1, df_zone2)
    return uh_ts


def get_data_from_zone(zone):
    print("Get data from zone...")
    print(zone)
    if zone.get("type") == "shapefile":
        zone_name = zone.get("shapefile")
        ds = clip_dataset_with_polygon(
            uh_season_ds,
            toulouse_shp.loc[toulouse_shp[shapefile_name_col] == zone_name].geometry,
        ).mean(["latitude", "longitude"])
    elif zone.get("type") == "bbox":
        bbox = zone.get("bbox")
        ds = uh_season_ds.sortby("latitude")
        ds = ds.sel(
            latitude=slice(bbox[1], bbox[3]), longitude=slice(bbox[0], bbox[2])
        ).mean(["latitude", "longitude"])
    elif zone.get("type") == "click":
        lat, lon = zone.get("click")
        ds = uh_season_ds.sel(latitude=lat, longitude=lon, method="nearest").drop(
            ["latitude", "longitude"]
        )
    elif zone.get("type") == "selection":
        zone_selection = zone.get("selection")
        ds = clip_dataset_with_polygon(
            uh_season_ds,
            zone_selection.geometry,
        ).mean(["latitude", "longitude"])
    else:
        ds = uh_season_100m_ds.mean(["latitude", "longitude"])

    return ds


@callback(
    Output("season1-info-div", "children"),
    Output("dropdown-season1", "value"),
    Input("dropdown-season1", "value"),
)
def update_season1_info(season):
    if season is None:
        season = season_list[0]
    images = season_info.loc[season_info["Season"] == season].Date.iloc[0]
    return (
        html.I(
            f"Landsat images: {images}",
            style={"color": "gray"},
        ),
        season,
    )


@callback(
    Output("dropdown-neighborhood2", "disabled"),
    Input("dropdown-season2", "value"),
)
def cant_have_neighborhood2_if_season2(season2):
    if season2 is not None:
        return True
    else:
        return False


@callback(
    Output("dropdown-season2", "disabled"),
    Input("dropdown-neighborhood2", "value"),
)
def cant_have_season2_if_neighborhood2(neighborhood2):
    if neighborhood2 is not None:
        return True
    else:
        return False


@callback(Output("season2-info-div", "children"), Input("dropdown-season2", "value"))
def update_season2_info(season):
    if season is not None:
        images = season_info.loc[season_info["Season"] == season].Date.iloc[0]
        return html.I(f"Landsat images: {images}", style={"color": "gray"})
    else:
        return html.Div()


def get_variable_id_from_name(variable_name):
    for var in variable_dict.keys():
        var_dict = variable_dict.get(var)
        if var_dict is not None and var_dict.get("name") == variable_name:
            return var
    return "uh_wavg"


# @callback(
#     Output("uh-map2", "figure"),
#     State("uh-map2", "figure"),
#     [Input("uh-map1", "relayoutData")],
# )
# def zoom_if_zoom(fig, select_data):
#     # If zoom on map1, zoom on map2
#     if fig is not None and select_data is not None:
#         if select_data.get("mapbox.center") is not None:
#             fig["layout"]["mapbox"]["center"] = select_data.get("mapbox.center")
#         if select_data.get("mapbox.zoom") is not None:
#             fig["layout"]["mapbox"]["zoom"] = select_data.get("mapbox.zoom")
#         return fig
#     else:
#         return dash.no_update


# @callback(
#     Output("uh-map1", "figure"),
#     State("uh-map1", "figure"),
#     [Input("uh-map2", "relayoutData")],
# )
# def zoom_if_zoom2(fig, select_data):
#     # If zoom on map 2, zoom on map 1
#     if fig is not None and select_data is not None:
#         if select_data.get("mapbox.center") is not None:
#             fig["layout"]["mapbox"]["center"] = select_data.get("mapbox.center")
#         if select_data.get("mapbox.zoom") is not None:
#             fig["layout"]["mapbox"]["zoom"] = select_data.get("mapbox.zoom")
#         return fig
#     else:
#         return dash.no_update
