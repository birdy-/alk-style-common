'use strict';

var HomePage = require('../pages/home.page.js');
var RegistrationPage = require('../pages/registration.page.js');
var Utils = require('../utils/utils.js');

describe('[Registration page]', function () {
  var homePage = new HomePage();
  var registrationPage = new RegistrationPage();
  var utils = new Utils();

  it('should be accessible from home page', function () {
    homePage.getRegistrationPageButton().click().then(function () {
      expect(browser.getCurrentUrl())
      .toEqual(browser.params.website.url + 'register');
    });
  });

  it('should have a registration form', function () {
    expect(registrationPage.getUserForm().isPresent())
    .toBe(true);
  });

  it('should have a form with all user inputs', function () {
    var inputGetMethods = [
      'getFirstNameField',
      'getLastNameField',
      'getEmailField',
      'getConfirmEmailField',
      'getJobField',
      'getPhoneField',
      'getPasswordField'
    ];

    inputGetMethods.map(function (method) {
      expect(registrationPage[method].apply(this).isPresent())
      .toBe(true);
    });
  });

  it('should hide company form when user fields are blank', function () {
    expect(registrationPage.getCompanyForm().isDisplayed())
    .toBe(false);
  });

  it('should display company form when user fields are filled', function () {
    registrationPage.fillBasicFields();

    expect(registrationPage.getCompanyForm().isDisplayed())
    .toBe(true);
  });

  it('should hide email form when company fields are blank', function () {
    expect(registrationPage.getEmailForm().isDisplayed())
    .toBe(false);
  });

  it('should display email form when company fields are filled', function () {
    registrationPage.fillCompanyFields();

    expect(registrationPage.getEmailForm().isDisplayed())
    .toBe(true);
  });

  it('should have 3 forms when all fields are filled', function () {
    var forms = [
      'getUserForm',
      'getCompanyForm'
    ];

    forms.map(function (form) {
      expect(utils.hasClass(registrationPage[form].apply(this), 'ng-valid'))
      .toBe(true);
    });
  });

  // Checkbox click issue with protractor
  //it('should have all forms valid when checkbox is clicked', function () {
  //  registrationPage.getCGUField().click().then(function () {
  //    var forms = [
  //      'getUserForm',
  //      'getCompanyForm',
  //      'getEmailForm'
  //    ];
  //
  //    forms.map(function (form) {
  //      expect(utils.hasClass(registrationPage[form].apply(this), 'ng-valid'))
  //        .toBe(true);
  //    });
  //  });
  //});

  // Commented because I don't have Vagrant environment
  //it('should submit the data on button submit click', function () {
  //  registrationPage.getSubmitButton().click().then(function () {
  //
  //  });
  //});

  /** Handle Invalid inputs **/
  it('should present warning for invalid inputs', function () {
    var invalidOptions = [
      { method: 'getEmailField', input: 'coucou' },
      { method: 'getPhoneField', input: 'coucou' },
      { method: 'getPasswordField', input: 'aa' }
    ];

    invalidOptions.map(function (option) {
      registrationPage.get();

      registrationPage[option.method].apply(this).sendKeys(option.input).then(function () {
        expect(utils.hasClass(registrationPage[option.method].apply(this), 'ng-invalid'))
        .toBe(true);
      })
    });
  });
});
