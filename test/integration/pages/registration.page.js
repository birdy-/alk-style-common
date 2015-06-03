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

  this.getConfirmEmailField = function() {
    return element(by.model('user.usernameConfirm'));
  };

  this.getJobField = function() {
    return element(by.model('user.jobTitle'));
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
      { method: 'getEmailField', input: 'jf@test.com'},
      { method: 'getConfirmEmailField', input: 'jf@test.com'},
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

  this.getGLNField = function (index) {
    index = index ? index : 0;
    return element(by.repeater('gln in company.claimGLNs').row(index)).element(by.model('gln.gln'));
  };

  this.getAddressField = function() {
    return element(by.model('company.address'));
  };

  this.getPostcodeField = function() {
    return element(by.model('company.postCode'));
  };

  this.getCityField = function() {
    return element(by.model('company.city'));
  };

  this.getCountryField = function() {
    return element(by.model('company.country'));
  };

  var fillCompanyFields = function() {
    var companyFields = [
      { method: 'getIdentifierLegalField', input: '535078190A'},
      { method: 'getIdentifierCityField', input: 'Pontoise'},
      { method: 'getGLNField', input: '3663215000011'},
      { method: 'getNameLegalField', input: 'Alkemics'},
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
