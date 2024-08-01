import dash
import numpy as np
import pandas as pd
import plotly.express as px
from dash import Input, Output, State, callback, ctx, dcc, html
from datacuber.utils import clip_dataset_with_polygon
from global_vars import (
    IndicatorThreshold,
    agregation_types,
    data_dir,
    gdf,
    global_dataset,
    global_zone,
    pollutant_name,
    scenario_colors,
    scenario_ds,
    shapefile_name_col,
    standards_catalogue,
)
from layout import (
    create_download_button,
    create_zone_stats,
    full_screen_btn,
    map_config,
)
from plots import create_pollutant_map, create_pollutant_plot
from utils import compute_statistics, get_under_10_ds, reset_zone


@callback(
    Output("main-store", "data", allow_duplicate=True),
    State("main-store", "data"),
    State("my-date-picker-range", "start_date"),
    State("my-date-picker-range", "end_date"),
    State("variable-dropdown", "value"),
    State("standard-dropdown", "value"),
    State("neighborhood-dropdown", "value"),
    State("cmax-input", "value"),
    Input("settings-ok-btn", "n_clicks"),
    prevent_initial_call=True,
)
def change_map_store(
    state,
    start_date,
    end_date,
    variable,
    standard,
    neighborhood,
    cmax,
    ok_btn,
):
    button_id = ctx.triggered[0]["prop_id"]
    print("CHANGE MAP STORE DATA")
    print(f"Trigger : {button_id}")

    state["trigger"] = button_id

    # if triggered by click on change dates
    if ok_btn is not None and button_id == "settings-ok-btn.n_clicks":
        state["start_date"] = start_date
        state["end_date"] = end_date

        state["variable"] = variable

        state["standard"] = standard

        if neighborhood is None:
            state = reset_zone(state)
        else:
            state["zone"] = {
                "type": "neighborhood",
                "neighborhood": neighborhood,
                "name": neighborhood,
            }
            state["nb_hex"] = 2
            state["zoom"] = 11

        # Get map data
        if variable == "Concentrations":
            ds_to_display = global_dataset.sel(
                time=slice(state.get("start_date"), state.get("end_date"))
            ).mean(dim="time")
        else:
            ds_to_display = get_under_10_ds(global_dataset, state, gdf)

        cmax = int(np.nanmax(ds_to_display[pollutant_name].values))
        state["cmax"] = cmax

        variable_str = "_".join(variable.lower().split(" "))
        map_area_name = str(state.get("zone").get("name")).split("/")[0]
        # State's maqi map tiff path changes
        state["no2_map_tiff_path"] = (
            f"{data_dir}/no2_map_{variable_str}_{map_area_name}_{state.get('start_date')}_{state.get('end_date')}.tiff"
        )
        state["no2_map_csv_path"] = (
            f"{data_dir}/no2_map_{variable_str}_{map_area_name}_{state.get('start_date')}_{state.get('end_date')}.csv"
        )

    print(state)
    return state


@callback(
    Output("ts-store", "data", allow_duplicate=True),
    # Output("neighborhood-dropdown", "value"),
    State("ts-store", "data"),
    State("my-date-picker-range", "start_date"),
    State("my-date-picker-range", "end_date"),
    State({"type": "graph", "id": "maqi-map"}, "figure"),
    State("agregation-dropdown", "value"),
    State("standard-dropdown", "value"),
    State("neighborhood-dropdown", "value"),
    Input({"type": "graph", "id": "maqi-map"}, "clickData"),
    Input("settings-ok-btn", "n_clicks"),
    prevent_initial_call=True,
)
def change_ts_store(
    state,
    start_date,
    end_date,
    figure,
    agregation,
    standard,
    neighborhood,
    click_on_map,
    ok_btn,
):
    button_id = ctx.triggered[0]["prop_id"]
    print("CHANGE TS STORE DATA")
    print(f"Trigger : {button_id}")

    # if triggered by click on change settings
    if button_id == "settings-ok-btn.n_clicks":
        state["start_date"] = start_date
        state["end_date"] = end_date
        state["agregation"] = agregation
        state["standard"] = standard

        if neighborhood is None:
            state = reset_zone(state)
        else:
            state["zone"] = {
                "type": "neighborhood",
                "neighborhood": neighborhood,
                "name": neighborhood,
            }

    # If triggered by click on map
    if click_on_map is not None and (
        button_id == "{'id':'maqi-map','type':'graph'}.clickData"
        or button_id == '{"id":"maqi-map","type":"graph"}.clickData'
    ):
        location = click_on_map["points"][0]["location"]
        result_dict = None
        features = figure["data"][0]["geojson"]["features"]
        for d in features:
            if d.get("id") == location:
                result_dict = d
                break
        coords = result_dict["geometry"]["coordinates"]
        x = [p[0] for p in coords[0]]
        y = [p[1] for p in coords[0]]
        centroid = (sum(x) / len(coords[0]), sum(y) / len(coords[0]))
        lon, lat = np.round(centroid, 3)

        # Find nearest non nan point
        point_dataset = global_dataset.where(
            global_dataset["no2_prediction"].notnull()
        ).sel(longitude=lon, latitude=lat, method="nearest")
        non_nan_lat = round(float(point_dataset["latitude"]), 3)
        non_nan_lon = round(float(point_dataset["longitude"]), 3)
        state["zone"] = {
            "type": "point",
            "point": [non_nan_lat, non_nan_lon],
            "name": [non_nan_lat, non_nan_lon],
            "detail": {"latitude": non_nan_lat, "longitude": non_nan_lon},
        }

    state["trigger"] = button_id

    ts_area_name = str(state.get("zone").get("name")).split("/")[0]
    agregation_str = agregation_types.get(state.get("agregation"))
    state["no2_ts_csv_path"] = (
        f"data/no2_ts_{ts_area_name}_{agregation_str}_{state.get('start_date')}_{state.get('end_date')}.csv"
    )

    print(state)
    return state


@callback(
    Output({"type": "graph", "id": "maqi-map"}, "figure"),
    Output({"type": "graph", "id": "maqi-map_modal"}, "figure", allow_duplicate=True),
    Output("cmax-input", "value"),
    State("opacity-slider", "value"),
    State("mapbox-dropdown", "value"),
    Input("main-store", "data"),
    prevent_initial_call=True,
)
def change_map_on_store_change(opacity, mapbox_style, state):
    button_id = ctx.triggered_id
    print("CHANGE ON STORE CHANGE")
    print(f"Trigger : {button_id}")

    # ----------------- MAP DATA ----------------------#

    cmax = state["cmax"]
    if state.get("trigger") == '{"id":"maqi-map","type":"graph"}.clickData':
        print(f"trigger: {state.get('trigger')}")
        maqi_map = None

    else:
        # Get map data
        if state.get("variable") == "Concentrations":
            ds_to_display = global_dataset.sel(
                time=slice(state.get("start_date"), state.get("end_date"))
            ).mean(dim="time")
        else:
            ds_to_display = get_under_10_ds(global_dataset, state, gdf)

        if state.get("zone").get("type") == "neighborhood":
            neigh = state.get("zone").get("neighborhood")
            ds_to_display = clip_dataset_with_polygon(
                ds_to_display, gdf.loc[gdf[shapefile_name_col] == neigh].geometry
            )

        # Save map data as tiff
        bT = ds_to_display[pollutant_name]
        bT = bT.rio.set_spatial_dims(x_dim="longitude", y_dim="latitude")
        bT.rio.write_crs("epsg:4326", inplace=True)
        print(f"Saving tiff in : {state.get('no2_map_tiff_path')}")
        bT.rio.to_raster(state.get("no2_map_tiff_path"))

        # Save map data as csv
        df_to_display = ds_to_display.to_dataframe().reset_index().dropna()
        df_to_display.to_csv(state.get("no2_map_csv_path"), index=False)

        maqi_map = create_pollutant_map(
            state,
            df_to_display,
            var_type=state["variable"],
            opacity=opacity,
            mapbox_style=mapbox_style,
        )

    if maqi_map is None:
        maqi_map = dash.no_update

    return (
        maqi_map,
        maqi_map,
        cmax,
    )


@callback(
    Output("maqi-ts-graph", "figure", allow_duplicate=True),
    Output("download-maqi-ts-csv-div", "children"),
    Output("statistics-div", "children"),
    # State("main-store", "data"),
    Input("ts-store", "data"),
    Input("scenario-road-traffic-dropdown", "value"),
    prevent_initial_call=True,
)
def change_ts_on_store_change(state, traffic_scenarios):
    button_id = ctx.triggered_id
    print("CHANGE ON STORE CHANGE")
    print(f"Trigger : {button_id}")
    print(state.get("zone"))

    ts_zone_and_time = global_dataset.sel(
        time=slice(state.get("start_date"), state.get("end_date"))
    )
    scenario_state = scenario_ds.sel(
        time=slice(state.get("start_date"), state.get("end_date"))
    )

    # ----------------- TIME SERIES DATA ----------------------#
    # Get time series data
    if state.get("zone"):
        print(f"Zone sélectionnée: {state.get('zone').get('type')}")

        # STATE ZONE IS A POINT
        if state.get("zone").get("type") == "point":
            lat, lon = state.get("zone").get("point")

            # MAQI TS
            # ts_zone_and_time = ts_zone_and_time.sel(
            #     latitude=lat, longitude=lon, method="nearest"
            # )
            ts_zone_and_time = ts_zone_and_time.where(
                ts_zone_and_time["no2_prediction"].notnull()
            ).sel(longitude=lon, latitude=lat, method="nearest")

            scenario_state = scenario_state.where(
                scenario_state["no2_prediction"].notnull()
            ).sel(longitude=lon, latitude=lat, method="nearest")

        elif state.get("zone").get("type") == "neighborhood":
            neighborhood = state.get("zone").get("neighborhood")
            ts_zone_and_time = clip_dataset_with_polygon(
                ts_zone_and_time,
                gdf.loc[gdf[shapefile_name_col] == neighborhood].geometry,
            ).mean(["latitude", "longitude"])

            scenario_state = clip_dataset_with_polygon(
                scenario_state,
                gdf.loc[gdf[shapefile_name_col] == neighborhood].geometry,
            ).mean(["latitude", "longitude"])

        # STATE ZONE IS WHOLE ZONE
        elif state.get("zone").get("type") == "all":
            # Average on area
            ts_zone_and_time = ts_zone_and_time.mean(["latitude", "longitude"])
            scenario_state = scenario_state.mean(["latitude", "longitude"])

    else:
        # Average on area
        ts_zone_and_time = ts_zone_and_time.mean(["latitude", "longitude"])
        scenario_state = scenario_state.mean(["latitude", "longitude"])

    # MAQI STATISTICS
    stats_dict = compute_statistics(
        ts_zone_and_time.to_dataframe().reset_index(), state
    )
    worst_day = stats_dict.get("worst_day")
    worst_pollution = stats_dict.get("worst_pollution")
    average_pollution = stats_dict.get("average_pollution")
    nb_jours = stats_dict.get("nb_jours")
    nb_depassement = stats_dict.get("nb_depassement")

    # Agregate on time dimension
    agregation = agregation_types.get(state.get("agregation"))
    if agregation:
        print(f"Agregation: {agregation}")
        ts_zone_and_time = ts_zone_and_time.resample(time=agregation).mean()
        scenario_state = scenario_state.resample(time=agregation).mean()

    # MAQI TIMESERIES
    ts_zone_and_time = ts_zone_and_time.to_dataframe().reset_index()
    if "latitude" in list(ts_zone_and_time):
        ts_zone_and_time = ts_zone_and_time.drop(["longitude", "latitude"], axis=1)
    # Save ts data as csv
    ts_zone_and_time.to_csv(state.get("no2_ts_csv_path"), index=False)

    # CREATE HTML ELEMENT
    standard = standards_catalogue.get(state['standard'])
    fig = create_pollutant_plot(
        ts_zone_and_time,
        state.get("zone").get("name"),
        thresholds=[IndicatorThreshold(name=f"{standard.standard_name} threshold", value=standard.no2)]
    )

    if traffic_scenarios is not None:
        for i_scenario, scenario in enumerate(traffic_scenarios):
            color = scenario_colors[scenario]
            scenario_name = f"Road Traffic {scenario}"
            scenario = int(scenario.split("%")[0]) / 100
            data_scenario = scenario_state[
                f"no2_prediction_scenario_road_traffic_{scenario}"
            ].to_dataframe()
            if "latitude" in data_scenario:
                data_scenario = data_scenario.drop(["latitude", "longitude"], axis=1)
            fig.add_trace(px.line(data_scenario).data[0])
            fig["data"][-1]["line"]["color"] = color
            fig["data"][-1]["name"] = scenario_name

    zone_statistics = create_zone_stats(
        state, nb_depassement, nb_jours, average_pollution, worst_day, worst_pollution
    )

    return (fig, create_download_button("maqi-ts"), zone_statistics)


@callback(
    Output("download-maqi-ts-csv", "data"),
    State("ts-store", "data"),
    Input("btn-download-maqi-ts-csv", "n_clicks"),
    prevent_initial_call=True,
)
def download_maqi_ts_df(state, n_clicks):
    print(f"Download of dataframe with state: {state}")

    import os

    no2_ts_path = state.get("no2_ts_csv_path")
    file_folder, file_name = os.path.split(no2_ts_path)
    print(f"Download: {no2_ts_path}")
    if os.path.exists(no2_ts_path):
        df = pd.read_csv(no2_ts_path)
        return dcc.send_data_frame(
            df[["time", pollutant_name]].to_csv,
            file_name,
            index=False,
        )
    return


@callback(
    Output("download-maqi-map-csv", "data"),
    State("main-store", "data"),
    Input("btn-download-maqi-map-csv", "n_clicks"),
    prevent_initial_call=True,
)
def download_maqi_map_df(state, n_clicks):
    print(f"Download of dataframe with state: {state}")

    import os

    no2_map_csv_path = state.get("no2_map_csv_path")
    file_folder, file_name = os.path.split(no2_map_csv_path)
    print(f"Download: {no2_map_csv_path}")
    if os.path.exists(no2_map_csv_path):
        df = pd.read_csv(no2_map_csv_path)
        return dcc.send_data_frame(
            df[["latitude", "longitude", pollutant_name]].to_csv,
            file_name,
            index=False,
        )
    return


@callback(
    Output("download-maqi-map-tiff", "data"),
    State("main-store", "data"),
    Input("btn-download-maqi-map-tiff", "n_clicks"),
    prevent_initial_call=True,
)
def download_maqi_map_df(state, n_clicks):
    print(f"Download of tiff with state: {state}")

    import os

    no2_map_tiff_path = state.get("no2_map_tiff_path")
    file_folder, file_name = os.path.split(no2_map_tiff_path)
    print(f"Download: {no2_map_tiff_path}")
    if os.path.exists(no2_map_tiff_path):
        return dcc.send_file(
            no2_map_tiff_path,
            file_name,
        )
    return


@callback(
    Output({"type": "graph", "id": "maqi-map"}, "figure", allow_duplicate=True),
    Output({"type": "graph", "id": "maqi-map_modal"}, "figure", allow_duplicate=True),
    State("main-store", "data"),
    State("data-store", "data"),
    State({"type": "graph", "id": "maqi-map"}, "figure"),
    State("opacity-slider", "value"),
    State("neighborhood-dropdown", "value"),
    Input("mapbox-dropdown", "value"),
    prevent_initial_call=True,
)
def update_mapbox(state, data_store, figure, opacity, neighborhood, mapbox_style):
    button_id = ctx.triggered_id
    print("UPDATE MAPBOX")
    print(f"Trigger : {button_id}")

    # Change mapbox
    if button_id == "mapbox-dropdown" and mapbox_style is not None:
        ds_to_plot = global_dataset

        # if data_store.get("maqi_map_dict"):
        #     df_to_plot = pd.DataFrame(data_store.get("maqi_map_dict"))
        # else:
        if state.get("variable") == "Concentrations":
            ds_to_plot = global_dataset.sel(
                time=slice(state["start_date"], state["end_date"])
            ).mean(dim="time")
        else:  # Overshoots
            ds_to_plot = get_under_10_ds(global_dataset, state, gdf)

        if state.get("zone").get("type") == "neighborhood" or neighborhood is not None:
            neigh = neighborhood or state.get("zone").get("neighborhood")
            ds_to_plot = clip_dataset_with_polygon(
                ds_to_plot, gdf.loc[gdf[shapefile_name_col] == neigh].geometry
            )
        df_to_plot = ds_to_plot.to_dataframe().reset_index().dropna()

        maqi_map = create_pollutant_map(
            state,
            df_to_plot,
            var_type=state["variable"],
            opacity=opacity,
            mapbox_style=mapbox_style,
        )
        return maqi_map, maqi_map

    else:
        return dash.no_update, dash.no_update


@callback(
    Output({"type": "graph", "id": "maqi-map"}, "figure", allow_duplicate=True),
    Output({"type": "graph", "id": "maqi-map_modal"}, "figure", allow_duplicate=True),
    State({"type": "graph", "id": "maqi-map"}, "figure"),
    Input("opacity-slider", "value"),
    Input("cmax-input", "value"),
    # Input("mapbox-dropdown", "value"),
    prevent_initial_call=True,
)
def update_opacity_cmax(figure, opacity, cmax):  # , mapbox_style):
    button_id = ctx.triggered_id if not None else "No clicks yet"
    print(button_id)

    if button_id == "opacity-slider":
        print("UPDATE OPACITY")
        figure["data"][0]["marker"]["opacity"] = opacity
        return figure, figure
    elif button_id == "cmax-input":
        print("UPDATE CMAX")
        figure["layout"]["coloraxis"]["cmin"] = 0
        figure["layout"]["coloraxis"]["cmax"] = cmax
        return figure, figure
    # elif button_id == "mapbox-dropdown" and mapbox_style is not None:
    #     print("UPDATE MAPBOX")
    #     figure["layout"]["mapbox"]["style"] = str(mapbox_style)
    #     return figure, figure
    else:
        return dash.no_update, dash.no_update


# @callback(
#     Output({"type": "graph", "id": "maqi-map"}, "figure", allow_duplicate=True),
#     Output({"type": "graph", "id": "maqi-map_modal"}, "figure", allow_duplicate=True),
#     State({"type": "graph", "id": "maqi-map"}, "figure"),
#     Input("cmax-input", "value"),
#     prevent_initial_call=True,
# )
# def update_cmax(figure, cmax):
#     button_id = ctx.triggered_id if not None else "No clicks yet"

#     if button_id == "cmax-input":
#         print("UPDATE CMAX")
#         figure["layout"]["coloraxis"]["cmin"] = 0
#         figure["layout"]["coloraxis"]["cmax"] = cmax
#         return figure, figure
#     else:
#         return dash.no_update, dash.no_update


# @callback(
#     Output({"type": "graph", "id": "maqi-map"}, "figure", allow_duplicate=True),
#     Output({"type": "graph", "id": "maqi-map_modal"}, "figure", allow_duplicate=True),
#     State({"type": "graph", "id": "maqi-map"}, "figure"),
#     Input("opacity-slider", "value"),
#     prevent_initial_call=True,
# )
# def update_opacity(figure, opacity, cmax, mapbox_style):
#     button_id = ctx.triggered_id if not None else "No clicks yet"

#     if button_id == "opacity-slider":
#         print("UPDATE OPACITY")
#         figure["data"][0]["marker"]["opacity"] = opacity
#         return figure, figure
#     else:
#         return dash.no_update, dash.no_update


@callback(
    Output("drawer-simple", "opened", allow_duplicate=True),
    Input("drawer-demo-button", "n_clicks"),
    prevent_initial_call=True,
)
def drawer_demo(drawer_btn):
    return True


@callback(
    Output("drawer-simple", "opened", allow_duplicate=True),
    Input("settings-ok-btn", "n_clicks"),
    prevent_initial_call=True,
)
def drawer_demo(settings_btn):
    print(ctx.triggered_id)
    if ctx.triggered_id == "settings-ok-btn":
        return False
    return True


@callback(
    Output("drawer-simple", "opened", allow_duplicate=True),
    Input("btn_settings", "n_clicks"),
    prevent_initial_call=True,
)
def drawer_demo(drawer_btn):
    return True


# @callback(
#     Output("maqi-ts-graph", "figure", allow_duplicate=True),
#     State("maqi-ts-graph", "figure"),
#     Input("scenario-road-traffic-dropdown", "value"),
#     prevent_initial_call=True,
# )
# def plot_scenarios(fig, scenarios):
#     print(scenarios)
#     return dash.no_update
