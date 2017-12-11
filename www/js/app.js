// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('gopals', ['ionic', 'gopals.controllers', 'gopals.services', 'LocalStorageModule'])
  .run(Runner)
  .config(Configurator);

Runner.$inject = ['$ionicPlatform', '$state', '$rootScope', 'localStorageService', '$ionicPopup'];

function Runner($ionicPlatform, $state, $rootScope, localStorageService, $ionicPopup) {


  //foreach(c in $state.current)


  $ionicPlatform.ready(function() {




    $rootScope.$on("$stateChangeStart", function(event, next, nextParams, fromState) {

      /*$ionicPopup.alert({
        title: 'Firebase test',
        template: $state.current.url

      });
			*/
      if (next.name != 'login' && next.name != 'register' && next.name != 'verify') {



        if (!localStorageService.get('login')) {



          //console.log("State Changeed");
          event.preventDefault();
          $state.go('login');

        }
      } else {




        //if local storage login data exists, go directly to dashboard page.. even if login is accessed..
        if (localStorageService.get('login')) {
          /*				 $ionicPopup.alert({
          							title: 'No Local Storage',
          							template: localStorageService.get('login')

          							});
          							*/
          $state.go("app.home");
        }

      }

    });


    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
}


Configurator.$inject = ['$httpProvider', '$stateProvider', '$urlRouterProvider', '$ionicConfigProvider'];

function Configurator($httpProvider, $stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  $ionicConfigProvider.backButton.previousTitleText(false).text(' ');

  $urlRouterProvider.otherwise('/app/home');

  $stateProvider

    .state('start', {
      url: '',

      templateUrl: 'templates/login-html.html',
      controller: 'AppCtrl as app'
    })


    .state('login', {
      url: '/login',

      templateUrl: 'templates/login-html.html',
      controller: 'AppCtrl as app'
    })

    .state('register', {
      url: '/register',
      templateUrl: 'templates/register.html',
      controller: 'AppCtrl'
    })




    .state('tabs', {
      url: '',
      abstract: true,
      templateUrl: 'templates/tabs.html',
      // controller: 'TabCtrl as tabs'
    })

    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu.html',
      controller: 'AppCtrl'
    })





    .state('app.home', {
      url: '/home',

      views: {
        'menuContent': {
          templateUrl: 'templates/home.html'
        }
      }
    })

    .state('app.view', {
      url: '/family/:slug',

      //templateUrl: 'templates/familyview.html',
      //controller: 'AppCtrl as app'
      views: {
        'menuContent': {
          templateUrl: 'templates/familyview.html',
          controller: 'AppCtrl as app'
        }
      }
    })

    .state('app.neworder', {
      url: '/neworder',

      views: {
        'menuContent': {
          templateUrl: 'templates/neworder.html',
          controller: 'CartCtrl as cart'
        }
      }
    })


  /* .state('app.search', {
      url: '/search',
      views: {
        'menuContent': {
          templateUrl: 'templates/search.html'
        }
      }
    })

    .state('app.browse', {
        url: '/browse',
        views: {
          'menuContent': {
            templateUrl: 'templates/browse.html'
          }
        }
      })
      .state('app.playlists', {
        url: '/playlists',
        views: {
          'menuContent': {
            templateUrl: 'templates/playlists.html',
            controller: 'PlaylistsCtrl'
          }
        }
      })
  */

  /*
    .state('app.single', {
      url: '/playlists/:playlistId',
      views: {
        'menuContent': {
          templateUrl: 'templates/playlist.html',
          controller: 'PlaylistCtrl'
        }
      }
    })
    */
  ;
  // if none of the above states are matched, use this as the fallback
  //$urlRouterProvider.otherwise('/app/playlists');
}