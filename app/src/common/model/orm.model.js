'use strict';

angular.module('jDashboardFluxApp').service('$$ORM', [
    '$$BrandRepository', '$$WebsiteRepository','$$ShopRepository', '$$OrganizationRepository', '$$UserRepository', '$$CommonUnitRepository',
    function service($$BrandRepository, $$WebsiteRepository,$$ShopRepository, $$OrganizationRepository, $$UserRepository, $$CommonUnitRepository) {

        var repositorys = {
            CommonUnit: $$CommonUnitRepository,
            Brand: $$BrandRepository,
            Website: $$WebsiteRepository,
            Shop: $$ShopRepository,
            Organization: $$OrganizationRepository,
            User: $$UserRepository
        };

        var repository = function(which) {
            return repositorys[which];
        };

        return {
            repository: repository
        };
}]);
