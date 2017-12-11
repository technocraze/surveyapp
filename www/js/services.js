angular.module('gopals.services', [])
  .service('AuthService', AuthService)
  .factory('ProductService', ProductService)
  .factory('CartService', CartService)
  .factory('LocalStorage', LocalStorage);

// Auth Service
AuthService.$inject = ['$q', '$http', 'LocalStorage', 'CONFIG'];

function AuthService($q, $http, LocalStorage, CONFIG) {
  var localStorage_token_key = CONFIG.localStorage_token_key;
  var token_header = CONFIG.token_header;
  var isAuthenticated = false;
  var authToken;

  function loadUserCredentials() {
    var token = LocalStorage.get(localStorage_token_key);
    if (token) {
      useCredentials(token);
    }
  }

  function storeUserCredentials(token) {
    LocalStorage.set(localStorage_token_key, token);
    useCredentials(token);
  }

  function useCredentials(token) {
    isAuthenticated = true;
    authToken = token;

    // Set the token as header for your requests!
    $http.defaults.headers.common[token_header] = token;
  }

  function destroyUserCredentials() {
    authToken = undefined;
    isAuthenticated = false;
    $http.defaults.headers.common[token_header] = undefined;
    LocalStorage.remove(localStorage_token_key);
  }

  var login = function(email, password) {
    var endpoint = CONFIG.api_login_uri;
    var deferred = $q.defer();
    var promise = deferred.promise;
    var params = {
      email: email,
      password: password
    };
    $http
      .post(endpoint, params)
      .success(function(response) {
        storeUserCredentials(response.token);
        deferred.resolve(response);
      })
      .error(function(rejection) {
        deferred.reject(rejection);
      });

    promise.success = function(callback) {
      promise.then(callback);
      return promise;
    };
    promise.error = function(callback) {
      promise.then(null, callback);
      return promise;
    };
    return promise;
  };

  var logout = function() {
    destroyUserCredentials();
  };

  loadUserCredentials();

  return {
    login: login,
    logout: logout,
    token: function() {
      return authToken;
    },
    isAuthenticated: function() {
      return isAuthenticated;
    }
  };
}

// Product Service
ProductService.$inject = ['$http', '$q', 'AuthService', 'CONFIG'];

function ProductService($http, $q, AuthService, CONFIG) {
  var service = this;
  service.endpoint = CONFIG.api_products_uri;
  service.all = all;
  service.get = get;
  service.getNew = getNew;

  service.products = [{
      'id': 1,
      'name': "Sesame Oil",
      'rate': 300
    },
    {
      'id': 2,
      'name': "Groundnut Oil",
      'rate': 200
    },
    {
      'id': 3,
      'name': "Coconut Oil",
      'rate': 300
    },
    {
      'id': 4,
      'name': "Castor Oil",
      'rate': 300
    },
    {
      'id': 5,
      'name': "Sesame Oil",
      'rate': 300
    },
    {
      'id': 6,
      'name': "Sesame Oil",
      'rate': 300
    },
  ];

  function getNew(product, qty) {
    return {
      'id': product.id,
      'name': product.name,
      'rate': product.rate,
      'qty': product.qty,
      'amount': product.amount
    };
  }

  function all(cache) {
    //return httpRequestHandler(service.endpoint, cache);
    return service.products;
  }

  function get(slug, cache) {
    return httpRequestHandler(service.endpoint + "/" + slug, cache);
  }

  function httpRequestHandler(url, cache) {
    var timedOut = false,
      timeout = $q.defer(),
      result = $q.defer(),
      httpRequest;

    cache = (typeof cache === 'undefined') ? true : cache;

    setTimeout(function() {
      timedOut = true;
      timeout.resolve();
    }, (1000 * CONFIG.timeout));

    httpRequest = $http({
      method: 'get',
      url: url,
      cache: cache,
      timeout: timeout.promise
    });

    httpRequest.success(function(response, status, headers, config) {
      var data = {};
      data.response = response;
      data.status = status;
      data.headers = headers;
      data.config = config;
      result.resolve(data);
    });

    httpRequest.error(function(rejection, status, headers, config) {
      var data = {};
      data.status = status;
      data.headers = headers;
      data.config = config;
      data.rejection = timedOut ? 'Request took longer than ' + CONFIG.timeout + ' seconds.' : rejection;
      result.reject(data);
    });

    return result.promise;
  }
  return service;
}

// Cart Service
CartService.$inject = ['$http', '$q', 'ProductService', 'localStorageService'];

function CartService($http, $q, ProductService, localStorageService) {


  var service = this;

  this.cartItems = [];
  this.keys = [];
  this.total = 0;
  this.details = {};

  service.addItem = addItem;
  service.removeItem = removeItem;
  service.saveOrder = saveOrder;
  service.getCount = getCount;

  this.clear = clear;
  this.addDetails = addDetails;
  this.calc = calc;
  this.clear = clear;

  this.orders = '';

  function saveOrder() {
    this.details = localStorageService.get('login');
    var order = {
      'details': this.details,
      'items': this.cartItems,
      'total': this.total
    };

    var orders = localStorageService.get('orders') ? localStorageService.get('orders') : [];

    orders.push(order);

    localStorageService.set('orders', orders);
    this.orders = orders;
    /*$ionicPopup.alert({
							title: 'Order Saved',
							template: "Your Order has been successfully saved." + orders.length

							});
	  */
    return true;



  }

  function addItem(product, qty) {

    var newItem = {
      'id': product.id,
      'name': product.name,
      'rate': product.rate,
      'qty': Number(qty),
      'amount': product.rate * Number(qty)
    };

    if (typeof this.keys[product.id] == 'number') {
      this.cartItems[this.keys[product.id]].qty += Number(qty);
      this.cartItems[this.keys[product.id]].amount *= this.cartItems[this.keys[product.id]].qty;
    } else {
      this.cartItems.push(newItem);
      //store product index in key array.. index is always one less than length of array
      this.keys[product.id] = this.cartItems.length - 1;
    }

    //calculate total amount
    var p = this.cartItems[this.keys[product.id]];
    p.amount = p.rate * p.qty;

    this.total += parseFloat(p.amount);

    //var newProduct = $.extend(true, {}, product);
    //newProduct.cart_product_id = ++service.cart_product_id;


  }

  function removeItem(id) {
    //service.products = service.products.filter(function (el) { return el !== product; });
    //service.total -= parseFloat(product.price);
    var removed = this.cartItems.splice(this.keys[id], 1);
    this.keys.splice(id, 1); //remove keys index

    this.total -= removed[0].amount;
  }

  function getCount() {
    return service.cartItems.length;
  }

  function addDetails(details) {
    this.details = details;
  }

  function calc() {
    this.total = 0;
    for (i = 0; i < this.cartItems.length; i++) {
      this.cartItems[i].amount = this.cartItems[i].qty * this.cartItems[i].rate;
      this.total += this.cartItems[i].amount;
    }

  }

  function clear() {
    this.cartItems.splice(0, this.cartItems.length);
    delete this.details;

    this.keys.splice(0, this.keys.length);
    this.total = 0;
  }

  return service;
}

LocalStorage.$inject = ['$window'];

function LocalStorage($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    remove: function(key) {
      $window.localStorage.removeItem(key);
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  };
}