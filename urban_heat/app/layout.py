import dash_bootstrap_components as dbc
import dash_daq as daq
import dash_mantine_components as dmc
from dash import dcc, html
from global_vars import (
    shapefile_name_col,
    toulouse_shp,
    uh_season_100m_ds,
    uh_season_ds,
    uh_stats,
    variable_dict,
)
from plots import plot_bar_temp, plot_uh_map, plot_uh_ts

# LISTS OF VARIABLES, NEIGHBORHOODS, SEASONS
season_list = list(uh_season_ds.season.values)
neighborhood_list = sorted(toulouse_shp[shapefile_name_col].unique())
variable_list = list(uh_season_ds)

# UH MAP
season_id = 0
season = season_list[season_id]
uh_ds_base = uh_season_ds.sel(season=season)[["uh_wavg"]]
uh_df = uh_ds_base.to_dataframe().reset_index()
uh_map = plot_uh_map(uh_df)

# UH TIME SERIES
uh_ts = plot_uh_ts(uh_season_100m_ds.mean(["latitude", "longitude"]))

# STATISTICS GRAPH
df = uh_stats.loc[uh_stats["season_year"] == season]
df = df.loc[df["type_uh"] == "uh_wavg"]
df["name"] = [
    str(int(cla)) + " - " + str(round(temp, 2)) + "°C"
    for cla, temp in zip(df.temperature_class.tolist(), df["mean"].tolist())
]
statistics_graph = plot_bar_temp(df)

# CREATE NAVBAR
navbar = dbc.Row(
    children=[
        dbc.Col(
            [
                html.H3("Urban Heat in Toulouse"),
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

# CREATE FOOTER
footer = html.Footer(
    [
        html.Div(
            [
                "© 2023 Copyright: ",
                html.A("Murmuration", href="https://murmuration-sas.com/en/homepage"),
            ],
            className="text-center",
        )
    ],
    style={"width": "100vw", "height": "5vh"},
)


# LAYOUT
def serve_layout():
    maqi_div = create_dash_div()

    # Return navbar, content and footer
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


# CREATE CONTENT
def create_dash_div():
    return html.Div(
        children=[
            dbc.Row(
                children=[
                    dbc.Col(
                        html.Div(
                            # dbc.Row(
                            #     [
                            #         dbc.Col(
                            #             dcc.Loading(
                            #                 dcc.Graph(
                            #                     figure=uh_map,
                            #                     style={"height": "100%"},
                            #                     id="uh_map1",
                            #                 ),
                            #                 color="#beab94",
                            #             ),
                            #             id="col-uh-map1",
                            #             style={"width": "100%"},
                            #         ),
                            #         dbc.Col(
                            #             dcc.Loading(
                            #                 dcc.Graph(id="uh_map2"), color="#beab94"
                            #             ),
                            #             style={"width": "0%"},
                            #         ),
                            #     ],
                            #     style={"overflowX": "hidden"},
                            #     className="background-and-border",
                            # ),
                            dmc.LoadingOverlay(
                                html.Div(
                                    dcc.Graph(
                                        figure=uh_map,
                                        id="uh-map1",
                                        style={"height": "100%"},
                                    ),
                                    id="uh-map-div",
                                    className="delay",
                                    style={"height": "100%", "overflowX": "hidden"},
                                ),
                                style={"height": "100%", "width": "100%"},
                                loaderProps={"color": "#79B895"},
                                overlayColor="#2b2b2b",
                                id="uh-map-div-loading",
                            ),
                            className="background-and-border",
                            style={"overflowY": "auto"},
                        ),
                        className="col-level-1",
                        md=8,
                    ),
                    dbc.Col(
                        [
                            html.Div(
                                [
                                    html.Div(
                                        [
                                            html.H6("Variable"),
                                            dcc.Dropdown(
                                                [
                                                    variable_dict.get(var).get("name")
                                                    for var in variable_list
                                                ],
                                                value="LST Classified",
                                                id="dropdown-variable",
                                            ),
                                        ],
                                        className="div-selection",
                                        style={"height": "20%"},
                                    ),
                                    # html.Div(
                                    #     [
                                    #         html.H6("Source"),
                                    #         dcc.Dropdown(
                                    #             [
                                    #                 "Model",
                                    #                 "Landsat",
                                    #                 "Climate Projections",
                                    #             ],
                                    #             value="Model",
                                    #             id="dropdown-source",
                                    #         ),
                                    #     ],
                                    #     className="div-selection",
                                    #     style={"height": "20%"},
                                    # ),
                                    html.Div(
                                        [
                                            dbc.Row(
                                                [
                                                    dbc.Col(
                                                        [
                                                            html.H6("Neighborhood"),
                                                            dcc.Dropdown(
                                                                neighborhood_list,
                                                                value=None,
                                                                id="dropdown-neighborhood1",
                                                                optionHeight=70,
                                                            ),
                                                        ],
                                                        className="col-params",
                                                    ),
                                                    dbc.Col(
                                                        [
                                                            html.H6(
                                                                "(Opt: Neigh. for comparison)"
                                                            ),
                                                            dcc.Dropdown(
                                                                neighborhood_list,
                                                                value=None,
                                                                id="dropdown-neighborhood2",
                                                                optionHeight=70,
                                                            ),
                                                        ],
                                                        className="col-optional col-params",
                                                    ),
                                                ],
                                                className="row-params",
                                            )
                                        ],
                                        className="div-selection",
                                        style={"height": "20%"},
                                    ),
                                    html.Div(
                                        [
                                            dbc.Row(
                                                [
                                                    dbc.Col(
                                                        [
                                                            html.H6("Season"),
                                                            dcc.Dropdown(
                                                                season_list,
                                                                value=season_list[
                                                                    season_id
                                                                ],
                                                                id="dropdown-season1",
                                                            ),
                                                            html.Div(
                                                                id="season1-info-div",
                                                                style={
                                                                    "overflowY": "auto"
                                                                },
                                                            ),
                                                        ],
                                                        className="col-params",
                                                    ),
                                                    dbc.Col(
                                                        [
                                                            html.H6(
                                                                "(Opt: Season for comparison)"
                                                            ),
                                                            dcc.Dropdown(
                                                                season_list,
                                                                value=None,
                                                                id="dropdown-season2",
                                                            ),
                                                            html.Div(
                                                                id="season2-info-div",
                                                                style={
                                                                    "overflowY": "auto"
                                                                },
                                                            ),
                                                        ],
                                                        className="col-optional col-params",
                                                    ),
                                                ],
                                                className="row-params",
                                            )
                                        ],
                                        className="div-selection",
                                        style={"height": "35%"},
                                    ),
                                    html.Div(
                                        html.Center(
                                            dbc.Button(
                                                ["Validate"],
                                                id="param-validate-btn",
                                                className="btn-style",
                                            ),
                                        ),
                                        className="div-selection",
                                        style={"height": "10%"},
                                    ),
                                ],
                                className="background-and-border",
                            ),
                        ],
                        className="col-level-1",
                        md=4,
                    ),
                ],
                className="row-level-1",
                style={"height": "55%"},
            ),
            dbc.Row(
                [
                    dbc.Col(
                        html.Div(
                            dmc.LoadingOverlay(
                                html.Div(
                                    dcc.Graph(
                                        figure=uh_ts,
                                        id="uh-ts",
                                        style={"height": "100%"},
                                    ),
                                    id="uh-ts-div",
                                    style={"height": "100%"},
                                ),
                                style={"height": "100%", "width": "100%"},
                                loaderProps={"color": "#79B895"},
                                overlayColor="#2b2b2b",
                                id="uh-ts-div-loading",
                            ),
                            className="background-and-border",
                            style={"overflowY": "auto"},
                        ),
                        md=8,
                        className="col-level-1",
                    ),
                    dbc.Col(
                        html.Div(
                            dmc.LoadingOverlay(
                                html.Div(
                                    [
                                        html.H5(
                                            f"Statistics: {' '.join(season_list[season_id].split('_'))}",
                                            style={
                                                "height": "10%",
                                                "font-size": "2vh",
                                            },
                                            className="div-selection",
                                        ),
                                        html.Div(
                                            dcc.Graph(
                                                figure=statistics_graph,
                                                style={"height": "100%"},
                                                # config=map_config,
                                            ),
                                            style={"height": "90%"},
                                        ),
                                    ],
                                    id="statistics-div",
                                    style={"height": "100%"},
                                ),
                                style={"height": "100%", "width": "100%"},
                                loaderProps={"color": "#79B895"},
                                overlayColor="#2b2b2b",
                                id="statistics-div-loading",
                            ),
                            className="background-and-border",
                        ),
                        md=4,
                        className="col-level-1",
                    ),
                ],
                className="row-level-1",
                style={"height": "47%"},
            ),
        ],
        id="maqi-div",
        style={"height": "86vh", "overflowY": "hidden", "overflowX": "hidden"},
    )
