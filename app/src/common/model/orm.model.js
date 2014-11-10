'use strict';

/**
 * Repository that groups all CRUD methods for a given model.
 */
var abstractRepository = function(Model, $$sdk, $$cacheManager, $q, cache, hydrateCustom) {

    // Parameters
    var modelName = Model._type;

    // Register repository in cacheManager :
    $$cacheManager.registerEntity(Model);

    // Helpers
    var hydrateResponse = $$cacheManager.hydrateResponse;
    var hydrate = $$cacheManager.hydrate;
    if (hydrateCustom) {
        hydrate = function (data, full) {
            return hydrateCustom($$cacheManager.hydrate(data, full), full);
        };
    }

    // Public methods
    var get = function (id, options) {
        id = parseInt(id, 10);
        // Return directly if cached (it means it was fully loaded)
        var entity = $$cacheManager.getCache(modelName, id);
        if (entity) {
            var deferred = $q.defer();
            deferred.resolve(entity);
            return deferred.promise;
        }
        return $$sdk[modelName + 'Show'](id, options).then(hydrateResponse);
    };
    var lazy = function(id, create) {
        return $$cacheManager.getLazy(modelName, id, true);
    };
    var list = function(queries, filters, sorts, offset, limit) {
        return $$sdk[modelName + 'List'](
            queries, filters, sorts, offset, limit
        ).then(function(response) {
            return response.data.data.map(function(json){
                return hydrate(json);
            });
        });
    };
    var update = function(entity) {
        return $$sdk[modelName + 'Update'](
            entity
        ).then(function(response) {
            entity.fromJson(response.data.data);
        });
    };
    var create = function(entity) {
        return $$sdk[modelName + 'Create'](
            entity
        ).then(function(response) {
            entity.fromJson(response.data.data);
        });
    };
    var del = function(id) {
        $$cacheManager.popCache(modelName, id);
        return $$sdk[modelName + 'Delete'](
            id
        );
    };
    var method = function (methodName) {
        return function () {
            return $$sdk[modelName + methodName].apply(this, arguments).then(hydrateResponse);
        };
    };

    // Init
    if (cache && cache.length) {
        cache.forEach(function (json) {
            json._type = modelName;
            hydrate(json, false);
        });
    }

    return {
        method: method,
        get: get,
        lazy: lazy,
        update: update,
        create: create,
        del: del,
        list: list
    };
};


angular.module('jDashboardFluxApp').service('$$ORM', [
    '$$cacheManager', '$q', '$$sdkCrud', '$$sdkCampaign', '$$sdkAuth',
    function service($$cacheManager, $q, $$sdkCrud, $$sdkCampaign, $$sdkAuth) {

        // Items that need to be lazily loaded in order to avoid calls on the APIs
        var commonUnits = [
            {id: 3, name: 'gramme'},
            {id: 104, name: 'kilo joule'},
            {id: 106, name: 'kilo calorie'}
        ];
        var concepts = [
            { name: 'Valeur énergétique (kJ)',  id: 19195, isMeasuredBy: {id: 104, _type: 'CommonUnit' }, type: 'Nutrition', compulsory: true,  legend: "" },
            { name: 'Valeur énergétique (kCal)',id: 19196, isMeasuredBy: {id: 106, _type: 'CommonUnit' }, type: 'Nutrition', compulsory: true,  legend: "" },
            { name: 'Matières grasses',         id: 19058, isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Nutrition', compulsory: true,  legend: "La quantité totale de lipides (y compris phospholipides), rapportée 100 grammes de produit." },
            { name: 'Acides gras saturatés',    id: 19059, isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Nutrition', compulsory: true,  legend: "La quantité totale d'acides gras sans double liaison, rapportée à 100 grammes de produit." },
            { name: 'Acides gras monoinsaturés',id: 19060, isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Nutrition', compulsory: false, legend: "La quantité totale d'acides gras avec une double liaison cis, rapportée à 100 grammes de produit." },
            { name: 'Acides gras polyinsaturés',id: 19061, isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Nutrition', compulsory: false, legend: "La quantité totale d'acides gras avec deux (ou plus) doubles liaisons interrompues cis ou cis-méthylène, rapportée à 100 grammes de produit." },
            { name: 'Acides gras trans',        id: 19062, isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Nutrition', compulsory: false, legend: "" },
            { name: 'Cholestérol',              id: 19063, isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Nutrition', compulsory: false, legend: "" },
            { name: 'Oméga 3',                  id: 19064, isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Nutrition', compulsory: false, legend: "" },
            { name: 'Oméga 6',                  id: 19065, isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Nutrition', compulsory: false, legend: ""  },
            { name: 'Rapport gras',             id: 19066, isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Nutrition', compulsory: false, legend: ""  },
            { name: 'Glucides',                 id: 19067, isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Nutrition', compulsory: true,  legend: "La quantité totale de tous les glucides métabolisés par l’homme, y compris les polyols, rapportée à 100 grammes de produit." },
            { name: 'Sucres',                   id: 19068, isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Nutrition', compulsory: true,  legend: "La quantité totale de tous les monosaccharides et disaccharides présents dans une denrée alimentaire, à l’exclusion des polyols, rapportée à 100 grammes de produit." },
            { name: 'Polyols',                  id: 19069, isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Nutrition', compulsory: false, legend: "La quantité totale de tous les alcools comprenant plus de deux groupes hydroxyles, rapportée à 100 grammes de produit." },
            { name: 'Amidon',                   id: 19070, isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Nutrition', compulsory: false, legend: "" },
            { name: 'Fibres alimentaires',      id: 19071, isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Nutrition', compulsory: true,  legend: "La quantité totale de fibres alimentaires, rapportée à 100 grammes de produit. Il s'agit des polymères glucidiques composés de trois unités monomériques ou plus, qui ne sont ni digérés ni absorbés dans l’intestin grêle humain et appartiennent à l’une des catégories suivantes: - polymères glucidiques comestibles, présents naturellement dans la denrée alimentaire telle qu’elle est consommée, - polymères glucidiques comestibles qui ont été obtenus à partir de matières premières alimentaires brutes par des moyens physiques, enzymatiques ou chimiques et ont un effet physiologique bénéfique démontré par des données scientifiques généralement admises, - polymères glucidiques comestibles synthétiques qui ont un effet physiologique bénéfique démontré par des données scientifiques généralement admises." },
            { name: 'Protéines',                id: 19072, isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Nutrition', compulsory: true,  legend: "La teneur en protéines, rapportée à 100 grammes de produit. Elle peut être calculée à l’aide de la formule: <code>protéines = azote total (Kjeldahl) &times; 6,25</code>" },
            { name: 'Sel',                      id: 19073, isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Nutrition', compulsory: true,  legend: "La teneur en équivalent en sel, rapportée à 100 grammes de produit. Elle peut être calculée à l’aide de la formule: <code>sel = sodium &times; 2,5</code>." },
            { name: 'Eau',                      id: 19074, isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Nutrition', compulsory: false, legend: "" },

            { name: 'Vitamine A',               id: 18978, isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Vitamin',   compulsory: false, legend: "" },
            { name: 'Vitamine B1',              id: 18739, isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Vitamin',   compulsory: false, legend: "" },
            { name: 'Vitamine B2',              id: 18740, isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Vitamin',   compulsory: false, legend: "" },
            { name: 'Vitamine B3',              id: 18741, isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Vitamin',   compulsory: false, legend: "" },
            { name: 'Vitamine B5',              id: 18744, isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Vitamin',   compulsory: false, legend: "" },
            { name: 'Vitamine B6',              id: 18983, isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Vitamin',   compulsory: false, legend: "" },
            { name: 'Vitamine B8',              id: 18743, isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Vitamin',   compulsory: false, legend: "" },
            { name: 'Vitamine B9',              id: 18742, isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Vitamin',   compulsory: false, legend: "" },
            { name: 'Vitamine B11',             id: 18984, isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Vitamin',   compulsory: false, legend: "" },
            { name: 'Vitamine B12',             id: 18985, isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Vitamin',   compulsory: false, legend: "" },
            { name: 'Vitamine C',               id: 18982, isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Vitamin',   compulsory: false, legend: "" },
            { name: 'Vitamine D',               id: 18979, isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Vitamin',   compulsory: false, legend: "" },
            { name: 'Vitamine E',               id: 18980, isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Vitamin',   compulsory: false, legend: "" },
            { name: 'Vitamine K',               id: 18981, isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Vitamin',   compulsory: false, legend: "" },
            { name: 'Vitamine H',               id: 18986, isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Vitamin',   compulsory: false, legend: "" },

            { name: 'Aluminium',                id: 19075, isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Mineral',   compulsory: false, legend: "" },
            { name: 'Arsenic',                  id: 19076, isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Mineral',   compulsory: false, legend: "" },
            { name: 'Bore',                     id: 19077, isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Mineral',   compulsory: false, legend: "" },
            { name: 'Calcium',                  id: 18989, isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Mineral',   compulsory: false, legend: "" },
            { name: 'Chlore',                   id: 18988, isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Mineral',   compulsory: false, legend: "" },
            { name: 'Chrome',                   id: 18998, isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Mineral',   compulsory: false, legend: "" },
            { name: 'Cobalt',                   id: 19078, isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Mineral',   compulsory: false, legend: "" },
            { name: 'Cuivre',                   id: 18994, isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Mineral',   compulsory: false, legend: "" },
            { name: 'Fer',                      id: 18992, isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Mineral',   compulsory: false, legend: "" },
            { name: 'Fluor',                    id: 18996, isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Mineral',   compulsory: false, legend: "" },
            { name: 'Iode',                     id: 19000, isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Mineral',   compulsory: false, legend: "" },
            { name: 'Magnésium',                id: 18991, isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Mineral',   compulsory: false, legend: "" },
            { name: 'Molybdène',                id: 18999, isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Mineral',   compulsory: false, legend: "" },
            { name: 'Nickel',                   id: 19079, isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Mineral',   compulsory: false, legend: "" },
            { name: 'Phosphore',                id: 18990, isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Mineral',   compulsory: false, legend: "" },
            { name: 'Plomb',                    id: 19080, isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Mineral',   compulsory: false, legend: "" },
            { name: 'Potassium',                id: 18987, isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Mineral',   compulsory: false, legend: "" },
            { name: 'Sodium',                   id: 19081, isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Mineral',   compulsory: false, legend: "" },
            { name: 'Souffre',                  id: 19082, isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Mineral',   compulsory: false, legend: "" },
            { name: 'Silicium',                 id: 19083, isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Mineral',   compulsory: false, legend: "" },
            { name: 'Sélénium',                 id: 18997, isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Mineral',   compulsory: false, legend: "" },
            { name: 'Vanadium',                 id: 19084, isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Mineral',   compulsory: false, legend: "" },
            { name: 'Zinc',                     id: 18993, isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Mineral',   compulsory: false, legend: "" }
        ];

        // Duplicates a field in the text attribute of the object, so it can be used by the autocomplete lubrary
        var addTextFrom = function (field) {
            return function (entity, full) {
                entity.text = entity[field];
                return entity;
            };
        };

        var repositorys = {
            Brand: abstractRepository(Brand, $$sdkCrud, $$cacheManager, $q, [], addTextFrom('name')),
            CommonUnit: abstractRepository(CommonUnit, $$sdkCrud, $$cacheManager, $q, commonUnits, addTextFrom('name')),
            Concept: abstractRepository(Concept, $$sdkCrud, $$cacheManager, $q, concepts, addTextFrom('name')),
            Organization: abstractRepository(Organization, $$sdkAuth, $$cacheManager, $q, [], addTextFrom('name')),
            Product: abstractRepository(Product, $$sdkCrud, $$cacheManager, $q, [], addTextFrom('nameLegal')),
            ProductStandardQuantity: abstractRepository(ProductStandardQuantity, $$sdkCrud, $$cacheManager, $q, [], null),
            ProductNutritionalQuantity: abstractRepository(ProductNutritionalQuantity, $$sdkCrud, $$cacheManager, $q, [], null),
            Placement: abstractRepository(Placement, $$sdkCampaign, $$cacheManager, $q, [], addTextFrom('name')),
            Shop: abstractRepository(Shop, $$sdkCrud, $$cacheManager, $q, [], addTextFrom('name')),
            User: abstractRepository(User, $$sdkAuth, $$cacheManager, $q, [], null),
            Campaign: abstractRepository(Campaign, $$sdkCampaign, $$cacheManager, $q, [], null),
            Website: abstractRepository(Website, $$sdkCrud, $$cacheManager, $q, [], addTextFrom('name'))
        };

        var repository = function(which) {
            return repositorys[which];
        };

        return {
            repository: repository
        };
}]);
