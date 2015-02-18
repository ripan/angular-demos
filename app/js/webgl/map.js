 var map;
 var myLayer;
 var center = new google.maps.LatLng(51.507413, -0.127802);

 function initialize() {
     var mapOptions = {
         zoom: 13,
         center: center,
         mapTypeId: google.maps.MapTypeId.ROADMAP,
         disableDefaultUI: true,
         draggable: false,
         scrollwheel: false,
         panControl: false
     };
     var mapCanvas = document.getElementById('header-map');
     map = new google.maps.Map(mapCanvas, mapOptions);

     myLayer = new WebGLLayer(map);

     google.maps.event.addDomListener(window, 'resize', function() {
         map.setCenter(center);
     });

     // myLayer.tilebase = 'http://130.211.58.85:8080/postcodes/';
     // myLayer.zoomlock = 12;

     myLayer.loadGeoJson('/data/postcodes.geojson');

     // google.maps.event.addListenerOnce(map, 'idle', function(){
     //   generateData(100000);
     // });

     myLayer.start(); //Starts the rendering loop.
 }

 function generateData(n) {
     var randInRange = function(from, to, fixed) {
         return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
     };
     var res = {
         'type': 'FeatureCollection',
         'features': []
     }
     console.log(map)
     var bounds = map.getBounds();
     console.log(bounds);
     var ne = bounds.getNorthEast();
     var sw = bounds.getSouthWest();
     for (var i = 0; i < n; i++) {
         var lat = randInRange(sw.lat(), ne.lat(), 8);
         var lng = randInRange(ne.lng(), sw.lng(), 8);
         var point = {
             "geometry": {
                 "type": "Point",
                 "coordinates": [lng, lat]
             },
             "type": "Feature",
             "properties": {}
         }
         res.features.push(point);
     }
     console.log(res);
     myLayer.loadData(res);
 }

 google.maps.event.addDomListener(window, 'load', initialize);