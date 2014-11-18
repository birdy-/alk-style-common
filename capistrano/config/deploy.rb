# config valid only for Capistrano 3.1
lock '3.2.1'

set :application, 'dashboard-flux'
set :repo_url, 'git@github.com:alkemics/dashboard-flux.git'


#set :rbenv_type, :user # or :system, depends on your rbenv setup
#set :rbenv_ruby, '2.1.2'
#set :rbenv_prefix, "RBENV_ROOT=#{fetch(:rbenv_path)} RBENV_VERSION=#{fetch(:rbenv_ruby)} #{fetch(:rbenv_path)}/bin/rbenv exec"
#set :rbenv_map_bins, %w{rake gem bundle ruby rails}
#set :rbenv_roles, :all # default value
#set :rbenv_ruby_version, '2.1.2'
# Default branch is :master
# ask :branch, proc { `git rev-parse --abbrev-ref HEAD`.chomp }.call

# Default deploy_to directory is /var/www/my_app
set :deploy_to, '/var/www/water.alkemics.com'

# Default value for :scm is :git
# set :scm, :git

# Default value for :format is :pretty
# set :format, :pretty

# Default value for :log_level is :debug
set :log_level, :debug

# Default value for :pty is false
#set :pty, true

# set :use_sudo, true
# Default value for :linked_files is []
# set :linked_files, %w{config/database.yml}

# Default value for linked_dirs is []
# set :linked_dirs, %w{bin log tmp/pids tmp/cache tmp/sockets vendor/bundle public/system}

# Default value for default_env is {}
# set :default_env, { path: "/opt/ruby/bin:$PATH" }

# Default value for keep_releases is 5
# set :keep_releases, 5

set :slack_team, "alkemics"
set :slack_token, "xoxp-2722465896-2945065910-3034863114-8cf50a"

set :slack_channel,      ->{ '#front' }
set :slack_username,     ->{ 'Slackistrano - dashboard-flux' }
set :slack_run_starting, ->{ true }
set :slack_run_finished, ->{ true }
set :slack_run_failed,   ->{ true }
set :slack_msg_starting, ->{ "#{ENV['USER'] || ENV['USERNAME']} has started deploying branch #{fetch :branch} of #{fetch :application} to #{fetch :stage, 'unknown stage'}." }
set :slack_msg_finished, ->{ "#{ENV['USER'] || ENV['USERNAME']} has finished deploying branch #{fetch :branch} of #{fetch :application} to #{fetch :stage, 'unknown stage'}." }
set :slack_msg_failed,   ->{ "*ERROR!* #{ENV['USER'] || ENV['USERNAME']} failed to deploy branch #{fetch :branch} of #{fetch :application} to #{fetch :stage, 'unknown stage'}." }
set :slack_via_slackbot, ->{ true } # Set to true to send the message via slackbot instead of webhook

namespace :alk do

    desc 'Full Deploy'
    task :deploy do
        on roles(:all), in: :parallel do
            invoke 'alk:upload_app'
            invoke 'alk:install_app'
        end
    end

    desc 'Upload Application'
    task :upload_app do
        on roles(:all), in: :parallel do
            info "Uploading tar archive"
            upload!("../app.tar.gz", "#{deploy_to}/app.tar.gz")

            execute "mkdir -p #{deploy_to}/backup"
            execute "rm -Rf #{deploy_to}/backup/*"
            execute "mkdir -p #{deploy_to}/current"
            execute "mv #{deploy_to}/current #{deploy_to}/backup/"
            execute "mkdir -p #{deploy_to}/current"

        end
    end

    desc 'Install Application'
    task :install_app do
        on roles(:all), in: :parallel do
            execute "tar -C #{deploy_to}/current -zxvf #{deploy_to}/app.tar.gz"
            execute "mv -f #{deploy_to}/current/dist/* #{deploy_to}/current/"
            execute "rm -Rf #{deploy_to}/current/dist"
        end
    end

    desc 'Rollback previous deploy'
    task :rollback do
        on roles(:all), in: :parallel do
            execute "mkdir -p #{deploy_to}/backup"
            execute "mkdir -p #{deploy_to}/current"
            execute "rm -Rf #{deploy_to}/current"
            execute "cp -R #{deploy_to}/backup/current #{deploy_to}/"
            alk.restart
        end
    end

    desc 'Restart App'
    task :restart do
        on roles(:all), in: :parallel do
            execute :sudo, "/etc/init.d/nginx reload"
        end
    end
end
