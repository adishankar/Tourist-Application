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
  
  //open the modal which contains the map
  $ionicModal.fromTemplateUrl('templates/map-modal.html', function($ionicModal, $ionicPopup) {
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

              /*
              marker.addListener('click', function() {
                $ionicPopup.show();
              });
              */
            }

            //center location marker
            var marker = new google.maps.Marker({
                map: $scope.map,
                animation: google.maps.Animation.DROP,
                position: latLng,
                label: 'My Location'
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

    //clear any leftover data
  $scope.clearData = function(){
    window.localStorage.removeItem("data");
  }

  
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
  //window.localStorage.setItem("data", results);
}
