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
<td>20/09/2024</td>
<td>Murmuration, Mozaika</td>
<td style="text-align: left;">First release for RR3</td>
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

[<span class="smallcaps">3</span> Infrastructure
[4](#infrastructure)](#infrastructure)

[3.1 User needs [4](#user-needs)](#user-needs)

[3.2 User stories [4](#user-stories)](#user-stories)

[3.3 High-level technical tasks
[4](#high-level-technical-tasks)](#high-level-technical-tasks)

[<span class="smallcaps">4</span> Resources [5](#resources)](#resources)

[4.1 User needs [5](#user-needs-1)](#user-needs-1)

[4.2 User stories [5](#user-stories-1)](#user-stories-1)

[4.3 High-level technical tasks
[5](#high-level-technical-tasks-1)](#high-level-technical-tasks-1)

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
the “Infrastructure” and “Resources” components. This is the third batch
of components, which is to be delivered at M9.

For the Infrastructure component, due to unforeseen circumstances, it
was not possible to collect user needs from UNITAR, who had agreed to be
pilot users at the beginning of the project. This has been particularly
affecting the status of the component, since UNITAR was set up as the
only pilot user. Efforts have been made since then to find new pilot
users (related to UNESCO and NGOs).

Thus, for the Infrastructure component, Section 4 of this document
contains user needs that reflect the view of Murmuration, that should be
validated during next steps of the project by a pilot user..

# Infrastructure

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
<td>UN-INF-1</td>
<td>Classify the state of roads</td>
<td>The goal is to evaluate the road damages. The primary source of
damages that is considered is the daily wear and tear from regular
traffic combined with insufficient maintenance actions. Roads should be
classified according to the amount of damages: perfect status, slightly
damaged, severely damaged, impracticable for conventional
vehicles...</td>
</tr>
<tr>
<td>UN-INF-2</td>
<td>Continuously monitor road infrastructure</td>
<td><p>The goal is to get a regularly updated map of the road
infrastructure highlighting the areas that would need action or
restoration.</p>
<p>The update frequency must be compliant with the operational rhythm of
the urban services responsible for road maintenance. The hypothesis of a
monthly update is considered.</p></td>
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
<td>UN-INF-1</td>
<td><strong>US-INF-1</strong></td>
<td>As a user, I want to be able to define a monitoring area and get an
up-to-date (maximum 1 month) map of the road damage status in the
area.</td>
</tr>
<tr>
<td>UN-INF-2</td>
<td><strong>US-INF-2</strong></td>
<td>As a user, I want to be able to connect to a live interface an get
historical and current status of the monitored areas I defined.</td>
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
<td>US-INF-1</td>
<td><strong>TT-INF-1.1</strong></td>
<td><p><strong>Urban Scene Classification</strong></p>
<p>We propose using data from ESA WorldCover, CORINE Land Cover (CLC),
and OpenStreetMap (OSM) data, along with radiometric classification, to
identify and isolate road infrastructure in urban environments.</p></td>
</tr>
<tr>
<td>US-INF-1</td>
<td><strong>TT-INF-1.2</strong></td>
<td><p><strong>Coregistration of Imagery</strong></p>
<p>Coregister multitemporal VHR imagery with a road mask to filter and
focus on road networks, enabling continuous monitoring.</p></td>
</tr>
<tr>
<td>US-INF-1</td>
<td><strong>TT-INF-1.3</strong></td>
<td><p><strong>Multitemporal Stack Construction</strong></p>
<p>Build a stack of VHR imagery to analyze changes in road conditions
over time, capturing gradual degradation due to daily traffic.</p></td>
</tr>
<tr>
<td>US-INF-1</td>
<td><strong>TT-INF-1.4</strong></td>
<td><p><strong>Classification of Road Condition</strong></p>
<p>Classify the state of road infrastructure to detect wear and damage
caused by daily traffic, requiring a different set of indicators and
potentially more subtle detection methods.</p></td>
</tr>
<tr>
<td>US-INF-2</td>
<td><strong>TT-INF-2.1</strong></td>
<td><p><strong>Online dashboard implementation</strong></p>
<p>Develop a pilot dashboard on a test area</p></td>
</tr>
</tbody>
</table>

# Resources

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
<td>UN-RS-1</td>
<td>Ability to evaluate flood damages</td>
<td>In a flood event the municipalities officials need to see and
inspect the flooded areas and what land objects are in these flooded
areas in order to evaluate the flood damages.</td>
</tr>
<tr>
<td>UN-RS-2</td>
<td>Ability to estimate the resources needed for recovery</td>
<td>Based on the evaluation of the flooded areas the municipalities
officials need to analyse the size of the incurred damages in terms of
number of buildings, population, infrastructure, size of agricultural
land and forests affected and determine the measures and estimate the
resources needed to be undertaken for recovery</td>
</tr>
<tr>
<td>UN-RS-3</td>
<td>Ability to plan recovery</td>
<td>Based on the determination and estimation of the resources needed to
be undertaken for recovery, draw a plan for carrying out the recovery
measures.</td>
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
<td>UN-RS-1</td>
<td>US-RS-1</td>
<td>Evaluation of flood damages</td>
</tr>
<tr>
<td>UN-RS-2</td>
<td>US-RS-2</td>
<td>Estimation of resources needed for recovery</td>
</tr>
<tr>
<td>UN-RS-3</td>
<td>US-RS-3</td>
<td>Plan of recovery</td>
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
<td>US-RS-1</td>
<td>TT-RS-1</td>
<td><p><strong>Flood span visualisation</strong></p>
<p>Build a component  to project the flood span on a map</p></td>
</tr>
<tr>
<td>US-RS-1</td>
<td>TT-RS-2</td>
<td><p><strong>Flooded areas visualisation</strong></p>
<p>Build a component for display the land objects under the flooded
areas</p></td>
</tr>
<tr>
<td>US-RS-2</td>
<td>TT-RS-3</td>
<td><p><strong>Resource identification</strong></p>
<p>Integrate quantitative and resources data into the flooded areas and
the land objects</p></td>
</tr>
<tr>
<td>US-RS-2</td>
<td>TT-RS-4</td>
<td><p><strong>Resource estimation</strong></p>
<p>Visualise the quantitative and resource data collected and
integrated</p></td>
</tr>
<tr>
<td>US-RS-3</td>
<td>TT-RS-5</td>
<td><p><strong>Plan for recovery</strong></p>
<p>Grade the affected areas based on quantitative and resource
data</p></td>
</tr>
<tr>
<td>US-RS-3</td>
<td>TT-RS-6</td>
<td><p><strong>Leverage official recovery action protocols</strong></p>
<p>Match the official recovery action protocols with the plan for
recovery</p></td>
</tr>
</tbody>
</table>
