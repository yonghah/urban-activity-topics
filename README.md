urban activity topics
==============================

This notebook is about a study on geospatial topic modeling to extract 'urban activity topics' from fine-grained hourly population estimate data using non-negative matrix factorization.

Early in 2018, the City of Seoul announced a remarkable dataset collecting hourly estimated population for each census tract (total 19,153) in Seoul. This is a synthetic dataset combining the population census data and real-time cell phone location data from a major cell phone carrier company in South Korea.

We identified urban activity topics by applying a topic modeling technique to the census tract - timeslot matrix where each elements are the average number of estimated population in a census tract at a timeslot. We was able to identify well-clustered activity topics repetitively found across census tracts such as weekday daytime, night-to-morning, weekend afternoons, evening times, commuting times and so on. Also, the method reveals how each census tract is composed of the topics we found.


![](https://github.com/yonghah/urban-activity-topics/blob/master/reports/figures/topics.svg)

* Notebook:
https://github.com/yonghah/urban-activity-topics/blob/master/notebooks/UrbanActivityTopics.ipynb

* Web app:
https://s3.amazonaws.com/seoul-topics/www/index.html


![](https://github.com/yonghah/urban-activity-topics/blob/master/reports/figures/screentshot0.png)
