(function() {
  'use strict';

  angular.module('rpiHome').directive('businessFeed',businesFeedDirective);

  function businesFeedDirective() {
    return {
      restrict: 'E',
      scope: {
        url: '@'
      },
      controller: businessCtrl,
      controllerAs: 'ctrl',
      bindToController: true,
      templateUrl: 'app/components/businessFeed/businessFeed.html'
    };
  }
  /** @ngInject */
  function businessCtrl($timeout, $http) {
    var vm = this;
    var index = 0;
    var tick = 1000 * 15; //20 secs
    function googlerss (url) {
      return $http.jsonp('//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=50&callback=JSON_CALLBACK&q=' + encodeURIComponent(url));
    }

    vm.getRSS = function() {
          googlerss(vm.url).then(function(resp) {
          vm.feeds=resp.data.responseData.feed.entries;
          vm.currentItem = vm.feeds[index];

      });

      $timeout(vm.getRSS, 1000 * 60 * 30); //every 30 mins recall
    };

    vm.getRSS();

    function changeFeedItem(){
      vm.currentItem = vm.feeds[index];
      index += 1;
      if (index >= vm.feeds.length) {
        index = 0;
      }
      $timeout(changeFeedItem, tick);
    }

    $timeout(changeFeedItem, tick);
  }
})();