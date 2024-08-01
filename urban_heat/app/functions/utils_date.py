# This script contains several utility functions related to date and time manipulation.
#
# Function generate_date_range:
#     This function generates a list of dates between a given start date and end date.
#
# Function split_period_by_year:
#     This function splits a given period by year.
#
# Function month_interval:
#     This function generates a list of monthly intervals between a given start date and end date.
#
# Function dekad_interval:
#     This function generates a list of dekads (10-day periods) for each month in a list of monthly intervals.
#
# Please see the docstrings of each function for more details.
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
import pandas as pd

from datetime import datetime

def get_today_date(date_format='%Y-%m-%d'):
    """
    Returns the current date in a specified format.

    Parameters:
    date_format (str): The format in which to return the date. Default is '%Y-%m-%d'.

    Returns:
    str: The current date in the specified format.
    """
    return datetime.now().strftime(date_format)


def generate_date_range(start_date, end_date, date_format = '%Y-%m-%d'):
    """
    Generate a list of dates between start_date and end_date (both inclusive).
    Dates are represented in 'YYYY-MM' format and start from the first day of each month.

    Args:
        start_date (str): Start date as a string in 'YYYY-MM-DD' format.
        end_date (str): End date as a string in 'YYYY-MM-DD' format.

    Returns:
        list: List of dates in 'YYYY-MM' format.
    """
    

    # Convert start_date and end_date from str to datetime.date
    start_date_obj = datetime.strptime(start_date, date_format).date()
    end_date_obj = datetime.strptime(end_date, date_format).date()
    
    # Initialize an empty list to hold the dates
    date_list = []
    
    # Start from the first day of the start_date month
    current_date = start_date_obj.replace(day=1)
    
    # Generate dates until the end_date
    while current_date <= end_date_obj:
        # Append the current_date to the list in 'YYYY-MM' format
        date_list.append(current_date.strftime('%Y-%m'))
        
        # Increment the current_date by approximately one month
        # timedelta(days=32) is used to ensure moving to the next month
        current_date = current_date + timedelta(days=32)
        
        # Adjust the day to the first day of the new current month
        current_date = current_date.replace(day=1)
    
    # Return the list of dates
    return date_list

def split_period_by_year(start_date, end_date):
    """
    Split a given period by year.

    Args:
        start_date (str): The start date in 'YYYY-MM-DD' format.
        end_date (str): The end date in 'YYYY-MM-DD' format.

    Returns:
        list: A list of time periods broken down by year. Each time period is a list of two elements: 
              the start date and end date of that year.
    """

    # Convert the start_date and end_date from strings to datetime objects
    start = datetime.strptime(start_date, '%Y-%m-%d')
    end = datetime.strptime(end_date, '%Y-%m-%d')

    # Initialize an empty list to hold the result
    result = []
    current_year = start.year

    # Loop through each year from the start year to the end year
    while current_year <= end.year:
        # Set the start and end dates for the current year
        year_start = datetime(current_year, 1, 1)
        year_end = datetime(current_year, 12, 31)

        # If the year start is before the overall start date, set the year start to the overall start date
        if year_start < start:
            year_start = start

        # If the year end is after the overall end date, set the year end to the overall end date
        if year_end > end:
            year_end = end

        # Append the year start and end dates as strings in 'YYYY-MM-DD' format to the result list
        result.append([year_start.strftime('%Y-%m-%d'), year_end.strftime('%Y-%m-%d')])

        # Move to the next year
        current_year += 1

    return result

def month_interval(date_start, date_end):
    """
    Generates a list of monthly intervals between a given start and end date.

    Args:
        date_start (str): The start date in 'YYYY-MM-DD' format.
        date_end (str): The end date in 'YYYY-MM-DD' format or 'today'.

    Returns:
        list: A list of lists, each containing a start and end date for a month.
    """
    if date_end == 'today':
        start = transform_yyyy_mm_dd_to_datetime(date_start)
        end = datetime.now()
        end = dekad_equalizor(end)  # This function is not defined in your provided code.
        print(end)
    else:
        start = transform_yyyy_mm_dd_to_datetime(date_start)
        end = transform_yyyy_mm_dd_to_datetime(date_end)
    
    date_monthly = start.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    date_to_iterate = date_monthly
    monthly_interval_book = []
    
    while date_to_iterate < end:
        first_day_month = date_to_iterate
        first_day_month_list = first_day_month.strftime("%Y-%m-%d")
        last_day = first_day_month + relativedelta(months=1)
        last_day_list = last_day.strftime("%Y-%m-%d")
        list_strat_end = [first_day_month_list, last_day_list]
        
        monthly_interval_book.append(list_strat_end)
        date_to_iterate = last_day

    return monthly_interval_book

def dekad_interval(list_month_interval):
    """
    Generates a list of dekads (10-day periods) for each month in a list of monthly intervals.

    Args:
        list_month_interval (list): A list of lists, each containing a start and end date for a month.

    Returns:
        list: A list of lists, each containing the start and end dates for a dekad.
    """
    dekad_interval_book = []
    for i in list_month_interval:
        threshold_dekad = pd.date_range(i[0], i[1], periods=4).strftime("%Y-%m-%d").tolist()
        dekad_interval_book.append(threshold_dekad)

    return dekad_interval_book
