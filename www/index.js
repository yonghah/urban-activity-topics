mapboxgl.accessToken =
'pk.eyJ1IjoiYWhnbm95IiwiYSI6ImZIcGRiZjgifQ.pL1SaB8gHyl-L2yolSl5Qw';

const spec = "heatmap.json";
vegaEmbed('#vis', spec, {defaultStyle: true}).catch(console.warn);

var clickedCensusId =  null;
var map = new mapboxgl.Map({
  container: 'map',
  //style: 'mapbox://styles/ahgnoy/cjkj0kgww439d2rnki8zgox1f',
  style: 'mapbox://styles/mapbox/streets-v9',
  zoom: 10.2,
  center: [126.97, 37.56]
})
//Array.from({length: 5}, (x,i) => 'topic_' + i);
var app = new Vue({
  el: '#app',
  data: {
    topics: Array.from({length: 15}, (x,i) => 'topic_' + i),
    currentTopic: 'topic_0',
    scoreCut: 1.0,
    maxScores: {"topic_0":0.9617289532,"topic_1":0.9936660192,"topic_2":0.9582582954,"topic_3":0.9244264603,"topic_4":0.7634331003,"topic_5":0.3669040362,"topic_6":0.882861761,"topic_7":0.366777168,"topic_8":0.9454749465,"topic_9":0.7852910221,"topic_10":0.8959908057,"topic_11":0.7249125909,"topic_12":0.4262215718,"topic_13":0.6373642553,"topic_14":0.9449404126}
  },
  computed: {
    topicColor: function(){
      var maxScore = this.maxScores[this.currentTopic] * this.scoreCut;
      return {
        'property': this.currentTopic,
        'stops': [
          [0, '#440154'],
          [0.25 * Number(maxScore), '#3b518b'], 
          [0.50 * Number(maxScore), '#21918d'],
          [0.75 * Number(maxScore), '#61c960'],  
          [Number(maxScore), '#cbe02d']
        ]
      } 
    },
  },
  methods: {
    changeTopic: function(e){
      map.setPaintProperty(
        'census', 'fill-color',
        app.topicColor
      );
    },
    changeScoreCut: function(e) {
      map.setPaintProperty(
        'census', 'fill-color',
        app.topicColor
      );
    },
    greet: function (event) {
      console.log(event);
    }
  },
  mounted: function(){
    //this.updateCount();
    //this.renderChart(this.$data.partyInfo);
  },
});

map.addControl(new mapboxgl.NavigationControl());

map.on('load', function() {
  var vectorTileUrl = "https://s3.amazonaws.com/seoul-topics/tile/{z}/{x}/{y}.pbf";
  map.addSource('census', {
    type: 'vector',
    "tiles": [ vectorTileUrl],
    "minzoom": 5,
    "maxzoom": 18
  });

  map.addLayer({
    'id': 'census',
    'type': 'fill',
    'source': 'census',
    "source-layer": 'censustopic',
    'paint': {
      'fill-color': app.topicColor,
      'fill-opacity': 0.75,
      'fill-outline-color':  'rgba(0, 0, 0, 0.3)'
    }
  });
});

/*******************
 * Events
 *******************/
map.on('zoomend', function(e){
  // app.zoom = Math.round(map.getZoom() * 100)/100;
  // app.updateCount();
  // app.renderChart();
});
map.on('moveend', function(e){
  // app.updateCount();
  // app.renderChart();
});
map.on('click', 'census', function (e) {
  var features = map.queryRenderedFeatures(e.point, { layers: ['census'] });
  addTopics(features[0]);
});

map.on("click", "census", function(e) {
  if (e.features.length > 0) {
    var feature = e.features[0];
    var id = 'selectedCensus';
    if (map.getSource(id)){
      map.removeLayer(id);
      map.removeSource(id);
    } else {
      map.addSource(id, {
        "type":"geojson",
        "data": feature.toJSON()
      });
      map.addLayer({
        "id": id,
        "type": "line",
        "source": id,
        'paint': {
          'line-color': 'rgba(255,0,0,1)',
          'line-width':  3
        }
      });
    }
  }
});

/*******************
 * functions 
 *******************/

function addTopics(feature) {
  var data = getTopicData(feature);
  var title = getTitle(feature);
  var svg = d3.select(".topics");
  var margin = {top: 20, right: 5, bottom: 5, left: 60};
  var width = +svg.attr("width") - margin.left - margin.right;
  var height = +svg.attr("height") - margin.top - margin.bottom;
  
  svg.selectAll("*").remove();

  svg.append("text")
    .attr("x", 5)             
    .attr("y", 5 + (margin.top / 2))
    .attr("text-anchor", "left")  
    .style("font-size", "10px") 
    .text(title);

  var y = d3.scaleBand().rangeRound([0, height]).padding(0.1),
      x = d3.scaleLinear().rangeRound([0, width]);
  
  var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
  y.domain(data.map(function(d) { return d.name; }));
  x.domain([0, d3.max(data, function(d) { return d.score; })]);

  g.append("g")
    .attr("class", "y axis")
    .call(d3.axisLeft(y));
  
  g.selectAll(".bar")
  .data(data)
  .enter().append("rect")
    .attr("class", "bar")
    .attr("y", function(d) {return y(d.name); })
    //.attr("x", function(d) { return x(d.count); })
    //.attr("fill", function(d) { return d.color })
    .attr("height", y.bandwidth())
    .attr("width", function(d) { return x(d.score); });
}

function getTopicData(feature) {
  var properties = feature.properties;
  var data = [];
  for (let key in properties) {
    if (key.includes('topic')) {
      data.push({
        'name': key,
        'score': properties[key] 
      });
    }
  }
  return data;
}

function getTitle(feature) {
  var properties = feature.properties;
  var census_id = properties['census']
  var adm_name = properties['ADM_NM']
  return "#" + census_id;
}