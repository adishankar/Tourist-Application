angular.module('starter.controllers', ['ngCordova', 'ion-google-autocomplete'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $cordovaGeolocation, SettingsUpdate) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $ionicModal.fromTemplateUrl('templates/modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
    });  

    $scope.rangeValue = "8";

    $scope.update = function(value) {
      SettingsUpdate.setRangeValue(value);
      $scope.modal.hide();
    };

    $scope.openModal = function() {
      $scope.modal.show();
    };
    $scope.closeModal = function() {
      $scope.modal.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });
  
  //finds current location and does a text search based on input
  $scope.doSearch = function(v) {

    //window.localStorage.removeItem("data");

    navigator.geolocation.getCurrentPosition(function(pos) {

      var centerLocation = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);

      console.log(v);

      var request = {
          location: centerLocation,
          radius: '500',
          query: v
      };
      var map = new google.maps.Map(document.getElementById("map2"));
      var service = new google.maps.places.PlacesService(map);
                
      service.textSearch(request, callback);
    });
  }

})

//controller for search page
.controller('SearchCtrl', function($scope, $ionicModal, $cordovaGeolocation) {

  $scope.data = {};

  //get location from autocomplete input, store in local storage?
  $scope.onAddressSelection = function(location) {
    var a = location.address_components;
    console.log("from search: " + JSON.stringify(a));

    window.localStorage.setItem("autocompleteData", JSON.stringify(a));
  }

  $scope.loadData = function() {
    alert(window.localStorage.getItem("data"));
  }

    //clear any leftover data
  $scope.clearData = function(){
    window.localStorage.removeItem("data");
  }

})

//Map Controller
.controller('MapCtrl', function($scope, $ionicLoading, SettingsUpdate) {

    $scope.loadData = function() {
      alert(window.localStorage.getItem("data"));
    }

    $scope.initialise = function() {

        var myLatlng = new google.maps.LatLng(37.3000, -120.4833);
        var mapOptions = {
            center: myLatlng,
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            
            //disabled some stuff on the UI since it was causing clutter
            disableDefaultUI: true,
            zoomControl: true,
            panControl: true,
            scaleControl:true,
            rotateControl: true
        };

        var map = new google.maps.Map(document.getElementById("map3"), mapOptions);
        
        //Times 1500 to account for whatever weird units google expects.
        $scope.rangeValue = 1500*parseFloat(SettingsUpdate.getRangeValue());

        var scanRadiusDisplay = new google.maps.Circle(
            {
                center: mapOptions.myLatlng,
                radius: $scope.rangeValue,
                strokeColor: "#008000",
                strokeOpacity: 0.9,
                strokeWeight: 1,
                fillColor: "#ADFF2F",
                fillOpacity: 0.2
            });
            
        scanRadiusDisplay.setMap(map);

        //load data here
        var dataString = window.localStorage.getItem("data");
        //convert to json
        var placesFound = JSON.parse(dataString);

        console.log(placesFound);
            

        navigator.geolocation.getCurrentPosition(function(pos) {
            console.log(pos);
            map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
            scanRadiusDisplay.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));

            var myLocation = new google.maps.Marker({
                position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
                map: map,
                title: "My Location",
                label: 'My Location'
            });

            

            //search location markers
            for (var i=0; i<placesFound.length; i++){
              
              //var locationDetails = {name: placesFound[i].name, address: placesFound[i].formatted_address};
              var locationDetails = placesFound[i].name;
              console.log(locationDetails);

              var marker = new google.maps.Marker({
                map: $scope.map,
                position: placesFound[i].geometry.location,
                title: placesFound[i].name + '<br>' + placesFound[i].formatted_address
              });

              
              var infoWindow = new google.maps.InfoWindow();
              
              
              google.maps.event.addListener(marker, 'click', function () {
                  infoWindow.open($scope.map, marker);
              });                  
              
              //set listener to open infowindow with marker title information
              marker.addListener('click', function(){
                infoWindow.setContent(this.title);
                infoWindow.open($scope.map, this);
              });
            }
            
            
        });

        $scope.map = map;
    };
    
    google.maps.event.addDomListener(document.getElementById("map3"), 'load', $scope.initialise());

    $scope.$on('eventFired', function(event, data) {
        $scope.initialise();
    })

})

//Browse Controller
.controller("BrowseCtrl", function($scope) {

  var a = window.localStorage.getItem("autocompleteData");
  console.log("from browse: " + a);

});

function callback(results, status) {
  //console.log(status);

  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      //console.log(place);
    }
  }
  else {
    console.log("error");
  }

  //console.log(results);
  window.localStorage.setItem("data", JSON.stringify(results));
}
