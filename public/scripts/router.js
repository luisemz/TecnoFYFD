angular.module('router', ['ui.router'])
  .config(function($stateProvider, $locationProvider, $urlRouterProvider) {

    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/');

    $stateProvider
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
    .state('reservar',{
      url: '/reservar',
      views: {
        'reservar': {
          templateUrl: 'views/reservar.html',
          controller: 'reservarCtrl'
        },
        'navbar': {
          templateUrl: 'views/navbar.html',
          controller: 'mainCtrl'
        }
      }
    })
    .state('pedir',{
      url: '/pedir',
      views: {
        'pedir': {
          templateUrl: 'views/pedir.html',
          controller: 'pedirCtrl'
        },
        'navbar': {
          templateUrl: 'views/navbar.html',
          controller: 'mainCtrl'
        }
      }
    })
    .state('pedirCrear',{
      url: '/pedir/crear',
      views: {
        'pedirCrear': {
          templateUrl: 'views/pedir-crear.html',
          controller: 'pedirCrearCtrl'
        },
        'navbar': {
          templateUrl: 'views/navbar.html',
          controller: 'mainCtrl'
        }
      }
    })
    .state('pedirMenu',{
      url: '/pedir/menu',
      views: {
        'pedirMenu': {
          templateUrl: 'views/pedir-menu.html',
          controller: 'pedirMenuCtrl'
        },
        'navbar': {
          templateUrl: 'views/navbar.html',
          controller: 'mainCtrl'
        }
      }
    })
    .state('pedirFacturar',{
      url: '/pedir/facturar',
      views: {
        'pedirFacturar': {
          templateUrl: 'views/pedir-facturar.html',
          controller: 'pedirFacturarCtrl'
        },
        'navbar': {
          templateUrl: 'views/navbar.html',
          controller: 'mainCtrl'
        }
      }
    })
    .state('calificar',{
      url: '/calificar',
      views: {
        'calificar': {
          templateUrl: 'views/calificar.html',
          controller: 'calificarCtrl'
        },
        'navbar': {
          templateUrl: 'views/navbar.html',
          controller: 'mainCtrl'
        }
      }
    })
    .state('musica',{
      url: '/musica',
      views: {
        'musica': {
          templateUrl: 'views/musica.html',
          controller: 'musicaCtrl'
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
    })
    .state('cocina',{
      url: '/cocina',
      views: {
        'profile': {
          templateUrl: 'views/cocina.html',
          controller: 'cocinaCtrl'
        },
        'navbarCocina': {
          templateUrl: 'views/navbar-cocina.html',
          controller: 'navbarCocinaCtrl'
        }
      }
    });
});
