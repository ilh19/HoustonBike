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
    
    // setting the description for bike rental
    google.maps.event.addListener(rentalLayer, 'click', function(e) {
      // Change the content of the InfoWindow
      e.infoWindowHtml = "<b>" + "BCycle: " + "</b>" + e.row['name'].value + "<br>";
    });
    
	var switchVisibility = function(layer, map) {
		if(layer.getMap())
			layer.setMap(null);
		else
			layer.setMap(map);
	}
	
	$('#rentalLayer').click(function(event) {
		switchVisibility(rentalLayer, map);
		$mark = $(this).find('.mark');
		$(this).toggleClass('marked');
	});
	$('#cityBikeLayer').click(function(event) {
		switchVisibility(cityBikeLayer, map);
		$(this).toggleClass('marked');
	});
	$('#googleBikeLayer').click(function(event) {
		switchVisibility(googleBikeLayer, map);
		$(this).toggleClass('marked');
	});
  };
}

// if (Meteor.isServer) {
//   Meteor.startup(function() {
//     // code to run on server at startup
//   });
// }