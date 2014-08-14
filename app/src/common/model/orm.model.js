'use strict';

angular.module('jDashboardFluxApp').service('$$ORM', [
    '$$BrandRepository', '$$WebsiteRepository','$$ShopRepository', '$$OrganizationRepository', '$$UserRepository',
    function service($$BrandRepository, $$WebsiteRepository,$$ShopRepository, $$OrganizationRepository, $$UserRepository) {

        var repositorys = {
            'Brand': $$BrandRepository,
            'Website': $$WebsiteRepository,
            'Shop': $$ShopRepository,
            'Organization': $$OrganizationRepository,
            'User': $$UserRepository,
        };

        var repository = function(which) {
        	return repositorys[which];
        };

        return {
            repository: repository
        };
}]);
