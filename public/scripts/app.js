var app = angular.module('app', ['ui.bootstrap','ui.router','router',
'ngStorage','ng-file-model','angularModalService']);

app.filter('nfcurrency', ['$filter', '$locale', function currency($filter, $locale) {
    var currencyFilter = $filter('currency');
    var formats = $locale.NUMBER_FORMATS;
    return function (amount, currencySymbol) {
        if (typeof amount !== 'undefined' && amount !== null) {
            var value = currencyFilter(amount, currencySymbol);
            var sep = value.indexOf(formats.DECIMAL_SEP);
            if (amount >= 0) {
                return value.substring(0, sep);
            }
            return value.substring(0, sep) + ')';
        }
    };
}]);

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
app.controller('reservarCtrl', ['$scope', '$localStorage', '$rootScope', 
'$timeout', 'ModalService', function($scope, $localStorage, $rootScope, $timeout,
ModalService){

  if (typeof $localStorage.user.reserve != 'undefined') {
    $scope.reserveDo = $localStorage.user.reserve;
    let element = document.getElementById("table"+$scope.reserveDo.table);
    if (angular.element(element).hasClass("tableAvailable")) {
      angular.element(element).removeClass("tableAvailable").addClass("tableSelect");
    } else if (angular.element(element).hasClass("table2Available")){
      angular.element(element).removeClass("table2Available").addClass("table2Select");
    } else if (angular.element(element).hasClass("table2AvailableRotate")) {
      angular.element(element).removeClass("table2AvailableRotate").addClass("table2SelectRotate");
    }
  }

  $scope.reserver = function(estado, mesa) {
    delete $scope.error;
    delete $scope.tableSelected;

    var i;
    for (i = 1; i <= 23; i++) { 
      let element = document.getElementById("table"+i);
      if (angular.element(element).hasClass("tableSelect")){
        angular.element(element).removeClass("tableSelect").addClass("tableAvailable");
      } else if (angular.element(element).hasClass("table2Select")){
        angular.element(element).removeClass("table2Select").addClass("table2Available");
      } else if (angular.element(element).hasClass("table2SelectRotate")) {
        angular.element(element).removeClass("table2SelectRotate").addClass("table2AvailableRotate");
      }
    }

    if (estado == 'reserved') {
      $scope.error = 'La mesa (' + mesa + ') que esta seleccionando se encuentra reservada.';
    } else {
      $scope.tableSelected = mesa;
      let element = document.getElementById("table"+mesa);
      if (angular.element(element).hasClass("tableAvailable")) {
        angular.element(element).removeClass("tableAvailable").addClass("tableSelect");
      } else if (angular.element(element).hasClass("table2Available")) {
        angular.element(element).removeClass("table2Available").addClass("table2Select");
      } else if(angular.element(element).hasClass("table2AvailableRotate")) {
        angular.element(element).removeClass("table2AvailableRotate").addClass("table2SelectRotate");
      }
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

  $scope.ok = function (reload) {
    delete $scope.success;
    delete $scope.successDelete;
    window.scrollTo(0, 0);
    if (reload)
      window.location.reload();
  }

  $scope.cancel = function () {
    delete $scope.error;
    delete $scope.tableSelected;
    delete $scope.success;
  }

  $scope.deleteReserve = function (reserve) {
    ModalService.showModal({
      templateUrl: "views/modal.html",
      controller: "modalCtrl",
      inputs: {
        title: "Cancelar Reserva",
        account: reserve
      }
    }).then(function(modal) {
      modal.element.modal();
      modal.close.then(function(result) {
        if (result.reserve) {
          delete $localStorage.user.reserve;
          delete $scope.reserveDo;
          $scope.successDelete = 'Reserva cancelada exitosamente.';
        }
      });
    });
  }
}]);

// =========================================================================
// PEDIR CONTROLLER ========================================================
// =========================================================================
app.controller('pedirCtrl', ['$scope', '$localStorage', '$rootScope','$timeout',
'$location', function($scope, $localStorage, $rootScope, $timeout, $location){
  if (typeof $localStorage.user.order != 'undefined') {
    $location.path('/pedir/facturar');
  }
}]);

// =========================================================================
// PEDIR CREAR CONTROLLER ==================================================
// =========================================================================
app.controller('pedirCrearCtrl', ['$scope', '$localStorage', '$rootScope','$timeout',
'$location', function($scope, $localStorage, $rootScope, $timeout, $location){
  let order = {};
  order.ingredientA = [];

  $scope.ingredientP = [
    {select: false,price: 9000},
    {select: false,price: 7000},
    {select: false,price: 8000},
    {select: false,price: 7000}
  ];
  $scope.ingredientS = [
    {select: false,price: 5000},
    {select: false,price: 4000},
    {select: false,price: 5000},
    {select: false,price: 6000}
  ];
  $scope.ingredientA = [
    {select: false,price: 1000},
    {select: false,price: 3000},
    {select: false,price: 3000},
    {select: false,price: 2000}
  ];

  $scope.addP = function(index) {
    let element = document.getElementById("iP"+index);

    var j;
    for (j = 1; j <= 4; j++) {
      let e = document.getElementById("iP"+j);
      if (angular.element(e).hasClass("ingredientSelect")
          && j != index){
        angular.element(e).removeClass("ingredientSelect");
        $scope.ingredientP[j-1].select = false;
      }
    }

    var i = index - 1;
    $scope.ingredientP[i].select = !$scope.ingredientP[i].select;

    if ($scope.ingredientP[i].select) {
      angular.element(element).addClass("ingredientSelect");
      $scope.iP = true;
      let ingredientP = $scope.ingredientP[i];
      ingredientP.index = i;
      order.ingredientP = ingredientP;
    } else {
      angular.element(element).removeClass("ingredientSelect");
      $scope.iP = false;
      delete order.ingredientP;
    }
  }

  $scope.addS = function(index) {
    let element = document.getElementById("iS"+index);

    var j;
    for (j = 1; j <= 4; j++) {
      let e = document.getElementById("iS"+j);
      if (angular.element(e).hasClass("ingredientSelect")
          && j != index){
        angular.element(e).removeClass("ingredientSelect");
        $scope.ingredientS[j-1].select = false;
      }
    }

    var i = index - 1;
    $scope.ingredientS[i].select = !$scope.ingredientS[i].select;

    if ($scope.ingredientS[i].select) {
      angular.element(element).addClass("ingredientSelect");
      $scope.iS = true;
      let ingredientS = $scope.ingredientS[i];
      ingredientS.index = i;
      order.ingredientS = ingredientS;
    } else {
      angular.element(element).removeClass("ingredientSelect");
      $scope.iS = false;
      delete order.ingredientS;
    }
  }

  $scope.addA = function(index) {
    let element = document.getElementById("iA"+index);

    var i = index - 1;
    $scope.ingredientA[i].select = !$scope.ingredientA[i].select;

    if ($scope.ingredientA[i].select) {
      angular.element(element).addClass("ingredientSelect");
      let tem = $scope.ingredientA[i];
      tem.index = i;
      order.ingredientA.push(tem);
    } else {
      angular.element(element).removeClass("ingredientSelect");
      var remove;
      var j;
      for (j = 0; j < order.ingredientA.length; j++) {
        if (typeof order.ingredientA[j] != 'undefined') {
          if (order.ingredientA[j].index == i) {
            remove = j;
          }
        }
      }
      delete order.ingredientA[remove];
    }
  }

  $scope.doOrder = function (type) {
    delete $scope.warning;
    
    if (typeof order.ingredientP != 'undefined') {
      if (typeof order.ingredientS != 'undefined') {
        if (typeof $scope.namePlate != 'undefined' 
            && $scope.namePlate.length > 0) {
          if (typeof $localStorage.user != 'undefined') {
            order.type = type;
            order.orderOk = false;
            order.namePlate = $scope.namePlate;
            $localStorage.user.order = order;
            $location.path('/pedir/facturar');
          } else {
            logoutSession($scope, $http, $localStorage, $window);
          }
        } else {
          $scope.warning = "El nombre del plato no puede estar vacio.";
        }
      } else {
        $scope.warning = "Debes seleccionar el ingrediente secundario.";
      }
    } else {
      $scope.warning = "Debes seleccionar el ingrediente principal.";
    }
  }
}]);

// =========================================================================
// PEDIR MENU CONTROLLER ===================================================
// =========================================================================
app.controller('pedirMenuCtrl', ['$scope', '$localStorage', '$rootScope','$timeout',
'$location', function($scope, $localStorage, $rootScope, $timeout, $location){
  let order = {};

  $scope.plate = [
    {select: false,name: 'Básico1',price: 90000},
    {select: false,name: 'Básico2',price: 8000},
    {select: false,name: 'Básico3',price: 8000},
    {select: false,name: 'Básico4',price: 10000},
    {select: false,name: 'Especial1',price: 12000},
    {select: false,name: 'Especial2',price: 12000},
    {select: false,name: 'Especial3',price: 14000},
    {select: false,name: 'Especial4',price: 15000},
    {select: false,name: 'Creado1',price: 13000},
    {select: false,name: 'Creado2',price: 12000},
    {select: false,name: 'Creado3',price: 15000},
    {select: false,name: 'Creado4',price: 17000}
  ];

  $scope.addPlate = function (index) {
    let element = document.getElementById("plate"+index);

    var j;
    for (j = 1; j <= 12; j++) {
      let e = document.getElementById("plate"+j);
      if (angular.element(e).hasClass("plateSelect")
          && j != index){
        angular.element(e).removeClass("plateSelect");
        $scope.plate[j-1].select = false;
      }
    }

    var i = index - 1;
    $scope.plate[i].select = !$scope.plate[i].select;

    if ($scope.plate[i].select) {
      angular.element(element).addClass("plateSelect");
      let plate = $scope.plate[i];
      plate.index = i;
      order.plate = plate;
    } else {
      angular.element(element).removeClass("plateSelect");
      delete order.plate;
    }
  }

  $scope.doOrder = function (type) {
    delete $scope.warning;
    
    if (typeof order.plate != 'undefined') {
      if (typeof $localStorage.user != 'undefined') {
        order.type = type;
        order.orderOk = false;
        $localStorage.user.order = order;
        $location.path('/pedir/facturar');
      } else {
        logoutSession($scope, $http, $localStorage, $window);
      }
    } else {
      $scope.warning = "Debes seleccionar un plato.";
    }
  }
}]);

// =========================================================================
// PEDIR FACTURAR CONTROLLER ===============================================
// =========================================================================
app.controller('pedirFacturarCtrl', ['$scope', '$localStorage', '$rootScope','$timeout',
'$window', '$location', 'ModalService', function($scope, $localStorage, $rootScope, $timeout, 
$window, $location, ModalService){
  if (typeof $localStorage.user.order != 'undefined') {
    let orderC = {};
    let orderP = {};
    let pay = {};

    $scope.orderOk = $localStorage.user.order.orderOk;

    if ($localStorage.user.order.type == 'Crear Plato') {
      orderC.type = $localStorage.user.order.type;
      orderC.namePlate = $localStorage.user.order.namePlate;
      orderC.ingredientP = $localStorage.user.order.ingredientP;
      orderC.ingredientS = $localStorage.user.order.ingredientS;
      orderC.ingredientA = $localStorage.user.order.ingredientA.filter(el => { return el });

      pay.sub = orderC.ingredientP.price;
      pay.sub += orderC.ingredientS.price;
      orderC.ingredientA.forEach(el => {
        if (typeof el != 'undefined') {
          pay.sub += el.price;
        }
      });
      pay.iva = Math.round(pay.sub * 0.19);
      pay.ser = Math.round(pay.sub * 0.15);
      pay.total = Math.round(pay.sub + pay.iva + pay.ser);
      
      pay.sub = moneyFormt(pay.sub);
      pay.iva = moneyFormt(pay.iva);
      pay.ser = moneyFormt(pay.ser);
      pay.total = moneyFormt(pay.total);

      orderC.pay = pay;

      $scope.orderC = orderC;
    } else if ($localStorage.user.order.type == 'Plato') {
      orderP.type = $localStorage.user.order.type;
      orderP.namePlate = $localStorage.user.order.plate.name;

      pay.sub = $localStorage.user.order.plate.price;
      pay.iva = Math.round(pay.sub * 0.19);
      pay.ser = Math.round(pay.sub * 0.15);
      pay.total = Math.round(pay.sub + pay.iva + pay.ser);

      pay.sub = moneyFormt(pay.sub);
      pay.iva = moneyFormt(pay.iva);
      pay.ser = moneyFormt(pay.ser);
      pay.total = moneyFormt(pay.total);

      orderP.pay = pay;

      $scope.orderP = orderP;
    }

    $scope.checkIn = function () {
      $localStorage.user.order.orderOk = !$localStorage.user.order.orderOk;
      $window.location.reload();
    }

    $scope.cancelOrder = function() {
      let order;
      if (typeof $scope.orderC != 'undefined')
        order = $scope.orderC;
      if (typeof $scope.orderP != 'undefined')
        order = $scope.orderP;

      ModalService.showModal({
        templateUrl: "views/modal.html",
        controller: "modalCtrl",
        inputs: {
          title: "Cancelar Pedido",
          account: order
        }
      }).then(function(modal) {
        modal.element.modal();
        modal.close.then(function(result) {
          if (result.order) {
            delete $localStorage.user.order;
            $location.path('/pedir');
          }
        });
      });
    }
  } else {
    $location.path('/pedir');
  }
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
  $scope.tracks = [
    {name: 'Dreamer', artist: 'Axwell & Ingrosso', duration: '4:11'},
    {name: 'Finesse', artist: 'Bruno Mars', duration: '3:37'},
    {name: 'Disfruto', artist: 'Carla Morrison', duration: '4:07'},
    {name: 'I\'m the One', artist: 'Dj Khaled', duration: '4:49'},
    {name: 'Signs', artist: 'Drake', duration: '3:54'}
  ];

  $scope.addTrack = function () {
    if (typeof $scope.artist != 'undefined'
        && $scope.artist.length > 0) {
      if (typeof $scope.nameTrack != 'undefined'
          && $scope.nameTrack.length > 0) {
        var name = $scope.nameTrack;
        var artist = $scope.artist;
        var min = Math.floor((Math.random() * 5) + 1);
        var sec = Math.floor((Math.random() * 60) + 1);
        var duration = min + ':' + sec;
        $scope.tracks.push(
          {
            name: name.replace(/\b\w/g, function(l){ return l.toUpperCase() }),
            artist: artist.replace(/\b\w/g, function(l){ return l.toUpperCase() }),
            duration: duration
          }
        );

        $scope.addM = false;
        $scope.artist = '';
        $scope.nameTrack = '';
      }
    }
  }
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
    $scope.user.type = "local";
    $scope.user.name = account.nick;
    $scope.user.email = account.email;

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
  
  else if (title === 'Cancelar Pedido') {
    $scope.cancelOrder = "Está seguro(a) de cancelar el pedido:";
    $scope.order = {};
    $scope.order.type = account.type;
    $scope.order.namePlate = account.namePlate;
    $scope.order.total = account.pay.total;

    $scope.disable = function(order){
      if (order) {
        delete $scope.error;
        $element.modal('hide');

        close({
          order: order
        }, 500);
      }
    }
  }
  
  else if (title === 'Cancelar Reserva') {
    $scope.cancelReserve = "Está seguro(a) de cancelar la reserva:";
    $scope.reserve = {};
    $scope.reserve.table = account.table;
    $scope.reserve.date = account.date;
    $scope.reserve.time = account.time;

    $scope.disable = function(reserve){
      if (reserve) {
        delete $scope.error;
        $element.modal('hide');

        close({
          reserve: reserve
        }, 500);
      }
    }
  }
}]);

function logoutSession($scope, $http, $localStorage, $window){
  delete $localStorage.user;
  delete $scope.navbarHome;
  $scope.navbarIndex = {};
  $window.location = $window.location.protocol + "//" + $window.location.host + "/";
}

function moneyFormt(x) {
  return '$ ' + x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}