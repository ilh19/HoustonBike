if (Meteor.isClient) {

  Template.map.rendered = function() {
    var mapOptions = {
      center: new google.maps.LatLng(29.760193, -95.36939),
      zoom: 13,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

    // ------ Google bike lanes ------
    var googleBikeLayer = new google.maps.BicyclingLayer();
    googleBikeLayer.setMap(map);

    // ------ COH bike lanes ------
    var cityBikeLayer = new google.maps.FusionTablesLayer({
      query: {
        select: 'geometry',
        from: '1G_rg3pp5LTK1T3IoEcMSWsV4Dv6O53VTOXBIkI4'
      }
      //styles: [{
      //  polygonOptions: {
      //      fillColor: "#274e13",
      //      strokeColor: "#274e13"
      //  },
      //  polylineOptions: {
      //      strokeColor: "#274e13"
      //  }
      //}]
    });
    cityBikeLayer.setMap(map);
    
    // setting the description for the COH bike lane
    google.maps.event.addListener(cityBikeLayer, 'click', function(e) {
      // Change the content of the InfoWindow
      e.infoWindowHtml = "<b>" + "Bike Route: " + "</b>" + e.row['Lane Type'].value + "<br>";
    });
        
    // ------ Bike rental locations ------
    //var rentalLayer = new google.maps.KmlLayer({
    //    url: 'https://data.codeforhouston.com.s3.amazonaws.com/2013-05-13T23:25:41.376Z/phaseiibcyclestations-kml-file.kml',
    //    styles: [{
    //        markerOptions: {
    //            iconName: "b_blue"
    //        }
    //       }]
    //    });
    var rentalLayer = new google.maps.FusionTablesLayer({
      query: {
        select: 'geometry',
        from: '1H1huBiR9EfC4SjzQ5Ju2mIkzOUOvxULT5QwTzoE'
      },
      styles: [{
        markerOptions: {
            iconName: "b_blue"
        }
      }]
    });
    rentalLayer.setMap(map);
	
	var switchVisibility = function(layer, map, event) {
		if(layer.getMap())
			layer.setMap(null);
		else
			layer.setMap(map);
		$(event).toggleClass('marked');
	}
	
	$('#rentalLayer').click(function(event) {
		switchVisibility(rentalLayer, map, this);
	});
	$('#cityBikeLayer').click(function(event) {
		switchVisibility(cityBikeLayer, map, this);
	});
	$('#googleBikeLayer').click(function(event) {
		switchVisibility(googleBikeLayer, map, this);
	});
	
	 
	var center = map.getCenter();
	var yelpMarkers = [];
	Meteor.call('queryYelp', 'bike shop', center.lat(), center.lng(), '10', function(result, response) {
		if(response.statusCode == 200) {
			var yelpResponse = EJSON.parse(response.content);
			var yelpResults = yelpResponse.businesses;
				
			for(var i = 0; i < yelpResults.length; i++) {
				var biz = yelpResults[i];
					
				var options = {
					position : new google.maps.LatLng(biz.latitude, biz.longitude),
					map : map,
					title: biz.name
				};

				var yelpMarker = new google.maps.Marker(options);
				yelpMarker.biz = biz;
				yelpMarkers.push(yelpMarker);
					
				google.maps.event.addListener(yelpMarker, 'click', function(e) {
					for(var j = 0; j < yelpMarkers.length; j++) {
						var currentMarker = yelpMarkers[j];
						
						if(currentMarker.position.equals(e.latLng)) {
							var infoWindow = new google.maps.InfoWindow({
								content: Template.yelpInfo(yelpMarkers[j].biz) 
							});
						
							infoWindow.open(map,yelpMarkers[j]);
						}
					}
					console.log(yelpMarkers, e.latLng);
				});
			}
		}
	});
  };
}

if (Meteor.isServer) {
//   Meteor.startup(function() {
//     // code to run on server at startup
//   });
	Meteor.methods({
		'queryYelp' : function(term, lat, longitude, radius, callback) {
			var url = 'http://api.yelp.com/business_review_search?ywsid=4z8j2En3Yc4AI-Whlsrejw';
			url = url + '&term=' + term;
			url = url + '&lat=' + lat;
			url = url + '&long=' + longitude;
			url = url + '&radius=' + radius;
			url = url + '&limit=' + 10;
			return Meteor.http.get(url, {
				'data' : {
					'term': term,
					'lat' : lat,
					'long' : longitude,
					'radius' : radius,
					'limit' : 10,
					'ywsid': '4z8j2En3Yc4AI-Whlsrejw'
				}
			});
		}
   });
}