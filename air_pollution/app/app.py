import os

import callbacks
import dash
import dash_bootstrap_components as dbc
from dash import dcc, html
from dash.dependencies import ClientsideFunction, Input, Output, State
from flask import Flask
from flask_caching import Cache
from global_vars import state_data, ts_data
from layout import serve_layout

ENV = os.getenv("ENV", default="dev")

if ENV == "dev":
    url = "/dev/urban-square/air-quality/toulouse/"
else:
    url = "/urban-square/air-quality/toulouse/"

try:
    # Monitoring
    from prometheus_client import Enum, start_http_server

    start_http_server(int(os.getenv("METRICS_PORT")))

    # create a prometheus metric
    app_status = Enum(
        f"{ENV}_urban_square_air_status",
        "Status of the dash server",
        states=["starting", "running", "stopped"],
    )
except:
    pass

app = dash.Dash(
    __name__,
    server=Flask("Murmuration"),
    external_stylesheets=[
        dbc.themes.BOOTSTRAP,
        dbc.icons.BOOTSTRAP,
        "assets/styles/style.css",
        "assets/styles/calendar.css",
    ],
    # Add js methods
    external_scripts=["assets/js/clientside.callback.js"],
    url_base_pathname=url,
    suppress_callback_exceptions=True,
)

app.title = "Air Quality Toulouse"
server = app.server

app.clientside_callback(
    ClientsideFunction(namespace="clientside", function_name="toggle_modal"),
    Output("modal_plt_1", "is_open"),
    Input("btn_modal_open", "n_clicks"),
    State("modal_plt_1", "is_open"),
)

app.index_string = """
    <!DOCTYPE html>
    <html>
        <head>
            {%metas%}
            <script
                src='https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js'>
            </script>
            <link
                href='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css'
            >
            <script
                src='https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.bundle.min.js'>
            </script>
            <link rel="stylesheet"
                href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css'
            >
            <title>{%title%}</title>
            {%favicon%}
            {%css%}
        </head>
        <body>
            <div id="app_container">
                <div id="content-wrap">
                    <!-- all other page content -->
                    {%app_entry%}
                </div>
                <footer class="page-footer footer-copyright">
                    {%config%}
                    {%scripts%}
                    {%renderer%}
                </footer>
            </div>
        </body>
    </html>
"""

app.layout = html.Div(
    [
        # dash.page_container,
        serve_layout(state_data, ts_data),
        dcc.Store(
            id="main-store",
            storage_type="session",
            data=state_data,
        ),
        dcc.Store(
            id="data-store",
            storage_type="session",
            data={
                "maqi_ts_dict": {},
                "maqi_map_dict": {},
            },
        ),
        dcc.Store(
            id="ts-store",
            storage_type="session",
            data=ts_data,
        ),
    ],
)


if __name__ == "__main__":
    app.run_server(debug=True, port=8001)
