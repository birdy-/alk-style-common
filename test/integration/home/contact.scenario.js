'use strict';

var HomePage = require('../pages/home.page.js');

describe('[Home page] Contact ', function() {
  var homePage = new HomePage();

  it('should have a button on header', function() {
    homePage.get();

    expect(homePage.getContactTab().isPresent())
      .toBe(true);
    expect(homePage.getContactTab().getText())
      .toBe('CONTACT');
  });

  it('should open a full modal on click', function() {
    homePage.getContactTab().click().then(function() {
      expect(homePage.getContactModal().isPresent())
        .toBe(true);

      expect(homePage.getContactModalHeader().getText())
        .toBe('Prenons contact...');

      expect(homePage.getContactModalOriginField().isPresent())
        .toBe(true);

      expect(homePage.getContactModalFirstnameField().isPresent())
        .toBe(true);

      expect(homePage.getContactModalLastnameField().isPresent())
        .toBe(true);

      expect(homePage.getContactModalUsernameField().isPresent())
        .toBe(true);

      expect(homePage.getContactModalPhonenumberField().isPresent())
        .toBe(true);

      expect(homePage.getContactModalMessageField().isPresent())
        .toBe(true);

      expect(homePage.getContactModalSubmit().isPresent())
        .toBe(true);
    });
  });


});
