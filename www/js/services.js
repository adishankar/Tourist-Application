angular.module('starter.services', [])

.service('SettingsUpdate', function($rootScope) {
  var rangeValue = "8";

  return {
    getRangeValue: function () {
      return rangeValue;
    },
    setRangeValue: function (value) {
      //Multiply by feet in a mile?
      rangeValue = value;
      $rootScope.$broadcast('eventFired', {
        data: 'something'
      });
    }
  };
});