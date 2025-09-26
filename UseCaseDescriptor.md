<img src="media/image1.png" style="width:8.20895in;height:5.46992in" />

**<span class="smallcaps">REVISION HISTORY</span>**

<table>
<colgroup>
<col style="width: 14%" />
<col style="width: 20%" />
<col style="width: 22%" />
<col style="width: 41%" />
</colgroup>
<thead>
<tr>
<th style="text-align: center;">Revision</th>
<th style="text-align: center;">Date</th>
<th style="text-align: center;">Author(s)</th>
<th style="text-align: center;">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>1.0</td>
<td>01/03/2024</td>
<td>All partners</td>
<td style="text-align: left;">First release for RR1</td>
</tr>
<tr>
<td>1.1</td>
<td>1/03/2024</td>
<td>Murmuration</td>
<td style="text-align: left;">Reissue after RR1 comments</td>
</tr>
<tr>
<td>1.2</td>
<td>22/05/2024</td>
<td>All partners</td>
<td style="text-align: left;"><p>Release for RR2</p>
<p>User engagement section updated.</p>
<p>What-if scenarios updated.</p>
<p>Data/Digital Twins section updated.</p></td>
</tr>
<tr>
<td>1.3</td>
<td>20/06/2024</td>
<td>All partners</td>
<td style="text-align: left;"><p>Update after RR2</p>
<p>Modified sections:</p>
<ul>
<li><p>3 User Engagement</p></li>
<li><p>5.4 Flood</p></li>
</ul></td>
</tr>
<tr>
<td>1.4</td>
<td>20/09/2024</td>
<td>Murmuration</td>
<td style="text-align: left;">Update for RR3</td>
</tr>
<tr>
<td>1.5</td>
<td>04/10/2024</td>
<td>Murmuration</td>
<td style="text-align: left;">Update after comments from RR3</td>
</tr>
<tr>
<td>1.6</td>
<td>21/03/2025</td>
<td>All partners</td>
<td style="text-align: left;"><p>Update for final review:</p>
<ul>
<li><p>3 User Engagement</p></li>
<li><p>4.2 Output Data</p></li>
<li><p>5.6 Infrastructures</p></li>
<li><p>6.4 Flood</p></li>
</ul></td>
</tr>
<tr>
<td>1.7</td>
<td>18/07/2025</td>
<td>All partners</td>
<td style="text-align: left;"><p>Update for final review:</p>
<ul>
<li><p>4.1.2 Digital Twin</p></li>
<li><p>5.3 Sea level rise and storm surges</p></li>
<li><p>6.4 Flood</p></li>
<li><p>6.7 Infrastructure</p></li>
<li><p>7 Architecture definition and functional specification</p></li>
</ul></td>
</tr>
<tr>
<td>1.8</td>
<td>28/07/2025</td>
<td>Mozaika</td>
<td style="text-align: left;"><p>Update after comments of the final
review:</p>
<ul>
<li><p>4.1.3 Other data (could be added to Data Cache)</p></li>
<li><p>6.4 Flood</p></li>
</ul></td>
</tr>
</tbody>
</table>

# Contents

[1 Purpose of the document
[3](#purpose-of-the-document)](#purpose-of-the-document)

[2 Use case Description
[3](#use-case-description)](#use-case-description)

[3 User Engagement [4](#user-engagement)](#user-engagement)

[4 Data [5](#data)](#data)

[4.1 Input Data [5](#input-data)](#input-data)

[4.1.1 Data Lake [5](#data-lake)](#data-lake)

[4.1.2 Digital Twin [2](#digital-twin)](#digital-twin)

[4.1.3 Other data (could be added to Data Cache)
[4](#other-data-could-be-added-to-data-cache)](#other-data-could-be-added-to-data-cache)

[4.1.4 External datasets [6](#external-datasets)](#external-datasets)

[4.2 Output Data [0](#output-data)](#output-data)

[5 Workflow description
[0](#workflow-description)](#workflow-description)

[5.1 Air quality [0](#air-quality)](#air-quality)

[5.2 Urban Heat [0](#urban-heat)](#urban-heat)

[5.3 Sea level rise and storm surges
[0](#sea-level-rise-and-storm-surges)](#sea-level-rise-and-storm-surges)

[5.4 Flood [1](#flood)](#flood)

[5.5 Resources [2](#resources)](#resources)

[5.6 Infrastructures [3](#infrastructures)](#infrastructures)

[5.6.1 Workflow [3](#workflow)](#workflow)

[5.6.2 Limitations [10](#limitations)](#limitations)

[5.6.3 Connectivity assessment to build an evacuation scenario
[10](#connectivity-assessment-to-build-an-evacuation-scenario)](#connectivity-assessment-to-build-an-evacuation-scenario)

[6 What-if scenarios [11](#what-if-scenarios)](#what-if-scenarios)

[6.1 Overview [11](#overview)](#overview)

[6.2 Air quality [11](#air-quality-1)](#air-quality-1)

[6.3 Urban-Heat [13](#urban-heat-1)](#urban-heat-1)

[6.4 Flood [14](#flood-1)](#flood-1)

[6.4.1 Simulation and forecasting tool
[15](#simulation-and-forecasting-tool)](#simulation-and-forecasting-tool)

[6.4.2 Methodology [16](#methodology)](#methodology)

[6.4.3 Validation [17](#validation)](#validation)

[6.5 Storm and Sea Level Rise
[0](#storm-and-sea-level-rise)](#storm-and-sea-level-rise)

[6.6 Resources [1](#resources-1)](#resources-1)

[6.7 Infrastructure [1](#infrastructure)](#infrastructure)

[7 Architecture definition and functional specification
[3](#architecture-definition-and-functional-specification)](#architecture-definition-and-functional-specification)

# Purpose of the document

This document provides detailed documentation on the Destination Earth
Use Case (DEUC) UrbanSquare.

# Use case Description

The goal of UrbanSquare is to provide operational tools to urban
planners, enabling them to assess the exposure of their territory and
plan to adapt to these risks. For that monitoring capacities are
provided to understand the historical and current situation as well as
projection capacities to plan future actions

UrbanSquare is organised along six components, developed by a consortium
of three companies: Murmuration, Sistema and Mozaika. Each component
covers the exposure of a specific climate risk to urban areas. The
components are listed in the following table.

<table>
<caption><p>: UrbanSquare components</p></caption>
<colgroup>
<col style="width: 26%" />
<col style="width: 46%" />
<col style="width: 16%" />
<col style="width: 11%" />
</colgroup>
<thead>
<tr>
<th>Component</th>
<th>Description</th>
<th>Leader</th>
<th>Delivery</th>
</tr>
</thead>
<tbody>
<tr>
<td>Air pollution and quality</td>
<td>Past and present view of the air pollution in a territory and
comparison to the WHO standards</td>
<td>Murmuration</td>
<td>M3</td>
</tr>
<tr>
<td>Urban heat</td>
<td>Heat exposure indicator allowing the identification of heat islands
on the area of interest, mapped on land use and urban vegetation</td>
<td>Murmuration</td>
<td>M3</td>
</tr>
<tr>
<td>Sea level rise and storm surges</td>
<td>Exploitation of climate scenarios up to 2150 to assess potential
inundation risk and effects due to sea level rise in the coastal
areas</td>
<td>Sistema</td>
<td>M6</td>
</tr>
<tr>
<td>Flood</td>
<td>Environment for forecasting the flood risk in a territory over a
period of 1 year from the initial conditions</td>
<td>Mozaika</td>
<td>M6</td>
</tr>
<tr>
<td>Infrastructure</td>
<td>Updated map of the road infrastructure highlighting the areas that
would need action or restoration</td>
<td>Murmuration</td>
<td>M9</td>
</tr>
<tr>
<td>Resources</td>
<td>Integrated socio-economic data to quantify the potential impacts of
a climate risk on the area of interest</td>
<td>Mozaika</td>
<td>M9</td>
</tr>
</tbody>
</table>

The overall generic workflow across demonstrators consists of data
access from DestinE Platform, processing on its own platform (deployed
on DestinE Platform) using a workflow of containers, plugged to
visualisation and on demand processing capabilities to display the
results to the users.

The input and output datasets are described in section 5 of the present
document and the workflows in section 6.

# User Engagement

<table>
<caption><p>: Users involved in the components
implementation</p></caption>
<colgroup>
<col style="width: 33%" />
<col style="width: 33%" />
<col style="width: 33%" />
</colgroup>
<thead>
<tr>
<th style="text-align: center;">Component</th>
<th style="text-align: center;">User</th>
<th style="text-align: center;">Leader</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align: center;">Air pollution and quality</td>
<td style="text-align: center;">Toulouse Metropole</td>
<td style="text-align: center;">Murmuration</td>
</tr>
<tr>
<td style="text-align: center;">Urban heat</td>
<td style="text-align: center;">Toulouse Metropole</td>
<td style="text-align: center;">Murmuration</td>
</tr>
<tr>
<td style="text-align: center;">Sea level rise and storm surges</td>
<td style="text-align: center;">UNESCO</td>
<td style="text-align: center;">Sistema</td>
</tr>
<tr>
<td style="text-align: center;">Flood</td>
<td style="text-align: center;">Suhindol</td>
<td style="text-align: center;">Mozaika</td>
</tr>
<tr>
<td style="text-align: center;">Infrastructure</td>
<td style="text-align: center;"></td>
<td style="text-align: center;">Murmuration</td>
</tr>
<tr>
<td style="text-align: center;">Resources</td>
<td style="text-align: center;">Suhindol</td>
<td style="text-align: center;">Mozaika</td>
</tr>
</tbody>
</table>

End users are involved to accompany the developments of UrbanSquare:

- **Toulouse Metropole & CNRS (France):** the city of Toulouse has been
  active in implementing solution to combat urban risks, in particular
  related to extreme heat waves and air pollution. Led by researchers
  from the French National Scientific Research Centre (CNRS), this team
  (the city and the CNRS) is interested in co-designing the extreme heat
  events and air pollution components.

- **Municipality of Suhindol (Bulgaria):** the municipality is keen on
  understanding the potential impact of climate change induced risks on
  its population. The team supports UrbanSquare regarding the potential
  flooding events and the population dynamic pressure on the available
  resources.

- **\[*Note: UNITAR has been replaced by another user to be defined
  after RR2 milestone*\] UNITAR/UNOSAT:** The central team from UNOSAT
  enables our project to liaise and co-design the demonstrators on the
  topics of flooding (in collaboration with the local UNOSAT team in
  Uganda), Sea Level Rise (UNOSAT/ Fiji) and Storm Surges (UNOSAT
  /Nigeria).

- **UNESCO:** the UNESCO Chair on Intersectoral Safety for Disaster Risk
  Reduction and Resilience (University of Udine, Italy) has been
  reached. (see **Table 3: UNESCO involvement** for more details).

- **Wider user community:** an example of our reach is illustrated by
  the World Bank who is already involved with our consortium partner
  Sistema in the Climate Knowledge Portal along with the Asian
  Development Bank. Throughout these developments both entities are
  interested in the UrbanSquare system integrated approach that has a
  larger scope than the ongoing activity and is more operation ready
  thanks to the use of the DestinE Platform resources and data wealth.

Due to unforeseen circumstances, it was not possible to collect user
needs from UNITAR, who had agreed to be pilot users at the beginning of
the project. This has been particularly affecting the status of the
Infrastructure and the Sea Level Rise and Storm Surges components, since
UNITAR was set up as the only pilot user. Efforts have been made since
then to find new pilot users:.

- UNESCO has been involved for the Sea Level Rise and Storm Surges
  component. the Software Requirement Specification document (SRS-1)
  contains user needs that reflect the feedback and insight received
  during the discussion with Professor Stefano Grimaz (UNESCO Chair on
  Intersectoral Safety for Disaster Risk Reduction and Resilience) and
  Dr Petra Malisan (University of Udine).

- Additional feedback on the Sea Level Rise and Storm Surge component
  was received from Dr. Natasa Manojlovic from the Institute of River
  and Coastal Engineering at Hamburg University of Technology (TUHH),
  who was interested in seeing the results of the service over the
  island of Newark (Germany).

- Rasmus Reeh, an urban consultant with experience in multiple projects
  for the Municipality of Copenhagen, contributed to the Infrastructure
  component. The service was presented to him, and direct feedback was
  gathered. However, due to the tight schedule and the fact that this
  activity took place at the end of the project, it was not possible to
  obtain more formalized feedback.

<table>
<caption><p>: UNESCO involvement</p></caption>
<colgroup>
<col style="width: 17%" />
<col style="width: 41%" />
<col style="width: 41%" />
</colgroup>
<thead>
<tr>
<th colspan="3" style="text-align: center;">SLR Component User
Involvement</th>
</tr>
</thead>
<tbody>
<tr>
<td>User</td>
<td>UNESCO Chair on Intersectoral Safety for Disaster Risk Reduction and
Resilience (University of Udine, Italy)</td>
<td>Institute of River &amp; Coastal Engineering,<br />
Hamburg University of Technology (TUHH)</td>
</tr>
<tr>
<td>Contact Persons</td>
<td><p>Chairholder Prof Stefano Grimaz</p>
<p>Dr Petra Malisan</p></td>
<td>Dr. Natasa Manojlovic</td>
</tr>
<tr>
<td>Description</td>
<td>The chairholder and his team have a strong background in
multi-hazard risk reduction, with a focus on seismic events and
hydro-geological emergencies (<a
href="https://unescochair-sprint.uniud.it/en/"><u>https://unescochair-sprint.uniud.it/en/</u></a>).</td>
<td>Research team focusing on climate change, water management and flood
emergencies (<a
href="https://www.tuhh.de/wb/en/welcome-page">https://www.tuhh.de/wb/en/welcome-page</a>).</td>
</tr>
<tr>
<td>Role in project</td>
<td>They have shown interest in supporting the project and intend to put
SISTEMA in direct contact with local administrations and authorities
actively involved in environmental monitoring</td>
<td>They showed interest in using the service on an area of interest.
They do similar studies and are willing to compare the results.</td>
</tr>
<tr>
<td>Feedback</td>
<td>In order to demonstrate the usefulness of the tool for strategic
planning and decision making, it is suggested to emphasize the
inundation risk on power plants and other critical infrastructure,
referred to as "sentinel points".</td>
<td>They would need to compare the results to see the usefulness of the
product.</td>
</tr>
</tbody>
</table>

# Data

## Input Data

### Data Lake

The following table details the datasets used by UrbanSquare components
available in the DestinE Data Lake.

The references for DestinE Data Lake content are:

- the “DestinE - System Framework - Data Portfolio” document issue “v1I
  e-signed”

- the “Available data collections on Destination Earth Data Lake”
  [<u>web
  page</u>](https://destine-data-lake-docs.data.destination-earth.eu/en/latest/dedl-discovery-and-data-access/Available-data-collections/Available-data-collections.html?highlight=collections)
  (as per its status on March 11<sup>th</sup> 2024)

*Table 3: DestinE Data Lake Datasets used by UrbanSquare*

<table>
<colgroup>
<col style="width: 10%" />
<col style="width: 24%" />
<col style="width: 24%" />
<col style="width: 10%" />
<col style="width: 10%" />
<col style="width: 10%" />
<col style="width: 10%" />
</colgroup>
<thead>
<tr>
<th style="text-align: center;">Component</th>
<th style="text-align: center;">Description</th>
<th style="text-align: center;">DestinE Platform Dataset ID</th>
<th style="text-align: center;">Required temporal resolution</th>
<th style="text-align: center;">Required spatial resolution</th>
<th style="text-align: center;">Required spatial coverage</th>
<th style="text-align: center;">Required temporal coverage</th>
</tr>
</thead>
<tbody>
<tr>
<td rowspan="4" style="text-align: left;">Air quality</td>
<td>CAMS European air quality forecasts</td>
<td>EO.ECMWF.DAT.CAMS_EUROPE_AIR_QUALITY_FORECASTS</td>
<td>Hourly</td>
<td>10 km</td>
<td>Europe</td>
<td>2020 to present</td>
</tr>
<tr>
<td>ERA5-Land hourly data from 1950 to present</td>
<td>EO.ECMWF.DAT.ERA5_LAND_HOURLY</td>
<td>Hourly</td>
<td>10 km</td>
<td>Global</td>
<td>2020 to present</td>
</tr>
<tr>
<td>ERA5 hourly data on single levels from 1940 to present</td>
<td>EO.ECMWF.DAT.REANALYSIS_ERA5_SINGLE_LEVELS</td>
<td>Hourly</td>
<td>10 km</td>
<td>Global</td>
<td>2020 to present</td>
</tr>
<tr>
<td>CAMS Global atmospheric composition forecasts</td>
<td>EO.ECMWF.DAT.CAMS_GLOBAL_ATMOSHERIC_COMPO_FORECAST</td>
<td>Hourly</td>
<td>40 km</td>
<td>Global</td>
<td>2020 to present</td>
</tr>
<tr>
<td rowspan="4" style="text-align: left;">Urban Heat</td>
<td>Landsat 8 OLI-TIRS European Coverage</td>
<td>EO:ESA:DAT:LANDSAT8:OLITIRS</td>
<td>5 to 10 days</td>
<td>30 m</td>
<td>Europe</td>
<td>2015 to present</td>
</tr>
<tr>
<td>Landsat 8 Collection 2 European Coverage</td>
<td>EO:ESA:DAT:LANDSAT8:COL-2</td>
<td>5 to 10 days</td>
<td>30m</td>
<td>Europe</td>
<td>2015 to present</td>
</tr>
<tr>
<td>Sentinel-2 Level 2A: Bottom-Of-Atmosphere reflectances in
cartographic geometry</td>
<td>EO.ESA.DAT.SENTINEL-2.MSI.L2A</td>
<td>5 days</td>
<td>20 m</td>
<td>Global</td>
<td>2017 to present</td>
</tr>
<tr>
<td>ERA5-Land hourly data from 1950 to present</td>
<td>EO.ECMWF.DAT.ERA5_LAND_HOURLY</td>
<td>Hourly</td>
<td>10 km</td>
<td>Global</td>
<td>2017 to present</td>
</tr>
<tr>
<td rowspan="14" style="text-align: left;">Flood</td>
<td>Water quantity indicators for Europe</td>
<td>EO:ECMWF:DAT:WATER_QUALITY_INDICATOR_FOR_EUROPEAN_RIVERS</td>
<td>Daily</td>
<td>0.1 Deg</td>
<td>Europe</td>
<td>2011 to 2100</td>
</tr>
<tr>
<td>CAMS solar radiation time-series</td>
<td>EO:ECMWF:DAT:CAMS_SOLAR_RADIATION_TIMESERIES</td>
<td>Daily</td>
<td>-</td>
<td>Global</td>
<td>2010 to present</td>
</tr>
<tr>
<td>Global 10-daily Normalized Difference Vegetation Index 1KM</td>
<td>EO:CLMS:DAT:CGLS_GLOBAL_NDVI_V2_1KM</td>
<td>Daily</td>
<td>1 km</td>
<td>Global</td>
<td>2010 to present</td>
</tr>
<tr>
<td>Vegetation Indices, daily</td>
<td>EO:HRVPP:DAT:VEGETATION-INDICES</td>
<td>Daily</td>
<td>5 km</td>
<td>Global</td>
<td>2010 to present</td>
</tr>
<tr>
<td>River discharge and related forecasted data by the Global Flood
Awareness System</td>
<td>EO:ECMWF:DAT:CEMS_GLOFAS_FORECAST</td>
<td>Daily</td>
<td>5 km</td>
<td>Global</td>
<td>2010 to present</td>
</tr>
<tr>
<td>River discharge and related historical data from the Global Flood
Awareness System</td>
<td>EO:ECMWF:DAT:CEMS_GLOFAS_HISTORICAL</td>
<td>Daily</td>
<td>5 km</td>
<td>Global</td>
<td>2010 to present</td>
</tr>
<tr>
<td>Reforecasts of river discharge and related data by the Global Flood
Awareness System</td>
<td>EO:ECMWF:DAT:CEMS_GLOFAS_REFORECAST</td>
<td>Daily</td>
<td>5 km</td>
<td>Global</td>
<td>2010 to present</td>
</tr>
<tr>
<td>Seasonal forecasts of river discharge and related data by the Global
Flood Awareness System</td>
<td>EO:ECMWF:DAT:CEMS_GLOFAS_SEASONAL</td>
<td>Daily</td>
<td>5 km</td>
<td>Global</td>
<td>2010 to present</td>
</tr>
<tr>
<td>Seasonal reforecasts of river discharge and related data from the
Global Flood Awareness System</td>
<td>EO:ECMWF:DAT:CEMS_GLOFAS_SEASONAL_REFORECAST</td>
<td>Daily</td>
<td>5 km</td>
<td>Global</td>
<td>2010 to present</td>
</tr>
<tr>
<td>River discharge and related forecasted data by the European Flood
Awareness System</td>
<td>EO:ECMWF:DAT:EFAS_FORECAST</td>
<td>Daily</td>
<td>5 km</td>
<td>Global</td>
<td>2010 to present</td>
</tr>
<tr>
<td>River discharge and related historical data from the European Flood
Awareness System</td>
<td>EO:ECMWF:DAT:EFAS_HISTORICAL</td>
<td>Daily</td>
<td>5 km</td>
<td>Global</td>
<td>2010 to present</td>
</tr>
<tr>
<td>Reforecasts of river discharge and related data by the European
Flood Awareness System</td>
<td>EO:ECMWF:DAT:EFAS_REFORECAST</td>
<td>Daily</td>
<td>5 km</td>
<td>Global</td>
<td>2010 to present</td>
</tr>
<tr>
<td>Seasonal forecasts of river discharge and related data by the
European Flood Awareness System</td>
<td>EO:ECMWF:DAT:EFAS_SEASONAL</td>
<td>Daily</td>
<td>5 km</td>
<td>Global</td>
<td>2010 to present</td>
</tr>
<tr>
<td>Seasonal reforecasts of river discharge and related data by the
European Flood Awareness System</td>
<td>EO:ECMWF:DAT:EFAS_SEASONAL_REFORECAST</td>
<td>Daily</td>
<td>5 km</td>
<td>Global</td>
<td>2010 to present</td>
</tr>
<tr>
<td style="text-align: left;">Infrastructure</td>
<td>Sentinel-2 Level 2A: Bottom-Of-Atmosphere reflectances in
cartographic geometry</td>
<td>EO.ESA.DAT.SENTINEL-2.MSI.L2A</td>
<td>5 days</td>
<td>20 m</td>
<td>Global</td>
<td>2017 to present</td>
</tr>
<tr>
<td style="text-align: left;">Resources</td>
<td>Population distribution: Population on 1 January by age group, sex
and NUTS 3 region</td>
<td>STAT.EUSTAT.DAT.POP_AGE_GROUP_SEX_NUTS3</td>
<td> </td>
<td> </td>
<td> </td>
<td> </td>
</tr>
</tbody>
</table>

### Digital Twin

The following table details how the Climate Change Adaptation Digital
Twin (CCADT) is used.

The references for DestinE Digital Twins description is:

- the “DestinE - System Framework - Data Portfolio” document issue “v1I
  e-signed”

<table>
<caption><p>: DestinE Digital Twins used operationally</p></caption>
<colgroup>
<col style="width: 24%" />
<col style="width: 9%" />
<col style="width: 65%" />
</colgroup>
<thead>
<tr>
<th style="text-align: center;">Component</th>
<th style="text-align: center;">Digital Twin</th>
<th style="text-align: center;">Usage</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align: left;">Air quality</td>
<td style="text-align: left;">CCADT</td>
<td style="text-align: left;">Evaluation of the impact of meteorological
conditions evolutions on the air quality.<br />
The climate projections (air temperature, wind, precipitations) are
injected into the air quality super-resolution model to evaluate how air
quality would be impacted.</td>
</tr>
<tr>
<td style="text-align: left;">Urban Heat</td>
<td style="text-align: left;">CCADT</td>
<td style="text-align: left;">Evaluation of heat islands extent
according to the temperatures in 2030.<br />
The heat island is evaluated according to different air temperature
conditions. Climate projections are used to give information to the user
on the probable conditions in 2030, in particular the number of days per
year on which the temperature reach a certain level.</td>
</tr>
</tbody>
</table>

<table>
<caption><p>: DestinE Digital Twins used for comparisons</p></caption>
<colgroup>
<col style="width: 24%" />
<col style="width: 9%" />
<col style="width: 65%" />
</colgroup>
<thead>
<tr>
<th style="text-align: center;">Component</th>
<th style="text-align: center;">Digital Twin</th>
<th style="text-align: center;">Usage</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align: left;">Sea Level Rise and storm surges</td>
<td style="text-align: left;">CCADT</td>
<td style="text-align: left;">Assessing potential improvements of the
inundation product using relevant DT datasets. Comparison with existing
products in the framework of sea level rise.</td>
</tr>
<tr>
<td style="text-align: left;">Flood</td>
<td style="text-align: left;">CCADT</td>
<td style="text-align: left;">Include the data of the climate change
adaptation service into the flood simulation modelling pipeline of
Mozaika. Comparison of the outputs of the climate change adaptation
service with the results from the flood simulation model of Mozaika.
Integrate the climate change adaptation service data into ISME-HYDRO
e-Infrastructure.</td>
</tr>
<tr>
<td style="text-align: left;">Infrastructure</td>
<td style="text-align: left;">CCADT</td>
<td style="text-align: left;">Use in the Valencia demonstrator to
evaluate the probability of high precipitation events (such as the event
that occurred in November2024) in the coming years (up to 2040 according
to the temporal coverage of the CCADT in June 2025).</td>
</tr>
<tr>
<td style="text-align: left;">Resources</td>
<td style="text-align: left;">CCADT</td>
<td style="text-align: left;">Identify key climate risk hotspots
starting from local level and reaching national and regional level to
allow the drafting of management and conservation plans</td>
</tr>
</tbody>
</table>

The access to Digital Twins data has been first experimented during the
beta-testing phase of DestinE Platform in May 2024. Two options are
considered:

- Going through the **Data Cache Management system** (CacheB) and
  accessing precomputed Zarr files directly available in S3 storage.
  This is the most convenient way to integrate data into the components
  workflow. In particular for Air Quality and Urban Heat components, the
  same kind of data storage and interfaces are used for the currently
  exploited data, so the integration of this new data source should be
  straightforward. The downside is that all the model variables are not
  available in the precomputed Zarr files, though it covers the first
  needs for the UrbanSquare components. In particular it includes

  - High-resolution (0.05°) projections until 2023 for ground
    temperature, precipitations and wind

  - Medium resolution (0.35°) projections until 2023 for Boundary layer
    height, cloud cover

  - Historical ERA5-Land (0.1° resolution) for ground temperature,
    precipitation and wind

- The **Polytope** interface could also be used to extract some specific
  variables that would not be available through the cache mechanism. It
  is a more complex and specific interface, though it provides a broader
  access to the Digital Twins model variables. The integration of
  Polytope in an automated workflow has not been validated so far,
  mainly due to the incomplete documentation.

In the final operational implementation of the components, the solution
that has been favoured is the Data Cache Management System.

It should be noted that currently one climatic scenario (SSP7.0) is
available in the Climate Change Digital Twins, up to 2040, leading to a
limitation in the scenarios that can be considered in the what-if
scenario for the different components.

### Other data (could be added to Data Cache)

The following table details datasets used by UrbanSquare components that
are not currently available in DestinE and that the UrbanSquare
development team considers that it would be useful to add to DestinE’s
data offering (through the DestinE Data Cache for example).

<table style="width:100%;">
<caption><p>: Datasets used by UrbanSquare that would be useful to
access through DestinE Data Cache</p></caption>
<colgroup>
<col style="width: 12%" />
<col style="width: 25%" />
<col style="width: 20%" />
<col style="width: 10%" />
<col style="width: 10%" />
<col style="width: 10%" />
<col style="width: 10%" />
</colgroup>
<thead>
<tr>
<th style="text-align: center;">Component</th>
<th style="text-align: center;">Description</th>
<th style="text-align: center;">Source</th>
<th style="text-align: center;">Required temporal resolution</th>
<th style="text-align: center;">Required spatial resolution</th>
<th style="text-align: center;">Required spatial coverage</th>
<th style="text-align: center;">Required temporal coverage</th>
</tr>
</thead>
<tbody>
<tr>
<td rowspan="4" style="text-align: center;">Air quality</td>
<td style="text-align: center;">Copernicus Land Digital Elevation
Model</td>
<td style="text-align: center;">Copernicus Land</td>
<td style="text-align: center;">-</td>
<td style="text-align: center;">90 m</td>
<td style="text-align: center;">Global</td>
<td style="text-align: center;">2020, 2021, 2022, 2023 and future
releases</td>
</tr>
<tr>
<td style="text-align: center;">ESA WorldCover</td>
<td style="text-align: center;">ESA WorldCover platform</td>
<td style="text-align: center;">Annual</td>
<td style="text-align: center;">100 m</td>
<td style="text-align: center;">Global</td>
<td style="text-align: center;">2020, 2021 and future releases</td>
</tr>
<tr>
<td style="text-align: center;">Population density 1-km raster</td>
<td style="text-align: center;"><a
href="https://www.worldpop.org/about/"><u>WorldPop</u></a></td>
<td style="text-align: center;">Annual</td>
<td style="text-align: center;">1 km</td>
<td style="text-align: center;">Global</td>
<td style="text-align: center;">2020</td>
</tr>
<tr>
<td style="text-align: center;">Road network</td>
<td style="text-align: center;">Open Street Map</td>
<td style="text-align: center;">Annual</td>
<td style="text-align: center;">Vector</td>
<td style="text-align: center;">Global</td>
<td style="text-align: center;">Current status</td>
</tr>
<tr>
<td style="text-align: center;">Urban Heat</td>
<td style="text-align: center;">Landsat 8 &amp; 9 Collection 2</td>
<td style="text-align: center;">USGS</td>
<td style="text-align: center;">5 to 10 days</td>
<td style="text-align: center;">30 m</td>
<td style="text-align: center;">Global</td>
<td style="text-align: center;">2015 to present</td>
</tr>
<tr>
<td rowspan="7" style="text-align: center;">Sea Level Rise and storm
surges</td>
<td style="text-align: center;">AR6 climate projections</td>
<td style="text-align: center;">Copernicus Climate</td>
<td style="text-align: center;">daily</td>
<td style="text-align: center;">0.25 Deg</td>
<td style="text-align: center;">Global</td>
<td style="text-align: center;"></td>
</tr>
<tr>
<td style="text-align: center;">Copernicus GLO-30 Copernicus Digital
Elevation Model (DEM) - 30 m</td>
<td style="text-align: center;">Copernicus Land</td>
<td style="text-align: center;">-</td>
<td style="text-align: center;">30 m</td>
<td style="text-align: center;">Global</td>
<td style="text-align: center;"></td>
</tr>
<tr>
<td style="text-align: center;">Copernicus EEA-10M Copernicus Digital
Elevation Model (DEM) – 10m</td>
<td style="text-align: center;">Copernicus Land</td>
<td style="text-align: center;">-</td>
<td style="text-align: center;">10 m</td>
<td style="text-align: center;">EEA39</td>
<td style="text-align: center;"></td>
</tr>
<tr>
<td style="text-align: center;">ESA WorldCover</td>
<td style="text-align: center;">ESA WorldCover platform</td>
<td style="text-align: center;">Annual</td>
<td style="text-align: center;">10 m</td>
<td style="text-align: center;">Global</td>
<td style="text-align: center;">2020, 2021 and future releases</td>
</tr>
<tr>
<td style="text-align: center;">ESA WorldCereals</td>
<td style="text-align: center;">ESA WorldCereals platform</td>
<td style="text-align: center;">Annual</td>
<td style="text-align: center;">10 m</td>
<td style="text-align: center;">Global</td>
<td style="text-align: center;">2021 and future releases</td>
</tr>
<tr>
<td style="text-align: center;">JRC Global Human Settlement – GHS
POP</td>
<td style="text-align: center;">GHS platform</td>
<td style="text-align: center;">Annual</td>
<td style="text-align: center;">100 m</td>
<td style="text-align: center;">Global</td>
<td style="text-align: center;">2020</td>
</tr>
<tr>
<td style="text-align: center;">JRC Global Human Settlement –
BUILT-S</td>
<td style="text-align: center;">GHS platform</td>
<td style="text-align: center;">Annual</td>
<td style="text-align: center;">100 m</td>
<td style="text-align: center;">Global</td>
<td style="text-align: center;">2020</td>
</tr>
<tr>
<td rowspan="3" style="text-align: center;">Infrastructure</td>
<td style="text-align: center;">Planet optical imagery</td>
<td style="text-align: center;">PlanetScope</td>
<td style="text-align: center;">Daily</td>
<td style="text-align: center;">3,5m</td>
<td style="text-align: center;"><p>Local</p>
<p>Specific to area damaged by natural disasters</p></td>
<td style="text-align: center;"><p>Specific</p>
<p>Before/after natural disaster event</p></td>
</tr>
<tr>
<td style="text-align: center;">Pléaides optical imagery</td>
<td style="text-align: center;">Airbus (through Skywatch platform)</td>
<td style="text-align: center;">On request</td>
<td style="text-align: center;">50cm</td>
<td style="text-align: center;"><p>Local</p>
<p>Specific to area damaged by natural disasters</p></td>
<td style="text-align: center;"><p>Specific</p>
<p>Before/after natural disaster event</p></td>
</tr>
<tr>
<td style="text-align: center;">Pléaides-NEO optical imagery</td>
<td style="text-align: center;">Airbus (through Skywatch platform)</td>
<td style="text-align: center;">On request</td>
<td style="text-align: center;">30cm</td>
<td style="text-align: center;"><p>Local</p>
<p>Specific to area damaged by natural disasters</p></td>
<td style="text-align: center;"><p>Specific</p>
<p>Before/after natural disaster event</p></td>
</tr>
<tr>
<td rowspan="2" style="text-align: center;">Flood</td>
<td style="text-align: center;">River shape files</td>
<td style="text-align: center;">hydroSheds platform</td>
<td style="text-align: center;">On request</td>
<td style="text-align: center;"></td>
<td style="text-align: center;">hydrographic data for global and
regional applications</td>
<td style="text-align: center;"></td>
</tr>
<tr>
<td style="text-align: center;">Discharge data</td>
<td style="text-align: center;">Runoff data center</td>
<td style="text-align: center;">On request</td>
<td style="text-align: center;">m3/sec</td>
<td style="text-align: center;">quality assured river discharge
data</td>
<td style="text-align: center;"></td>
</tr>
</tbody>
</table>

### External datasets

The following table details the datasets used by UrbanSquare components
that are not available in DestinE, and that the UrbanSquare development
team considers would not be useful to add to DestinE's data offering.

<table style="width:100%;">
<caption><p>: External datasets used by UrbanSquare</p></caption>
<colgroup>
<col style="width: 12%" />
<col style="width: 25%" />
<col style="width: 20%" />
<col style="width: 10%" />
<col style="width: 10%" />
<col style="width: 10%" />
<col style="width: 10%" />
</colgroup>
<thead>
<tr>
<th style="text-align: center;">Component</th>
<th style="text-align: center;">Description</th>
<th style="text-align: center;">Source</th>
<th style="text-align: center;">Required temporal resolution</th>
<th style="text-align: center;">Required spatial resolution</th>
<th style="text-align: center;">Required spatial coverage</th>
<th style="text-align: center;">Required temporal coverage</th>
</tr>
</thead>
<tbody>
<tr>
<td rowspan="2" style="text-align: left;">Air quality</td>
<td style="text-align: left;">Air quality In situ measurements</td>
<td style="text-align: left;">ATMO (France), EEA</td>
<td style="text-align: center;">Hourly</td>
<td style="text-align: center;">Depending on the sensor location</td>
<td style="text-align: center;">Depending on the sensor location</td>
<td style="text-align: center;">2019 - present</td>
</tr>
<tr>
<td style="text-align: left;">Traffic data from permanent sensors</td>
<td style="text-align: left;">Open Data Paris</td>
<td style="text-align: center;">Hourly</td>
<td style="text-align: center;">Depending on the sensor location</td>
<td style="text-align: center;">Depending on the sensor location</td>
<td style="text-align: center;">2019 - present</td>
</tr>
<tr>
<td rowspan="7" style="text-align: left;">Flood</td>
<td style="text-align: left;">Temperature</td>
<td style="text-align: left;">MODIS land surface temperature day</td>
<td style="text-align: center;">daily</td>
<td style="text-align: center;">5 Km</td>
<td style="text-align: center;">Global</td>
<td style="text-align: center;">2000 - present</td>
</tr>
<tr>
<td style="text-align: left;">Soil Moisture</td>
<td style="text-align: left;">ERA5</td>
<td style="text-align: center;">daily</td>
<td style="text-align: center;">10 Km</td>
<td style="text-align: center;">Global</td>
<td style="text-align: center;">2010 - present</td>
</tr>
<tr>
<td style="text-align: left;">Precipitation</td>
<td style="text-align: left;">imerg liquid precipitation daily</td>
<td style="text-align: center;">daily</td>
<td style="text-align: center;">10 Km</td>
<td style="text-align: center;">Global</td>
<td style="text-align: center;">2000 - present</td>
</tr>
<tr>
<td style="text-align: left;"></td>
<td style="text-align: left;">imerg solid precipitation daily</td>
<td style="text-align: center;">daily</td>
<td style="text-align: center;">10 Km</td>
<td style="text-align: center;">Global</td>
<td style="text-align: center;">2000 - present</td>
</tr>
<tr>
<td style="text-align: left;">Snow cover</td>
<td style="text-align: left;">MODIS Snow cover</td>
<td style="text-align: center;">daily</td>
<td style="text-align: center;">1 Km</td>
<td style="text-align: center;">Global</td>
<td style="text-align: center;">2000 - present</td>
</tr>
<tr>
<td style="text-align: left;">Solar irradiance</td>
<td style="text-align: left;">MSG Downwelling Shortwave Surface
Flux</td>
<td style="text-align: center;">daily</td>
<td style="text-align: center;">30 m</td>
<td style="text-align: center;">Global</td>
<td style="text-align: center;">2008 - present</td>
</tr>
<tr>
<td style="text-align: left;">Vegetation index</td>
<td style="text-align: left;">Sentinel 2 NDVI</td>
<td style="text-align: center;">5 days</td>
<td style="text-align: center;">10 m</td>
<td style="text-align: center;">Global</td>
<td style="text-align: center;">2015 - present</td>
</tr>
</tbody>
</table>

## Output Data

*Table 7 : Datasets generated by UrbanSquare*

<table>
<colgroup>
<col style="width: 19%" />
<col style="width: 58%" />
<col style="width: 12%" />
<col style="width: 9%" />
</colgroup>
<thead>
<tr>
<th rowspan="2">Component</th>
<th rowspan="2">Description</th>
<th colspan="2">Resolution</th>
</tr>
<tr>
<th><strong>Temporal</strong></th>
<th><strong>Spatial</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td rowspan="5">Air quality</td>
<td>Super resolution NO2 pollution map</td>
<td>Hourly</td>
<td>1 km</td>
</tr>
<tr>
<td>Climate Change scenario air quality map</td>
<td>Hourly</td>
<td>1 km</td>
</tr>
<tr>
<td>Road transformation scenario air quality map</td>
<td>Hourly</td>
<td>1 km</td>
</tr>
<tr>
<td>Low emission zone scenario air quality map</td>
<td>Hourly</td>
<td>1 km</td>
</tr>
<tr>
<td>Urbanisation change air quality map</td>
<td>Hourly</td>
<td>1 km</td>
</tr>
<tr>
<td rowspan="6">Urban Heat</td>
<td>Land Surface Temperature map</td>
<td>Seasonal</td>
<td>30 m</td>
</tr>
<tr>
<td>Air temperature map (resampled from 10 km)</td>
<td>Seasonal</td>
<td>30 m</td>
</tr>
<tr>
<td>LST Difference to Air temperature map</td>
<td>Seasonal</td>
<td>30 m</td>
</tr>
<tr>
<td>LST classified map</td>
<td>Seasonal</td>
<td>30 m</td>
</tr>
<tr>
<td>Urban Heat Island map</td>
<td>Seasonal</td>
<td>30m</td>
</tr>
<tr>
<td>Extreme heat wave scenario urban heat island map</td>
<td>Seasonal</td>
<td>30 m</td>
</tr>
<tr>
<td>Storm &amp; Sea Level Rise</td>
<td>Inundation risk maps</td>
<td>20-30 years</td>
<td>30 m</td>
</tr>
<tr>
<td rowspan="2">Flood</td>
<td>Flood risk simulation map</td>
<td>-</td>
<td>30 m</td>
</tr>
<tr>
<td>Flood forecast map</td>
<td>Daily, up to 30 days ahead</td>
<td>30 m</td>
</tr>
<tr>
<td>Resources</td>
<td>Flooded land objects map</td>
<td>-</td>
<td>30 m</td>
</tr>
<tr>
<td>Infrastructure</td>
<td>Damaged road network map</td>
<td>-</td>
<td>30cm</td>
</tr>
</tbody>
</table>

# Workflow description

## Air quality

<figure>
<img src="media/image9.png" style="width:6.29921in;height:2.59033in" />
<figcaption><p>: Air quality component workflow</p></figcaption>
</figure>

## Urban Heat

<figure>
<img src="media/image10.png" style="width:6.29921in;height:2.73982in" />
<figcaption><p>: Urban Heat component workflow</p></figcaption>
</figure>

## Sea level rise and storm surges

<figure>
<img src="media/image11.png" style="width:6.76772in;height:3.80556in" />
<figcaption><p>: Inundation maps generation workflow for the Storm and
Sea level rise component.</p></figcaption>
</figure>

<figure>
<img src="media/image12.png" style="width:6.76772in;height:2.93056in"
alt="A diagram of a model AI-generated content may be incorrect." />
<figcaption><p>: Storm and Sea level rise component
architecture.</p></figcaption>
</figure>

## Flood

<figure>
<img src="media/image13.png" style="width:4.72441in;height:5.14803in" />
<figcaption><p>: Flood component workflow</p></figcaption>
</figure>

## Resources

The architecture of the Resources component is the same as for the Flood
component, shown above.

Additional datasets have been leveraged specifically for the Resources
component:

- EUROSTAT: Population distribution: Population on 1 January by age
  group, sex and NUTS 3 region

- Buildings, roads, Forests and critical infrastructures (bridges,
  hospitals, schools and archaeological sites) from mapflow.ai and
  OpenStreeMap.

These features are visualised in the Flood/Resources GUI, and statistics
are computed, as shown in the Figure below.

<figure>
<img src="media/image14.png" style="width:6.76806in;height:2.90833in"
alt="A aerial view of a river AI-generated content may be incorrect." />
<figcaption><p>: Buildings, roads and forests feature in the Flood
GUI</p></figcaption>
</figure>

<figure>
<img src="media/image15.png" style="width:4.63606in;height:2.91707in"
alt="A map of land with numbers and text AI-generated content may be incorrect." />
<figcaption><p>: Flood impact statistics</p></figcaption>
</figure>

## Infrastructures

### Workflow

1.  Selection of a testing area

<figure>
<img src="media/image16.png" style="width:5.51181in;height:4.59336in"
alt="Aerial view of a city AI-generated content may be incorrect." />
<figcaption><p>: Selected area (Valencia, Spain)</p></figcaption>
</figure>

1.  High-resolution Pleiades imagery was used to manually label two
    classes: paved roads (1) and non-paved areas (2).

2.  Preparation of training data for machine learning by stacking the
    following features:

    - VHR spectral bands

    - Spectral indices such as NDV, NDWI, SAVI, BSI

    - The manually labelled data (paved and non-paved)

3.  Application of a classification model -&gt; A random forest
    classifier was trained on 80% of the labelled data and applied to
    classify roads in the study area.

<figure>
<img src="media/image17.png" style="width:5.51181in;height:4.13386in"
alt="A yellow and blue graph AI-generated content may be incorrect." />
<figcaption><p>: Result of the road classifier</p></figcaption>
</figure>

1.  Initial road detection and probability thresholding

    - The classification results showed that not many roads were
      detected.

    - To refine the detection, a probability layer was used, and a
      threshold of 0.33 was set to classify areas as roads.

<figure>
<img src="media/image18.png" style="width:5.51181in;height:4.13835in"
alt="A map of a city AI-generated content may be incorrect." />
<figcaption><p>: Result of the road probability
classifier</p></figcaption>
</figure>

1.  Post-processing to reduce noise

    - The classification results appeared salt-and-peppery, with many
      small, fragmented patches.

    - Morphological operations such as closing were applied to improve
      the continuity of detected roads.

2.  Vectorization of detected roads

    - After post-processing, the detected roads were converted into
      polygon vectors for further analysis.

<figure>
<img src="media/image19.png" style="width:5.51181in;height:5.51181in"
alt="A blue and white map AI-generated content may be incorrect." />
<figcaption><p>: Vectorised road network</p></figcaption>
</figure>

1.  Integration of OpenStreetMap (OSM) data

    - Road data from OpenStreetMap (OSM) was extracted and processed in
      two formats:

      - As an undirected graph (nodes and edges representation)

<figure>
<img src="media/image20.png" style="width:3.14961in;height:3.14961in"
alt="A map of the constellation of the constellation of the star AI-generated content may be incorrect." />
<figcaption><p>: OSM graph road network</p></figcaption>
</figure>

- As polygon vectors (for direct spatial comparison)

1.  Overlay analysis: detected vs. OSM roads

    - The detected roads (from the classification) were overlaid with
      OSM road polygons (ground truth).

    - Areas where OSM indicates a road, but no road was detected, were
      considered as potential blockages.

2.  Visual inspection of the potential blockages showed that some were
    caused by building shadows rather than being actual blockages 🡪 Can
    we identify the ones caused by mud?

<!-- -->

1.  Mud-Index application:

- A Mud-Index from literature
  (<https://www.mdpi.com/2072-4292/17/5/770>) was computed to assess
  muddy areas.

> Alcaras, E. (2025). Flood Mud Index (FMI): A Rapid and Effective Tool
> for Mapping Muddy Areas After Floods—The Valencia Case. *Remote
> Sensing*, *17*(5), 770. <https://doi.org/10.3390/rs17050770>

<figure>
<img src="media/image21.png" style="width:5.51181in;height:4.13386in"
alt="A map of a city AI-generated content may be incorrect." />
<figcaption><p>: Mud index</p></figcaption>
</figure>

- A threshold was applied to the Mud-Index to identify areas with high
  mud probability.

- The Mud-Index was overlaid with the detected blockages:

  - If a blockage coincided with a high mud probability, it was assumed
    to be a blockage caused by mud and marked in a different colour

<figure>
<img src="media/image22.png" style="width:5.51181in;height:5.51181in"
alt="A map of a city AI-generated content may be incorrect." />
<figcaption><p>: Detection of blocked roads</p></figcaption>
</figure>

### Limitations

- Deficient detection of roads when covered by earth and mud. Not a
  clear cut-off road, but all of them affected to some degree.

- Some OSM roads are missing, and geographical alignment is not totally
  accurate. Buffering was used to account for slight misalignments, but
  it has to be used carefully. Too much buffering and actual blockages
  might be missed.

- Building’s shadows can be detected as blockages.

### Connectivity assessment to build an evacuation scenario

Evacuation scenarios can be built using the OSM graph road network
compared to a graph extracted from detected roads.

The detected roads can be transformed into a graph. An edge is drawn
between two nodes if there is a possible path between them.

If an edge is present in the OSM graph but missing in the detected
roads, that means that the road is blocked and that an alternative path
should be defined in the graph.

# What-if scenarios

## Overview

<table>
<caption><p>: What if scenarios overview</p></caption>
<colgroup>
<col style="width: 18%" />
<col style="width: 81%" />
</colgroup>
<thead>
<tr>
<th style="text-align: center;">Component</th>
<th style="text-align: center;">Whatif scenario description</th>
</tr>
</thead>
<tbody>
<tr>
<td>Air quality</td>
<td>Assessing the impact of relevant policies (transforming roads into
walking street, Low Emission Zone deployment…) and climate change
(meteorological conditions) to support decision making</td>
</tr>
<tr>
<td>Urban Heat</td>
<td>Simulation of three extreme heat waves indicators. The relation
between air temperature and land surface temperature is assessed with
historical data. Air temperature projections from ‘Climate Change
Adaptation’ are then used, following different climate scenarios
provided, to assess the future urban heat island situation.</td>
</tr>
<tr>
<td>Flood</td>
<td>Three forecast flood scenarios based on water quantity projections.
The impact on human infrastructure, including the farming sector, is
assessed, in view of planning needed resources for recovery.</td>
</tr>
<tr>
<td>Sea level rise and storm surges</td>
<td>Sea level rise what-if scenarios can be generated for the year
2040-2150 from the combination of five different Shared Socioeconomic
Pathways<a href="#fn1" class="footnote-ref" id="fnref1"
role="doc-noteref"><sup>1</sup></a> (SSP) and seven storm surge
levels.</td>
</tr>
<tr>
<td>Resources</td>
<td>Resources consumption scenarios are produced based on three
population density scenarios.</td>
</tr>
<tr>
<td>Infrastructure</td>
<td>Assessment of the high precipitation risk in the area based on
historical data (ERA5) and high resolution projection data (CCADT) to
highlight the evolution between current and future conditions.</td>
</tr>
</tbody>
</table>
<section id="footnotes" class="footnotes footnotes-end-of-document"
role="doc-endnotes">
<hr />
<ol>
<li id="fn1"><p><a
href="https://www.sciencedirect.com/topics/earth-and-planetary-sciences/shared-socioeconomic-pathways"><u>https://www.sciencedirect.com/topics/earth-and-planetary-sciences/shared-socioeconomic-pathways</u></a><a
href="#fnref1" class="footnote-back" role="doc-backlink">↩︎</a></p></li>
</ol>
</section>

## Air quality

The air quality component relies on an AI super resolution model. This
model increases the spatial resolution of daily N2 concentration data
from 10 kilometres (in Copernicus Atmosphere European forecast product)
to 1 kilometre. The list of input datasets includes Copernicus
Atmosphere European forecast product as well as air pollution
influential factors: meteorological conditions from ERA5, static
environmental conditions (topography, land cover) and human activities
data (road network, traffic tendency, population density...).

<figure>
<img src="media/image23.png" style="width:6.29921in;height:2.52692in" />
<figcaption><p>: Super resolution air quality monitoring
model</p></figcaption>
</figure>

This model generates a daily 1-km NO2 concentration raster map with
near-real-time delivery (a few days of latency).

By tweaking the datasets feeding the model, it can be used to simulate
some specific scenarios. Predictions of air pollution maps can be
generated according to specific hypotheses on the influential factors.
The “what-if” scenarios are built on the following hypotheses:

- Climate change will have an impact on average temperature and
  precipitation conditions. The associated average air pollution
  conditions will be evaluated according to several climate change
  scenarios (RCPs).

- Urban renovation can lead to lower the size and number of roads
  dedicated to car traffic. It can be simulated by modifying the road
  network used as input of the model.

- Implementing low emission zone policies aim at limiting the car
  traffic. It can be simulated by modifying the traffic tendency used as
  input of the model.

- Urban renovation can lead to increase or decrease the population
  density in an area. It can be simulated by modifying the urban density
  raster map used as input of the model.

<figure>
<img src="media/image24.png" style="width:6.29921in;height:2.16688in" />
<figcaption><p>: Air quality what-if scenario</p></figcaption>
</figure>

The implemented scenarios include different influential factors:

- Road traffic: this section features a dropdown menu with several
  options: 0%, 50%, 150%, and 200%. By selecting one of these options,
  users can simulate changes in road traffic and instantly see the
  updated time series data for air quality. For instance, choosing a 50%
  reduction option will update the chart to show the potential
  improvement in air quality, while selecting a 200% increase option
  will demonstrate how a surge in traffic could worsen air quality.

<figure>
<img src="media/image25.png" style="width:5.51181in;height:2.20563in"
alt="A screen shot of a graph AI-generated content may be incorrect." />
<figcaption><p>: Air quality road traffic what if
scenario</p></figcaption>
</figure>

- Air temperature: several options are available (+1°C, +1,5°C, +2°C).
  By selecting one of these options, users can simulate changes in
  averaged air temperature and see the updated time series data for air
  quality.

<figure>
<img src="media/image26.png" style="width:5.51181in;height:2.18188in"
alt="A screen shot of a graph AI-generated content may be incorrect." />
<figcaption><p>: Air quality temperature what if
scenario</p></figcaption>
</figure>

## Urban-Heat

The goal is to project and visualise Land Surface Temperature (LST)
during heat waves with specific air temperatures (30°C, 35°C, 40°C,
45°C) and link it to climate change scenarios (SSP). This approach will
help stakeholders understand potential future climate conditions and
make informed decisions regarding urban heat management.

------------------------------------------------------------------------

**Data Preparation and Extraction**

Data Sources:

- Landsat 8/9: Historical and current LST data.

- Digital Twin Climate Change Adaptation from DestinE: Air temperature
  projections for various SSP scenarios.

LST Projections:

- Method: Use pixel-wise linear regression to compute LST projections
  based on the selected air temperatures (30°C, 35°C, 40°C, 45°C).

- Steps:

1.  Implement **pixel-wise linear regression** for each pixel in the
    study area to establish a relationship between air temperature and
    LST.

2.  Apply the regression model to project LST for each pixel to predict
    the temperature of four type of heat waves

    1.  Moderate Heat Wave (30°C)

    2.  Severe Heat Wave (35°C)

    3.  Intense Heat Wave (40°C)

    4.  Extreme Heat Wave (45°C)

3.  Calculate the average annual number of days where temperatures meet
    or exceed 30°C, 35°C, 40°C, and 45°C for each SSP scenario using
    historical and projected temperature data, and visualise the results
    in a bar chart with SSP scenarios on the x-axis and the number of
    days on the y-axis to allow comparison by SSP scenarios.

**User Interface Enhancements**

- Dropdown Menu:

  - Add a dropdown menu for selecting air temperatures (30°C, 35°C,
    40°C, 45°C).

  - Include options for users to choose SSP scenarios and year.

- Map Updates:

  - Enhance the map component to display LST projections dynamically
    based on selected air temperatures.

- Probability Display:

  - Use bar charts graphs to visualise the likelihood of different
    temperature thresholds being reached under each SSP scenario and
    year.

**User experience**

Users will be presented with a dropdown menu to select specific air
temperatures (30°C, 35°C, 40°C, 45°C) and projection years. Upon
selection, the map will dynamically update to display LST projections. A
bar chart will show the average annual number of days where temperatures
meet or exceed the chosen thresholds for each SSP scenario, positioned
below the map for easy comparison. This interactive and responsive
design will ensure that stakeholders can easily explore and understand
potential future climate conditions.

## Flood

### Simulation and forecasting tool

The flood component forecasts and simulates flood events. It is
integrated in a federated manner into DestinE platform. The flood
forecasting uses the EO4AI method for forecasting of hydrological
features of ISME-HYDRO and applies the results of them to Copernicus
digital elevation model to project the flooded areas and hence visualize
the flood span on the interactive map of the ISME-HYDRO interface, as
sown on Figure 19.

The flood map is integrated into ISME-HYDRO semantic e-Infrastructure,
and can be obtained along with numeric values of the water levels by
running a query about water level on the ISME-HYDRO GUI. Figure 19 shows
the result of such a query. In this way, the users can obtain
information about past or future flood by merely inquiring about the
water level at a certain point or area of a given river.

<figure>
<img src="media/image27.png" style="width:6.76772in;height:2.33333in"
alt="A screenshot of a computer AI-generated content may be incorrect." />
<figcaption><p>: Flood forecast GUI</p></figcaption>
</figure>

To leverage the situations where no real flood is foreseen, based on the
available forecasts, we add a flood simulation component that allows the
users to specify scenarios, by providing information on steam flow
amount and initial point for the flood event, as shown in Figure 20
below. To make the user navigation over the map easier, the user is
provided the option to select a river and a monitoring point on it as
well.

<figure>
<img src="media/image28.png" style="width:6.76806in;height:2.65833in"
alt="A screenshot of a computer AI-generated content may be incorrect." />
<figcaption><p>: Flood simulation GUI</p></figcaption>
</figure>

After running the simulation, ISME-HYDRO returns in real time the
simulated flood on the specified location with its flood span, and
flooded areas, as shown in Figure 21.

<figure>
<img src="media/image29.png" style="width:6.76806in;height:2.66042in"
alt="A map of a body of water AI-generated content may be incorrect." />
<figcaption><p>: Flood simulation results</p></figcaption>
</figure>

In addition, Figure 21 shows that the flood simulator generates
statistics regarding the potentially incurred damages, e.g. buildings,
roads, forests affected, types of critical buildings affected, like
hospitals, schools, bridges, archaeological sites, cities and the
population count affected. This functionality is the provided solution
for the use case “Resources”, closely related to the Flood
functionality. The results of the simulation provide visualization of
the flood span. Additionally, the tool integrates datasets of buildings,
roads and forests from mapflow.ai, datasets with types of buildings and
infrastructure from OpenStreetMap (e.g. schools, hospitals,
archeological sites, bridges) and statistical information about the
cities and their population from Eurostat. This allows the tool to
provide the users with estimation about the potential damages that will
occur in the event of a given flood.

### Methodology

The flood model makes use of Copernicus Digital Elevation Model (DEM),
river shapes information from hydroSHEDS and a flood fill algorithm to
distribute the spread of the water across the terrain, based on the
stream flow amount and water level, combined with the flow direction of
the river. The HydroSHEDS shapefiles include multiple layers of
hydrological features, encompassing river networks with flow direction
and accumulation data, reservoir and dam locations with structural
characteristics, and watershed boundaries that define drainage basins.
Each feature contains rich metadata including flow rates and
hierarchical coding systems that allow for systematic analysis of water
connectivity and downstream relationships. The shapefiles are converted
into GeoJSON format to optimize performance and functionality for the
web-based flood simulator application. The flood fill algorithm
simulates how water spreads from a specific starting point across
terrain, using elevation data points. It integrates local flow behavior
with surrounding terrain features, adjusting for both streamflow and
water level. The output is a distribution map allocating proportional
amounts of the initial streamflow to different locations on a
standardized scale. This approach ensures that the web-based flood
simulator can handle large-scale hydrographic datasets efficiently while
providing users with intuitive, interactive tools for analyzing
potential flood impacts and water management scenarios across different
geographic regions.

The water level is determined by applying established stage-discharge
relationships and hydraulic modeling principles. This process utilizes
rating curves to convert measured discharge values (Q, in m³/s) into
corresponding water levels (H, in meters). The relationship between
discharge and water level is expressed by the following quadratic
formula, derived from the stage-discharge curve:

$\frac{\sqrt{^{}}}{}$ (3)

Where:

- H is the water level.

- Q is the discharge.

- A, B, and C are site-specific coefficients determined for each river
  gauging station. These coefficients are unique to each location and
  are used to model the relationship between water level and discharge
  at that specific point.

For the resources and impact estimation the datasets of Overpass API to
retrieve land objects like buildings, roads, forests, and the finer
granularity of types of buildings with importance in emergency response
situations like hospitals, schools, bridges and archeological sites.

To include cities and population count in the damage estimation, the
flood simulator makes use of Eurostat dataset
STS.EUSTAT.DAT.POP\_AGE\_GROUP\_SEX\_NUTS3[1] and the World Cities[2]
database.

### Validation

The validation of the simulation process has been carried out by
comparing simulations from classical hydrological models (hydrological
tool, e.g. HEC-RAS) with simulations produced by ISME-HYDRO flood
simulator. The comparisons are made with three methods:

1.  Comparing the visualization of the flood span on the map,

2.  Heatmaps of the flood span based on the water level values,

3.  Graphical view, comparing the curves between minimum and maximum
    water level values of a given simulation, given equal input
    parameters for generating the simulation.

For example, Figure 20 and Figure 21 show the visualization of the flood
simulations on the Danube river around Svishtov, produced by HEC-RAS and
the flood simulator of ISME-HYDRO with equal streamflow conditions. It
clearly shows that the two images display the same trend in the flooded
areas.

<img src="media/image30.png" style="width:4.7in;height:3.2167in"
alt="A blue river flowing through a city AI-generated content may be incorrect." />

: Simulation of flood on the Danube around Svishtov with HEC-RAS

<figure>
<img src="media/image31.png" style="width:4.52616in;height:3.15833in"
alt="A blue river flowing through a green area AI-generated content may be incorrect." />
<figcaption><p>: Simulation of flood on the Danube around Svishtov with
ISME-HYDRO flood simulator</p></figcaption>
</figure>

Figure 22 and Figure 23 show the flood simulations on Turia river in
Valencia, produced with HEC-RAS and with ISME-HYDRO flood simulator.
Again, the trends are almost identical.

<figure>
<img src="media/image32.png" style="width:4.54167in;height:3.45833in"
alt="A map of a city AI-generated content may be incorrect." />
<figcaption><p>: Simulation of flood on Turia river in Valencia with
HEC-RAS</p></figcaption>
</figure>

<figure>
<img src="media/image33.png" style="width:4.54167in;height:3.54809in"
alt="A map of a city AI-generated content may be incorrect." />
<figcaption><p>: Simulation of flood on the Turia river in Valencia with
ISME-HYDRO flood simulator</p></figcaption>
</figure>

This is highlighted in Figure 24, in which the two flood spans are
placed one on top of the other. No significance divergences in the flood
shape can be noticed.

<figure>
<img src="media/image34.png" style="width:4.46667in;height:3.50417in"
alt="A map of a city AI-generated content may be incorrect." />
<figcaption><p>: Visualization of the flood simulations on Turia river
in Valencia with HEC-RAS and ISME-HYDRO flood simulator</p></figcaption>
</figure>

The second phase of the validation consists in comparing the heatmaps of
the flood simulations, generated under equal streamflow conditions by
ISME-HYDRO flood simulator and HEC-RAS. They demonstrate the differences
in the water levels of the flood spans in centimeter. Figure 25 and
Figure 26 show this comparison for the simulations of floods on the
Danube river around Svishtov and on Turia river in Valencia.

<figure>
<img src="media/image35.png" style="width:6.76806in;height:2.55556in"
alt="A screenshot of a graph showing a map AI-generated content may be incorrect." />
<figcaption><p>: Heatmaps of the flood simulations with HEC-RAS and
ISME-HYDRO flood simulator on the Danube river around
Svishtov.</p></figcaption>
</figure>

The differences in the depths, hence the stream flows are insignificant.

<figure>
<img src="media/image36.png" style="width:6.76806in;height:2.55556in"
alt="A graph of a graph showing a variety of blue dots AI-generated content may be incorrect." />
<figcaption><p>: Heatmaps of the flood simulations with HEC-RAS and
ISME-HYDRO flood simulator on the Turia river in
Valencia</p></figcaption>
</figure>

Finally, to estimate the flood flow differences between the simulations
generated with HEC-RAS and with ISME-HYDRO flood simulator under equal
stream flow conditions, a graphical view of the water level values curve
along 25K flood points is presented for the two validation scenarios of
the flood simulation on the Danube around Svishtov (see Figure 24) and
the flood simulation on Turia river in Valencia (see Figure 25). The
analysis of the curves establishes differences in the curves related to
the higher water levels, but overall they follow a parallel trend.

<figure>
<img src="media/image37.png" style="width:6.76806in;height:3.86736in"
alt="A graph showing a red line and blue line AI-generated content may be incorrect." />
<figcaption><p>: Comparison of Minimal and Maximal water levels of the
flood simulation on the Danube river around Svishtov with HEC-RAS and
with ISME-HYDRO flood simulator</p></figcaption>
</figure>

<figure>
<img src="media/image38.png" style="width:6.76806in;height:3.86736in"
alt="A graph of a flood AI-generated content may be incorrect." />
</figure>

Figure 30: Comparison of Minimal and Maximal water levels of the flood
simulation on the Turia river in Valencia with HEC-RAS and with
ISME-HYDRO flood simulator

Finally, a quantitative analysis shows that the differences between
simulations generated with the standard hydrological model in HEC-RAS
and the model of ISME-HYDRO are minimal, see Table 1 below. They are due
to the application of different parameters in the flood models. These
differences can be minimized after further calibration of the models.
The HEC-RAS model employs Manning’s roughness coefficients among other
hydrological metrics, whereas ISME-HYDRO employs RFSM Rapid Flood
Spreading Model.

<table>
<caption><p>Table 9 Flooded area and number of geolocated points
comparison</p></caption>
<colgroup>
<col style="width: 22%" />
<col style="width: 18%" />
<col style="width: 19%" />
<col style="width: 20%" />
<col style="width: 19%" />
</colgroup>
<thead>
<tr>
<th style="text-align: center;"><strong>Flood model</strong></th>
<th colspan="2" style="text-align: center;"><strong>Danube around
Svishtov</strong></th>
<th colspan="2" style="text-align: center;"><strong>Turia in
Valencia</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td></td>
<td style="text-align: center;">Flooded area km<sup>2</sup></td>
<td style="text-align: center;">Number of geolocated points</td>
<td style="text-align: center;">Flooded area km<sup>2</sup></td>
<td style="text-align: center;">Number of geolocated points</td>
</tr>
<tr>
<td>ISME-HYDRO</td>
<td style="text-align: right;">194,055</td>
<td style="text-align: right;">26,713</td>
<td style="text-align: right;">26,914</td>
<td style="text-align: right;">5,296</td>
</tr>
<tr>
<td>HEC-RAS</td>
<td style="text-align: right;">188,937</td>
<td style="text-align: right;">24,961</td>
<td style="text-align: right;">28,888</td>
<td style="text-align: right;">5,533</td>
</tr>
</tbody>
</table>

Table 2 shows the overlap ratio of the flooded areas produced by HEC-RAS
simulation and by ISME-HYDRO simulation.

<table>
<caption><p>Table 10 Flooded area overlap ratio</p></caption>
<colgroup>
<col style="width: 22%" />
<col style="width: 18%" />
<col style="width: 19%" />
<col style="width: 20%" />
<col style="width: 19%" />
</colgroup>
<thead>
<tr>
<th style="text-align: center;"><strong>Flood model</strong></th>
<th colspan="2" style="text-align: center;"><strong>Danube around
Svishtov</strong></th>
<th colspan="2" style="text-align: center;"><strong>Turia in
Valencia</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td>overlap ratio</td>
<td>Flooded area km<sup>2</sup> overlap ratio</td>
<td>Number of geolocated points</td>
<td>Flooded area km<sup>2</sup> overlap ratio</td>
<td>Number of geolocated points</td>
</tr>
<tr>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<td>HEC-RAS/ISME-HYDRO</td>
<td style="text-align: right;">97%</td>
<td style="text-align: right;">93%</td>
<td style="text-align: right;">107%</td>
<td style="text-align: right;">104%</td>
</tr>
</tbody>
</table>

To provide a more convincing leverage of the validation, comparative
experiments with different stream flow levels starting from the same
initial point have been planned (see Table 11) and carried out.

<table>
<caption><p>Table 11</p></caption>
<colgroup>
<col style="width: 19%" />
<col style="width: 39%" />
<col style="width: 41%" />
</colgroup>
<tbody>
<tr>
<td>River</td>
<td>Metrologic Station</td>
<td>Stream flow (m3/sec)</td>
</tr>
<tr>
<td> </td>
<td> </td>
<td> </td>
</tr>
<tr>
<td>Danube</td>
<td>Svishtov</td>
<td>10960</td>
</tr>
<tr>
<td> </td>
<td>Svishtov</td>
<td>14656</td>
</tr>
<tr>
<td> </td>
<td style="text-align: center;">Svishtov</td>
<td>17296</td>
</tr>
<tr>
<td> </td>
<td>Lom</td>
<td>9640</td>
</tr>
<tr>
<td> </td>
<td> </td>
<td>13072</td>
</tr>
<tr>
<td> </td>
<td> </td>
<td>15712</td>
</tr>
<tr>
<td> </td>
<td>Novi sad</td>
<td>12280</td>
</tr>
<tr>
<td> </td>
<td> </td>
<td>15712</td>
</tr>
<tr>
<td> </td>
<td> </td>
<td>18352</td>
</tr>
<tr>
<td> </td>
<td>Belgrade</td>
<td>11752</td>
</tr>
<tr>
<td> </td>
<td> </td>
<td>15448</td>
</tr>
<tr>
<td> </td>
<td> </td>
<td>18088</td>
</tr>
<tr>
<td>Turia</td>
<td>Valencia</td>
<td>6984</td>
</tr>
<tr>
<td>…</td>
<td> </td>
<td> </td>
</tr>
</tbody>
</table>

The results on the Danube with a starting point around Svishtov and on
Turia river in Valencia are shown on Table 12 below.

<table>
<caption><p>Table 12 Validation results</p></caption>
<colgroup>
<col style="width: 7%" />
<col style="width: 7%" />
<col style="width: 13%" />
<col style="width: 15%" />
<col style="width: 6%" />
<col style="width: 10%" />
<col style="width: 8%" />
<col style="width: 9%" />
<col style="width: 9%" />
<col style="width: 12%" />
</colgroup>
<tbody>
<tr>
<td>River</td>
<td>Metrologic Station</td>
<td colspan="2">Initial point (epsg:4326 - wgs84)</td>
<td>Stream flow (m3/sec)</td>
<td>Water level (cm)</td>
<td colspan="2">Flood points</td>
<td>Overlapping points number</td>
<td>Overlap ratio %</td>
</tr>
<tr>
<td> </td>
<td> </td>
<td>lat</td>
<td>long</td>
<td> </td>
<td> </td>
<td>HEC-RAS</td>
<td>ISME-HYDRO</td>
<td> </td>
<td> </td>
</tr>
<tr>
<td>Danube</td>
<td>Svishtov</td>
<td>43.62473737152112</td>
<td>25.36320231026188</td>
<td>10960</td>
<td>426.68</td>
<td>11818</td>
<td>9114</td>
<td>8245</td>
<td>77.7</td>
</tr>
<tr>
<td> </td>
<td>Svishtov</td>
<td>43.62473737152112</td>
<td>25.36320231026188</td>
<td>14656</td>
<td>598.02</td>
<td>14276</td>
<td>11161</td>
<td>9269</td>
<td>72.9</td>
</tr>
<tr>
<td> </td>
<td>Svishtov</td>
<td>43.62473737152112</td>
<td>25.36320231026188</td>
<td>17296</td>
<td>803.56</td>
<td>17575</td>
<td>19159</td>
<td>13193</td>
<td>69.1</td>
</tr>
<tr>
<td>Turia</td>
<td>Valencia</td>
<td>39.48439033297592</td>
<td>-0.43500631789290495</td>
<td>6984</td>
<td>174.6</td>
<td>5533</td>
<td>5296</td>
<td>4838</td>
<td>93.7</td>
</tr>
</tbody>
</table>

Figures 31-34 show the visualization of the overlaps between the HEC-RAS
model outcomes and ISME-HYDRO simulator outcome.

<img src="media/image39.png" style="width:9.44882in;height:4.63829in" />

Figure 31 HEC-RAS vs. ISME-HYDRO outcome for streamflow of 10960 m3/sec

<img src="media/image40.png" style="width:9.44882in;height:4.63829in" />

Figure 32 HEC-RAS vs. ISME-HYDRO outcome for streamflow of 14656 m3/sec

<img src="media/image41.png" style="width:9.44882in;height:4.63829in" />

Figure 33 HEC-RAS vs. ISME-HYDRO outcome for streamflow of 17296 m3/sec

<img src="media/image42.png" style="width:9.44882in;height:4.63829in" />

Figure 34 HEC-RAS vs. ISME-HYDRO outcome for streamflow of 6984 m3/sec

Apart from validation by comparing flood simulations, produced with
different simulation methods, we are planning to produce comparisons
with real past floods. Data about such events are difficult to obtain.
The process of obtaining such data on the Danube has started, and
validation will be carried out, once the data about real floods will be
obtained.

## Storm and Sea Level Rise

The Storm and Sea Level Rise component aims at assessing the risk of
inundation in coastal areas due to sea level rise by running what-if
scenarios computed by a model that takes as input a set of input data
derived from:

- IPCC AR6 Climate projection for Sea Level Rise derived for five global
  Shared Socioeconomic Pathway (SSP) scenarios, which
  a<span class="mark">re climate scenarios of projected global changes
  up to 2150 and are used to derive greenhouse gas emissions scenarios
  with different climate policies;</span>

- 30m resolution Digital Elevation Model from Copernicus ;

- WorldCover data from ESA.

The model generates an inundation risk map at 30m resolution which can
be used for risk analysis. In order to achieve this, the end-user is
asked to select a combination of three “what-if” parameters, to choose
between:

- Two confidence levels (low, medium);

- <span class="mark">Five global Shared Socioeconomic Pathways;</span>

- <span class="mark">Seven different Storm surge height options (ranging
  from 0 to 50m), where a storm surge is defined as the unusual rise in
  seawater level during a storm, measured as the height of the water
  above the normal predicted astronomical tide;</span>

- <span class="mark">and seven model years, ranging from 2020 to 2150,
  used as baseline for computing land cover.</span>

The definition of the five Shared Socioeconomic Pathway (SSP) scenarios
are described below (more details
[<u>IPCC\_AR6\_SYR\_LongerReport.pdf</u>](https://www.ipcc.ch/report/ar6/syr/downloads/report/IPCC_AR6_SYR_LongerReport.pdf)),
and they range from optimistic to pessimistic scenarios, as shown in
figure 8:

- **SSP119**: holds warming to approximately 1.5°C above 1850-1900 in
  2100 after slight overshoot (median) and implies net zero CO2
  emissions around the middle of the century.

- **SSP126**: stays below 2.0°C warming relative to 1850-1900 (median)
  with implied net zero emissions in the second half of the century.

- **SSP245**: is approximately in line with the upper end of aggregate
  Nationally Determined Contribution emission levels by 2030. SR1.5
  assessed temperature projections for NDCs to be between 2.7 and 3.4°C
  by 2100, corresponding to the upper half of projected warming under
  SP245. New or updated NDCs by the end of 2020 did not significantly
  change the emissions projections up to 2030, although more countries
  adopted 2050 net zero targets in line with SSP119 or SSP126. The
  SSP245 scenario deviates mildly from a ‘no-additional- climate-policy’
  reference scenario, resulting in a best-estimate warming around 2.7°C
  by the end of the 21st century relative to 1850-1900.

- **SSP370**: is a medium to high reference scenario resulting from no
  additional climate policy under the SSP3 socioeconomic development
  narrative. SSP370 has particularly high non-CO2 emissions, including
  high aerosols emissions.

- **SSP585**: is a high reference scenario with no additional climate
  policy. Emission levels as high as SSP585 are not obtained by
  Integrated Assessment Models (IAMs) under any of the SSPs other than
  the fossil fuelled SSP5 socioeconomic development pathway.

<img src="media/image43.png" style="width:5.75042in;height:2.118in" /><img src="media/image44.png" style="width:0.73438in;height:2.11673in" />

: Global mean sea level rise by SSP scenario

Inundation scenarios are accompanied by impact assessment estimates for:

1.  Population, buildings and crop areas affected.

2.  Critical infrastructures potentially affected, including schools and
    hospitals.

3.  Statistical analysis that allows users to see the effects of SLR
    throughout the various scenarios.

## Resources

The resources component provides a visualisation of the flooded land
objects - roads, buildings, forests, and allows to estimate the
potential damages of the incurred flood event. This is provided in flood
simulation and in forecasted real flood event scenarios. Thus, the
resources component helps plan in a what-if scenario context, when the
flood component is used in a flood simulation mode and in expected
upcoming flood context, when a real flood event is forecasted by the
system. It is foreseen to add socio-economic data from Eurostat into the
evaluation of the impact of the flood on the flooded areas and the
operational response of affected municipalities. Further, it is foreseen
to add guidelines on how to adapt to the disaster response plans
instructing the heads of municipalities on how to act during such
events.

## Infrastructure

In addition to assessing road conditions following an extreme
precipitation event, the Infrastructure component also offers "what-if"
scenarios that evaluate the risk of such events occurring under both
current climate conditions (based on historical data) and future climate
conditions (using climate projections from DestinE CCDAT).

The “what-if” scenario interface displays all extreme precipitation
events over two time periods: the past decade (2015–2025), based on
ERA5-Land historical data, and the upcoming decade (2025–2035), using
projections from DestinE CCADT. The analysis focuses on the region of
Valencia (“Comunidad de Valencia”), considering daily average
precipitation across the area. A threshold of 80 mm/day, set
arbitrarily, is used to identify extreme precipitation episodes. Key
figures highlight the number of such events: 10 observed in the past
decade and 52 projected for the coming decade within the demonstrator
area.

<figure>
<img src="media/image45.png" style="width:6.76806in;height:3.37986in"
alt="A screenshot of a map AI-generated content may be incorrect." />
<figcaption><p>: Precipitation levels and key figures for extreme
episodes</p></figcaption>
</figure>

The detailed spatial information has been extracted for all these
extreme episodes.

For past events, It allows to visualise where the precipitation occurred
(see Figure 27).

<figure>
<img src="media/image46.png" style="width:6.76806in;height:2.72361in"
alt="A map of the north and south america AI-generated content may be incorrect." />
<figcaption><p>:Precipitation level for the extreme episode in 2024,
October 29<sup>th</sup>.</p></figcaption>
</figure>

For future events, it enables the visualization of high-resolution data
from CCADT, offering scenarios of what could potentially occur in the
coming years.

<figure>
<img src="media/image47.png" style="width:6.76806in;height:2.68403in"
alt="A map of the ocean AI-generated content may be incorrect." />
<figcaption><p>: Precipitation level for a scenario in 2031, November
7<sup>th</sup>, as per the projection of CCADT.</p></figcaption>
</figure>

These projected scenarios should not be interpreted as precise
predictions of when or where extreme events will occur. Rather, they
represent plausible events based on climate model simulations. Sharing
this information with public authorities can support better
preparedness, enabling the adaptation of protection measures and
emergency response plans.

# Architecture definition and functional specification

<table>
<colgroup>
<col style="width: 9%" />
<col style="width: 15%" />
<col style="width: 18%" />
<col style="width: 16%" />
<col style="width: 14%" />
<col style="width: 11%" />
<col style="width: 15%" />
</colgroup>
<thead>
<tr>
<th style="text-align: center;"></th>
<th style="text-align: center;">Air quality</th>
<th style="text-align: center;">Urban Heat</th>
<th style="text-align: center;">Sea level Rise and storm surges</th>
<th style="text-align: center;">Flood</th>
<th style="text-align: center;">Infrastructure</th>
<th style="text-align: center;">Resources</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align: center;">Computing infrastructure and
computational resources needed</td>
<td><p><em><strong>(For current application restricted to Toulouse
area)</strong></em></p>
<p>For training 1 computation VM (64 GB RAM, 8 CPU)</p>
<p>For model operation 1 standard VM (16 GB RAM, 4 CPU)</p>
<p>For input data storage, 4 GB of object storage (S3) resources </p>
<p>For output data storage, 2 GB of object storage (S3)  resources</p>
<p>Frontend application is hosted in, a Kubernetes cluster (requirement
8 GB RAM)</p></td>
<td><p><em><strong>(For current application restricted to Toulouse
area)</strong></em></p>
<p>For input data storage, 0.5 GB of object storage (S3) resources </p>
<p>For output data storage,1 GB of object storage (S3) resources</p>
<p>Frontend application is hosted in, a Kubernetes cluster (requirement
8 GB RAM)</p></td>
<td style="text-align: left;"><p>For input and output data storage:</p>
<ul>
<li><p>10TB of object storage</p></li>
<li><p>1TB of fast access storage</p></li>
</ul>
<p>For inundation risk computation: 64 CPU Cores / 256 GB RAM</p>
<p>Service provision modules (WMS, API, frontend) hosted in a Kubernetes
Cluster (8CPU / 64 GB RAM)</p></td>
<td style="text-align: left;"><p>For Service layer 16 GB RAM,</p>
<p>4 CPU</p>
<p>For GUI layer 8 GB RAM, 2 CPU</p>
<p>For local storage 8 GB (S3)</p></td>
<td style="text-align: left;"><p>For HR data processing 1 computation VM
(64 GB RAM, 8 CPU)</p>
<p>The frontend application is hosted in ESRI ArcGIS Murmuration
tenant.</p></td>
<td style="text-align: left;"><p>For Service layer 16 GB RAM,</p>
<p>4 CPU</p>
<p>For GUI layer 8 GB RAM, 2 CPU</p>
<p>For local storage 8 GB (S3)</p></td>
</tr>
<tr>
<td style="text-align: center;">Data and modelling capabilities</td>
<td style="text-align: left;">1-km air quality modelling based on CAMS
dataset, in situ air quality measurements and ground reference
data.</td>
<td style="text-align: left;">Urban heat island modelling based on Land
Surface Temperature satellite measurements combined with land cover</td>
<td style="text-align: left;">30 m inundation risk maps based on IPCC
AR6 projections and Copernicus DEM.</td>
<td style="text-align: left;"><p>Linked data modelling - semantic
integration of heterogeneous data</p>
<p>and forecasts of hydrological, hydrodynamic features</p>
<p>flood simulation</p></td>
<td style="text-align: left;">Pleaides HR data processing to detect the
road extent before an extreme event, the mud index after the extreme
events, and assess the road blockages.</td>
<td style="text-align: left;"><p>Linked data modelling - semantic
integration of heterogeneous data</p>
<p>and forecasts of hydrological, hydrodynamic features</p>
<p>flood simulation</p></td>
</tr>
<tr>
<td style="text-align: center;">Artificial Intelligence (AI)
components</td>
<td style="text-align: left;">XGBoost algorithm trained with historical
air quality and meteorological data.</td>
<td style="text-align: left;">Pixel wise model linking air temperature
with land surface temperature.</td>
<td style="text-align: left;">None</td>
<td style="text-align: left;"><p>Forecast modeller</p>
<p>Geometry modeller</p>
<p>Flood simulator</p>
<p>Linked data infrastructure</p></td>
<td style="text-align: left;"><p>A random forest classifier was trained
on 80% of</p>
<p>the labelled data and applied to classify roads in the study
area.</p></td>
<td style="text-align: left;"><p>Forecast modeller</p>
<p>Geometry modeller</p>
<p>Flood simulator</p>
<p>Linked data infrastructure</p></td>
</tr>
<tr>
<td style="text-align: center;">Interactive capabilities, data analytics
and visualisation</td>
<td style="text-align: left;">Frontend application to explore the 1-km
dataset at a city and neighbourhood level</td>
<td style="text-align: left;">Frontend application to explore the
different products : raw land surface and air temperature, classified
land surface temperature, urban heat island. The tool allows comparing 
different neighbourhoods or different periods of time, as well as
visualising time series of urban thermal behaviour.</td>
<td style="text-align: left;"><p>Frontend application to explore the
different generated layers : risk inundation maps for 392 scenarios.</p>
<p>APIs to intersect inundated areas with relevant exposure layers
(population density, built-up areas, ..), to retrieve critical
infrastructures from OpenStreetMap, and to perform what-if scenarios
statistical analysis.</p></td>
<td style="text-align: left;"><p>Querying for all kinds of data
correlations,</p>
<p>for past and future periods</p>
<p>Synchronised map, graph and table views</p></td>
<td style="text-align: left;">An interactive demonstrator dashboard was
developed.</td>
<td style="text-align: left;"><p>Querying for all kinds of data
correlations,</p>
<p>for past and future periods</p>
<p>Synchronised map, graph and table views</p></td>
</tr>
<tr>
<td style="text-align: center;">Operational requirements</td>
<td style="text-align: left;">The 1-km model is executed daily with air
quality and meteorological  data. The application needs to access
near-real-time data flows for these variables.</td>
<td><p>The thermal data is precomputed. The temporal resolution is
seasonal summer/winter (6 months periods). The data processing pipeline
must be executed every 6 months.</p>
<p>The data processing pipeline needs to access recent Landsat 8/9
images (last 6 months).</p></td>
<td style="text-align: left;">The inundation risk maps are precomputed
and stored in a WMS (once unless climate projections are updated).</td>
<td style="text-align: left;">Service connectivity to computational
resources of Mozaika</td>
<td style="text-align: left;">The application needs to access HR
commercial imagery (Pleiades or similar resolution sources such as
MAXAM).</td>
<td style="text-align: left;">Service connectivity to computational
resources of Mozaika</td>
</tr>
<tr>
<td style="text-align: center;">Integration requirements</td>
<td><p>Computation resources to train and execute the model, and host
the frontend application.</p>
<p>Object storage resources to store the model output (historical 1-km
air quality dataset).</p>
<p>DT and Data Lake data connectors to access air quality and
meteorological data.</p>
<p>Data catalogue for historical 1-km air quality dataset
discoverability.</p>
<p>Service registry for the frontend application.</p>
<p>User management to access the frontend application.</p></td>
<td><p>Computation resources to execute the data preprocessing pipeline 
and host the frontend application.</p>
<p>Object storage resources to store the model output (historical 1-km
air quality dataset).</p>
<p>DT and Data Lake data connectors to access air quality and
meteorological data.</p>
<p>Data catalogue for historical 1-km air quality dataset
discoverability.</p>
<p>Service registry for the frontend application.</p>
<p>User management to access the frontend application.</p></td>
<td style="text-align: left;"><p>Computation resources to execute the
data processing pipeline and host the API and frontend application.</p>
<p>Object storage resources to store input and service output (30m
global layers for 7 times, 5 SSPs, 7 storm surge levels).</p>
<p>Data catalogue ancillary and contextual data.</p>
<p>Service registry for the frontend application.</p>
<p>User management to access the frontend application.</p></td>
<td style="text-align: left;">Service connectivity to computational
resources of Mozaika</td>
<td style="text-align: left;"><p>Computation resources to process the HR
data.</p>
<p>Storage resources to store the input HR data, and the output vector
results.</p>
<p>Connector to a source for commercial HR images, or ability for the
user to upload its own commercial HR data.</p></td>
<td style="text-align: left;">Service connectivity to computational
resources of Mozaika</td>
</tr>
</tbody>
</table>

[1] https://hda.data.destination-earth.eu/ui/dataset/STAT.EUSTAT.DAT.POP\_AGE\_GROUP\_SEX\_NUTS3

[2] https://simplemaps.com/data/bg-cities
