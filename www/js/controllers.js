angular.module('starter.controllers', ['ngCordova'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
})

//controller for search page
.controller('SearchCtrl', function($scope, $ionicModal, $cordovaGeolocation) {

  $scope.loadData = function() {
    alert(window.localStorage.getItem("data"));
  }

  //finds current location and does a text search for restaurants
  $scope.restaurantSearch = function() {

    navigator.geolocation.getCurrentPosition(function(pos) {

      var centerLocation = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
      //console.log(pos.coords.latitude);

      var request = {
          location: centerLocation,
          radius: '500',
          query: 'restaurant'
      };
      var map = new google.maps.Map(document.getElementById("map2"));
      var service = new google.maps.places.PlacesService(map);
                
      service.textSearch(request, callback);
    });
  }
  
  //open the modal which contains the map
  $ionicModal.fromTemplateUrl('templates/map-modal.html', function($ionicModal) {
        $scope.modal = $ionicModal;
    }, {
        scope: $scope,
        animation: 'slide-in-up'
    });

    
    $scope.showMap = function (){
        var options = {
           timeout: 10000,
           enableHighAccuracy: true
        };

        //use geolocation to center the map
        $cordovaGeolocation.getCurrentPosition(options).then(function (position) {

          //load data here
          var dataString = window.localStorage.getItem("data");
          //convert to json
          var placesFound = JSON.parse(dataString);

          //console.log(placesFound);

          var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

          var mapOptions = {
             center: latLng,
             zoom: 13,
             mapTypeId: google.maps.MapTypeId.ROADMAP
          };

          $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

          google.maps.event.addListenerOnce($scope.map, 'idle', function () {

            for (var i=0; i<placesFound.length; i++){
              var marker = new google.maps.Marker({
                map: $scope.map,
                position: placesFound[i].geometry.location
              });
            }

            var marker = new google.maps.Marker({
                map: $scope.map,
                animation: google.maps.Animation.DROP,
                position: latLng
            });
        });

        }, function (error) {
           alert("Could not get location");
        });
    };

    $scope.openModal = function(){
      $scope.modal.show();
      $scope.showMap();
    };

    //Remove modal
    $scope.$on('$destroy', function () {
        $scope.modal.remove();
    });

    //Set $scope.map to null
    $scope.$on('modal.hidden', function () {
        $scope.$on('$destroy', function () {
            $scope.map = null;
        });
    });

  
});

function callback(results, status) {
  console.log(status);

  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      //console.log(place);
      placesFound.push(place);
    }
  }
  else {
    console.log("error");
  }

  //console.log(results);
  window.localStorage.setItem("data", JSON.stringify(results));
  //window.localStorage.setItem("data", results);
}
