var app = angular.module('app', ['ui.bootstrap','ui.router','router',
'ngStorage','ng-file-model','angularModalService']);

// =========================================================================
// NAVBAR CONTROLLER =======================================================
// =========================================================================
app.controller('mainCtrl', ['$scope', '$http', '$location', '$localStorage',
'$window', function($scope, $http, $location, $localStorage, $window){

  if (!$localStorage.saveUser) {
    let userSave = {};
    $localStorage.saveUser = true;

    userSave.email = 'jose-luna95@hotmail.com';
    userSave.password = '12345678';
    userSave.nick = 'joseluna';
    userSave.name = 'Jose';
    userSave.lastName = 'Luna';
    userSave.registeredDate = new Date();
    userSave.lastLogin = new Date();
    $localStorage.userSave = userSave;
  }

  if (!$localStorage.first) {
    if ($localStorage.user) {
      $scope.navbarHome = {};
      if ($location.path() != '/home' && $location.path() != '/') {
          $scope.show = true;
      } else {
        $scope.show = false;
        $scope.showAdmin = false;
      }
      $scope.navbarHome.home = "Inicio";
      $scope.navbarHome.themes = "Reservar Mesa";
      $scope.navbarHome.trivia = "Realizar Pedido";
      $scope.navbarHome.maps = "Calificar Platos";
      $scope.navbarHome.vr = "Elegir Música";
      $scope.navbarHome.logout = "Cerrar Sesión";
      $scope.navbarHome.nick = $localStorage.user.nick;

      if ($location.path() === '/login' || $location.path() === '/signup') {
        $location.path('/home');
      }
    } else {
      $scope.navbarIndex = {};
      $scope.navbarIndex.login = "Iniciar Sesión";
      $scope.navbarIndex.signup = "Registrarse";

      if ($location.path() === '/home' || $location.path() === '/profile') {
        $location.path('/');
      }
    }
  }

  if ($localStorage.reload) {
    $localStorage.reload = false;
    $localStorage.first = false;
  }

  $scope.logout = function() {
    logoutSession($scope, $http, $localStorage, $window);
  }

}]);

// =========================================================================
// RESERVAR CONTROLLER =====================================================
// =========================================================================
app.controller('reservarCtrl', ['$scope', '$localStorage', '$rootScope','$timeout',
function($scope, $localStorage, $rootScope,$timeout){

  if (typeof $localStorage.user.reserve != 'undefined') {
    $scope.reserveDo = $localStorage.user.reserve;
    let element = document.getElementById("table"+$scope.reserveDo.table);
    angular.element(element).removeClass("tableAvailable").addClass("tableSelect");
  }

  $scope.reserver = function(estado, mesa) {
    delete $scope.error;
    delete $scope.tableSelected;

    var i;
    for (i = 1; i <= 16; i++) { 
      let element = document.getElementById("table"+i);
      if (angular.element(element).hasClass("tableSelect")){
        angular.element(element).removeClass("tableSelect").addClass("tableAvailable");
      }
    }

    if (estado == 'reserved') {
      $scope.error = 'La mesa (' + mesa + ') que esta seleccionando se encuentra reservada.';
    } else {
      $scope.tableSelected = mesa;
      let element = document.getElementById("table"+mesa);
      angular.element(element).removeClass("tableAvailable").addClass("tableSelect");
    }
  }

  $scope.doReserver = function (reserva) {
    if (typeof reserva != 'undefined') {
      if (typeof reserva.date != 'undefined'
          && typeof reserva.time != 'undefined') {
        let reserve = {}
        reserve.table = $scope.tableSelected;
        reserve.date = reserva.date;
        reserve.time = reserva.time;
        $localStorage.user.reserve = reserve;
        delete $scope.tableSelected;
        $scope.success = 'La reserva de la mesa (' + reserve.table + ') se realizó correctamente.';
        $scope.date = reserve.date;
        $scope.time = reserve.time;
      }
    }
  }

  $scope.ok = function () {
    delete $scope.success;
    delete $scope.successDelete;
    window.scrollTo(0, 0);
    window.location.reload();
  }

  $scope.cancel = function () {
    delete $scope.error;
    delete $scope.tableSelected;
    delete $scope.success;
  }

  $scope.deleteReserve = function () {
    delete $localStorage.user.reserve;
    delete $scope.reserveDo;
    $scope.successDelete = 'Reserva cancelada exitosamente.';
  }
}]);

// =========================================================================
// PEDIR CONTROLLER ========================================================
// =========================================================================
app.controller('pedirCtrl', ['$scope', '$localStorage', '$rootScope','$timeout',
function($scope, $localStorage, $rootScope, $timeout){

}]);

// =========================================================================
// PEDIR CREAR CONTROLLER ==================================================
// =========================================================================
app.controller('pedirCrearCtrl', ['$scope', '$localStorage', '$rootScope','$timeout',
function($scope, $localStorage, $rootScope, $timeout){

}]);

// =========================================================================
// PEDIR MENU CONTROLLER ===================================================
// =========================================================================
app.controller('pedirMenuCtrl', ['$scope', '$localStorage', '$rootScope','$timeout',
function($scope, $localStorage, $rootScope, $timeout){

}]);

// =========================================================================
// CALIFICAR CONTROLLER ====================================================
// =========================================================================
app.controller('calificarCtrl', ['$scope', '$localStorage', '$rootScope','$timeout',
function($scope, $localStorage, $rootScope, $timeout){

}]);

// =========================================================================
// MÚSICA CONTROLLER =======================================================
// =========================================================================
app.controller('musicaCtrl', ['$scope', '$localStorage', '$rootScope','$timeout',
function($scope, $localStorage, $rootScope, $timeout){

}]);

// =========================================================================
// START CONTROLLER ========================================================
// =========================================================================
app.controller('startCtrl', ['$scope', '$localStorage',
function($scope, $localStorage){
  if ($localStorage.sessionTerminated) {
    $scope.error = "Session expired!"
  } else if ($localStorage.profileDelete) {
    $scope.warning = $localStorage.profileMsg;
    $scope.name = $localStorage.profileName;
    $scope.email = $localStorage.profileEmail;
  }

  $scope.close = function() {
    delete $localStorage.sessionTerminated;
    delete $localStorage.profileDelete;
    delete $localStorage.profileName;
    delete $localStorage.profileEmail;
    delete $localStorage.profileMsg;
    delete $scope.error;
    delete $scope.warning;
    delete $scope.name;
    delete $scope.email;
  }
}]);

// =========================================================================
// SIGNUP CONTROLLER =======================================================
// =========================================================================
app.controller('signupCtrl', ['$scope', '$http', '$localStorage', '$window',
function($scope, $http, $localStorage, $window){
  $scope.form = true;

  $scope.user = {};
  $scope.user.loc = $window.location.protocol + "//"
              + $window.location.host + "/web/";

  $scope.signup = function() {
    delete $scope.error;
    delete $scope.success;

    if ($scope.user.password.length >= 8) {
      if (typeof $localStorage.userSave != 'undefined') {
        if ($scope.user.email != $localStorage.userSave.email) {
          let userSave = {};

          userSave.email = $scope.user.email;
          userSave.password = $scope.user.password;
          userSave.nick = $scope.user.nick;
          userSave.name = $scope.user.name ? $scope.user.name : 'No Especificado';
          userSave.lastName = $scope.user.lastName ? $scope.user.lastName : 'No Especificado';
          userSave.registeredDate = new Date();
          userSave.lastLogin = new Date();
          $localStorage.userSave = userSave;

          $scope.success = 'Usuario registrado correctamente.';
          $scope.form = false;
        } else {
          $scope.error = 'El correo ya se encuentra registrado.';
        }
      } else {
        let userSave = {};

        userSave.email = $scope.user.email;
        userSave.password = $scope.user.password;
        userSave.nick = $scope.user.nick;
        userSave.name = $scope.user.name ? $scope.user.name : 'No Especificado';
        userSave.lastName = $scope.user.lastName ? $scope.user.lastName : 'No Especificado';
        userSave.registeredDate = new Date();
        userSave.lastLogin = new Date();
        $localStorage.userSave = userSave;

        $scope.success = 'Usuario registrado correctamente.';
        $scope.form = false;
      }
    } else {
      $scope.error = 'Formato de contraseña incorrecto.';
    }
  };

  $scope.loginC = function() {
    $window.location = $window.location.protocol + "//"
      + $window.location.host + "/login";
  };
}]);

// =========================================================================
// LOGIN CONTROLLER ========================================================
// =========================================================================
app.controller('loginCtrl', ['$scope', '$http', '$localStorage', '$window',
function($scope, $http, $localStorage, $window){
  $scope.form1 = true;
  $scope.form2 = false;

  $scope.user = {};

  $scope.login = function() {
    delete $scope.success;
    delete $scope.error;

    if (typeof $localStorage.userSave != 'undefined') {
      if ($scope.user.email == $localStorage.userSave.email) {
        if ($scope.user.password == $localStorage.userSave.password) {
          $localStorage.userSave.lastLogin = new Date();
          $localStorage.user = $localStorage.userSave;
          $window.location = $window.location.protocol + "//"
            + $window.location.host + "/home";
        } else {
          $scope.error = 'Contraseña incorrecta.';
        }
      } else {
        $scope.error = 'Correo no registrado.';
      }
    } else {
      $scope.error = 'Correo no registrado.';
    }
  };

  $scope.signupC = function() {
    $window.location = $window.location.protocol + "//"
      + $window.location.host + "/signup";
  };

  $scope.facebook = function() {

  };

  $scope.google = function() {

  };

  $scope.reset = function() {
    $scope.form1 = true;
    $scope.form2 = false;
    $scope.user.email = "";
    delete $scope.success;
    delete $scope.error;
  };

  $scope.restoreClick = function(form1, form2) {
    $scope.form1 = !form1;
    $scope.form2 = !form2;
    delete $scope.success;
    delete $scope.error;
  };

  $scope.restore = function(form2) {
    if ($scope.user.email == $localStorage.userSave.email) {
      delete $scope.error;
      $localStorage.userSave.password = '12345678';
      $scope.sent = "Nueva contraseña: 12345678";
      $scope.success = " ";
      $scope.form2 = !form2;
    } else {
      $scope.error = 'El correo ' + $scope.user.email + ' no se encuentra registrado.'
      $scope.user.email = "";
    }
  };

}]);

// =========================================================================
// HOME CONTROLLER =========================================================
// =========================================================================
app.controller('homeCtrl', ['$scope', '$http', '$location', '$localStorage',
'$window','ModalService',
function($scope, $http, $location, $localStorage, $window, ModalService){
  delete $localStorage.addDesc;

  if (typeof $localStorage.user != 'undefined') {
    $localStorage.sessionTerminated = false;
    $scope.welcome = 'TECNO App'
    $scope.content = "Contenido";
  } else {
    $localStorage.sessionTerminated = true;
    logoutSession($scope, $http, $localStorage, $window);
  }
}]);

// =========================================================================
// USERS CONTROLLER ========================================================
// =========================================================================
app.controller('usersCtrl', ['$scope', '$http', '$location', '$localStorage',
'$window', 'ModalService',
function($scope, $http, $location, $localStorage, $window, ModalService){
  delete $localStorage.addDesc;

  $http.get('/api/users')
    .success(function(response) {
      if (response.msgAdmin) {
        $localStorage.sessionTerminated = false;
        if (response.msgAdmin.length > 1) {
          $scope.welcome = response.msgAdmin[0];
          $scope.adminUser = response.msgAdmin[1];
        } else {
          var active = 0;
          var disable = 0;
          $scope.helloAdmin = response.msgAdmin[0];
          $scope.users = response.users;
          if (response.users == 0) {
            $scope.noUsers = "No hay usuarios registrados!"
          }
          response.users.forEach(function(user) {
            if (user.local) {
              if (user.local.state) {
                active += 1;
              } else {
                disable += 1;
              }
            } else if (user.facebook) {
              if (user.facebook.state) {
                active += 1;
              } else {
                disable += 1;
              }
            } else if (user.google) {
              if (user.google.state) {
                active += 1;
              } else {
                disable += 1;
              }
            }
          });
          $scope.active = active;
          $scope.disable = disable;
        }
      } else if (response.error) {
        $localStorage.sessionTerminated = false;
        $scope.errorAccount = response.error;
        console.log(response.error);
      } else {
        $localStorage.sessionTerminated = true;
        logoutSession($scope, $http, $localStorage, $window);
      }
    })
    .error(function(response) {
        console.log('Error: ' + response);
    });

  $scope.close = function() {
    delete $scope.errorAccount;
    delete $scope.error;
    delete $scope.success;
    $window.location.reload();
  }

  // =======================================================================
  // ADMIN FUNCTION ========================================================
  // =======================================================================
  $scope.findByName = function(name) {
    if (name) {
      $http.get('/api/users/searchN/' + name)
        .success(function(response){
          search(response, name);
        })
        .error(function(response){
          console.log("Error: " + response);
        });
    }
  }

  $scope.findByEmail = function(email) {
    if (email) {
      $http.get('/api/users/searchE/' + email)
        .success(function(response){
          search(response, email);
        })
        .error(function(response){
          console.log("Error: " + response);
        });
    }
  }

  $scope.viewUser = function(user) {
    $location.path('/web/user/' + user._id)
  }

  $scope.restorePasswordUser = function(user) {
    ModalService.showModal({
      templateUrl: "views/modal.html",
      controller: "modalCtrl",
      inputs: {
        title: "Restaurar Contraseña de Usuario",
        account: user
      }
    }).then(function(modal) {
      modal.element.modal();
      modal.close.then(function(result) {
        var user = result.user;
        user.action = "restore";

        updateUser(user);
      });
    });
  }

  $scope.activeUser = function(user) {
    ModalService.showModal({
      templateUrl: "views/modal.html",
      controller: "modalCtrl",
      inputs: {
        title: "Activar Usuario",
        account: user
      }
    }).then(function(modal) {
      modal.element.modal();
      modal.close.then(function(result) {
        var user = result.user;
        user.action = "active";

        updateUser(user);
      });
    });
  }

  $scope.disableUser = function(user) {
    ModalService.showModal({
      templateUrl: "views/modal.html",
      controller: "modalCtrl",
      inputs: {
        title: "Desactivar Usuario",
        account: user
      }
    }).then(function(modal) {
      modal.element.modal();
      modal.close.then(function(result) {
        var user = result.user;
        user.action = "disable";

        updateUser(user);
      });
    });
  }

  $scope.clear = function() {
    $scope.searchUser = false;
    delete $scope.findUsers;
    delete $scope.noUsersFound;
    delete $scope.nameFound;
  }

  function search(response, query) {
    $scope.searchUser = true;
    if (response.userSearch) {
      if (response.userSearch.length > 0) {
        delete $scope.noUsersFound;
        $scope.findUsers = response.userSearch;
        $scope.findCount = response.userSearch.length;
      } else {
        delete $scope.findUsers;
        $scope.noUsersFound = "No user found to:";
        $scope.nameFound = query;
      }
    } else {
      $localStorage.sessionTerminated = true;
      logoutSession($scope, $http, $localStorage, $window);
    }
  }

  function updateUser(user) {
    $http.put('/api/users/' + user.id, user)
      .success(function(response){
        if (response.success) {
          $scope.success = response.success;
        } else if (response.error) {
          $scope.error = response.error;
        }
      })
      .error(function(response){
        console.log("Error: " + response);
      });
  }

}]);

// =========================================================================
// PROFILE CONTROLLER ======================================================
// =========================================================================
app.controller('profileCtrl', ['$scope', '$http', '$localStorage', '$window',
'ModalService',
function($scope, $http, $localStorage, $window, ModalService){
  $scope.form = false;
  $scope.changePassword = false;
  if ($localStorage.user) {
    $scope.user = $localStorage.user;
    if ($localStorage.user) {
      $scope.changePassword = true;
      $scope.nick = $localStorage.user.nick;
      $scope.name = $localStorage.user.name;
      $scope.lastName = $localStorage.user.lastName;
      $scope.email = $localStorage.user.email;
      $scope.registeredDate = $localStorage.user.registeredDate;
      $scope.lastlogin = $localStorage.user.lastLogin;
    }
  } else {
    $localStorage.sessionTerminated = true;
    logoutSession($scope, $http, $localStorage, $window);
  }

  $scope.change = function() {
    delete $scope.error;
    delete $scope.sent;

    if ($scope.user.pass) {
      if ($scope.user.pass == $scope.user.password) {
        if ($scope.user.newPass.length >= 8
            && $scope.user.confirmNewPass.length >=8) {
          if ($scope.user.newPass == $scope.user.confirmNewPass) {
            $scope.success = true;
            $scope.form = false;
            $scope.user.password = $scope.user.newPass;
            $localStorage.userSave = $scope.user;
            $scope.msg = 'Información y contraseña actualizada correctamente.';
            $scope.user.pass = "";
            $scope.user.newPass = "";
            $scope.user.confirmNewPass = "";
          } else {
            $scope.error = "La nueva contraseña no coincide."
            $scope.user.newPass = "";
            $scope.user.confirmNewPass = "";
          }
        } else {
          $scope.error = "Debes insgresar una nueva contraseña con el formato correcto."
        }
      } else {
        $scope.error = "La contraseña actual ingresada es incorrecta.";
        $scope.user.pass = "";
      }
    } else {
      $scope.success = true;
      $scope.form = false;
      $localStorage.userSave = $scope.user;
      $scope.msg = 'Información actualizada correctamente.';
    }
  }

  $scope.restore = function() {
    delete $scope.error;
    $scope.form = false;
    $scope.success1 = true;
    $scope.sent = 'Nueva contraseña: 12345678';
    $scope.user.password = '12345678';
    $localStorage.userSave = $scope.user;
  };

  $scope.showForm = function() {
    $scope.form = !$scope.form;
    window.scrollTo(0, 0);
  }

  $scope.deleteAccount = function(user) {
    ModalService.showModal({
      templateUrl: "views/modal.html",
      controller: "modalCtrl",
      inputs: {
        title: "Eliminar Perfil",
        account: user
      }
    }).then(function(modal) {
      modal.element.modal();
      modal.close.then(function(result) {
        if (result.user) {
          console.log(result);
          $localStorage.profileDelete = true;
          $localStorage.profileName = result.user.name;
          $localStorage.profileEmail = result.user.email;
          $localStorage.profileMsg = 'Perfil eliminado correctamente.';
          delete $localStorage.userSave;
          logoutSession($scope, $http, $localStorage, $window);
        }
      });
    });
  }
}]);

// =========================================================================
// MODAL CONTROLLER ========================================================
// =========================================================================
app.controller('modalCtrl', ['$scope', '$element', 'title', 'account', 'close',
function($scope, $element, title, account, close) {
  $scope.title = title;

  if (title === 'Eliminar Perfil') {
    $scope.deleteProfile = "Está seguro(a) de eliminar el perfil:";
    $scope.user = {};
    getUser(account);

    $scope.disable = function(user){
      if (user) {
        delete $scope.error;
        $element.modal('hide');

        close({
          user: user
        }, 500);
      }
    }
  }

  function getUser(user) {
    if (user) {
      $scope.user.type = "local";
      $scope.user.name = user.nick;
      $scope.user.email = user.email;
    }
  }
}]);

function logoutSession($scope, $http, $localStorage, $window){
  delete $localStorage.user;
  delete $scope.navbarHome;
  $scope.navbarIndex = {};
  $window.location = $window.location.protocol + "//" + $window.location.host + "/";
}
