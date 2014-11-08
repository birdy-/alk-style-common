'use strict';

angular.module('jDashboardFluxApp').service('$$ORM', [
    '$$BrandRepository', '$$WebsiteRepository','$$ShopRepository', '$$OrganizationRepository', '$$UserRepository', '$$CommonUnitRepository', '$$PlacementRepository', '$$CampaignRepository', '$$ProductRepository',
    function service($$BrandRepository, $$WebsiteRepository,$$ShopRepository, $$OrganizationRepository, $$UserRepository, $$CommonUnitRepository, $$PlacementRepository, $$CampaignRepository, $$ProductRepository) {

        var repositorys = {
            Brand: $$BrandRepository,
            CommonUnit: $$CommonUnitRepository,
            Organization: $$OrganizationRepository,
            Product: $$ProductRepository,
            Placement: $$PlacementRepository,
            Shop: $$ShopRepository,
            User: $$UserRepository,
            Campaign: $$CampaignRepository,
            Website: $$WebsiteRepository
        };

        var repository = function(which) {
            return repositorys[which];
        };

        return {
            repository: repository
        };
}]);
