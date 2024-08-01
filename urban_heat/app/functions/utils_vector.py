# import geopandas as gpd
import pandas as pd
import geopandas as gpd
from shapely.geometry import Polygon
import pyproj

def gdf_to_bbox(gdf):
    # Get the bounds of the GeoDataFrame
    bounds = gdf.total_bounds
    crs = gdf.crs
    # Create a Polygon from the bounding box
    bbox = Polygon([(bounds[0], bounds[1]), (bounds[0], bounds[3]), 
                    (bounds[2], bounds[3]), (bounds[2], bounds[1])])
    
    # Convert the Polygon to a GeoDataFrame
    bbox_gdf = gpd.GeoDataFrame(gpd.GeoSeries(bbox), columns=['geometry'])
    bbox_gdf = bbox_gdf.set_crs(crs)
    return bbox_gdf

import pyproj
from pyproj import CRS

def create_bbox_from_point(lat, lon, radius_meters):
    """
    Create a bounding box (in EPSG:4326) based on a point and a distance.
    
    Parameters:
        lat (float): Latitude of the point.
        lon (float): Longitude of the point.
        radius_meters (float): Distance from the point in meters.
        
    Returns:
        list: Bounding box [lat_min, lon_min, lat_max, lon_max] in EPSG:4326.
    """
    
    # Create Transformer object for CRS transformation
    transformer_4326_3857 = pyproj.Transformer.from_crs("epsg:4326", "epsg:3857", always_xy=True)
    transformer_3857_4326 = pyproj.Transformer.from_crs("epsg:3857", "epsg:4326", always_xy=True)

    # Convert point to projected CRS (EPSG:3857)
    x, y = transformer_4326_3857.transform(lon, lat)

    # Calculate the bounding box coordinates in the projected CRS
    x_min = x - radius_meters
    y_min = y - radius_meters
    x_max = x + radius_meters
    y_max = y + radius_meters

    # Convert the bounding box back to the geographic CRS (EPSG:4326)
    lon_min, lat_min = transformer_3857_4326.transform(x_min, y_min)
    lon_max, lat_max = transformer_3857_4326.transform(x_max, y_max)

    return [lat_min, lon_min, lat_max, lon_max]


def bbox_to_gdf(bbox, crs='EPSG:4326'):
    """
    Convert a bounding box to a GeoDataFrame.
    
    Parameters:
    - bbox (list or tuple): The bounding box specified as [xmin, ymin, xmax, ymax].
    - crs (str): The coordinate reference system to set for the resulting GeoDataFrame.
    
    Returns:
    - GeoDataFrame: A GeoDataFrame containing the geometry of the bounding box.
    """
    xmin, ymin, xmax, ymax = bbox
    polygon_geom = Polygon([(xmin, ymin), (xmin, ymax), (xmax, ymax), (xmax, ymin), (xmin, ymin)])
    gdf = gpd.GeoDataFrame(index=[0], geometry=[polygon_geom], crs=crs)
    return gdf

