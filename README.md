urban activity topics
==============================
This notebook is about a study on geospatial topic modeling to extract 'urban activity topics' from fine-grained hourly population estimate data using non-negative matrix factorization. 

Early in 2018, the City of Seoul started to publish a dataset collecting hourly estimated population for each census tract (total 19,153) in Seoul everyday. The City of Seoul created this detailed synthetic dataset combining the population census data and real-time cell phone location data in collaboration with a major cell phone carrier company of South Korea. 

We identified urban activity topics by applying non-negative matrix factorization (NMF) to the location-time matrix whose row is each census tract(19,153) and column is each hourly timeslot(7X24), and elements are the average number of estimated population in the census tract at the timeslot. NMF on the location-time matrix yields two matrices. One matrix describes how each timeslot contributes to activity topics. The other matrix describes how each census tract is composed of the activity topics.

We were able to identify well-clustered activity topics repetitively found across census tracts such as weekday daytime, night-to-morning, weekend afternoons, evening times, commuting times and so on. Also, the method reveals how urban places are composed of the topics we found and how the topics are geographically located.


![](https://github.com/yonghah/urban-activity-topics/blob/master/reports/figures/topics.svg)

## Notebooks

### data collection
Zipped csv from the City of Seoul collected with Beautiful Soup and saved to AWS S3 after cleaning up

https://github.com/yonghah/urban-activity-topics/blob/master/notebooks/xPopData2S3.ipynb

### data aggretation
aggregates the csvs in S3 using AWS Athena grouping by date, hour, census_id

https://github.com/yonghah/urban-activity-topics/blob/master/notebooks/DataAggregateInAthena.ipynb

### topic modeling
topic model with NMF from scikit-learn

https://github.com/yonghah/urban-activity-topics/blob/master/notebooks/UrbanActivityTopicsNMF.ipynb

## Web app
Mapbox GL JS, Vue.js, D3.js, and vega.

https://s3.amazonaws.com/seoul-topics/www/index.html


![](https://github.com/yonghah/urban-activity-topics/blob/master/reports/figures/screentshot0.png)
