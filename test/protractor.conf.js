exports.config = {
  seleniumAddress: 'http://127.0.0.1:4444/wd/hub',

  suites: {
    home: 'integration/home/*.scenario.js'
  },

  baseUrl: 'http://localhost.alkemics:9005',

  capabilities: {
    'browserName': 'chrome'
  },

  params: {
    website: {
      url: 'http://localhost.alkemics.com:9005'
    }
  }
};
