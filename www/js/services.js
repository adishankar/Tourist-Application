angular.module('starter.services', [])

.service('SettingsUpdate', function($rootScope) {
  var rangeValue = "6";
  var numPlaces = "10";

  return {
    getRangeValue: function () {
      return rangeValue;
    },
    setValues: function (value, valuePlaces) {
      rangeValue = value;
      numPlaces = valuePlaces;
      $rootScope.$broadcast('eventFired', {
        data: 'something'
      });
    },
    // setRangeValue: function (value) {
    //   //Multiply by feet in a mile?
    //   rangeValue = value;
    //   $rootScope.$broadcast('eventFired', {
    //     data: 'something'
    //   });
    // },
    getNumPlaces: function () {
      return numPlaces;
    }
    // setNumPlaces: function (value) {
    //   numPlaces = value;
    //   $rootScope.$broadcast('eventFired', {
    //     data: 'something'
    //   });
    // }
  };
});