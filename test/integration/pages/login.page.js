'use strict';

var LoginPage = function () {
  var that = this;
  this.get = function () {
    browser.get(browser.params.website.url + 'login');
  };

  this.getLoginField = function () {
    return element(by.css('#view')).element(by.model('login'));
  };

  this.getPasswordField = function () {
    return element(by.css('#view')).element(by.model('password'));
  };

  this.fillLoginFields = function (login, password) {
    return that.getLoginField().clear().then(function () {
      that.getLoginField().sendKeys(login).then(function () {
        return that.getPasswordField().sendKeys(password);
      });
    });
  };

  this.getLoginButton = function () {
    return element(by.css('#view')).element(by.buttonText('Me connecter'));
  };
};

module.exports = LoginPage;
