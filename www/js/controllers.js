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

      
     var searchPlaces = v.split(", ");
     console.log(searchPlaces);
     console.log(searchPlaces.length);

     /*
     for (var i=0; i<searchPlaces.length; i++)
     {
      var request = {
            location: centerLocation,
            radius: '500',
            query: searchPlaces[i]
      };
      var map = new google.maps.Map(document.getElementById("map2"));
      var service = new google.maps.places.PlacesService(map);
      
      console.log("searching for " + searchPlaces[i]);

      service.textSearch(request, callback);
     }
     */
     
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

  //modal stuff
  $ionicModal.fromTemplateUrl('my-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
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
    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
      // Execute action
    });
  //get location from autocomplete input, store in local storage?
  $scope.onAddressSelection = function(location) {
    var a = location.address_components;
    var b = location.name;
    var c = location.types;
    
    console.log(c);
    //console.log("from search: " + JSON.stringify(a));

    //window.localStorage.setItem("autocompleteData", JSON.stringify(c));

    var searchType = c[0];//first one for the sake of convenience
    console.log("search location type: " + searchType);

    navigator.geolocation.getCurrentPosition(function(pos) {

      //console.log(searchType);

      var centerLocation = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
      
        var request = {
            location: centerLocation,
            radius: '500',
            query: searchType
        };
        var map = new google.maps.Map(document.getElementById("map4"));
        var service = new google.maps.places.PlacesService(map);
                  
        service.textSearch(request, callback2);
        
      });
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
            //clear local data
            window.localStorage.removeItem("data");
            
            
        });

        $scope.map = map;
    };
    
    google.maps.event.addDomListener(document.getElementById("map3"), 'load', $scope.initialise());

    $scope.$on('eventFired', function(event, data) {
        $scope.initialise();
    })

})

//Favorites Controller
.controller('FavoritesCtrl', function($scope) {

})

//Browse Controller
.controller("BrowseCtrl", function($scope, $window) { 

  $scope.refresh = function(){
    $window.location.reload(true);
  }

  var v = window.localStorage.getItem("autocompleteData");

  v = JSON.parse(v);
  console.log(v);

  var searchLocations = new Array();
  for (var i=0; i<v.length; i++)
  {
    searchLocations[i] = {
      name: v[i].name,
      rating: v[i].rating
    }
  }

  console.log(searchLocations);

  $scope.locations = searchLocations;

});

function callback(results, status) {
  //console.log(status);

  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      console.log(place.name);
    }
  }
  else {
    console.log("error");
  }

  //console.log(results);
  //console.log(JSON.stringify(results));

  //appendToStorage("data", JSON.stringify(results))

  window.localStorage.setItem("data", JSON.stringify(results));
}

function appendToStorage(data, results){
    var old = window.localStorage.getItem(data);
    if(old === null) old = "";
    window.localStorage.setItem("data", old + results);

    var v = window.localStorage.getItem("data");
    console.log(v);
}

function callback2(results, status) {
  //console.log(status);

  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      //console.log(place.name);
    }
  }
  else {
    console.log("error");
  }

  //console.log(results);
  //puts results from search type into local storage
  window.localStorage.setItem("autocompleteData", JSON.stringify(results));
}
