angular.module('router', ['ui.router'])
  .config(function($stateProvider, $locationProvider, $urlRouterProvider) {

    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/');

    $stateProvider
    .state('unity',{
      url: '/vr',
      views: {
        'unity': {
          templateUrl: 'views/unity.html'
        },
        'navbar': {
          templateUrl: 'views/navbar.html',
          controller: 'mainCtrl'
        }
      }
    })
    .state('index',{
      url: '/',
      views: {
        'start': {
          templateUrl: 'views/start.html',
          controller: 'startCtrl'
        },
        'navbar': {
          templateUrl: 'views/navbar.html',
          controller: 'mainCtrl'
        }
      }
    })
    .state('ssr',{
      url: '/ssr',
      views: {
        'ssr': {
          templateUrl: 'views/ssr.html',
          controller: 'ssrCtrl'
        },
        'navbar': {
          templateUrl: 'views/navbar.html',
          controller: 'mainCtrl'
        }
      }
    })
    .state('map',{
      url: '/map',
      views: {
        'map': {
          templateUrl: 'views/map.html',
          controller: 'mapCtrl'
        },
        'navbar': {
          templateUrl: 'views/navbar.html',
          controller: 'mainCtrl'
        }
      }
    })
    .state('login',{
      url: '/login',
      views: {
        'login': {
          templateUrl: 'views/login.html',
          controller: 'loginCtrl'
        },
        'navbar': {
          templateUrl: 'views/navbar.html',
          controller: 'mainCtrl'
        }
      }
    })
    .state('signup',{
      url: '/signup',
      views: {
        'signup': {
          templateUrl: 'views/signup.html',
          controller: 'signupCtrl'
        },
        'navbar': {
          templateUrl: 'views/navbar.html',
          controller: 'mainCtrl'
        }
      }
    })
    .state('signupVerify',{
      url: '/signupVerify/:id',
      views: {
        'signupVerify': {
          templateUrl: 'views/signupVerify.html',
          controller: 'signupVerifyCtrl'
        },
        'navbar': {
          templateUrl: 'views/navbar.html',
          controller: 'mainCtrl'
        }
      }
    })
    .state('home',{
      url: '/home',
      views: {
        'home': {
          templateUrl: 'views/home.html',
          controller: 'homeCtrl'
        },
        'navbar': {
          templateUrl: 'views/navbar.html',
          controller: 'mainCtrl'
        }
      }
    })
    .state('users',{
      url: '/admin/users',
      views: {
        'users': {
          templateUrl: 'views/users.html',
          controller: 'usersCtrl'
        },
        'navbar': {
          templateUrl: 'views/navbar.html',
          controller: 'mainCtrl'
        }
      }
    })
    .state('adminSsr',{
      url: '/admin/ssr',
      views: {
        'adminSsr': {
          templateUrl: 'views/adminSsr.html',
          controller: 'ssrAdminCtrl'
        },
        'navbar': {
          templateUrl: 'views/navbar.html',
          controller: 'mainCtrl'
        }
      }
    })
    .state('adminMap',{
      url: '/admin/map',
      views: {
        'adminMap': {
          templateUrl: 'views/adminMap.html',
          controller: 'mapAdminCtrl'
        },
        'navbar': {
          templateUrl: 'views/navbar.html',
          controller: 'mainCtrl'
        }
      }
    })
    .state('profile',{
      url: '/profile',
      views: {
        'profile': {
          templateUrl: 'views/profile.html',
          controller: 'profileCtrl'
        },
        'navbar': {
          templateUrl: 'views/navbar.html',
          controller: 'mainCtrl'
        }
      }
    });
});
