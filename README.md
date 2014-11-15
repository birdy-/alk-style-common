Alkemics Stream Dashboard
=========================

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

```
grunt build-preprod
cd capistrano && bundle exec cap preprod alk:deploy
```

For production:

```
grunt build
cd capistrano && bundle exec cap production alk:deploy
```

## Tests!!

### Unit tests

Shut down your grunt serve or adapt the port

```
grunt test
```

~~### End-to-end (E2E) tests~~
Grunt test will launch all tests now

Be sure to have a JDK and protractor installed as described in [documentation](http://angular.github.io/protractor/#/)

```
npm install -g protractor
grunt serve
protractor test/protractor.conf.js
```

### Jenkins integration

Check [Confluence](https://alkemics.atlassian.net/wiki/display/ITH/How+to+setup+Jenkins+for+the+frontend)
