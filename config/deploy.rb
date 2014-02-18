# Enable verbose deploy output
logger.level = Logger::MAX_LEVEL

set :application, "Alkemics-Waters"

# Remove errors
set :normalize_asset_timestamps, false

ssh_options[:forward_agent] = true
ssh_options[:port] = fetch(:port, 22)
default_run_options[:pty] = true

set :user, "deploy_sdk"
set :use_sudo, false


set :scm,           :git
set :scm_verbose,   true
set :deploy_via,    :remote_cache
set :repository,    "git@github.com:alkemics/dashboard-flux.git"
set :branch,        "master"

set :deploy_to, "/var/www/water.alkemics.com"

depend :remote, :command, ["git"]

task :upload_dashboard do
    directory_name = File.expand_path(File.dirname(__FILE__))
    run "mkdir -p #{deploy_to}/backup"
    run "rm -Rf #{deploy_to}/backup/*"

    run "mkdir -p #{deploy_to}/current"
    run "mv #{deploy_to}/current #{deploy_to}/backup/"

    run "mkdir -p #{deploy_to}/current"

    top.upload("#{directory_name}/../app.tar.gz", "#{deploy_to}", :via=> :scp, :recursive => true)
    run "tar -C #{deploy_to}/current -zxvf #{deploy_to}/app.tar.gz"
    run "mv -f #{deploy_to}/current/dist/* #{deploy_to}/current/"
    run "rm -Rf #{deploy_to}/current/dist"
end


task :restart do
    run "sudo /etc/init.d/nginx reload"
end

role :app, "alk-cdn-1.cloudapp.net", "alk-cdn-1.cloudapp.net:61868"

namespace :alk do
    task :deploy, :roles => :app do
        upload_dashboard
        restart
    end

    task :rollback, :roles => :app do
        run "mkdir -p #{deploy_to}/backup"
        run "mkdir -p #{deploy_to}/current"
        
        run "rm -Rf #{deploy_to}/current"
        run "cp -R #{deploy_to}/backup/current #{deploy_to}/"
        restart
    end
end
