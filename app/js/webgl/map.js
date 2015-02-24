 var map;
 var myLayer;
 var center = new google.maps.LatLng(51.507413, -0.127802);

 function initialize() {
     var mapOptions = {
         zoom: 8,
         center: center,
         mapTypeId: google.maps.MapTypeId.ROADMAP,
         disableDefaultUI: true,
         draggable: true,
         scrollwheel: true,
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

     // myLayer.loadGeoJson('/data/postcodes.geojson');

     // google.maps.event.addListenerOnce(map, 'idle', function(){
     //   generateData(100000);
     // });

     google.maps.event.addListenerOnce(map, 'idle', function() {
         generateFramesData();
         generateShapesData();
     });

     myLayer.start(); //Starts the rendering loop.

 }

 function generateFramesData() {

     $.ajax({
         url: "/data/frames_70000.json",
         context: document.body,
         beforeSend: function(xhr) {
             toastr.info('Processing frames')
         }
     }).done(function(response) {

         var res = {
             'type': 'FeatureCollection',
             'features': []
         }
         $.each(response, function(index, val) {
             var lat = val.Geometry.Coordinates[0]
             var lng = val.Geometry.Coordinates[1]
             var point = {
                 "geometry": {
                     "type": "Point",
                     "coordinates": [lng, lat]
                 },
                 "type": "Feature",
                 "properties": val.Properties
             }
             res.features.push(point);
         });
         myLayer.loadData(res);
         toastr.info('Frames Done')
     });

 }

 function generateShapesData() {

     $.ajax({
         url: "/data/shapes.json",
         context: document.body,
         beforeSend: function(xhr) {
             toastr.info('Processing shapes')
         }
     }).done(function(response) {

         var res = {
             'type': 'FeatureCollection',
             'features': []
         }

         wkt_format = new OpenLayers.Format.WKT();
         geojson_format = new OpenLayers.Format.GeoJSON();

         $.each(response, function(index, val) {
             wicket = val.Wkt;
             //wicket = "MULTIPOLYGON (((40 40, 20 45, 45 30, 40 40)), ((20 35, 45 20, 30 5, 10 10, 10 30, 20 35), (30 20, 20 25, 20 15, 30 20)))"
             var feature = wkt_format.read(wicket)
             var geoJson = geojson_format.write(feature);
             polygon = JSON.parse(geoJson);
             res.features.push(polygon);
             return false;
         });
         myLayer.loadData(res);
         toastr.info('Shapes Done')
     });

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
     myLayer.loadData(res);
 }

 google.maps.event.addDomListener(window, 'load', initialize);