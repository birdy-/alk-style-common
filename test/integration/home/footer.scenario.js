'use strict';

var HomePage = require('../pages/home.page.js');

describe('[Home page] Footer', function() {
  var homePage = new HomePage();

  it('should be present', function() {
    homePage.get();

    expect(homePage.getFooter().isPresent())
    .toBe(true);
  });
});
