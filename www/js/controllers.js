angular.module('gopals.controllers', [])
  .controller('AppCtrl', AppCtrl)
  .controller('CartCtrl', CartCtrl)
  .controller('OrdersCtrl', OrdersCtrl);


AppCtrl.$inject = ['$scope', '$ionicModal', '$timeout', '$state', 'localStorageService', '$ionicPopup', '$ionicLoading'];

function AppCtrl($scope, $ionicModal, $timeout, $state, localStorageService, $ionicPopup, $ionicLoading) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //;

  /*
   $ionicPopup.alert({
  							title: 'Firebase test',
  							template: window.outerHeight

  							});
  */

  $scope.showloading = false;



  // Form data for the login modal
  $scope.loginData = localStorageService.get('login') ? localStorageService.get('login') : {};
  $scope.registerData = {};
  $scope.smsauth = {
    'mobile_number': '',
    'mobile_country': '+91'
  };
  //  $scope.mobile_country = '+91';
  this.recaptchaVerifier = '';

  this.confirmationResult = '';

  $scope.otp = {
    'code': ''
  };

  //Send phone by sms
  this.phone = function() {
    /*
    $ionicPopup.alert({
    			title: 'Login Init',
    			template: $scope.smsauth.mobile_number + " - - " + $scope.smsauth.mobile_country

    			});
    */
    //$state.go("verify");

    $ionicLoading.show({
      content: "loading",
      animation: 'fade-in'
    });

    $state.go("register");

    $ionicLoading.hide();

  }

  this.verify = function() {

    $state.go("verify");

    $ionicLoading.show({
      content: "loading",
      animation: 'fade-in'
    });







  }


  this.init_login = function() {

    /* $ionicPopup.alert({
    		title: 'Login Init',
    		template: "Successfully logged out"

    		});
    		*/



    //Google firebase captcha initialised for phone authentication.
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
      'size': 'invisible',
      'callback': function(response) {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        //  onSignInSubmit();
      }
    })
  }




  $scope.logout = function() {
    if (localStorageService.remove('login')) {
      $ionicPopup.alert({
        title: 'Successfully Logged out',
        template: "Successfully logged out"

      });
    }
    $state.go("login");

  }

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    /*$timeout(function() {
      $scope.closeLogin();
    }, 1000);
	*/

    $state.go('app.home');
  };

  $scope.doRegister = function() {
    if (localStorageService.set('login', $scope.registerData)) {
      $state.go("app.home");
    }

  }

}

OrdersCtrl.$inject = ['$scope', '$ionicModal', '$timeout', '$state', '$stateParams', 'localStorageService', '$ionicPopup', 'CartService', 'ProductService'];

function OrdersCtrl($scope, $ionicModal, $timeout, $state, $stateParams, localStorageService, $ionicPopup, CartService, ProductService) {

  this.orders_list = localStorageService.get('orders') ? localStorageService.get('orders') : [];

  this.order_id = $stateParams.slug;

  this.cur_order = this.orders_list[this.order_id];

  /* $ionicPopup.alert({
  						template: this.cur_order.items

  						});
  */

}


CartCtrl.$inject = ['$scope', '$ionicModal', '$timeout', '$state', 'localStorageService', '$ionicPopup', 'CartService', 'ProductService'];

function CartCtrl($scope, $ionicModal, $timeout, $state, localStorageService, $ionicPopup, CartService, ProductService) {

  var cs = CartService;
  var ps = ProductService;

  this.cart = cs.cartItems;
  this.total = cs.total;
  this.title = "New Order";
  this.item_qty = 1;
  this.item_to_add = null;
  this.products = ProductService.all();

  this.addToCart = addToCart;
  this.saveOrder = saveOrder;
  this.getTotal = getTotal;

  function saveOrder() {

    if (cs.saveOrder()) {
      $ionicPopup.alert({
        title: 'Order Saved',
        template: "Your Order has been successfully saved." + cs.orders.length

      }).then(function(res) {
        $state.go('app.home');
      });

    }


  }

  function getTotal() {
    return cs.total;
  }


  function addToCart() {

    if (this.item_to_add == undefined) {
      $ionicPopup.alert({
        title: 'Please Select a product to add',
        template: "You have not selected any product for adding. Please choose a product"

      });
      return;
    }

    var prod = ps.products[this.item_to_add];

    cs.addItem(prod, this.item_qty);
    console.log("Add button licked");
    /*$ionicPopup.alert({
    					title: 'Product Successfully added',
    					template: "Product " + prod.name +  " successfully added:" + cs.cartItems.length + "total:" + cs.total

    					});
    					*/

  }



}