import pandas as pd
import plotly.express as px
from datacuber.plots import plot_hexbin_map, plot_multicolor_line
from global_vars import IndicatorThreshold, colors, gdf, logo


def apply_basic_layout(fig):
    # Layout to apply to all plots: transparent background, white font color etc.
    fig = fig.update_layout(
        plot_bgcolor="rgba(43, 43, 43, 0)",
        paper_bgcolor="rgba(43, 43, 43, 0)",
        yaxis_gridcolor="rgba(0, 0, 0, 0.17)",
        xaxis_gridcolor="rgba(0, 0, 0, 0)",
        xaxis_showline=False,
        font_color="#e5e6ec",
        autosize=True,
    )
    # Don't show the zeroline
    fig.update_yaxes(zeroline=False)
    return fig


def create_pollutant_plot(
    df:pd.DataFrame,
    city_name:str,
    pollutant_name:str="no2_prediction",
    thresholds:list[IndicatorThreshold]=[]
):
    print("CREATE POLLUTANT PLOT")

    # Pollutant line plot
    # fig = px.line(df, x=df["time"], y=df[pollutant_name])
    # fig.update_traces(line_color="#acaeb5", line_width=2)

    fig = plot_multicolor_line(
        df.dropna(),
        x_name="time",
        y_name=pollutant_name,
        z_name=pollutant_name,
        zmin=0,
        zmax=50,
    )
    fig.update_traces(hovertemplate=None)

    # Add threshold hlines
    for threshold in thresholds:
        fig.add_hline(
            y=threshold.value,
            line_color=threshold.color,
            opacity=0.9,
            annotation_text=threshold.name,
            annotation_position="bottom left",
            annotation_font_color=threshold.color,
        )

    # Add title etc.
    fig.update_layout(
        title=f"<b>NO<sub>2</sub> Concentrations</b><br><i>{city_name}</i>",
        title_x=0.48,
        title_y=0.93,
        bargap=0.0,
        bargroupgap=0,
        plot_bgcolor="rgba(0,0,0,0)",
        yaxis_gridcolor="rgba(0, 0, 0, 0.17)",
        xaxis_gridcolor="rgba(0, 0, 0, 0)",
        xaxis_showline=False,
        font_color="#191a1a",
        legend=dict(title=None, x=0.2, orientation="h"),
        margin=dict(l=80, r=20, t=60, b=20),
        title_font_size=14,
    )
    fig = apply_basic_layout(fig)

    # Add murmuration logo
    fig.add_layout_image(
        dict(
            source=logo,
            xref="paper",
            yref="paper",
            x=0.97,
            y=0.93,
            sizex=0.15,
            sizey=0.15,
            xanchor="right",
            yanchor="bottom",
        )
    )

    # Don't show xaxis legend ("Time")
    fig.update_xaxes(title=None)
    # Add title to yaxis and set range
    fig.update_yaxes(title="NO<sub>2</sub> (µg.m<sup>-3</sup>)")
    print("Plot plotted !")
    return fig


def create_pollutant_map(
    state,
    df,
    variable="no2_prediction",
    var_type="Concentrations",
    opacity=0.9,
    mapbox_style="dark",
):
    print("CREATE POLLUTANT MAP")
    df = df.dropna()

    legend_title = "NO<sub>2</sub> (µg/m3)"
    title = f"<b>NO<sub>2</sub> concentrations</b><br><i>{state.get('start_date')} to {state.get('end_date')}</i>"
    if var_type == "Number of overshoots":
        legend_title = "Number of overshoots"
        title = f"<b>Number of days above WHO threshold</b><br><i>{state.get('start_date')} to {state.get('end_date')}</i>"

    # Plot hexbin map
    maqi_map = plot_hexbin_map(
        df,
        variable,
        legend_title,
        title_x=0.5,
        title_y=0.97,
        unit="",
        center_lon=(df["longitude"].min() + df["longitude"].max()) / 2,
        center_lat=(df["latitude"].min() + df["latitude"].max()) / 2,
        zoom=state.get("zoom"),
        geodf=gdf,
        font_color="#e5e6ec",
        nb_hexagon=state.get("nb_hex"),
        cmin=0,
        cmax=state.get("cmax"),
        opacity=opacity,
        title=title,
        geodf_color="rgba(25, 26, 26, 0.8)",
    )

    # Add murmuration logo
    maqi_map.add_layout_image(
        dict(
            source=logo,
            xref="paper",
            yref="paper",
            x=0.97,
            y=0.88,
            sizex=0.12,
            sizey=0.12,
            xanchor="right",
            yanchor="bottom",
        )
    )
    # Choose color scale
    maqi_map["layout"]["coloraxis"]["colorscale"] = colors

    # Choose mapbox style
    maqi_map["layout"]["mapbox"]["style"] = mapbox_style

    # Remove margins
    maqi_map.update_layout(
        margin=dict(l=10, r=20, t=40, b=10),
        title_font_size=14,
    )

    # When hex is clicked, non selected hexagons' opacity is turned down
    maqi_map.update_traces(
        selected_marker_opacity=1, unselected_marker_opacity=0.4
    ).update_layout(clickmode="event+select")
    maqi_map = apply_basic_layout(maqi_map)
    return maqi_map


def plot_shap_values(df):
    df = pd.DataFrame(df)
    col_name = df.columns[0]
    df["sign"] = [1 if val > 0 else 0 for val in df[col_name].values]
    df = df.rename(columns={col_name: "influence"})

    fig = px.bar(
        df,
        orientation="h",
        color="sign",
        # color_continuous_scale=[[0, "#1E88E5"], [1, "#FF0D57"]],
        color_continuous_scale=[[0, "#31c1bc"], [1, "rgb(224, 13, 58)"]],
    )
    fig.update_yaxes(title=None, zeroline=False)
    fig.update_xaxes(title="Influence", zeroline=False)
    fig.update_layout(
        barcornerradius=5,
        showlegend=False,
        coloraxis_showscale=False,
        margin=dict(r=0, t=10, b=10),
    )
    fig = apply_basic_layout(fig)
    return fig
