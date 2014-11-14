'use strict';

var HomePage = require('../pages/home.page.js');

describe('[Home page] Header', function() {
  var homePage = new HomePage();

  it('should be present', function() {
    homePage.get();

    expect(homePage.getHeader().isPresent())
      .toBe(true);
  });

  it('should have an active item on home', function() {
    expect(homePage.getHeaderActiveTab().isPresent())
      .toBe(true);
    expect(homePage.getHeaderActiveTab().getText())
      .toBe('ACCUEIL');
  });

  it('should have 7 items', function() {
    expect(homePage.getHeaderTabs().count())
      .toEqual(7);
  });
});
