angular.module('starter.controllers', ['ngCordova', 'ion-google-autocomplete'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $cordovaGeolocation, SettingsUpdate, $timeout) {

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

    // $scope.rangeValue = "6";
    $scope.rangeValue = SettingsUpdate.getRangeValue();
    $scope.toggle = "false";

    $scope.update = function(value, numPlaces, valueToggle) {
      $scope.rangeValue = value;
      $scope.toggle = valueToggle;
      console.log(" toggle is " + valueToggle);
      SettingsUpdate.setValues(value, numPlaces);
      // SettingsUpdate.setRangeValue(value);
      // SettingsUpdate.setNumPlaces(numPlaces);
      $scope.modal.hide();
    };

    $scope.openModal = function() {
      $scope.modal.show();
    };
    $scope.closeModal = function() {
      $scope.modal.hide();
    };

    //$timeout($scope.openModal, 10);

    // Cleanup the modal when we're done with it!
    // $scope.$on('$destroy', function() {
    //   $scope.modal.remove();
    // });
  
  //finds current location and does a text search based on input
  $scope.doSearch = function(v) {

    //window.localStorage.removeItem("data");

    navigator.geolocation.getCurrentPosition(function(pos) {

      var centerLocation = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);

      console.log(v);
      console.log("range is" + $scope.rangeValue);

      var request = {
          location: centerLocation,
          // radius: '500',
          radius: (1609 * parseInt($scope.rangeValue)),
          opennow: $scope.toggle,
          type: v
      };
      var map = new google.maps.Map(document.getElementById("map2"));
      var service = new google.maps.places.PlacesService(map);
                
      service.textSearch(request, callback);
    });
  }

 

  $scope.groups = [
    { name: 'Food', id: 1, items: [{subName: 'restaurant',subId: 'restaurant'}, {subName: 'cafe',subId: 'cafe'}, {subName: 'bakery',subId: 'bakery'}]},
    { name: 'Tourism', id: 2, items: [{subName: 'amusement park',subId: 'amusement_park'}, {subName: 'aquarium',subId: 'aquarium'}, {subName: 'natural feature',subId: 'natural_feature'}, {subName: 'museum',subId: 'museum'}]},
    { name: 'Worship', id: 3, items: [{subName: 'church',subId: 'church'}, {subName: 'mosque',subId: 'mosque'}, {subName: 'synagogue',subId: 'synagogue'}]},
    { name: 'Outdoors', id: 4, items: [{subName: 'campground',subId: 'campground'}, {subName: 'park',subId: 'park'}, {subName: 'rv park',subId: 'rv_park'}]},
    { name: 'Shopping', id: 5, items: [{subName: 'jewelry store',subId: 'jewelry_store'}, {subName: 'liquor store',subId: 'liquor_store'},{ subName: 'shopping mall', subId: 'shopping_mall'}]},
    { name: 'Services', id: 6, items: [{subName: 'hair care',subId: 'hair_care'}, {subName: 'bank',subId: 'bank'},{ subName: 'lodging', subId: 'lodging'}, { subName: 'car rental', subId: 'car_rental'}]}
  ];
  
  
  $scope.toggleGroup = function(group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
  };
  $scope.isGroupShown = function(group) {
    return $scope.shownGroup === group;
  };

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

    $scope.addToFavorites = function(u, v){
      //console.log(u);
      //console.log(v);
      appendToStorage(u,v);

    }
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
    $scope.name = location.name;
    $scope.address = location.formatted_address;
    $scope.rating = location.rating;
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
        $scope.rangeValue = 1609*parseFloat(SettingsUpdate.getRangeValue());

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
        $scope.numPlaces = SettingsUpdate.getNumPlaces();
         // if (placesFound.length > $scope.numPlaces) {
        //   placesFound = placesFound.slice(0, $scope.numPlaces);
        // } 
            

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
                title: '<a target="_blank" href="https://www.youtube.com/results?search_query=' + locationDetails+ '">' + placesFound[i].name  + '</a>' + '<br>' + placesFound[i].formatted_address
              });

              
              var infoWindow = new google.maps.InfoWindow();
              
              
              google.maps.event.addListener(marker, 'click', function () {
                  infoWindow.open($scope.map, marker);
              });                  
              
              //set listener to open infowindow with marker title information
              marker.addListener('click', function(){
                var title = this.title;
                window.localStorage.setItem("mapFavorite", title);

                infoWindow.setContent(this.title + '<br> <button class="button button-positive button-small" onClick="infowindowFavorite()">Add to Favorites</button>');
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
.controller('FavoritesCtrl', function($scope, $window) {
  $scope.clearFavorites = function(){
    window.localStorage.removeItem("favorite");
  }

  $scope.showFavorites = function(){
    console.log(window.localStorage.getItem("favorite"));
  }

  $scope.updateFavorites = function(){//refresh to get latest favorites
    $window.location.reload(true);
  }

  var u = window.localStorage.getItem("favorite");
  var v = window.localStorage.getItem("favoriteAddress");
  //console.log(v);
  
  var favorites = new Array();
  if (u != null){
    var favoritePlaces = u.split(";");
    var favoritePlacesAddr = v.split(";");
    console.log(favoritePlaces);
    console.log(favoritePlacesAddr);

    
    for (var i=0; i<favoritePlaces.length; i++)
    {
      favorites[i] = {
        name: favoritePlaces[i],
        address: favoritePlacesAddr[i]
      };
    }

    console.log(favorites);
  }
  
  

  $scope.favorites = favorites;

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

function appendToStorage(u, v){
    //create object with search data
    var w = {
      name: u,
      address: v
    };

    //var favoriteItem = JSON.stringify(w);//turn into string
    //console.log(favoriteItem);
    //console.log(JSON.parse(favoriteItem));

    var favoriteItem = u;
    var favoriteItemAddress = v;

    var old = window.localStorage.getItem("favorite");//get old favorite data
    var old2 = window.localStorage.getItem("favoriteAddress");

    if(old === null) {
      window.localStorage.setItem("favorite", u);//set as favorite if null
      window.localStorage.setItem("favoriteAddress", v);
    }
    else {
      window.localStorage.setItem("favorite", old + ";" + u);//append with ; as delimiter
      window.localStorage.setItem("favoriteAddress", old2 + ";" + v);
    }
    

    var x = window.localStorage.getItem("favorite");
    //console.log(x);
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

function infowindowFavorite() {
  var v = window.localStorage.getItem("mapFavorite");
  v = v.toString();
  console.log(v);
  var x = v.split(">");
  //var u = v[1].replace("</a", "");
  console.log(x);
  //console.log(x[1]);
  var y = x[1].replace('</a', '');//this is the location name
  var z = x[3];//this is the location address

  appendToStorage(y,z);

  window.localStorage.removeItem("mapFavorite");

  //<a target="_blank" href="https://www.youtube.com/results?search_query=Natura Coffee & Tea">Natura Coffee & Tea</a><br>12078 Collegiate Way, Orlando, FL 32817, United States
}
