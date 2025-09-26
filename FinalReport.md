<img src="media/image1.png" style="width:1.65833in;height:0.90069in"
alt="Une image contenant Police, blanc, logo, Graphique Description générée automatiquement" /><img src="media/image2.jpg" style="width:1.24167in;height:0.90069in"
alt="Immagine che contiene testo, emblema, simbolo, cerchio Il contenuto generato dall&#39;IA potrebbe non essere corretto." /><img src="media/image3.png" style="width:1.94653in;height:0.85833in"
alt="Homepage - SISTEMA" /><img src="media/image4.png" style="width:1.31944in;height:1.125in"
alt="Immagine che contiene Elementi grafici, schermata, grafica, testo Il contenuto generato dall&#39;IA potrebbe non essere corretto." /><img src="media/image5.png" style="width:6.26806in;height:0.63403in" />  
<img src="media/image6.png" style="width:8.20895in;height:5.46992in" />

REVISION HISTORY

<table>
<colgroup>
<col style="width: 14%" />
<col style="width: 20%" />
<col style="width: 22%" />
<col style="width: 41%" />
</colgroup>
<thead>
<tr>
<th>Revision</th>
<th>Date</th>
<th>Author(s)</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>1.0</td>
<td>25/07/2025</td>
<td>Murmuration, Sistema, Mozaika, Imperative</td>
<td>Initial version</td>
</tr>
<tr>
<td></td>
<td></td>
<td></td>
<td><ul>
<li></li>
</ul></td>
</tr>
</tbody>
</table>

[1 Executive Summary [3](#executive-summary)](#executive-summary)

[2 Activities performed
[5](#activities-performed)](#activities-performed)

[2.1 Components development
[5](#components-development)](#components-development)

[2.1.1 Air quality [5](#air-quality)](#air-quality)

[2.1.2 Urban heat [5](#urban-heat)](#urban-heat)

[2.1.3 Sea level rise and Storm surges
[6](#sea-level-rise-and-storm-surges)](#sea-level-rise-and-storm-surges)

[2.1.4 Flood [7](#flood)](#flood)

[2.1.5 Resources [8](#resources)](#resources)

[2.1.6 Infrastructures [9](#infrastructures)](#infrastructures)

[2.2 Integration and Onboarding on DestinE
[9](#integration-and-onboarding-on-destine)](#integration-and-onboarding-on-destine)

[2.3 Communication [10](#communication)](#communication)

[2.4 Exploitation [11](#exploitation)](#exploitation)

[2.4.1 Roadmap [11](#roadmap)](#roadmap)

[2.4.2 Sustainability [0](#sustainability)](#sustainability)

[2.4.3 User Engagement Strategy
[0](#user-engagement-strategy)](#user-engagement-strategy)

[3 Conclusion and next steps
[1](#conclusion-and-next-steps)](#conclusion-and-next-steps)

# Executive Summary

The UrbanSquare project, developed within the DestinE platform, has
delivered a suite of services enabling urban planners to assess and plan
for climate-related risks. From its inception in November 2024 to its
conclusion in Julye 2026, UrbanSquare has evolved into a multi-component
platform integrating Earth Observation data, socio-economic data, and
scenario modelling, all operationalised on the DestinE Platform.

Key achievements include the development and deployment of six
components addressing distinct urban climate risk domains:

- **Air Quality** (Leader: Murmuration): Provides near-real-time, 1-km
  resolution air pollution data and what-if scenario modelling for urban
  policies like Low Emission Zones and climate change impact.

- **Urban Heat** (Leader: Murmuration): Provides high-resolution heat
  exposure mapping using LST from Landsat and vegetation health. It
  includes before/after comparisons to assess the effects of green
  infrastructure and urban changes.

- **Sea Level Rise & Storm Surges** (Leader: Sistema): Delivers 30m
  inundation risk maps with configurable storm surge heights and climate
  scenarios up to 2150. It includes population, agriculture, buildings
  and critical infrastructure exposure analysis.

- **Flood** (Leader: Mozaika): Offers 7-30 day forecasts and simulations
  based on hydrological, hydrodynamic, geological and meteorological
  parameters via the ISME-HYDRO model.

- **Resources** (Leader: Mozaika): Provides flood-related damage and
  exposure assessments for buildings, roads, forests, and crops thanks
  to the integration with Eurostat and WorldCereal datasets.

- **Infrastructures** (Leader: Murmuration): Uses VHR imagery to detect
  road condition changes before/after disasters.

Each service includes dashboard-style interfaces supporting scenario
simulations and decision-making.

UrbanSquare was successfully integrated with the DestinE platform. It
was deployed on the DestinE OVH cloud infrastructure and integrated with
the DestinE authentication system and data access. Services (namely Air
quality, Urban heat, and Sea level rise) run natively on DestinE, while
Flood and Resources services are federated externally.

UrbanSquare engaged multiple pilot end-users across Europe:

- <u>Toulouse Metropole (France)</u>: Co-designed Air quality and Urban
  heat components.

- <u>Municipality of Suhindol (Bulgaria)</u>: Partnered on Flood and
  Resource components.

- <u>UNESCO & TUHH</u>: Validated Sea level rise and Storm surge
  component with scenario-based feedback

A structured validation process ensured continuous refinement. Pilot
users provided crucial input on usability, data granularity, and feature
relevance.

UrbanSquare is well positioned for commercial expansion:

- A modular, license-based business model combines data-as-a-service and
  analytics-as-a-service elements.

- Target markets include public authorities, consultancies, and
  international agencies.

- Continued alignment with DestinE enhances service credibility and
  market differentiation.

The consortium plans to promote UrbanSquare as a unified urban
resilience toolkit, with future integration of 3D visualisation and
expanded spatial coverage.

On the communication and dissemination aspect, UrbanSquare contributed
to the DestinE MOOC with dedicated educational chapters, participated in
webinars with over 100 attendees, and produced promotional materials to
raise awareness among urban stakeholders.

In conclusion, UrbanSquare has successfully delivered a comprehensive
and integrated platform for urban climate risk assessment. Built on
advanced EO data, AI analytics, and user-centric design, it stands as a
mature, operational-ready system aligned with DestinE goals and equipped
for broad exploitation in the years to come.

# Activities performed

## Components development

### Air quality

Status: Operational

Developed features

The Air Quality component is a service to monitor, analyse, and project
urban air pollution patterns. Developed by Murmuration in collaboration
with Toulouse Metropole, it integrates near-real-time Earth Observation
and in situ data to support urban planning and environmental policy.

Key features include:

- **High-Resolution Modelling**: Provides daily NO₂ concentration data
  at 1-km resolution across urban areas, with 2-day latency, based on
  Copernicus Atmosphere data, air pollution influential factor data
  (weather condition, road network, land cover…) and local measurements.

- **Interactive Dashboard**: Users can visualise spatial and temporal
  trends, select specific neighbourhoods or pixels, and compare with WHO
  standards

- **What-if Scenario Modelling**: Users can simulate the impact of
  policy interventions (e.g. Low Emission Zones, road transformations,
  population density changes) and climate change on air quality

- **Factor Attribution**: Users can explore the underlying drivers (e.g.
  traffic, meteorology, land use) influencing model predictions to
  support evidence-based decision-making

Innovation

The Air Quality component introduces several technical and
methodological innovations:

- **Neighbourhood-Level Personalisation**: Unlike regional or citywide
  maps, the tool allows analysis at the urban block level, addressing
  the growing demand for hyper-local environmental intelligence.

- **Dynamic Scenario Simulations**: Built-in what-if simulations offer
  forward-looking insights into the effect of mitigation policies and
  climate trends, a step beyond static air quality maps.

Integration with DestinE

The integration with DestinE brings significant advantages:

- **Cloud-Native Deployment**: Hosted on DestinE OVH cloud environment,
  the application benefits from scalable resources, reliable
  performance, and unified user access via DestinE IAM.

- **Support for Digital Twins**: the component makes use of the Climate
  Change Adaptation Digital Twin, positioning the Air Quality component
  for future enhancements with AI-driven prediction and high-resolution
  twin simulation.

- **Prepared for Scalable Reuse**: Air quality can be replicated in
  other urban contexts thanks to the modular deployment on DestinE and
  use of globally available EO data.

### Urban heat

Status: Operational

Developed features

The Urban Heat component, led by Murmuration in collaboration with
Toulouse Metropole, offers a solution to identify and monitor the urban
heat island (UHI) at high spatial resolution. It provides urban planners
with critical insights to mitigate heat exposure risks and assess the
effectiveness of urban greening and cooling strategies.

Key features delivered include:

- **High-Resolution Heat Exposure Mapping**: Uses Land Surface
  Temperature (LST) and 2m air temperature data to produce seasonal and
  annual heat maps at neighbourhood scale.

- **Urban Heat Island Indicator**: characterise the UHI by comparing
  surface temperatures across different land use and vegetation
  contexts, enabling targeted mitigation planning.

- **Before/After Comparison Tool**: Supports policy evaluation by
  comparing historical and recent conditions, particularly useful to
  assess the effects of urban greening or land-use changes.

Innovation

The Urban Heat component delivers innovative capabilities beyond
standard climate indicators:

- **Neighbourhood-Scale Analysis**: Offers unprecedented spatial
  granularity (down to individual blocks), empowering local authorities
  to make evidence-based decisions for specific zones within a city.

- **Temporal Analysis**: Provides multi-seasonal and inter-annual
  comparisons, enabling users to observe long-term trends in urban heat
  exposure.

Integration with DestinE

Deployment within the DestinE ecosystem has significantly enhanced the
value and scalability of the Urban Heat component:

- **Cloud-Native Deployment**: Hosted on DestinE OVH cloud environment,
  the application benefits from scalable resources, reliable
  performance, and unified user access via DestinE IAM.

- **Access to Climate Digital Twins**: The service is designed to
  benefit from DestinE Climate Change Adaptation Digital Twin, allowing
  integration of future temperature projections and extreme heat events.

- **Integrated Data Sources**: Utilises data from the DestinE Data Lake
  (e.g., ERA5-Land, NDVI, climate projections) and harmonises it with
  third-party sources like USGS Landsat.

- **Prepared for Scalable Reuse**: Urban Heat can be replicated in other
  urban contexts thanks to the modular deployment on DestinE and use of
  globally available EO data.

### Sea level rise and Storm surges

Status: Operational

Developed features

The Sea Level Rise and Storm Surges component, led by Sistema, delivers
a scenario-based assessment tool for coastal inundation risks. It
enables urban planners, scientists, and civil protection agencies to
visualise long-term sea level rise and storm surge impacts up to the
year 2150.

Key features delivered include:

- Global flood maps at 30m spatial resolution displayed in seconds

- Over 300 what-if scenarios based on 4 main parameters:

- Shared Socioeconomic Pathway (SSP), from 119 (taking the “green road”)
  to 585 (worst-case scenario)

- Storm surge height (0-5m)

- Model year (2040-2150)

- Confidence level (low, medium)

- Exposure estimates for affected population, urban surfaces and crop
  areas

- Statistics tool for analysing the impact of coastal inundation over
  time/year or in terms of storm surge level

- Identification of critical infrastructures, including hospitals,
  emergency response facilities, schools and power plants.

Innovation

Based on state-of-the-art sea level rise data derived from the IPCC AR6,
the Sea Level Rise and Storm Surges component allows global access to
high-resolution inundation maps and to better understand the impacts of
climate change on the natural and artificial world throughout the
various what-if scenarios.

Moreover, the flood maps include a layer of ‘protected areas’, which are
regions that, according to most recent Digital Elevation Model data, lay
below sea-level, but are assumed to be protected by natural or
artificial barriers.

By integrating GIS data from the Global Human Settlement Layer, ESA
WorldCereal and OpenStreetMap, the tool delivers valuable information
that may be more relevant to some target users, as they are able to
retrieve numerical estimates of the impact caused by sea level rise and
storm surges - induced floods.

Integration with DestinE

The deployment of the component within the DestinE ecosystem has
enhanced its value and scalability, thanks to:

- Cloud-Native Deployment: Hosted on DestinE OVH cloud environment, the
  application benefits from scalable resources, reliable performance,
  and unified user access via DestinE IAM

- Visibility: as one of the DestinE Use Cases, UrbanSquare is able to
  gain considerable traction among our target audience

As the DestinE data portfolio grows, there will be the possibility of
integrating new data within the Sea Level Rise and Storm Surges
component with the aim of enhancing the final products.

### Flood

Status: Demonstrator

Developed features

The Flood component, developed by Mozaika, provides an environment for
simulating and forecasting flood risks, supporting both preparedness and
response planning. It enables local authorities to anticipate flood
events, evaluate their spatial extent, and estimate potential damages to
infrastructure, population, and ecosystems.

Key features delivered include:

- Flood forecasting

- Real-time Flood simulation

- Flood span visualization

Innovation

The flood simulation maps and impact estimates are generated using a
simplified model known as the *Rapid Flood Spreading Method* (RFSM),
estimating where water might spread in case of a flood based on terrain
shape and water level. The method is based on EO4AI approach developed
by Mozaika and adopted in ISME-HYDRO that applies neural network
architectures to a selection of meteorological data coming from
satellites and in-situ measurements to predict high water levels and
discharge with high precision. The real time flood simulation is based
on the river size and direction and the digital elevation model from
satellites, thus combining physical and hydrological characteristics,
and allowing to draw accurate flood spans without making use of in-situ
measurements of the curves of the rivers.

Integration with DestinE

The Flood and Resources components are considered as demonstrators as
the method has only been validated in 2 areas (Danube river around
Svishtov (Bulgaria) and Turia rivers around Valencia (Spain)). Results
in other regions should be interpreted with caution.

Despite this limitation, the component is deployed on DestinE, with a
disclaimer clearly stating the limitations to the users.

The deployment of the component within the DestinE ecosystem has
enhanced its value and scalability, thanks to:

- A large pool of data that allows to easily apply the developed methods
  for flood forecasting and simulation for locations around the globe.

- Secured access and monitoring of usage of the components.

- Exposition to a larger community of users and potential customers.

### Resources

Status: Demonstrator

Developed features

The Resources component, developed by Mozaika, provides an integrated
environment for evaluating the socio-economic impact of flood events. It
complements the Flood component by quantifying damage and resource needs
in urban and peri-urban environments.

Key features delivered include:

- Flood span visualization

- Affected infrastructure, forests, buildings count

- Types of critical institutions affected like hospitals, schools,
  archaeological sites

- Affected cities and population

Innovation

Datasets from OpenStreetMap, [<u>mapflow.ai</u>](http://mapflow.ai) and
EUROSTAT have been integrated into the flood simulator to provide the
users with a tool assessing the expected damages, playing out what-if
scenarios and helping setting up plan for adequate recovery measures.

Advantages in using DestinE

- Rich data offer, including non-EO data (e.g. EUROSTAT), that can be
  used to constantly enrich the Flood and Resources components.

### Infrastructures

Status: Demonstrator

Developed features

The Infrastructure component of UrbanSquare, developed by Murmuration,
focuses on assessing the vulnerability and condition of road
infrastructure in urban and peri-urban areas. It provides
decision-makers with actionable information to support climate-resilient
infrastructure planning and post-disaster recovery.

Key features delivered include:

- **Infrastructure Disruption Mapping**: Identifies disruptions in road
  networks due to natural hazards (e.g. flooding).

- **Before/After Event Comparison**: Allows users to visualise and
  compare infrastructure status before and after a disaster or planned
  intervention, supporting emergency response and infrastructure
  management.

- **VHR Data Integration**: Access very high-resolution (VHR) imagery
  (Pleiades data), essential for assessing road conditions and safety
  risks not visible in medium-resolution EO data.

- **Extreme events probability assessment**: Uses climate historical
  (ERA5) and projection (Climate Change Adaptation Digital Twin) data to
  assess the probability of climate hazards in an area.

Innovation

The Infrastructure component brings several unique capabilities to the
field of EO-based infrastructure monitoring:

- **Event-Driven Infrastructure Assessment**: Unlike traditional static
  infrastructure inventories, the component supports reactive and
  proactive evaluations based on evolving climate hazard contexts.

- **Integration with External Data Sources**: Incorporates OpenStreetMap
  inputs to contextualise infrastructure in relation to buildings, land
  use, and flood impacts.

- **Pre-Operational Pipeline with Pleiades Neo**: Access to VHR imagery
  significantly enhanced the component’s capability to detect
  degradation signs such as obstruction—typically inaccessible from
  public EO sources.

Integration with DestinE

The Infrastructure component is at a demonstration level. It is a web
application developed with the ArcGIS dashboard framework, deployed in
the ESRI SaaS.

The Infrastructure component is not directly integrated with the DestinE
platform: it is not visible in the DestinE service catalogue, it is not
deployed in OVH cloud, it is not integrated with IAM system, etc.

The development of the infrastructure component could not reach the
operational level for various reasons:

- The data sources foreseen during the proposal phase of the project
  (Sentinel-2, PlanetScope) turned out not to be sufficiently well
  resolved. The experimentation performed during the project showed that
  HR images (i.e. spatial resolution &lt; 1m) are required to properly
  assess the status of roads. This type of data is only available via
  commercial offers. The way to integrate the access to this commercial
  offer through DestinE, both from a technical (i.e. no API is available
  to automate the access in the existing workflow) or business point of
  view, is to be defined

- The pilot user onboarded to the project (i.e. UNITAR), who was meant
  to detail the real-world and help shape an operational tool left the
  project midway.

The What-if scenarios feature, implemented using CCADT data to evaluate
the risk of extreme precipitation events with current and future climate
conditions, suffers from the current limitations of the CCADT (only one
SSP available, does not extend beyond 2040).

The Infrastructure component still benefits from the DestinE services:

- **Access to Copernicus and Climate Data**: Utilises Copernicus and
  DestinE climate datasets to contextualise infrastructure assessments.

## Integration and Onboarding on DestinE

Throughout the UrbanSquare project (November 2024 – June 2026),
significant progress was made in integrating and onboarding the
components with the DestinE Platform. This integration ensured
interoperability, scalability, and alignment with the broader DestinE
vision of supporting climate resilience and sustainability through
advanced digital services.

UrbanSquare components were deployed across different architectural
configurations:

- Natively Deployed Components: Air Quality, Urban Heat, and Sea Level
  Rise & Storm Surges were fully deployed on DestinE OVH cloud
  infrastructure.

- Federated Components: Flood and Resources components, while hosted
  outside the core DestinE cloud, were federated through a proxy
  architecture. This setup enabled full user authentication, secure data
  access, and interoperability with the DestinE environment.

All components were connected to the DestinE Identity and Access
Management (IAM) system, providing a consistent and secure user
experience with federated login.

UrbanSquare leveraged DestinE data services to feed and enrich its
models:

- **Data Lake Access**: Used to source critical datasets.

- **CCADT Integration**: The component incorporated data from the
  Climate Change Adaptation Digital Twin.

A comprehensive Integration, Verification and Validation (IVV) process
was conducted across all components to ensure stable operation within
the DestinE ecosystem. Key outcomes included the successful deployment
of cloud-native services (on the OVH tenant managed by Murmuration),
smooth federation of externally hosted components via service proxies
and validation of access rights, data flow, container orchestration, and
performance under real user scenarios.

The integration and onboarding with DestinE was a key achievement of the
UrbanSquare project. It enabled the deployment of a modular, federated,
and interoperable set of services that not only harness DestinE
technological strengths but also demonstrate the potential of digital
twins to support urban adaptation planning. This foundation now
positions UrbanSquare for broader uptake, replication, and commercial
exploitation across European and global urban contexts.

## Communication

A comprehensive use case promotion plan was developed aimed at sharing
valuable knowledge and insights derived from its diverse use cases. The
primary objective was to communicate the benefits and future potential
of DestinE services through a variety of communication channels and
products.

The plan was designed to reach informed audiences who are already aware
of DestinE, as well as to attract new stakeholders with similar needs.
The promotion plan emphasises the value of the Use Case Promotion
Package, highlighting its role in supporting informed decision-making.
To accomplish this, a standardised one-page template is used to present
mature use cases, including those related to air quality, urban heat,
flooding, and sea level rise.

A variety of communication products have been developed to support
project messaging, including e-flyers, articles, social media content,
tutorials, materials for conferences and events such as presentations
and posters. Notably, the consortium has actively participated in a
DestinE roadshow webinar and provided material and developed challenges
and potential mentors for a community Comms Hackathon.

Consortium members participated in several major conferences to showcase
UrbanSquare’s value and applications. At the Smart City Congress in
Barcelona, they presented UrbanSquare’s value proposition to a broad
audience. During the UN Austria Symposium 2024, they focused on
UrbanSquare’s flood use case. The consortium also took part in the
DestinE 3rd User Exchange in Darmstadt, where they led a session titled
“Transportation and Urban Dynamics: Transforming Transportation and
Urban Planning with Digital Twin Technologies.” At the Living Planet
Symposium, consortium members promoted UrbanSquare and DestinE through
multiple sessions, platform demonstrations, and several poster
presentations.

All activities have been actively promoted on social media both prior to
and throughout their occurrence. The most recent example was during the
Living Planet Symposium, where live posts and photographs were shared
across social media channels in real time.

Additionally, a dedicated MOOC chapter has been developed to expand
educational outreach, integrating UrbanSquare content into the
comprehensive DestinE learning platform.

A 13-minute short film has been produced to serve as an instructional
resource for UrbanSquare, providing a comprehensive overview of the
platform and detailed explanations of each of its components. This film
is designed for flexible use, allowing segments to be repurposed as
short clips for promotional activities on social media, websites and in
presentations.

## Exploitation

The successful implementation of the UrbanSquare Use Cases has created
an opportunity for UrbanSquare to move forward as a combined technical,
analytics and visualisation solution that leverages the complementary
capabilities of its component partners and creates a modularised
offering that can be tailored to the needs of local clients.

By offering multi-disciplinary analytics, UrbanSquare can address a wide
range of urban challenges through a single platform, enabling
stakeholders to act upon these risks through a set of what-if scenarios.
Such an integration provides a comprehensive understanding of urban
systems and allows for more effective and coordinated decision-making by
stakeholders. Over time, new thematic areas (e.g., sustainable mobility,
digital twins for cities) can be added based on evolving user needs.

Its exploitation strategy focuses on three pillars: roadmap progression,
sustainability, and strategic user engagement.

### Roadmap

UrbanSquare’s development is structured into three progressive phases:
Establishment (0–6 months), Adoption (6–24 months), and Acceleration
(24–48 months). In the Establishment phase, efforts will centre on
refining and consolidating a B2B sales funnel as well as a pricing
strategy, while also preparing tender-ready documentation and providing
base-level analytics. From a technical standpoint, it will leverage the
capabilities of each partner to deploy market-ready components, while
refining demonstrators such as the infrastructure module. Integration
with DestinE’s evolving datasets (e.g., digital elevation models,
Climate Digital Twins) strengthen the performance and reliability of the
service offering, both for the single components and for the combination
of the components.

The Adoption phase sees the expansion of the service portfolio to
include new thematic areas (e.g., sustainable mobility, digital twins
for buildings), and the deployment of enhanced visualisation
capabilities that appeal to urban planners and architecture
professionals. Integration with AR/VR and scenario-based simulation
tools enhance usability and allow more agile and user-friendly access to
UrbanSquare services.

In the Acceleration phase, UrbanSquare aims to expand its market
presence and reinforce its technological maturity, while refining its
service offering based on continuous user needs assessment and
monitoring. Key actions include the development of use cases responding
directly to evolving user demands, whilst curating the user onboarding,
education and training, and enhancing visualisation to appeal to
non-expert users. Emphasis will be placed on refining the hybrid
business model to align with diverse client capacities. UrbanSquare also
aims to further harmonise its service components with DestinE datasets
to maintain and improve interoperability. User acquisition and retention
will be deepened through targeted marketing campaigns leveraging
high-level networks, sectoral events, and case-based storytelling.
Internal mechanisms will evolve to manage the increasing complexity of
multi-partner coordination, the integration of new , and user feedback
loops.

<figure>
<img src="media/image9.png" style="width:8.68816in;height:6.18027in"
alt="A diagram with text and images AI-generated content may be incorrect." />
<figcaption><p>: UrbanSquare Roadmap</p></figcaption>
</figure>

### Sustainability

UrbanSquare’s sustainability model addresses the absence of a DestinE
commercialisation module by pursuing a hybrid, multi-tier business
model. The primary offering is a subscription-based urban analytics
toolbox, with tiered access to indicators, predictive models, and
simulations. This can be complemented by license-based, pay-per-use, and
on-demand service tiers to suit diverse municipalities and stakeholders.

Each component retains autonomy in revenue generation while contributing
to a cohesive, integrated UrbanSquare offering. Costs have been
benchmarked across cloud deployment options to provide indicative
estimations of OPEX and pricing models.

UrbanSquare’s focus on UX design, education and training, and client
onboarding further enhance retention and long-term viability. Marketing
will leverage partner networks, industry events, and direct outreach to
municipalities and relevant stakeholders.

### User Engagement Strategy

Municipalities were the target users for the development of UrbanSquare
use cases. Desk research highlighted that, while a growing variety of
end users are interested in EO services, government and public
authorities remain the most active sector in typical take-up. More
specifically, municipalities are uniquely positioned to benefit from
Earth Observation (EO) applications, given their responsibilities in
urban planning, environmental monitoring, and disaster response. With
the increasing availability and affordability of EO technologies, cities
and local governments have significant opportunities to integrate
satellite data into their operations.

Engagement was also informed by user needs assessment at the end of
UrbanSquare, which reflected a generalised positive perception in terms
of added value of the services provided, with room to further enhance
each component’s service offering. Initial user feedback underlined the
importance of continuous engagement with the end users to ensure that
the services are tailored to their needs on the one hand, and that
future developments meet the evolving needs of the primary target users
on the other.

For this reason, UrbanSquare’s user engagement is designed to be
multi-layered and iterative. The Level 0–2 support framework ensures
that user inquiries are efficiently addressed, with complex queries
escalated to domain-specific partners. This structure enables rapid
response and agile feature development.

To build capacity and deepen adoption, UrbanSquare offers educational
resources, including MOOCs, tutorials, and onboarding, alongside service
documentation. These are tailored to accommodate both non-specialist
municipal staff and advanced users with EO or modelling expertise.

A central focus on user-centric design, scenario-based analysis, and the
ability to simulate interventions (e.g., greening, mobility shifts,
infrastructure upgrades) ensures that UrbanSquare aligns with the
operational realities of local governments and urban planners.

# Conclusion and next steps

UrbanSquare is a modular, scenario-based digital platform that leverages
DestinE’s capabilities to support municipalities in addressing urban
climate risks. It stands out in a rapidly growing market by offering a
centralised, user-friendly entry point for urban planning and
resilience, integrating high-impact climate simulations with
infrastructure and resource management tools.

Most of its services—like sea level rise, air quality, and urban
heat—are already market-ready, while others (like infrastructure
analysis) are still in the demonstrator phase. Key development
priorities include enhancing user experience, aligning pricing with
market standards, and exploring independent commercialisation strategies
beyond DestinE.

Looking forward, a roadmap has been established jointly by the
consortium members, focusing on technological refinement, deeper DestinE
integration, and thematic features expansion. By continuing to evolve
alongside user needs and emerging datasets, UrbanSquare aims to become a
leading tool in climate-resilient urban decision-making.

At the moment of this present report, UrbanSquare is deployed in the OVH
cloud infrastructure, in a tenant supported and managed by Murmuration.
It is onboarded and publicly visible in DestinE service catalogue

The UrbanSquare consortium takes the commitment to maintain the service,
at least in its current state, but more probably with continuous
evolutions, for the next 6 months, visible and operational on DestinE
platform.
