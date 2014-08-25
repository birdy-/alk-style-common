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
grunt server
# Tests
grunt test
```

## Deploy

```
# Build app
grunt build
# Upload
cd capistrano && bundle exec cap production alk:deploy
```