'use strict';

var RegistrationPage = function() {
  var that = this;
  this.get = function() {
    browser.get(browser.params.website.url + 'register');
  };

  /** Form **/
  this.getUserForm = function() {
    return element(by.css('form[name=userForm]'));
  };

  this.getCompanyForm = function() {
    return element(by.css('form[name=companyForm]'));
  };

  this.getEmailForm = function() {
    return element(by.css('form[name=emailForm]'));
  };

  /** User fields **/
  this.getFirstNameField = function() {
    return element(by.model('user.firstname'));
  };

  this.getLastNameField = function() {
    return element(by.model('user.lastname'));
  };

  this.getEmailField = function() {
    return element(by.model('user.username'));
  };

  this.getJobField = function() {
    return element(by.model('user.job'));
  };

  this.getPhoneField = function() {
    return element(by.model('user.phonenumber'));
  };

  this.getPasswordField = function() {
    return element(by.model('user.password'));
  };

  var fillBasicFields = function() {
    var userFields = [
      { method: 'getFirstNameField', input: 'JF'},
      { method: 'getLastNameField', input: 'Dean'},
      { method: 'getEmailField', input: 'jf@alkemics.com'},
      { method: 'getJobField', input: 'jedi'},
      { method: 'getPhoneField', input: '0600000000'},
      { method: 'getPasswordField', input: 'NoPassw0rdIsG00dEnough'}
    ];

    userFields.map(function(field) {
      that[field.method].apply(this).sendKeys(field.input);
    });
  };

  this.fillBasicFields = function() {
    fillBasicFields();
  };

  /** Company Fields **/

  this.getNameLegalField = function() {
    return element(by.model('company.nameLegal'));
  };

  this.getIdentifierLegalField = function() {
    return element(by.model('company.identifierLegal'));
  };

  this.getIdentifierCityField = function() {
    return element(by.model('company.identifierCity'));
  };

  this.getAddressField = function() {
    return element(by.model('company.adress'));
  };

  this.getPostcodeField = function() {
    return element(by.model('company.postcode'));
  };

  this.getCityField = function() {
    return element(by.model('company.city'));
  };

  this.getCountryField = function() {
    return element(by.model('company.country'));
  };

  var fillCompanyFields = function() {
    var companyFields = [
      { method: 'getNameLegalField', input: 'Alkemics'},
      { method: 'getIdentifierLegalField', input: 'Alkemics'},
      { method: 'getIdentifierCityField', input: 'Pontoise'},
      { method: 'getAddressField', input: '82 Rue du Faubourg Saint Martin'},
      { method: 'getPostcodeField', input: '75010'},
      { method: 'getCityField', input: 'Paris'},
      { method: 'getCountryField', input: 'France'}
    ];

    companyFields.map(function(field) {
      that[field.method].apply(this).sendKeys(field.input);
    });
  };

  this.fillCompanyFields = function() {
    fillCompanyFields();
  };

  /** Accept form **/

  this.getCGUField = function() {
    // by.model is not working for checkboxes
    return element(by.css('form[name=acceptForm] .checkbox label'));
  };

  this.getSubmitButton = function() {
    return element(by.partialButtonText('Je m\'inscris'));
  };
};

module.exports = RegistrationPage;
