'use strict';

var OrganizationAdminPage = function () {
  var that = this;

  this.get = function (organizationId) {
    // Default to Alkemics
    if (!organizationId) { organizationId = 7; }
    return browser.get(browser.params.website.url + 'organization/' + organizationId + '/admin/home');
  };

  this.getSegments = function () {
    return element.all(by.repeater('segment in filteredSegments = (segments | filter:search)'));
  };
};

module.exports = OrganizationAdminPage;
