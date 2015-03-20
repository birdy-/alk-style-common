'use strict';

var ResourcesPage = function () {
  var that = this;

  this.getFAQ = function () {
    return browser.get(browser.params.website.url + 'maker/resources/faq');
  };

  this.getTutorials = function () {
    return browser.get(browser.params.website.url + 'maker/resources/tutorial');
  };

  this.getProcedures = function () {
    return browser.get(browser.params.website.url + 'maker/resources/procedures');
  };

  this.getResourcesBtn = function () {
    return element(by.css('.nav.navbar-nav.navbar-right .dropdown'));
  };

  this.getHeaderItem = function (index) {
    return element.all(by.css('.nav.navbar-nav.navbar-right .dropdown li')).get(index);
  };

  this.getFAQHeaderBtn = function (index) {
    return that.getHeaderItem(0);
  };

  this.getTutorialHeaderBtn = function (index) {
    return that.getHeaderItem(1);
  };

  this.getProceduresHeaderBtn = function (index) {
    return that.getHeaderItem(2);
  };

  this.getCGUHeaderBtn = function (index) {
    return that.getHeaderItem(3);
  };
};

module.exports = ResourcesPage;
