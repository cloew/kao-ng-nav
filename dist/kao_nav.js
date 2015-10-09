$traceurRuntime.ModuleStore.getAnonymousModule(function() {
  "use strict";
  angular.module("kao.nav", ["ngRoute"]).provider("NavConfig", function() {
    this.config = {};
    this.routes = [];
    this.add = function(config) {
      this.config[config.name] = config;
      this.routes.push(config);
    };
    this.$get = function() {
      return this;
    };
  }).factory("NavRoute", function($location) {
    var NavRoute = function(route) {
      for (var $__0 = Object.keys(route)[$traceurRuntime.toProperty(Symbol.iterator)](),
          $__1; !($__1 = $__0.next()).done; ) {
        var attr = $__1.value;
        {
          var value = route[attr];
          this[attr] = value;
        }
      }
      this.routeParams = this.getRouteParams();
    };
    NavRoute.prototype.goTo = function() {
      var __splat,
          args = 1 <= arguments.length ? [].slice.call(arguments, 0) : [];
      return $location.path(this._getPathWithArgs(args));
    };
    NavRoute.prototype.getPathWithArgs = function() {
      var __splat,
          args = 1 <= arguments.length ? [].slice.call(arguments, 0) : [];
      return this._getPathWithArgs(args);
    };
    NavRoute.prototype._getPathWithArgs = function(args) {
      var path = this.path;
      for (var i = 0; i < args.length; i++) {
        path = path.replace(":" + this.routeParams[i], args[i]);
      }
      return path;
    };
    NavRoute.prototype.getRouteParams = function() {
      var params = [];
      var pieces = this.path.split("/");
      for (var $__0 = pieces[$traceurRuntime.toProperty(Symbol.iterator)](),
          $__1; !($__1 = $__0.next()).done; ) {
        var piece = $__1.value;
        {
          if (piece.startsWith(":")) {
            params.push(piece.slice(1));
          }
        }
      }
      return params;
    };
    return NavRoute;
  }).factory("NavService", function(NavConfig, NavRoute, $route) {
    var NavService = {current: function() {
        return this[$route.current.$$route.path];
      }};
    for (var $__0 = NavConfig.routes[$traceurRuntime.toProperty(Symbol.iterator)](),
        $__1; !($__1 = $__0.next()).done; ) {
      var routeCfg = $__1.value;
      {
        var route = new NavRoute(routeCfg);
        NavService[routeCfg.name] = route;
        NavService[routeCfg.path] = route;
      }
    }
    return NavService;
  }).run(function($injector, $rootScope, NavService) {
    $rootScope.$on("$routeChangeStart", function(event, next, current) {
      if (!!(!!next && !!next.$$route) && !!next.$$route.originalPath) {
        var nav = NavService[next.$$route.originalPath];
        if (typeof nav !== "undefined" && nav !== null) {
          angular.forEach(nav.onLoad, function(serviceName) {
            if (!event.defaultPrevented) {
              $injector.get(serviceName)(event);
            }
          });
        }
      }
    });
  });
  return {};
});
