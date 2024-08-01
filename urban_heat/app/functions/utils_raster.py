# This script contains several functions for manipulating raster and vector data, as well as for working with geospatial data in general.
#
# Function raster_to_polygon:
#     This function converts a raster image into a GeoPandas DataFrame of polygons.
#
# Function shp_to_raster:
#     This function converts a shapefile into a raster image.
#
# Function create_img_reference:
#     This function creates an empty raster image with a specified spatial resolution and extent, based on a given bounding box.
#
# Function get_bins:
#     This function calculates the bin edges for a 2D histogram based on a given bounding box and target lat/long arrays.
#
# Function create_grid_gdf:
#     This function creates a gridded GeoPandas DataFrame based on a base DataFrame, with a specified size for the grid cells.
#
# Please look at the docstrings of each function for more details.
import xarray as xr
# import xesmf as xe
import numpy as np
import pandas as pd

import plotly.express as px
import plotly.figure_factory as ff
import pyproj
import rioxarray as rio

from shapely.geometry import mapping
import matplotlib.pyplot as plt
#import kaleido
import os
import geopandas as gpd
import rasterio

import geopandas as gpd
import numpy as np
import rasterio
from shapely.geometry import Polygon
from rioxarray.exceptions import *
from shapely.geometry import mapping
from tqdm.notebook import tqdm
import rioxarray
import numpy as np
from scipy.interpolate import griddata



import rioxarray as rio
import geopandas as gpd
from shapely.geometry import shape, Point
import rasterio
from rasterio import features




def raster_to_grid_poly_or_point(raster, geometry_type='polygon'):
    """
    Convert a raster dataset to a GeoDataFrame of polygons or points.

    This function takes a raster dataset and converts each cell into a Shapely polygon or point
    geometry, depending on the specified geometry type. It then returns a GeoDataFrame of these
    geometries with the same CRS as the input raster.

    Parameters:
    raster (rioxarray.DataArray): The input raster dataset to convert.
    geometry_type (str): The type of geometry to create from the raster. 
                         Options are 'polygon' for polygon geometries representing each cell, 
                         or 'point' for point geometries at the center of each cell. 
                         Default is 'polygon'.

    Returns:
    geopandas.GeoDataFrame: A GeoDataFrame containing the geometries created from the raster cells.

    Examples:
    >>> raster = rio.open_rasterio('path_to_raster.tif')
    >>> polygons_gdf = raster_to_grid_poly_or_point(raster, 'polygon')
    >>> points_gdf = raster_to_grid_poly_or_point(raster, 'point')
    """

    # Convert the raster data to geometries (polygons or points)
    transform = raster.rio.transform()
    
    if geometry_type == 'polygon':
        shapes = features.shapes(raster.data, transform=transform)
        geometries = [shape(geom) for geom, value in shapes if value != raster.nodata]
    elif geometry_type == 'point':
        geometries = []
        for row in range(raster.shape[1]):
            for col in range(raster.shape[2]):
                value = raster[0, row, col]
                if not raster.isnull():
                    x, y = rasterio.transform.xy(transform, row, col, offset='center')
                    geometries.append(Point(x, y))
    
    # Create a GeoDataFrame
    gdf = gpd.GeoDataFrame({'geometry': geometries})
    gdf.crs = raster.rio.crs
    return gdf



def fill_empty_pixel(data, method ='nearest' ):
    """
    Fill empty (NaN) pixels in a single-band raster dataset using defined method for interpolation.

    This function takes a single-band raster dataset, typically represented as a 2D array within an xarray DataArray, and fills in NaN values (empty pixels) using defined method for interpolation.. It's useful for handling missing data in geospatial raster datasets.

    Parameters:
        data (xarray.DataArray): A single-band xarray DataArray representing the raster dataset. It should be a 2D array, where NaN values indicate missing data.
        
    Returns:
        None: The function directly modifies the input DataArray, filling in NaN values with interpolated data.

    Note:
        The function assumes that the input DataArray is 2D and contains a single band of data. If the DataArray has more than one band, the function will only process the first band.
    """
    # Function implementation...

    # Convert the dataset to a 2D numpy array (assuming it's single-band)
    array = data.squeeze().values

    # Create grid coordinates
    x, y = np.indices(array.shape)

    # Flatten the data and coordinates
    data_flat = array.flatten()
    x_flat = x.flatten()
    y_flat = y.flatten()

    # Filter out NaN values from the data for interpolation
    mask = ~np.isnan(data_flat)
    x_valid = x_flat[mask]
    y_valid = y_flat[mask]
    data_valid = data_flat[mask]

    # Perform grid interpolation
    data_filled = griddata((x_valid, y_valid), data_valid, (x_flat, y_flat), method=method).reshape(array.shape)

    # Update the original data array with the filled data
    data.loc[dict(x=data.x, y=data.y)] = data_filled
    return data


    
    

def raster_to_polygon(raster, data_type):
    '''
    return a gdf of the input raster
    
    raster: as datarray with shape (band, x, y)
    dtype (mandatory): str 'uint8', 'uint16', 'float32' .........
    '''
    #assign dtype # Use a float nodata value
    # nodata = -9999.0
    # crs = raster.crs
    raster = raster.astype(data_type)
    raster = raster.where(raster != raster.ffill, drop=True)  #
    # raster = raster.astype(dtype = data_type)
    raster.rio.to_raster('temporary_data.tif')
    with rasterio.open('temporary_data.tif') as src:
        arr = src.read(1).astype(data_type)    
    # src = src.astype(data_type)    
    # Extract the shapes of connected regions in the numpy array
    result = (
        {
            "properties": {"value": v},
            "geometry": s,
        }
        for i, (s, v) in enumerate(rasterio.features.shapes(arr, transform=src.transform))
    )
#     raster = raster.squeeze('band')
#     result = (
#         {
#             "properties": {"value": v},
#             "geometry": s,
#         }
#         for i, (s, v) in enumerate(rasterio.features.shapes(raster.values, transform=raster.rio.transform()))
#     )
    print('creating gdf')
   
    # Create a GeoDataFrame from the extracted shapes
    gdf = gpd.GeoDataFrame.from_features(result, crs = raster.rio.crs)
    
    #Dissolve by value
    # print('dissolving gdf')
    # gdf = gdf.dissolve(by="value")
    # Simplify the polygon geometries for better visual representation
    # gdf["geometry"] = gdf.simplify(tolerance=0.01, preserve_topology=False)
    os.remove("temporary_data.tif")
    return gdf

def classify_raster(data_array, bins=[0, 50, 100, 150, 200, 255], labels=[1, 2, 3, 4, 5]):
    """
    Classifies a raster based on specified bins and labels.

    Parameters:
        data_array (xarray.DataArray): The raster data.
        bins (list): List of bin edges.
        labels (list): List of labels.

    Returns:
        xarray.DataArray: The classified raster.
    """
    classified_array = xr.full_like(data_array, fill_value=0, dtype=np.int8)

    for i in range(len(bins) - 1):
        low_bin, high_bin, label = bins[i], bins[i + 1], labels[i]
        classified_array = xr.where((data_array > low_bin) & (data_array <= high_bin), label, classified_array)

    return classified_array


def polygon_to_raster(shapefile, img_ref, fill_value=0, default_value = 1):
    '''
    returns a xarray image of the input shapefile 
    
    - shapefile: str or shapefile
            path of the shapefile
    - img_ref: str or datarray
    '''
    #open img_ref with rasterio 
#     if isinstance(img_ref, str):
#         img_ref = rasterio.open(img_ref)
#     #read file if not open yet
#     if isinstance(shapefile, str):
#         #read boundaries shapefile
#         shapefile = gpd.read_file(shapefile)

    
#     shapefile = shapefile.to_crs(epsg=3857)
    #open img_ref to get raster infos
    # Get list of geometries for all features in vector file
    shapefile = [shapes for shapes in shapefile.geometry]
    #rasterize boundaries shapefile
    rasterized = rasterio.features.rasterize(shapefile,
                                out_shape =  img_ref.squeeze('band').shape,
                                fill = fill_value,
                                out = None,
                                transform = img_ref.rio.transform(),
                                all_touched = False,
                                default_value = default_value,
                                dtype = None)
    shapefile = None
    
    # convert to xarray
    rasterized = np.expand_dims(rasterized, axis=0)
    xarr = xr.DataArray(rasterized, 
                        dims=("band", "y", "x"), 
                        coords={"x": img_ref.coords["x"], "y": img_ref.coords["y"], "band": [1]},
                        attrs={"transform": img_ref.rio.transform(), "crs": img_ref.rio.crs})
    return xarr



from typing import List, Tuple


def create_img_reference(bbox, spatial_resolution, path_root=None, output_crs='epsg:3857'):
    '''
    -> Returns an empty rioxarray objct with shape ('band', 'y', 'x') in epsg:3857 (can be reprojected) based on the extent given by the bbox and the spatial resolution 
    
    - bbox: [min_lon, min_lat, max_lon, max_lat] in EPSG: 4326 /!\
    - spatial_resolution: int in meter 
            (TEST BEFORE IMPLEMENTING -> the actual resolution MIGHT VARY SLIGHTLY)
    - path_root: str as 'path_root/'
            if specifided, Path where everything is downloaded
    - output_crs: as 'espg:...'
    '''
   
    # SET CRS
    crs4326 = pyproj.crs.CRS(projparams='epsg:4326')
    crs3857 = pyproj.crs.CRS(projparams='epsg:3857')

    # EXTRACT COORDINATES
    min_lon = bbox[0]
    min_lat = bbox[1]
    max_lon = bbox[2]
    max_lat = bbox[3]
    
    # CREATE TRANSFORMER OBJECT
    transformer = pyproj.transformer.Transformer.from_crs(crs4326, crs3857)

    # REPROJECT BOUNDING BOX COORDINATES
    coord1 = transformer.transform(min_lat, min_lon)
    coord2 = transformer.transform(max_lat, max_lon)

    #rearrange coordinates
    min_lon, min_lat, max_lon, max_lat = coord1[0], coord1[1], coord2[0], coord2[1]
    coords_bot_left = (min_lon, min_lat)
    coords_bot_right = (min_lon, max_lat)
    coords_top_left = (max_lon, min_lat)
    
    #create arrays as input data
    step=int(spatial_resolution) #corresponds to approx 10m pixel 
    longitudes = np.arange(min_lon, max_lon, step)
    latitudes = np.arange(min_lat, max_lat, step)
    
    #defines shape lengths
    dim_lon = []
    dim_lat = []
    for i in longitudes:
        dim_lon.append(i)
    dim_lon = len(dim_lon)
    for i in latitudes:
        dim_lat.append(i)
    dim_lat = len(dim_lat)
    nb_band = 1
    
    var_array = np.empty((nb_band, dim_lat, dim_lon))
    var_array[:] = np.nan
    
    #create data xarray
    ds = xr.DataArray(
                data   = var_array,
                dims   = ['band', "y", "x"],
                coords = {'band': np.array([1]), "y":latitudes, "x":longitudes},
                # attrs  = {'_FillValue': 65535.0, 'scale_factor': 1.0, 'add_offset': 0.0}
                )
    ds = ds.rio.write_crs("epsg:3857", inplace=True)
    ds = ds.rio.set_spatial_dims("x", "y", inplace=True)
    
    # #save raster
    if path_root:
        path_img_ref = path_root + 'data_for_processing/'
        os.makedirs(path_img_ref, exist_ok=True)
        ds.rio.to_raster(path_img_ref + 'image_reference.tif', driver ='COG')
    if output_crs:
        ds = ds.rio.reproject(output_crs)
    return ds



def get_bins(bbox, target_lat: xr.DataArray, target_lon: xr.DataArray):
    """ """
    min_lon = bbox[0]
    max_lon = bbox[2]
    min_lat = bbox[1]
    max_lat = bbox[3]

    interval_means = sorted(target_lat.values)
    ecart_lat = abs(interval_means[1] - interval_means[0])

    interval_means = sorted(target_lon.values)
    ecart_lon = abs(interval_means[1] - interval_means[0])

    bins_lat = np.linspace(
        min_lat - ecart_lat / 2, max_lat + ecart_lat / 2, len(target_lat) + 1
    )
    bins_lon = np.linspace(
        min_lon - ecart_lon / 2, max_lon + ecart_lon / 2, len(target_lon) + 1
    )
    return bins_lon, bins_lat


import geopandas as gpd
from shapely.geometry import Polygon
import math
def create_grid(gdf, grid_size):
    """
    Create a grid of polygons based on the bounding box of the input GeoDataFrame.
    
    Parameters:
    gdf (GeoDataFrame): The input GeoDataFrame
    grid_size (float): The size of each grid cell
    
    Returns:
    GeoDataFrame: A new GeoDataFrame containing the grid polygons
    """
    
    # Get the bounding box of the input GeoDataFrame
    bounds = gdf.total_bounds
    minx, miny, maxx, maxy = bounds
    
    # Calculate the number of grid cells needed to cover the extent
    n_cells_x = math.ceil((maxx - minx) / grid_size)
    n_cells_y = math.ceil((maxy - miny) / grid_size)
    
    # Generate the grid polygons
    grid_polys = []
    for x in range(n_cells_x):
        for y in range(n_cells_y):
            x1 = minx + (x * grid_size)
            y1 = miny + (y * grid_size)
            x2 = x1 + grid_size
            y2 = y1 + grid_size
            grid_polys.append(Polygon([(x1, y1), (x2, y1), (x2, y2), (x1, y2)]))
    
    # Create a new GeoDataFrame containing the grid polygons
    grid_gdf = gpd.GeoDataFrame({'geometry': grid_polys})
    
    # Set the same CRS as the input GeoDataFrame
    grid_gdf.crs = gdf.crs
    
    return grid_gdf

# def create_gridded_polygon(shapefile_path, surface_value = 200000000, output_crs='epsg:3857', save = False):
#     '''
#     Returns a gridded gdf with surface_value being the approx surface (in m²) of each polygon
    
#     shapefile_path: str. 
#     surface_value: in m²
#     output_crs: as "4326"
#     save: Bool save to the same directory as shapefile_path
#     '''
    
#     # Load shapefile into a geopandas dataframe
#     gdf = gpd.read_file(shapefile_path)
#     gdf = gdf.to_crs('epsg:3857')
#     # Extract the extent of the shapefile
#     xmin, ymin, xmax, ymax = gdf.total_bounds

#     # Calculate the width and height of the extent
#     width = xmax - xmin
#     height = ymax - ymin

#     # Calculate the number of rows and columns based on the surface value
#     cell_size = round((surface_value ** 0.5), 6) # round to 6 decimal places to avoid floating point errors
#     num_rows = int(height // cell_size)
#     num_cols = int(width // cell_size)

#     # Calculate the x and y coordinates of the grid points
#     x_coords = np.linspace(xmin, xmax, num_cols + 1)
#     y_coords = np.linspace(ymin, ymax, num_rows + 1)

#     # Create a list of polygons based on the grid points
#     polygons = []
#     for i in range(num_rows):
#         for j in range(num_cols):
#             poly = Polygon([(x_coords[j], y_coords[i]),
#                             (x_coords[j+1], y_coords[i]),
#                             (x_coords[j+1], y_coords[i+1]),
#                             (x_coords[j], y_coords[i+1])])
#             polygons.append(poly)

#     # Convert the list of polygons to a geopandas dataframe
#     grid_gdf = gpd.GeoDataFrame(geometry=polygons)
    
#     #Clip to input shp
#     # grid_gdf = grid_gdf.clip(gdf)
    
#     # Calculate the area (KM²) of each cell and set it as a new column in the dataframe
#     grid_gdf['cell_area'] = grid_gdf.area/1000
    
#     #reset index to get unique identifier
#     grid_gdf = grid_gdf.reset_index()
    
#     # write crs
#     grid_gdf.crs = gdf.crs
#     print( grid_gdf.crs)
#     # Set  CRS to desired crs
#     grid_gdf = grid_gdf.to_crs( output_crs)
    
#     #save gdf as shp
#     if save == True:
#         grid_gdf_path, file_name = zonage_path.split('/')[:-1], zonage_path.split('/')[-1][:-4]
#         grid_gdf_path = '/'.join(grid_gdf_path) + '/' + file_name + '_grid.shp'
#         print('saving ' + grid_gdf_path)
#         grid_gdf.to_file(grid_gdf_path)
#     return grid_gdf


import numpy as np
import xarray as xr
import rioxarray
from sklearn.cluster import KMeans
import jenkspy

def discretize_raster(dataarray, technique, num_classes, bins=None):
    """
    Discretizes a raster dataarray into a specified number of classes using a selected technique.

    Parameters:
    - dataarray: xarray.DataArray, the input raster to discretize
    - technique: str, the discretization technique ('equal_interval', 'quantile', or 'custom')
    - num_classes: int, the number of classes to discretize into
    - bins: array_like (optional), the bin edges for 'custom' technique

    Returns:
    - xarray.DataArray, the discretized raster
    """
    
    if technique not in ['equal_interval', 'quantile', 'custom', 'kmeans', 'natural_breaks']:
        raise ValueError("Technique not recognized. Choose from 'equal_interval', 'quantile', 'custom', 'kmeans'.")
    
    # Handle NaN values: Create a mask of NaN values
    nan_mask = np.isnan(dataarray)

    # Temporarily fill NaNs with a neutral value (e.g., the mean of the dataarray)
    data_filled = dataarray.where(~nan_mask, -999)

    # Initialize discretized_data
    discretized_data = None
    
    if technique == 'kmeans':
        # Reshape data for k-means clustering
        original_shape = data_filled.shape
        data_reshaped = data_filled.values.flatten().reshape(-1, 1)
        
        # ensue that the number of classes match the input 
        num_classes = num_classes+1
        # Compute k-means clustering
        kmeans = KMeans(n_clusters=num_classes, random_state=0, n_init=15).fit(data_reshaped)

        # Get centroids and sort them to get the order
        centroids = kmeans.cluster_centers_.squeeze()
        sorted_idx = np.argsort(centroids)

        # Create a mapping from original cluster labels to sorted labels
        label_mapping = dict(zip(sorted_idx, range(num_classes)))

        # Apply the mapping to the cluster labels
        reordered_labels = np.vectorize(label_mapping.get)(kmeans.labels_)

        # Reshape to original data shape
        reordered_labels = reordered_labels.reshape(original_shape)

        # Create a new DataArray with reordered labels
        discretized_data = xr.DataArray(reordered_labels, dims=dataarray.dims, coords=dataarray.coords)
        
        #check if the number of classes matches the input parameter
        if len(set(list(discretized_data.values.flatten()))) != num_classes:
            discretized_data = discretized_data.where(discretized_data != 0, 1)

            
    
    elif technique == 'natural_breaks':
        # Flatten the array and remove NaN values for classification
        flattened_data = dataarray.values.flatten()
        flattened_data = flattened_data[~np.isnan(flattened_data)]

        # Calculate natural breaks
        breaks = jenkspy.jenks_breaks(flattened_data, n_classes = num_classes)

        # Use np.digitize to classify the original data based on these breaks
        discretized_data = xr.apply_ufunc(
            np.digitize, 
            dataarray, 
            breaks, 
            kwargs={"right": True}
        )
    
    elif technique == 'equal_interval':
        # Equal-width binning
        data_min, data_max = dataarray.min().item(), dataarray.max().item()
        interval_width = (data_max - data_min) / (num_classes )
        class_bounds = np.arange(data_min, data_max, interval_width)
            # Apply the digitize function to convert continuous data to discrete bins
        discretized_data = xr.apply_ufunc(
        np.digitize, 
        dataarray, 
        class_bounds, 
        kwargs={"right": True}
    )
    
        
    elif technique == 'quantile':
        # Equal-frequency (quantile) binning
        percentiles = np.linspace(0, 100, num_classes)
        class_bounds = dataarray.quantile(percentiles / 100.0).values
        discretized_data = xr.apply_ufunc(
        np.digitize, 
        dataarray, 
        class_bounds, 
        kwargs={"right": True}
    )        
    elif technique == 'custom':
        # Bin by custom boundaries
        if bins is None:
            raise ValueError("For 'custom' technique, bins must be provided.")
        class_bounds = bins
        discretized_data = xr.apply_ufunc(
        np.digitize, 
        dataarray, 
        class_bounds, 
        kwargs={"right": True}
    )

    # After discretization, apply the NaN mask to ensure NaNs are not included in any class
    discretized_data = discretized_data.where(~nan_mask, np.nan)
    # Set attributes and encoding similar to the original dataarray
    discretized_data.attrs = dataarray.attrs
    discretized_data.encoding = dataarray.encoding
    
    #compute stats
    stats = compute_stats_range_between_rasterclass(dataarray, discretized_data)
    return {'stats' : stats, 'discretized_raster' : discretized_data}

import rioxarray
import numpy as np

def compute_area_percentage(raster, pixel_size, class_correspondance=None):
    """
    Computes the area in square kilometers and the percentage of surface coverage 
    for each land cover class in a raster. Optionally merges the results with 
    a class correspondence dictionary to map class IDs to meaningful names.

    Parameters:
    raster (rioxarray.dataarray): Opened rioxarray DataArray representing the raster data.
    pixel_size (float or tuple): The size of each pixel in the raster. It can be a single float 
                                 for square pixels or a tuple (width, height) for rectangular pixels.
    class_correspondance (pd.DataFrame, optional): DataFrame for mapping class IDs to class names. 
                                                   This should have an index of class IDs and 
                                                   at least one column with corresponding class names.

    Returns:
    pd.DataFrame: A DataFrame containing two columns: 'areas_km²' for the area of each class in square kilometers,
                  and 'percentages' for the percentage of total area covered by each class. If 
                  class_correspondance is provided, the result will include corresponding class names.
    """

    # Extract the data and mask NaNs
    data = raster.data # Assuming single band raster
    masked_data = np.ma.masked_invalid(data)

    # Count pixels for each class, ignoring NaNs
    unique, counts = np.unique(masked_data.compressed(), return_counts=True)
    pixel_counts = dict(zip(unique, counts))

    # Calculate the area
    if isinstance(pixel_size, tuple):
        pixel_area = pixel_size[0] * pixel_size[1] / 1_000_000  # Convert to km²
    else:
        pixel_area = pixel_size * pixel_size / 1_000_000  # Convert to km²
    class_areas = {k: v * pixel_area for k, v in pixel_counts.items()}

    # Calculate the total area and percentages
    total_area = sum(class_areas.values())
    class_percentages = {k: (v / total_area) * 100 for k, v in class_areas.items()}

    # Create result DataFrame
    result = pd.DataFrame({'areas_km²': class_areas, 'percentages': class_percentages})

    # Merge with class correspondence if provided
    if class_correspondance is not None:
        result = result.merge(class_correspondance, left_index=True, right_index=True)

    return result
        
    
def resample_raster(raster_to_interp, source_raster, x ="x", y="y", method='nearest'):
    """
    Interpolates a raster dataset to match the coordinate grid of a source raster using nearest neighbor method.

    Parameters:
    raster_to_interp (rioxarray object): The raster to be interpolated.
    source_raster (rioxarray object): The source raster whose coordinate grid is to be matched.

    Returns:
    rioxarray object: The interpolated raster.
    """
    # Extract the coordinates from the source raster
    x_coords = source_raster[x]
    y_coords = source_raster[y]

    # Interpolate the raster
    resampled_raster = raster_to_interp.interp(x=x_coords, y=y_coords, method=method)

    return resampled_raster


def clip_raster_with_gdf(opened_raster, opened_gdf):
    """
    Clips an opened raster based on the geometry of an opened GeoDataFrame.

    Parameters:
    opened_raster (rioxarray object): Opened raster object.
    opened_gdf (GeoDataFrame): Opened GeoDataFrame with geometry for clipping.
    """
    # Check if the CRS of the raster and GeoDataFrame match
    if opened_raster.rio.crs != opened_gdf.crs:
        raise ValueError("The CRS of the raster and GeoDataFrame do not match. Please reproject one to match the other.")

    # Clip the raster with the geometry of the GeoDataFrame
    clipped_raster = opened_raster.rio.clip(opened_gdf.geometry.apply(mapping), opened_gdf.crs)
    return clipped_raster



import pyproj
from rasterio.enums import Resampling

def get_pixel_size(raster):
    """
    Computes the pixel size in meters.
    If the raster is not in a metric CRS, it is reprojected to a metric CRS (UTM).

    Parameters:
    - raster (rioxarray.dataarray): The open rioxarray DataArray.

    Returns:
    - int representing pixel size
   
    """

    crs = raster.rio.crs
    if crs is None:
        raise ValueError("Raster does not have a CRS defined.")

    # Check if the CRS is metric
    if not pyproj.CRS(crs).is_projected:
        # Determine UTM zone and hemisphere for reprojection
        lon, lat = raster.rio.bounds()[::2]
        utm_crs = pyproj.CRS.from_epsg(32700 if lat < 0 else 32600).to_epsg() + round((183 + lon) / 6)
        raster = raster.rio.reproject(f"EPSG:{utm_crs}", resampling=Resampling.nearest)

    # Extract the resolution (pixel size)
    pixel_size_x, pixel_size_y = raster.rio.resolution()
    pixel_size = (abs(pixel_size_x) + abs(pixel_size_y)) / 2
    return int(pixel_size)


import numpy as np
import pandas as pd
# from tqdm import tqdm

def compute_stats_range_between_rasterclass(raster_raw, raster_classified):
    """
    Computes statistics for each class in a classified raster and merges these with area and percentage data.

    Parameters:
    - raster_raw (rioxarray.dataarray): The raw raster data array.
    - raster_classified (rioxarray.dataarray): The classified raster data array.

    Returns:
    - pandas.DataFrame: A DataFrame containing mean, min, max values for each class, 
                         the average difference per class, and area percentage data.
    """
    # Compute the pixel size of the classified raster
    pixel_size = get_pixel_size(raster_classified)

    # Compute the area percentage of each class
    df_area = compute_area_percentage(raster_classified, pixel_size)

    # Get unique values (classes) in the classified raster
    list_value = np.unique(raster_classified.values.flatten())
    list_value = list_value[~np.isnan(list_value)]  # Remove NaN values
    list_value = list(set(list_value))  # Ensure unique values

    # Initialize dictionary to store stats
    dictio = {}

    # Loop over each class value
    for value in tqdm(list_value):
        if (value != 'nan') or value != np.nan:
            # Extract pixels corresponding to the current class
            raster_step = raster_raw.where(raster_classified == value, drop=True)

            # Calculate mean, min, max for the class
            raster_mean = round(raster_step.mean().item(), 2)
            raster_min = round(raster_step.min().item(), 2)
            raster_max = round(raster_step.max().item(), 2)

            # Store the stats in the dictionary
            dictio[value] = [raster_mean, raster_min, raster_max]

    # Convert the stats dictionary to a DataFrame
    df_stats = pd.DataFrame(dictio).T
    df_stats.columns = ['mean', 'range_min', 'range_max']

    # Calculate average difference per class
    df_stats['avg_diff_per_class'] = df_stats['mean'].diff()

    # Merge stats with area and percentage data
    df_final = pd.merge(df_stats, df_area, left_index=True, right_index=True)
    # df_final = df_final.dropna()

    return df_final



def extract_ts_by_group_rioxarray(images, by_group_ts, vege_index, reducer='mean'):
    """
    Args:
        images (list): List of DataArrays read using rioxarray.
        by_group_ts (pd.DataFrame): A DataFrame defining the groups of interest.
        vege_index (str): The band of interest in the images.

    Returns:
        pd.DataFrame: A DataFrame of the time series data for each group.
    """
    
    # Initialize an empty DataFrame to store results
    df = pd.DataFrame()

    # Loop over each row in the by_group_ts DataFrame
    for index, row in tqdm(by_group_ts.iterrows()):
        
        # Convert the current group to a GeoDataFrame
        gdf = gpd.GeoDataFrame(by_group_ts.loc[by_group_ts.index == index])
        
        try:
            nom_zone = gdf.index[index]
        except:
            nom_zone = str(index)
        
        # Loop over each image in the list
        for image in images:
            
            # Clip the image to the current group
            clipped_image = image.rio.clip(gdf.geometry)
            

            # Extract the date from the image attributes
            date = pd.to_datetime(clipped_image.attrs['date']).strftime('%Y-%m-%d')

            # Compute the statistic of interest
            if reducer == 'mean':
                ndvi = clipped_image.mean().values.item()
            elif reducer == 'max':
                ndvi = clipped_image.max().values.item()
            
            # Add the data to the DataFrame
            df.at[date, nom_zone] = ndvi

        df.index = pd.to_datetime(df.index)

    # Further DataFrame processing
     # Sort, interpolate missing data, and format the DataFrame
    df = df.sort_index()
    df_copy = df.copy()
    threshold = len(df.columns) / 2 
    df_copy = df_copy.dropna(thresh=threshold)
    df_copy = df_copy.interpolate(method='spline', order=3)
    df_copy =  df_copy.reset_index()
    df_copy =  df_copy.rename(columns={'index':'Date'})
    df_copy['date_string'] = pd.to_datetime(df_copy.Date).dt.strftime("%B-%d, %Y")
    df_copy.reset_index(inplace=True)
    df_copy['date_string'] = df_copy.index.map(lambda x: str(x+1).zfill(2)).astype(str) + ' | ' + df_copy['date_string']
    df_copy= df_copy.set_index('Date').drop(columns='index')

    # Melt the DataFrame to a long format
    df_melted = df_copy.melt(id_vars='date_string', ignore_index=False, value_name=vege_index)
    df_melted = df_melted.reset_index(names='Date')
    return df_melted