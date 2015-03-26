Alkemics Stream Dashboard
=========================

[![Build Status](https://ci.alkemics.com:443/buildStatus/icon?job=dashboard-flux)](https://ci.alkemics.com:443/job/dashboard-flux/)

## Setup

```
# Install node, npm and ruby
brew install node
brew install ruby

# Install yeoman
npm install -g yo
# Install generators for angular
npm install -g generator-angular

# Install compass, bundle, capistrano
gem update --system
gem install compass
gem install capistrano
gem install bundle
gem install bundler

# Install dependencies
bower install

# Prepare for deploy
cd capistrano && bundle install
```

## Run

Make sure to have an entry for `localstream.alkemics.com` in your /etc/hosts

```
# Serve
grunt serve
# Tests
grunt test
```

## Dev

By default the sdk-dashboard package is installed via Github.
However when developping you will probably need to use your local version.

```
cd ~/alkemics/dev/sdk-dashboard
bower link
cd ~/alkemics/dev/dashboard-flux
bower link sdk-dashboard
```

That's it! You've got your working dev package.

## Deploy

For preproduction:

Merge staging in master and ensure build pass on Jenkins, it will be automagically deploy on preprod-stream.alkemics.com

For production:

```
ssh avalon
cd /home/excalibur/preproduction/frontend/dashboard-flux
cd capistrano && bundle exec cap production alk:deploy
```

## Tests!!

Run all tests (Shut down your grunt serve or adapt the port)
```
grunt test
```

### Unit tests

```
npm run test:unit
```

### End-to-end (E2E) tests

Be sure to have a JDK and protractor installed as described in [documentation](http://angular.github.io/protractor/#/)

Run Protractor

```
npm install -g protractor
grunt serve
protractor test/protractor.conf.js
```

Make sure to have selenium running in the background

```
./node_modules/.bin/webdriver update
./node_modules/.bin/webdriver start
```

The first time, you will need to copy protractor dist configuration file
```
cp test/protractor.conf.js.dist test/protractor.conf.js
```

```
npm run test:integration
```


### Jenkins integration

Check [Confluence](https://alkemics.atlassian.net/wiki/display/ITH/How+to+setup+Jenkins+for+the+frontend)
