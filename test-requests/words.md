Investigated the CDP API with some initial help from Dale Ship.

There are two three parts to the Maps offering from the CDP API:

* Observations
* Forecast
* Base maps

These are well documented in the [up-to-date documentation](https://metoffice.sharepoint.com/sites/TechnologyAtlasTeamExt/SitePages/CDP-CC-Maps-Service.aspx).

---

The Observations available are as follows:

* **radar_rainfall** - 2 days worth of 5 minute data
* **radar_rainfall_accessible** - 2 days worth of 5 minute data using a more accessible colour scheme

The [capabilities file](https://maps.consumer-digital.api.metoffice.gov.uk/v1/config/get-capabilities/ob.xml) is massively simplified from the usual WMS specification

Performance was good on the dev system I was accessing and couldn't possibly have been faster on the production system with pre-cached data.

---

The Forecast data available from the UKV model are as follows:

* **rainfall_rate**
* **total_precipitation_rate** - difficult to tell but does look to combine all precipitation sources
* **total_precipitation_rate_accessible** - same as above but using a more accessible colour scheme
* **cloud_amount_total**
* **hail_fall_rate**
* **snowfall_rate**
* **temperature**

All layers have the same temporal availability of:

* **Short**: run every hour giving T+0 to T+12 as 15 minute steps
* **Long**: run every 12 hours giving T+0 to T+54 as 15 minute steps, then T+54 to T+120 as hourly steps

No **Pressure**, **Wind** or **Precipitation accumulation** layers are available from the CDP map service.

Again, the [capabilities file](https://maps.consumer-digital.api.metoffice.gov.uk/v1/config/get-capabilities/fc.xml) is massively simplified from the usual WMS specification

And again, performance was good on the dev system I was accessing and couldn't possibly have been faster on the production system with pre-cached data.

---

**Conclusion**. 

The CDP Map Service as a system is very easy to use and because of what systems it supports, very powerful and performant. Obviously being Consumer Digital focused (public web and app) I'd expect having additional layers from MDDA added to the map imagery service to support Hazard Manager to be a difficult discussion every though the underlying systems would fully support it with the included auto-scaling.

---

**Also found**

CDP also provides an API for spot data and other information and that is again well documented in a [Swagger document](https://data.dev.consumer-digital.api.metoffice.gov.uk/v1/swagger/index.html). Again, majority of this data supports public web and app and is mainly BestData1 or IMPROVER data.
