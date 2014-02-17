'use strict';

angular
    .module('jDashboardFluxApp')
        .service('headerRepository', function headerRepository() {

            function Header(id, root, name, type, picto, color, defaultAction, available, permissions) {

                // Default values
                defaultAction = typeof(defaultAction) === 'undefined' ? 'list' : defaultAction;
                permissions = typeof(permissions) === 'undefined' ? {} : permissions;
                available = typeof(available) === 'undefined' ? false : available;
                permissions = angular.extend({
                    show: false,
                    list: false,
                    create: false,
                    update: false
                }, permissions);

                // Properties
                this.id = id;
                this.root = root;
                this.name = name;
                this.type = type;
                this.picto = picto;
                this.color = color;
                this.defaultAction = defaultAction;
                this.available = available;
                this.permissions = permissions;

                // Methods
                this.allowed = function (action) {
                    //console.log(this);
                    if (typeof(action) === 'undefined') {
                        return this.permissions['show']
                            || this.permissions['list']
                            || this.permissions['create']
                            || this.permissions['update'];
                    }
                    return this.permissions[action];
                };
                this.route = function (action) {
                    if (typeof(action) === 'undefined') {
                        action = this.defaultAction;
                    }
                    return this.root+'/'+action;
                }
            };

            var headers = [
                new Header(1, '/segment/household', 'Segment d\'utilisateurs', 'Segment', 'icon-group', 'color-member'),
                new Header(2, '/segment/page', 'Segment de pages', 'Segment', 'icon-file', 'color-page'),
                new Header(5, '/segment/product', 'Segment de produits', 'Segment', 'icon-barcode', 'color-product'),
                new Header(4, '/action', 'Actions', 'Action', 'icon-bolt', 'color-action', 'new'),
                new Header(3, '/stream', 'Flux', 'Stream', 'icon-puzzle-piece', 'color-stream'),
                new Header(6, '/calendar', 'Calendriers',  'Calendar', 'icon-calendar', 'color-calendar'),
                new Header(7, '/dashboard', 'Dashboard',  'Dashboard', 'icon-dashboard', 'color-dashboard', 'show'),
            ];

            return {
                findAll: function () {
                    return headers;
                },
                findById: function(id) {
                    var l = headers.length;
                    var action;
                    for (var i = 0; i < l; i++) {
                        action = headers[i];
                        if (action.id == id) {
                            return action;
                        }
                    }
                    throw 'Header not found : '+id;
                }
            }
      });
