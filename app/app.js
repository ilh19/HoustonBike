if (Meteor.isClient) {

  Template.map.rendered = function() {
    var map = new google.maps.Map(document.getElementById("map-canvas"), {
      center: new google.maps.LatLng(29.760193, -95.36939),
      zoom: 13,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    // add layers
    addGoogleBikeLayer(map);
    addCohBikeLayer(map);
    addRentalLocationsLayer(map);

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

    // add pins to the map on click
    google.maps.event.addListener(map, 'click', function(e) {
      placeMarker(map, e.latLng);
    });

  }; // end template

  var switchVisibility = function(layer, map) {
    if (layer.getMap()) layer.setMap(null);
    else layer.setMap(map);
  }

  var placeMarker = function(map, location) {
    var marker = new google.maps.Marker({
      position: location,
      map: map
    });
  };

  var addGoogleBikeLayer = function(map) {
    var googleBikeLayer = new google.maps.BicyclingLayer();
    googleBikeLayer.setMap(map);
  };

  var addCohBikeLayer = function(map) {
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
  };

  var addRentalLocationsLayer = function(map) {
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
      // BCycle logo, link, location name
      e.infoWindowHtml = "<img src=\"Houston_B-cycle_Logo.jpg\" alt=\"Houston BCycle Logo\">" +
        "<a href=" + "http://houston.bcycle.com" + " target=\"_blank\">" +
        "BCycle" + "</a>" + ": " + e.row['name'].value;
    });
  };

}