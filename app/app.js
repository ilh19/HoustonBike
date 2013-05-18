if (Meteor.isClient) {

  Template.map.rendered = function() {
    var map = new google.maps.Map(document.getElementById("map-canvas"), {
      center: new google.maps.LatLng(29.760193, -95.36939),
      zoom: 13,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    // ADD LAYERS
    googleBikeLayer = getGoogleBikeLayer(map);
    googleBikeLayer.setMap(map);

    cityBikeLayer = getCityBikeLayer(map);
    cityBikeLayer.setMap(map);

    rentalLayer = getRentalBikeLayer(map);
    rentalLayer.setMap(map);

    // MAP LISTENERS
    google.maps.event.addListener(map, 'click', function(e) {
      placeMarker(map, e.latLng);
    });

    google.maps.event.addListener(cityBikeLayer, 'click', function(e) {
      // Change the content of the InfoWindow
      e.infoWindowHtml = "<b>" + "Bike Route: " + "</b>" + e.row['Lane Type'].value + "<br>";
    });

    google.maps.event.addListener(rentalLayer, 'click', function(e) {
      // Change the content of the InfoWindow
      // BCycle logo, link, location name
      e.infoWindowHtml = "<img src=\"Houston_B-cycle_Logo.jpg\" alt=\"Houston BCycle Logo\">" +
        "<a href=" + "http://houston.bcycle.com" + " target=\"_blank\">" +
        "BCycle" + "</a>" + ": " + e.row['name'].value;
    });

    // NAVBAR LISTENERS
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

    // search box functionality
    var geocoder = new google.maps.Geocoder();
    $(function() {
        $("#searchbox").autocomplete({    
            source: function(request, response) {
    
            if (geocoder == null){
                geocoder = new google.maps.Geocoder();
            }
            geocoder.geocode( {'address': request.term }, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
    
                var searchLoc = results[0].geometry.location;
                var lat = results[0].geometry.location.lat();
                var lng = results[0].geometry.location.lng();
                var latlng = new google.maps.LatLng(lat, lng);
                var bounds = results[0].geometry.bounds;
    
                geocoder.geocode({'latLng': latlng}, function(results1, status1) {
                    if (status1 == google.maps.GeocoderStatus.OK) {
                        if (results1[1]) {
                        response($.map(results1, function(loc) {
                            return {
                                label  : loc.formatted_address,
                                value  : loc.formatted_address,
                                bounds   : loc.geometry.bounds
                            }
                        }));
                      }
                    }
                  });
                }
            });
            },
            select: function(event,ui){
                var pos = ui.item.position;
                var lct = ui.item.locType;
                var bounds = ui.item.bounds;
        
                if (bounds){
                    map.fitBounds(bounds);
                }
            }
        });
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

  var getGoogleBikeLayer = function(map) {
    return new google.maps.BicyclingLayer();
  };

  var getCityBikeLayer = function(map) {
    return cityBikeLayer = new google.maps.FusionTablesLayer({
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
  };

  var getRentalBikeLayer = function(map) {
    // return rentalLayer = new google.maps.KmlLayer({
    //    url: 'https://data.codeforhouston.com.s3.amazonaws.com/2013-05-13T23:25:41.376Z/phaseiibcyclestations-kml-file.kml',
    //    styles: [{
    //        markerOptions: {
    //            iconName: "b_blue"
    //        }
    //       }]
    //    });
    return new google.maps.FusionTablesLayer({
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
  };
}