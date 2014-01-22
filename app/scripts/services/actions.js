'use strict';

angular
    .module('jDashboardFluxApp')
        .service('actionRepository', function actionRepository() {

            function Action(id, root, name, type, picto, available) {
                // Properties
                this.id = id;
                this.root = root;
                this.name = name;
                this.type = type;
                this.picto = picto;
                this.available = available;

                // Methods
                this.route = function() {
                    return this.root;
                };
            }

            var actions = [
                new Action(1, "action/panel", "Real Panel", "measure", "bar-chart", false),
                new Action(10, "action/email", "Email Campaign", "advertising", "envelope-alt", false),
                new Action(11, "action/push", "Push Campaign", "advertising", "mobile-phone", false),
                new Action(12, "action/comarketing", "Co-marketing campaign", "advertising", "exchange", false),
                new Action(13, "action/targeting", "Online targeting campaign", "advertising", "bullseye", false),
                new Action(20, "action/search", "Search", "api", "search", false),
                new Action(21, "action/recommendation", "Recommendation", "api", "heart-empty", false),
                new Action(22, "action/substitution/list", "Substitution", "api", "code-fork", false),
                new Action(23, "action/crossselling", "Cross-selling", "api", "repeat", false),
                new Action(24, "action/merchandising", "Merchandising", "api", "exchange icon-rotate-90", false),
                new Action(25, "action/recipes", "Recipes", "api", "food", false),
                new Action(30, "/action/interface/button", "AddToBasket - Button", "interface", "shopping-cart", false),
                new Action(31, "/action/interface/banner", "AddToBasket - Banner", "interface", "shopping-cart", false),
            ];

            return {
                findAll: function () {
                    return actions;
                },
                findById: function(id) {
                    var l = actions.length;
                    var action;
                    for (var i = 0; i < l; i++) {
                        action = actions[i];
                        if (action.id == id) {
                            return action;
                        }
                    }
                    throw "Action not found : "+id;
                }
            }
      });
