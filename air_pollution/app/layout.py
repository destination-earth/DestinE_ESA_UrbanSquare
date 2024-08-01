import dash_bootstrap_components as dbc
import dash_daq as daq
import dash_mantine_components as dmc
from dash import dcc, html
from global_vars import (
    IndicatorThreshold,
    agregation_types,
    cmax,
    gdf,
    global_dataset,
    icons,
    neighborhood_list,
    shap_values,
    standards_catalogue,
    state_data,
    state_no2_ts,
    toulouse_df,
)
from plots import create_pollutant_map, create_pollutant_plot, plot_shap_values
from utils import (
    categorize_value,
    compute_statistics,
    get_under_10_ds,
    get_values_df_from_state,
)

standard = standards_catalogue.get(state_data['standard'])
maqi_ts = create_pollutant_plot(
    state_no2_ts.reset_index(),
    "Toulouse",
    thresholds=[IndicatorThreshold(name=f"{standard.standard_name} threshold", value=standard.no2)]
)

graph_config = {
    "displaylogo": False,
    "toImageButtonOptions": {
        "format": "png",  # one of png, svg, jpeg, webp
        "filename": "urbansquare_murmuration_image",
        "height": 500,
        "width": 1200,
        "scale": 5,  # Multiply title/legend/axis/canvas sizes by this factor
    },
    "responsive": True,
}

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

navbar = dbc.Row(
    children=[
        dbc.Col(
            [
                html.H3("Air Quality in Toulouse"),
            ],
            md=11,
            xs=8,
        ),
        dbc.Col(
            html.A(
                className="navbar-right",
                href="https://murmuration-sas.com/en/homepage",
                children=[
                    html.Img(src="assets/images/murmuration_logo.png", id="navbar-logo")
                ],
            ),
            style={"margin": "0px", "padding": "0px"},
            md=1,
            xs=4,
        ),
    ],
    justify="between",
    id="dashboard-title",
    className="navbar",
    style={"height": "8vh"},
)

footer = html.Footer(
    [
        html.Div(
            [
                "© 2024 Copyright: ",
                html.A("Murmuration", href="https://murmuration-sas.com/en/homepage"),
            ],
            className="text-center",
        )
    ],
    style={"width": "100vw", "height": "5vh"},
)


def serve_layout(state, ts_store):
    maqi_div = create_dash_div(state, ts_store)

    return dbc.Container(
        children=[navbar, maqi_div, footer],
        fluid=True,
        style={
            "height": "100vh",
            "width": "100vw",
            "overflowX": "hidden",
            "overflowY": "hidden",
        },
        id="total-container",
    )


def create_dash_div(state, ts_store):
    ds_to_plot = global_dataset.sel(
        time=slice(state.get("start_date"), state.get("end_date"))
    ).mean(dim="time")
    df_to_plot = ds_to_plot.to_dataframe().reset_index()

    df_for_stats = (
        global_dataset.mean(["latitude", "longitude"]).to_dataframe().reset_index()
    )
    stats_dict = compute_statistics(df_for_stats, state)
    worst_day = stats_dict.get("worst_day")
    worst_pollution = stats_dict.get("worst_pollution")
    average_pollution = stats_dict.get("average_pollution")
    nb_jours = stats_dict.get("nb_jours")
    nb_depassement = stats_dict.get("nb_depassement")

    maqi_map = create_pollutant_map(state, df_to_plot)

    return html.Div(
        children=[
            dbc.Modal(
                [
                    html.Div(
                        [
                            dbc.ModalHeader(
                                dbc.Row(
                                    children=[
                                        dbc.Col(dbc.ModalTitle("Air Quality Map"))
                                    ]
                                )
                            ),
                            dbc.ModalBody(
                                [
                                    dcc.Graph(
                                        id={"type": "graph", "id": "maqi-map_modal"},
                                        className="graph maqi_graph",
                                        figure=maqi_map,
                                        config=map_config,
                                    )
                                ]
                            ),
                        ]
                    )
                ],
                id="modal_plt_1",
                fullscreen=True,
                is_open=False,
                className="modal-maqi-map",
            ),
            html.Div(
                [
                    dmc.Button(
                        html.I(className="bi bi-caret-right"), id="drawer-demo-button"
                    ),
                    dmc.Drawer(
                        title=html.H3("Settings"),
                        id="drawer-simple",
                        size="25%",
                        padding="md",
                        zIndex=10000,
                        children=[
                            html.Div(
                                [
                                    html.H5("Map settings"),
                                    html.P("Variable :", style={"padding-top": "2%"}),
                                    dcc.Dropdown(
                                        ["Concentrations", "Number of overshoots"],
                                        "Concentrations",
                                        id="variable-dropdown",
                                        placeholder="Choose variable",
                                        optionHeight=50,
                                    ),
                                    html.P("Date range :", style={"padding-top": "2%"}),
                                    dcc.DatePickerRange(
                                        id="my-date-picker-range",
                                        min_date_allowed=state.get("min_date"),
                                        max_date_allowed=state.get("max_date"),
                                        initial_visible_month=state.get("start_date"),
                                        start_date=state.get("start_date"),
                                        end_date=state.get("end_date"),
                                        display_format="YYYY/MM/DD",
                                    ),
                                ],
                                id="map-settings",
                            ),
                            html.Div(
                                [
                                    html.H5("Time series settings"),
                                    html.P(
                                        "Aggregation :", style={"padding-top": "2%"}
                                    ),
                                    dcc.Dropdown(
                                        [item for item in agregation_types.keys()],
                                        ts_store.get("agregation"),
                                        id="agregation-dropdown",
                                        clearable=False,
                                        placeholder="Select Aggregation",
                                    ),
                                ],
                                id="ts-settings",
                                style={"padding-top": "10%"},
                            ),
                            html.Div(
                                [
                                    html.H5("Air Quality Standard"),
                                    html.P(
                                        "Standard :", style={"padding-top": "2%"}
                                    ),
                                    dcc.Dropdown(
                                        options=[
                                            {
                                                "value": standard_id,
                                                "label": standards_catalogue[
                                                    standard_id
                                                ].standard_name,
                                            }
                                            for standard_id in standards_catalogue
                                        ],
                                        value = ts_store.get("standard"),
                                        id="standard-dropdown",
                                        clearable=False,
                                        placeholder="Select Standard",
                                    ),
                                ],
                                id="standard-settings",
                                style={"padding-top": "10%"},
                            ),
                            html.Div(
                                [
                                    html.H5("Zone selection"),
                                    html.P(
                                        "Neighborhood :", style={"padding-top": "2%"}
                                    ),
                                    dcc.Dropdown(
                                        [n for n in neighborhood_list],
                                        None,
                                        id="neighborhood-dropdown",
                                        clearable=True,
                                        placeholder="Select neighborhood",
                                        optionHeight=50,
                                    ),
                                ],
                                style={"padding-top": "10%"},
                            ),
                            dbc.Button(
                                "Validate settings",
                                id="settings-ok-btn",
                                className="btn-style",
                            ),
                        ],
                    ),
                ]
            ),
            dbc.Row(
                children=[
                    dbc.Col(
                        [
                            html.Div(
                                children=[
                                    html.Div(
                                        [
                                            full_screen_btn,
                                            settings_btn,
                                            html.Div(
                                                children=[
                                                    dmc.LoadingOverlay(
                                                        dcc.Graph(
                                                            id={
                                                                "type": "graph",
                                                                "id": "maqi-map",
                                                            },
                                                            className="graph maqi_graph",
                                                            figure=maqi_map,
                                                            config=map_config,
                                                            style={"height": "100%"},
                                                        ),
                                                        loaderProps={
                                                            "color": "#79B895"
                                                        },
                                                        overlayColor="#2b2b2b",
                                                        style={"height": "100%"},
                                                    )
                                                ],
                                                style={"height": "92%"},
                                            ),
                                            html.Div(
                                                create_maqi_map_download_row(state),
                                                style={"height": "6%"},
                                            ),
                                        ],
                                        id="maqi-map-div",
                                        style={
                                            "height": "80%",
                                            "overflowY": "auto",
                                            "overflowX": "hidden",
                                            "padding-top": "2%",
                                        },
                                    ),
                                    html.Hr(),
                                    html.Div(parameters_row, style={"height": "11%"}),
                                ],
                                className="graph-col-div background-and-border",
                                style={"height": "100%"},
                            )
                        ],
                        md=5,
                        xs=12,
                        className="col-level-1",
                    ),
                    dbc.Col(
                        children=[
                            dbc.Row(
                                [
                                    html.Div(
                                        [
                                            # [
                                            # html.Div(
                                            dbc.Row(
                                                [
                                                    dbc.Col(
                                                        children=[
                                                            html.Div(
                                                                dmc.LoadingOverlay(
                                                                    html.Div(
                                                                        dcc.Graph(
                                                                            figure=maqi_ts,
                                                                            id="maqi-ts-graph",
                                                                            style={
                                                                                "height": "100%"
                                                                            },
                                                                            config=graph_config,
                                                                        ),
                                                                        style={
                                                                            "height": "100%"
                                                                        },
                                                                    ),
                                                                    loaderProps={
                                                                        "color": "#79B895"
                                                                    },
                                                                    overlayColor="#2b2b2b",
                                                                    style={
                                                                        "height": "100%"
                                                                    },
                                                                ),
                                                                id="maqi-ts-graph-div",
                                                                style={"height": "90%"},
                                                            ),
                                                            html.Div(
                                                                create_download_button(
                                                                    "maqi-ts",
                                                                ),
                                                                style={"height": "10%"},
                                                            ),
                                                        ],
                                                        md=9,
                                                        style={"height": "100%"},
                                                    ),
                                                    dbc.Col(
                                                        [
                                                            html.H5("Scenarios"),
                                                            html.P(
                                                                [
                                                                    "Scenarios provide a glimpse into what ",
                                                                    html.Strong(
                                                                        "air quality",
                                                                        style={
                                                                            "color": "#beab94"
                                                                        },
                                                                    ),
                                                                    " would look like if ",
                                                                    html.Strong(
                                                                        "measures ",
                                                                        style={
                                                                            "color": "#beab94"
                                                                        },
                                                                    ),
                                                                    "such as car bans or pedestrianization of a neighborhood were implemented.",
                                                                ]
                                                            ),
                                                            html.Hr(),
                                                            html.Div(
                                                                [
                                                                    html.Strong(
                                                                        "Road Traffic Scenario"
                                                                    ),
                                                                    dcc.Dropdown(
                                                                        options=[
                                                                            "0%",
                                                                            "50%",
                                                                            "150%",
                                                                            "200%",
                                                                        ],
                                                                        value=None,
                                                                        multi=True,
                                                                        id="scenario-road-traffic-dropdown",
                                                                    ),
                                                                ]
                                                            ),
                                                        ],
                                                        md=3,
                                                        style={
                                                            "height": "100%",
                                                            "padding": "2%",
                                                            "padding-left": "0.5%",
                                                        },
                                                    ),
                                                ],
                                                style={"height": "100%"},
                                            ),
                                        ],
                                        # className="background-and-border",
                                        #     ),
                                        # ],
                                        className="background-and-border",
                                        id="maqi_ts_col_div",
                                        style={
                                            "height": "100%",
                                            "overflowY": "auto",
                                            "overflowX": "hidden",
                                        },
                                    ),
                                ],
                                className="row-level-2",
                                style={
                                    "height": "60%",
                                },
                            ),
                            dbc.Row(
                                [
                                    html.Div(
                                        create_zone_stats(
                                            ts_store,
                                            nb_depassement,
                                            nb_jours,
                                            average_pollution,
                                            worst_day,
                                            worst_pollution,
                                        ),
                                        className="background-and-border",
                                        style={
                                            "height": "100%",
                                            "overflowY": "auto",
                                            "overflowX": "hidden",
                                        },
                                        id="statistics-div",
                                    )
                                ],
                                className="row-level-2",
                                style={"height": "38.5%"},
                            ),
                        ],
                        md=7,
                        xs=12,
                        className="col-level-1",
                    ),
                ],
                justify="between",
                className="row-level-1 graph-row",
                style={"height": "100%"},
            ),
        ],
        id="total-div",
        style={"height": "86vh", "overflowY": "hidden", "overflowX": "hidden"},
    )


def create_zone_stats(
    state, nb_depassement, nb_jours, average_pollution, worst_day, worst_pollution
):
    shap_df = get_values_df_from_state(shap_values, state)
    input_df = get_values_df_from_state(toulouse_df, state)

    if shap_df is not None:
        anti_pollution_vars = [
            var for var, val in zip(shap_df[:3].index, shap_df[:3]) if val < 0
        ]
        anti_pollution_situations = []
        for variable in anti_pollution_vars:
            value = input_df[variable]
            situation = categorize_value(variable, value)
            anti_pollution_situations.append(situation)

        pro_pollution_vars = [
            var for var, val in zip(shap_df[-3:].index, shap_df[-3:]) if val > 0
        ]
        pro_pollution_vars.reverse()
        pro_pollution_situations = []
        for variable in pro_pollution_vars:
            value = input_df[variable]
            situation = categorize_value(variable, value)
            pro_pollution_situations.append(situation)

        explainability_fig = plot_shap_values(shap_df)
        tooltip_explainability = html.Div(
            [
                html.P(
                    [
                        "Influences are the result of a ",
                        html.Strong("shap analysis", style={"color": "#beab94"}),
                        " of Murmuration's super-resolution model.",
                    ]
                ),
                dcc.Graph(figure=explainability_fig, style={"width": "100%"}),
            ]
        )
        pro_pollution_cols = [
            dbc.Col(
                [
                    html.I(
                        className=icons[val],
                        id=f"item-pro-{' '.join(val)}",
                    ),
                    html.P(
                        val,
                    ),
                    html.P(
                        situation,
                    ),
                    # dbc.Tooltip(
                    #     val,
                    #     target=f"item-pro-{' '.join(val)}",
                    # ),
                ],
                className="item-col-pro-pollution",
            )
            for val, situation in zip(pro_pollution_vars, pro_pollution_situations)
        ]
        anti_pollution_cols = [
            dbc.Col(
                [
                    html.I(
                        className=icons[val],
                        id=f"item-anti-{' '.join(val)}",
                    ),
                    html.P(
                        val,
                    ),
                    html.P(
                        situation,
                    ),
                    # dbc.Tooltip(
                    #     val,
                    #     target=f"item-anti-{' '.join(val)}",
                    # ),
                ],
                className="item-col-anti-pollution",
            )
            for val, situation in zip(anti_pollution_vars, anti_pollution_situations)
        ]
    else:
        anti_pollution_vars = None
        pro_pollution_vars = None
        explainability_fig = None
        tooltip_explainability = html.Div(
            "Explainability on influences are not available for neighborhoods."
        )
        pro_pollution_cols = html.P("No data available for this zone.")
        anti_pollution_cols = html.P("No data available for this zone.")

    print("Anti pollution ", anti_pollution_vars)
    print("Pro pollution ", pro_pollution_vars)

    return [
        dbc.Row(
            [
                html.P(
                    [f"Zone: ", html.Strong(f"{state.get('zone').get('name')}")],
                    style={"text-align": "center", "margin-bottom": "0"},
                ),
                html.P(
                    [
                        f"Time range: ",
                        html.Strong(
                            f"{state.get('start_date')} to {state.get('end_date')}"
                        ),
                    ],
                    style={"text-align": "center"},
                ),
            ],
            style={"padding": "0.8vw"},
        ),
        dbc.Row(
            [
                dbc.Col(
                    [
                        html.H3(
                            children=f"{average_pollution} µg/m3",
                            style={"text-align": "center", "color": "#31c1bc"},
                        ),
                        html.P(
                            "Average NO2",
                            style={"text-align": "center", "color": "#31c1bc"},
                        ),
                    ],
                    md=3,
                ),
                dbc.Col(
                    [
                        html.H3(
                            children=f"{nb_depassement} / {nb_jours}",
                            style={"text-align": "center", "color": "#ff7f11"},
                        ),
                        html.P(
                            "Days of overshoot",
                            style={"text-align": "center", "color": "#ff7f11"},
                        ),
                    ],
                    md=3,
                ),
                dbc.Col(
                    [
                        html.H3(
                            children=f"{worst_day} : {worst_pollution} µg/m3",
                            style={"text-align": "center", "color": "#e00d3a"},
                        ),
                        html.P(
                            "Worst concentration day",
                            style={"text-align": "center", "color": "#e00d3a"},
                        ),
                    ],
                    width="auto",
                ),
            ],
            justify="center",
        ),
        dbc.Row(
            [
                dbc.Col(
                    [
                        html.I(className="bi bi-info", id="explainability-info"),
                        dbc.Tooltip(
                            tooltip_explainability,
                            style={"width": "20vw"},
                            target="explainability-info",
                        ),
                    ],
                    md=1,
                ),
                dbc.Col(
                    [
                        dbc.Row(
                            [
                                dbc.Col(
                                    html.Center(
                                        [
                                            html.H5(
                                                "Pro-pollution influences",
                                                id="title-pro-pollution",
                                            ),
                                            dbc.Row(pro_pollution_cols),
                                        ],
                                        id="center-pro-pollution",
                                    ),
                                    className="col-influences-pollution",
                                    md=6,
                                ),
                                dbc.Col(
                                    html.Center(
                                        [
                                            html.H5(
                                                "Anti-pollution influences",
                                                id="title-anti-pollution",
                                            ),
                                            dbc.Row(anti_pollution_cols),
                                        ],
                                        id="center-anti-pollution",
                                    ),
                                    className="col-influences-pollution",
                                    md=6,
                                ),
                            ],
                            id="row-influences",
                            justify="center",
                            style={"padding": "0.8vw"},
                        ),
                    ],
                    md=11,
                ),
            ]
        ),
    ]


def create_download_button(btn_id, format="csv"):
    return html.Div(
        [
            html.Center(
                [
                    html.Button(
                        [
                            html.I(className="bi bi-download"),
                            f" {format}",
                        ],
                        id=f"btn-download-{btn_id}-{format}",
                        className="button-download btn-style",
                    )
                ]
            ),
            dcc.Download(id=f"download-{btn_id}-{format}"),
        ],
        id=f"download-{btn_id}-{format}-div",
        style={"height": "100%"},
    )


def create_maqi_map_download_row(state):
    return dbc.Row(
        [
            dbc.Col(
                [
                    create_download_button(
                        "maqi-map",
                    ),
                ],
                width=2,
                style={"height": "100%"},
            ),
            dbc.Col(
                [
                    create_download_button(
                        "maqi-map",
                        "tiff",
                    ),
                ],
                width=2,
                style={"height": "100%"},
            ),
        ],
        justify="center",
        style={"height": "100%"},
    )


parameters_row = dbc.Row(
    children=[
        dbc.Col(
            html.Div(
                children=[
                    html.Center(
                        "Opacity",
                        id="opacity-slider-description",
                        className="parameter-description",
                    ),
                    dcc.Slider(
                        0,
                        1,
                        0.1,
                        value=1,
                        id="opacity-slider",
                        marks=None,
                        tooltip={"placement": "bottom", "always_visible": True},
                    ),
                    html.Div(id="output-opacity"),
                ],
                className="parameter-div",
            ),
            id="opacity-slider-col",
            className="parameter-col",
            width=4,
        ),
        dbc.Col(
            html.Div(
                children=[
                    html.Center(
                        "Color max",
                        id="cmax-description",
                        className="parameter-description",
                    ),
                    html.Center(
                        daq.NumericInput(
                            value=cmax,
                            size=100,
                            min=0,
                            max=365,
                            id="cmax-input",
                            theme="dark",
                        )
                    ),
                ],
                className="parameter-div",
            ),
            className="parameter-col",
            width=4,
        ),
        dbc.Col(
            html.Div(
                children=[
                    html.Center(
                        "Map style",
                        id="mapbox-dropdown-description",
                        className="parameter-description",
                    ),
                    dcc.Dropdown(
                        ["dark", "light", "open-street-map", "satellite"],
                        "dark",
                        className="dropup",
                        id="mapbox-dropdown",
                        optionHeight=40,
                        placeholder="Choose mapbox",
                    ),
                ],
                className="parameter-div",
            ),
            id="mapbox-dropdown-col",
            className="parameter-col",
            width=4,
        ),
    ],
    id="parameters-row",
    justify="center",
    style={"height": "100%"},
)

full_screen_btn = html.Div(
    [
        dbc.Button(
            [html.I(className="bi bi-fullscreen")],
            id="btn_modal_open",
            className="btn-style btn-fullscreen",
            n_clicks=0,
        ),
        dbc.Tooltip(
            f"Full Screen",
            target=f"btn_modal_open",
            placement="top",
        ),
    ]
)

settings_btn = html.Div(
    [
        dbc.Button(
            [html.I(className="bi bi-gear")],
            id="btn_settings",
            className="btn-style btn-settings",
            n_clicks=0,
        ),
        dbc.Tooltip(
            f"Settings",
            target=f"btn_settings",
            placement="top",
        ),
    ]
)


def create_date_picker_row(state):
    the_row = dbc.Row(
        [
            dbc.Col(
                [
                    # html.Center(html.Strong("Date Range :")),
                    html.Center(
                        [
                            dcc.DatePickerRange(
                                id="my-date-picker-range",
                                min_date_allowed=state.get("min_date"),
                                max_date_allowed=state.get("max_date"),
                                initial_visible_month=state.get("start_date"),
                                start_date=state.get("start_date"),
                                end_date=state.get("end_date"),
                            ),
                            dbc.Button("OK", id="date-ok-btn", className="btn-style"),
                        ],
                    ),
                ],
                width=7,
            ),
        ],
        justify="center",
        style={"height": "10%", "padding": "0.5vw 0"},
    )
    return the_row
    # return html.Center(
    #     [
    #         dcc.DatePickerRange(
    #             id="my-date-picker-range",
    #             min_date_allowed=state.get("min_date"),
    #             max_date_allowed=state.get("max_date"),
    #             initial_visible_month=state.get("start_date"),
    #             start_date=state.get("start_date"),
    #             end_date=state.get("end_date"),
    #         ),
    #         dbc.Button("OK", id="date-ok-btn", className="btn-style"),
    #     ],
    #     style={"height": "10%"},
    # )
