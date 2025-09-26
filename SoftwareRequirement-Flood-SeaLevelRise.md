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
<td>22/05/2024</td>
<td>Mozaika, Sistema</td>
<td style="text-align: left;">First release for RR2</td>
</tr>
<tr>
<td>1.1</td>
<td>20/09/2024</td>
<td>Mozaika, Sistema</td>
<td style="text-align: left;">Release for RR3</td>
</tr>
<tr>
<td></td>
<td></td>
<td></td>
<td style="text-align: left;"></td>
</tr>
<tr>
<td></td>
<td></td>
<td></td>
<td style="text-align: left;"></td>
</tr>
<tr>
<td></td>
<td></td>
<td></td>
<td style="text-align: left;"></td>
</tr>
<tr>
<td></td>
<td></td>
<td></td>
<td style="text-align: left;"></td>
</tr>
</tbody>
</table>

# Contents

[1 Purpose of the document
[3](#purpose-of-the-document)](#purpose-of-the-document)

[2 General Methodology [3](#general-methodology)](#general-methodology)

[<span class="smallcaps">3</span> Flood [4](#flood)](#flood)

[3.1 User needs [4](#user-needs)](#user-needs)

[3.2 User stories [5](#user-stories)](#user-stories)

[3.3 High-level technical tasks
[5](#high-level-technical-tasks)](#high-level-technical-tasks)

[<span class="smallcaps">4</span> Sea Level Rise and Storm Surges
[6](#sea-level-rise-and-storm-surges)](#sea-level-rise-and-storm-surges)

[4.1 User needs [6](#user-needs-1)](#user-needs-1)

[4.2 User stories [7](#user-stories-1)](#user-stories-1)

[4.3 High-level technical tasks
[7](#high-level-technical-tasks-1)](#high-level-technical-tasks-1)

# Purpose of the document

This document presents the Software Requirement Specification for the
Destination Earth Use Case (DEUC) UrbanSquare.

It synthesises the information gathered from the involved end-users for
the 7 components constituting UrbanSquare, the analysis made by the
UrbanSquare team and the high-level technical tasks that are derived to
drive the components implementation.

# General Methodology

The “End-user engagement - Requirement consolidation” phase aims to
clarify and detail user requirements in relation to the themes that have
been identified for each component.

The following table recap the different components and the associated
end-users.

<table>
<colgroup>
<col style="width: 33%" />
<col style="width: 29%" />
<col style="width: 15%" />
<col style="width: 21%" />
</colgroup>
<thead>
<tr>
<th style="text-align: center;">Component</th>
<th style="text-align: center;">Pilot user</th>
<th style="text-align: center;">Delivery</th>
<th style="text-align: center;">Leader</th>
</tr>
</thead>
<tbody>
<tr>
<td>Air pollution</td>
<td>Toulouse Metropole</td>
<td>M3 (RR1)</td>
<td>Murmuration</td>
</tr>
<tr>
<td>Urban heat</td>
<td>Toulouse Metropole</td>
<td>M3 (RR1)</td>
<td>Murmuration</td>
</tr>
<tr>
<td>Sea level rise and Storm surges</td>
<td>To be decided</td>
<td>M6 (RR2)</td>
<td>Sistema</td>
</tr>
<tr>
<td>Flood</td>
<td>Suhindol</td>
<td>M6 (RR2)</td>
<td>Mozaika</td>
</tr>
<tr>
<td>Infrastructure</td>
<td>To be decided</td>
<td>M9 (RR3)</td>
<td>Murmuration</td>
</tr>
<tr>
<td>Resources</td>
<td>Suhindol</td>
<td>M9 (RR3)</td>
<td>Mozaika</td>
</tr>
</tbody>
</table>

*Figure 7: Users involved in the components implementation*

The present document covers the Software Requirement Specifications for
the “Flood” and “Sea Level Rise & Storm Surges” components. This is the
second batch of components, which is to be delivered first at M6. For
the Flood components, several meetings have been held with Suhindol
municipalities. A set of user needs has been collected, that will be
refined into user stories and technical tasks.

For the Sea level rise and Storm component, due to unforeseen
circumstances, it was not possible to collect user needs from UNITAR,
who had agreed to be pilot users at the beginning of the project. This
has been particularly affecting the status of the Infrastructure and the
Sea Level Rise and Storm Surges components, since UNITAR was set up as
the only pilot user. Efforts have been made since then to find new pilot
users (related to UNESCO and NGOs) and, although the user status is yet
to be confirmed, it was possible to collect valuable feedback.

Thus, for the SLR component, Section 4 of this document contains user
needs that reflect the feedback and insight received during the
discussion with Professor Stefano Grimaz (UNESCO Chair on Intersectoral
Safety for Disaster Risk Reduction and Resilience) and Dr Petra Malisan
(University of Udine).

# Flood

## User needs

<table>
<colgroup>
<col style="width: 15%" />
<col style="width: 15%" />
<col style="width: 68%" />
</colgroup>
<thead>
<tr>
<th>ID</th>
<th style="text-align: center;">User need</th>
<th style="text-align: center;">Rationale</th>
</tr>
</thead>
<tbody>
<tr>
<td>UN-FL-1</td>
<td>Ability to receive advanced warning for upcoming floods</td>
<td><p>The municipalities have protocols of behaviour and rules for
reaction during emergency situations produced by the Ministry of
environment. They would benefit from advanced information about upcoming
flood situations because they will be able to better adapt and plan for
applying the regulatory protocols to optimally protect the population,
the real estate and the fields.</p>
<p>ISME-HYDRO produces forecasts about the hydrological status of rivers
for up to 30 days ahead. This is considered a very promising time period
to allow the municipality officials to prepare for the upcoming
difficult circumstance. The officials receive alerting through
ISME-HYDRO once they detect forecasted higher than normal water levels
and discharge</p></td>
</tr>
<tr>
<td>UN-FL-2</td>
<td>Ability to assess the size of the flood</td>
<td><p>The municipalities have the obligation to protect the population,
to minimise the damages of a flood event. That is why they would benefit
from precise and detailed information about the size of the flood.</p>
<p>ISME-HYDRO produces forecasts about the hydrological status of the
rivers, and provides capabilities for querying and reviewing the
hydrological data in tables, on graphs and on the map in a synchronised
manner. This gives the possibility to municipality officials to inquire
and obtain detailed information about the water levels and discharge
expected to be in place way before the event to occur, which gives a
time window for them to size and plan the protection
activities.</p></td>
</tr>
<tr>
<td>UN-FL-3</td>
<td>Ability to visualise the flood span</td>
<td><p>In order to better assess the expected damage of an upcoming
flood, the municipality officials have to be able to see the area that
will be affected by the high water levels. That is why they need an
accurate visualisation of the flood plains and the span of the flood
over the land in order to be able to assess the type of land or
infrastructure that will be affected.</p>
<p>ISME-HYDRO produces interactive flood maps based on the forecasted
hydrological features and provides the municipalities officials with the
ability to query about hydrological features in given times in the
future and obtain the flood spans visualised on the map, so that they
can view the areas under their responsibility and see the lands and
infrastructure that will be affected.</p></td>
</tr>
</tbody>
</table>

## User stories

<table>
<colgroup>
<col style="width: 16%" />
<col style="width: 17%" />
<col style="width: 66%" />
</colgroup>
<thead>
<tr>
<th>User need ID</th>
<th style="text-align: center;">User story ID</th>
<th style="text-align: center;">User story</th>
</tr>
</thead>
<tbody>
<tr>
<td>UN-FL-1</td>
<td><strong>US-FL-1</strong></td>
<td><p><strong>Advanced warning for response planning</strong></p>
<p>Suhindol municipality has rare occasions of floods. In addition, they
have to follow prescribed protocols from the Ministry of Environment
that provides action plans for cases of floods and emergencies. So, they
do not feel perfectly prepared to act if a flood occurs.</p>
<p>That is why, having an advanced warning about an upcoming flood,
together with details about its parameters, like strength, flood span,
time to drain are a very welcome functionalities.</p></td>
</tr>
<tr>
<td><p>UN-FL-2</p>
<p>UN-FL-3</p></td>
<td><strong>US-FL-2</strong></td>
<td><p><strong>Flood span prediction</strong></p>
<p>Dam Alexander Stambolijski is located in Suhindol municipality. It is
important to be able to predict occasions of dam overflow, together with
the inflow that will be caused outside of the dam wall, and the size of
the flood span around the dam lake and upstream the river</p></td>
</tr>
</tbody>
</table>

## High-level technical tasks

<table>
<colgroup>
<col style="width: 16%" />
<col style="width: 17%" />
<col style="width: 65%" />
</colgroup>
<thead>
<tr>
<th>User story ID</th>
<th style="text-align: center;">Technical task ID</th>
<th style="text-align: center;">Technical task</th>
</tr>
</thead>
<tbody>
<tr>
<td>US-FL-1</td>
<td><strong>TT-FL-1</strong></td>
<td><p><strong>Flood forecast</strong></p>
<p>Build a model for flood forecast</p></td>
</tr>
<tr>
<td>US-FL-1</td>
<td><strong>TT-FL-4</strong></td>
<td><p><strong>Flood alert</strong></p>
<p>Build a component to throw advanced warning for flood alert</p></td>
</tr>
<tr>
<td>US-FL-1</td>
<td><strong>TT-FL-5</strong></td>
<td><p><strong>Flood parameters visualisation</strong></p>
<p>Build a component to display the parameters of the flood on the map
and in attribute values, text and digits</p></td>
</tr>
<tr>
<td>US-FL-2</td>
<td><strong>TT-FL-2</strong></td>
<td><p><strong>Flood span</strong></p>
<p>Build a model to forecast the flood span</p></td>
</tr>
<tr>
<td>US-FL-2</td>
<td><strong>TT-FL-3</strong></td>
<td><p><strong>Flood span visualisation</strong></p>
<p>Build a component to project the flood span on a map</p></td>
</tr>
<tr>
<td>US-FL-1</td>
<td><strong>TT-FL-6</strong></td>
<td><p><strong>Flood simulation</strong></p>
<p>Build a flood simulation functionality</p></td>
</tr>
</tbody>
</table>

# Sea Level Rise and Storm Surges

## User needs

<table>
<colgroup>
<col style="width: 16%" />
<col style="width: 20%" />
<col style="width: 63%" />
</colgroup>
<thead>
<tr>
<th>ID</th>
<th style="text-align: center;">User need</th>
<th style="text-align: center;">Rationale</th>
</tr>
</thead>
<tbody>
<tr>
<td>UN-RES-1</td>
<td>Ability to access the different layers of the inundation product and
select parameters</td>
<td><p>The sea level rise and storm surges component is expected to
produce high resolution inundation scenario products for any area of the
globe in a quick and user-friendly manner, so that it can be used by
municipalities and entities as a supporting tool to work towards a
comprehensive emergency protocol to follow in case of inundation in
coastal areas, in order to protect the population, the economic assets
and protected natural areas. The territory can be affected by climate
change in different ways. The tool allows to produce long-term what-if
scenarios depending on three main parameters:</p>
<ul>
<li><p>Shared Socioeconomic Pathway (SSP), which is a climate scenario
of the projected global changes, used to derive greenhouse gas emissions
scenarios with different climate policies;</p></li>
<li><p>the model year to which the SSP projection is applied (from 2040,
up to 2150);</p></li>
<li><p>storm surge height, i.e. the unusual rise in seawater level
during a storm.</p></li>
</ul></td>
</tr>
<tr>
<td>UN-RES-2</td>
<td>Ability to draw an area of interest and extract the relevant
assets</td>
<td>In order to better assess the inundation risk severity in the area
of interest, the platform should allow to extract the area’s amenities
such as hospitals, schools and power plants, as well as to overlay other
maps of interest related to population and land use, derived from
datasets such as Global Human Settlement and WorldCereal.</td>
</tr>
<tr>
<td>UN-RES-3</td>
<td>Ability to retrieve information regarding affected population,
buildings and crops.</td>
<td>With the aim of guiding the relevant entities and developing an
efficient emergency protocol, it is of great significance to be able to
obtain the data regarding the area of interest affected by the what-if
scenario. In particular, the estimated population affected by inundation
is expected, as well as the affected crops and buildings.</td>
</tr>
<tr>
<td>UN-RES-4</td>
<td>Ability to download relevant information</td>
<td>For reporting purposes, it would be useful to be able to download
the relevant output(s) of the inundation product (i.e. assets, flood
extent).</td>
</tr>
<tr>
<td>UN-RES-5</td>
<td>Ability to assess impact of floods on the territory’s sentinel
points</td>
<td>While assessing the extent of the impact in the urban area can be
useful, understanding the impact on sentinel points, i.e. critical
infrastructures, is of greater importance for decision making and
strategic planning. Sentinel points such as power plants are to be
highlighted: in case of inundation, the territory is not only affected
by the hazard itself but also by lack of power, which can influence
emergency response.</td>
</tr>
</tbody>
</table>

## User stories

<table>
<colgroup>
<col style="width: 16%" />
<col style="width: 17%" />
<col style="width: 65%" />
</colgroup>
<thead>
<tr>
<th>User need ID</th>
<th style="text-align: center;">User story ID</th>
<th style="text-align: center;">User story</th>
</tr>
</thead>
<tbody>
<tr>
<td>UN-RES-1</td>
<td>US-RES-1</td>
<td>The Sea Level Rise and Storm Surges component allows the user to
simulate different future inundation scenarios. The user expects to
access a user-friendly web platform from which they can change model
parameters, visualise the 30m resolution outputs in a prompt and
interactive manner, as well as compare output scenarios and with the
possibility of changing background maps and add overlay layers of
interest such as population density derived from the Global Human
Settlement dataset.</td>
</tr>
<tr>
<td>UN-RES-2</td>
<td>US-RES-2</td>
<td>The user wants to draw an area of interest and visualise only the
output product for that area. The user also wants to overlay maps
derived from Global Human Settlement and World Cereal so as to have a
more comprehensive understanding.</td>
</tr>
<tr>
<td>UN-RES-3</td>
<td>US-RES-3</td>
<td>The user wants to obtain quantitative information regarding the
population as well as the crops and built-up areas affected by the
inundation, in the what-if scenario, with meaningful units, such as
number of inhabitants, and square metres of the area affected.</td>
</tr>
<tr>
<td>UN-RES-4</td>
<td>US-RES-4</td>
<td>The user expects to be able to save flood risk map and impact
assessments maps relative to the different scenarios, in order to
prepare accurate reports, either by downloading the data or in a more
interactive way (directly on the platform or through an embedded link to
add onto an HTML file for a webpage).</td>
</tr>
<tr>
<td>UN-RES-5</td>
<td>US-RES-5</td>
<td>The user wants to assess the impact of inundation on vulnerable
assets and on sentinel points, which are locations or infrastructures
that if affected can heavily influence the rest of the territory. Thus,
the user expects that the platform will include important amenities
(power plants, large factories, hospitals) that can be retrieved from
OpenStreetMap.</td>
</tr>
</tbody>
</table>

## High-level technical tasks

<table>
<colgroup>
<col style="width: 16%" />
<col style="width: 17%" />
<col style="width: 65%" />
</colgroup>
<thead>
<tr>
<th>User story ID</th>
<th style="text-align: center;">Technical task ID</th>
<th style="text-align: center;">Technical task</th>
</tr>
</thead>
<tbody>
<tr>
<td>US-RES-1</td>
<td>TT-RES-1</td>
<td>Check that the inundation risk model runs correctly, promptly, and
accordingly with the selected model parameters.</td>
</tr>
<tr>
<td>US-RES-1, US-RES-2</td>
<td>TT-RES-2</td>
<td>Check that the dedicated front-end works correctly and that the user
is able to access the inundation model parameters and visualise the
output products, and to draw AOIs, and add overlay layers.</td>
</tr>
<tr>
<td>US-RES-3</td>
<td>TT-RES-3</td>
<td>Implement the retrieval of quantitative information about the
affected areas and population resulting from the inundation risk
scenario through API.</td>
</tr>
<tr>
<td>US-RES-4</td>
<td>TT-RES-4</td>
<td>Implementation of functionalities that allow users to share, save
and download generated products: object embedding functionality and an
API to have the possibility to download the outputs of interest directly
from the platform. No service accounts are foreseen to be created for
this platform and therefore a custom dashboard where the user can
successfully save inundation products is a non-objective.</td>
</tr>
<tr>
<td>US-RES-5</td>
<td>TT-RES-5</td>
<td>Integrate OSM Overpass API in order to efficiently query for
vulnerable amenities in the interface and produce relevant impact
assessment statistical data.</td>
</tr>
</tbody>
</table>

