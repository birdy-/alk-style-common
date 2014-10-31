'use strict';

var HomePage = require('../pages/home.page.js');

describe('[Home page]', function() {
  var homePage = new HomePage();

  it('should have the correct path', function() {
    homePage.get();

    expect(browser.getCurrentUrl())
      .toEqual(browser.params.website.url);
  });
});
