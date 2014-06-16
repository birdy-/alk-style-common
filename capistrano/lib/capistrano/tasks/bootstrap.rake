desc "Bootstrap"
task :bootstrap do
    on roles(:all) do |host|
        info "Installing git"
        execute :sudo, "apt-get install git -y"
        info "Creating Directory Skeleton"
        execute :sudo, "mkdir -p #{deploy_to}; sudo chown -R $USER:$GROUP #{deploy_to}"        
    end
end
