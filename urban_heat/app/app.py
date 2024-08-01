import os

import callbacks
import dash
import dash_bootstrap_components as dbc
from dash import dcc, html
from flask import Flask
from global_vars import state_data
from layout import serve_layout

ENV = os.getenv("ENV", default="dev")

if ENV == "dev":
    url = "/dev/urban-square/urban-heat/toulouse/"
else:
    url = "/urban-square/urban-heat/toulouse/"

try:
    # Monitoring
    from prometheus_client import Enum, start_http_server

    start_http_server(int(os.getenv("METRICS_PORT")))

    # create a prometheus metric
    app_status = Enum(
        f"{ENV}_urban_square_heat_status",
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
        "assets/styles/murmuration.css",
    ],
    url_base_pathname=url,
    suppress_callback_exceptions=True,
)

app.title = "Urban Heat in Toulouse"
server = app.server


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
    [serve_layout(), dcc.Store(id="main-store", data=state_data)],
)


if __name__ == "__main__":
    app.run_server(debug=True)
