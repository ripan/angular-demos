 var map;
 var myLayer;
 var center = new google.maps.LatLng(51.507413, -0.127802);
 var markerColors = []
 var res;
 var markers = [];

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
         //generateFramesData();
         //generateShapesData();
     });

     map.addListener('click', function(e) {
         if (res) {
             addCircle(e.latLng, 100);
             console.log(e);
         }
     });


     map.addListener('rightclick', function() {
         if (map.zoom > 10) {
             showViewportmarkers();
         } else {
             toastr.info('Please increate the zoom to 11 to view the markers. Current zoom is: ' + map.zoom)
         }
     });


     function showViewportmarkers() {
         bounds = map.getBounds();
         invisibleMarkers = _.filter(markers, function(marker) {
             return !marker.isPresentOnMap;
         });
         //toastr.info('invisible markers ' + invisibleMarkers.length)
         $.each(invisibleMarkers, function(index, marker) {
             if (bounds.contains(marker.getPosition())) {
                 icon = 'https://chart.googleapis.com/chart?chst=d_map_xpin_letter&chld=pin||' + marker.settings.color.replace('#', '');
                 marker.setIcon(icon);
                 marker.setMap(map);
                 marker.isPresentOnMap = true;
             }
         });
     }

     $('#plotFeaturesBtn').click(function(e) {
         count = $('input[name=featuresCount]').val();
         if ($.isNumeric(count)) {
             toastr.info('Plotting ' + count + ' features');
             generateData(count);
         } else {
             toastr.error('Please enter valid input');
         }
     });

     $('#plotEcosFeaturesBtn').click(function(e) {
         generateFramesData();
     });

     $('#clearEcosFeaturesBtn').click(function(e) {
         clearData();
     });

     $('#map-colors').click(function(e) {
         clearData();
         generateFramesData({
             name: e.target.textContent
         })
     });


 }

 function clearData() {
     $.each(markers, function(index, marker) {
         marker.setMap(null)
     });
     myLayer.canvasLayer_.canvas.remove();
     markerColors = [];
     markers = [];
 }

 function addCircle(center, radius) {
     $.each(res.features, function(index, feature) {
         coords = feature.geometry.coordinates;
         position = new google.maps.LatLng(coords[1], coords[0]);
         if (google.maps.geometry.spherical.computeDistanceBetween(center, position) < radius) {
             var circle = new google.maps.Circle({
                 strokeColor: '#FF0000',
                 strokeOpacity: 0.8,
                 strokeWeight: 2,
                 fillColor: '#FF0000',
                 fillOpacity: 0.35,
                 map: map,
                 center: position,
                 radius: radius
             });

             var marker = new google.maps.Marker({
                 position: position,
                 map: map,
                 icon: 'https://chart.googleapis.com/chart?chst=d_bubble_icon_text_small&chld=ski|bb|Wheeee!|FFFFFF|000000',
                 title: 'Hello World!'
             });

             center = circle.getCenter();
             radius = circle.getRadius();
         }
     });
 }

 function addMarker(feature) {
     coords = feature.geometry.coordinates;
     position = new google.maps.LatLng(coords[1], coords[0]);
     var marker = new google.maps.Marker({
         position: position,
         settings: {
             color: feature.properties.MediaOwnerColour
         },
         title: feature.properties.MediaOwner,
         isPresentOnMap: false,
     });
     markers.push(marker);
 }

 function generateFramesData(options) {

     myLayer = new WebGLLayer(map);
     myLayer.start();

     $.ajax({
         url: "/data/frames_70000.json",
         context: document.body,
         beforeSend: function(xhr) {
             toastr.info('Processing frames')
         }
     }).done(function(response) {

         res = {
             'type': 'FeatureCollection',
             'features': []
         }
         if (options && options.name) {
             response = _.filter(response, function(d) {
                 return d.Properties.MediaOwner == options.name
             })
         }

         //response = _.first(response, 20)
         toastr.info('Plotting ' + response.length + ' features');

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
                 //rgb = HEXtoRGB(val.Properties.MediaOwnerColour)
                 //myLayer.features_.points.defaultColor = rgb; //[192,192,192];
                 //myLayer.changePointColor(index, rgb)
             res.features.push(point);
             addMarker(point);
         });
         myLayer.loadData(res);
         updateFeaturesColor(res.features);
         if (options && options.name) {

         } else {
             createColorDisplay();
         }
         toastr.info('Success')
     });
 }

 function findFeatureIndexById(featureId) {
     //featureId = "750314";
     feature = _.find(res.features, function(r) {
         return r.properties.$id == featureId
     });
     index = res.features.indexOf(feature);
 }

 function updateFeaturesColor(features) {
     //toastr.info('Adding colors to frames')
     $.each(features, function(index, feature) {
         featureName = feature.properties.MediaOwner;
         featureColor = feature.properties.MediaOwnerColour;
         featureId = feature.properties.$id;
         //findFeatureIndexById(featureId);
         //featureColor = feature.properties.FormatgroupColour;
         rgb = HEXtoRGB(featureColor)
         markerColors.push({
             hex: featureColor,
             rgb: rgb,
             name: featureName
         });
         myLayer.changePointColor(index, rgb)
     });
 }

 function createColorDisplay() {
     //toastr.info('Creating color spans')
     uniqueMarkerColors = _.uniq(markerColors, 'hex');
     $.each(uniqueMarkerColors, function(index, markerColor) {
         colorSpan = $('<li>' + markerColor.name + '</li>');
         colorSpan.attr('style', 'color:' + markerColor.hex + '');
         $('#map-colors').append(colorSpan);

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

     myLayer = new WebGLLayer(map);
     myLayer.start();

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