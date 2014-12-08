'use strict';

/**
 * Repository that groups all CRUD methods for a given model.
 */
var abstractRepository = function (Model, $$sdk, $$cacheManager, $q, cache, hydrateCustom) {

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
    var lazy = function (id, create) {
        return $$cacheManager.getLazy(modelName, id, true);
    };
    var list = function (queries, filters, sorts, offset, limit, withs) {
        return $$sdk[modelName + 'List'](
            queries, filters, sorts, offset, limit, withs
        ).then(function (response) {
            return response.data.data.map(function (json){
                return hydrate(json);
            });
        });
    };
    var update = function (entity) {
        return $$sdk[modelName + 'Update'](
            entity
        ).then(function (response) {
            entity.fromJson(response.data.data);
        });
    };
    var create = function (entity) {
        return $$sdk[modelName + 'Create'](
            entity
        ).then(function (response) {
            entity.fromJson(response.data.data);
        });
    };
    var del = function (id) {
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
            {id:   3, name: 'gramme'},
            {id: 104, name: 'kilo joule'},
            {id: 106, name: 'kilo calorie'},
            {id:  22, name: 'kg'},
            {id:   7, name: 'cl'},
            {id:   9, name: 'l'},
            {id:   2, name: 'ml'}
        ];
        var concepts = [
            { id: 19195, name: 'Valeur énergétique (kJ)',  isMeasuredBy: {id: 104, _type: 'CommonUnit' }, type: 'Nutrition', compulsory: true,  legend: "" },
            { id: 19196, name: 'Valeur énergétique (kCal)',isMeasuredBy: {id: 106, _type: 'CommonUnit' }, type: 'Nutrition', compulsory: true,  legend: "" },
            { id: 19058, name: 'Matières grasses',         isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Nutrition', compulsory: true,  legend: "La quantité totale de lipides (y compris phospholipides), rapportée 100 grammes de produit." },
            { id: 19059, name: 'Acides gras saturés',      isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Nutrition', compulsory: true,  legend: "La quantité totale d'acides gras sans double liaison, rapportée à 100 grammes de produit." },
            { id: 19060, name: 'Acides gras monoinsaturés',isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Nutrition', compulsory: false, legend: "La quantité totale d'acides gras avec une double liaison cis, rapportée à 100 grammes de produit." },
            { id: 19061, name: 'Acides gras polyinsaturés',isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Nutrition', compulsory: false, legend: "La quantité totale d'acides gras avec deux (ou plus) doubles liaisons interrompues cis ou cis-méthylène, rapportée à 100 grammes de produit." },
            { id: 19062, name: 'Acides gras trans',        isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Nutrition', compulsory: false, legend: "" },
            { id: 19063, name: 'Cholestérol',              isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Nutrition', compulsory: false, legend: "" },
            { id: 19064, name: 'Oméga 3',                  isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Nutrition', compulsory: false, legend: "" },
            { id: 19065, name: 'Oméga 6',                  isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Nutrition', compulsory: false, legend: ""  },
            { id: 19066, name: '% de matières grasses',    isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Nutrition', compulsory: false, legend: ""  },
            { id: 19067, name: 'Glucides',                 isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Nutrition', compulsory: true,  legend: "La quantité totale de tous les glucides métabolisés par l’homme, y compris les polyols, rapportée à 100 grammes de produit." },
            { id: 19068, name: 'Sucres',                   isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Nutrition', compulsory: true,  legend: "La quantité totale de tous les monosaccharides et disaccharides présents dans une denrée alimentaire, à l’exclusion des polyols, rapportée à 100 grammes de produit." },
            { id: 19069, name: 'Polyols',                  isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Nutrition', compulsory: false, legend: "La quantité totale de tous les alcools comprenant plus de deux groupes hydroxyles, rapportée à 100 grammes de produit." },
            { id: 19070, name: 'Amidon',                   isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Nutrition', compulsory: false, legend: "" },
            { id: 19071, name: 'Fibres alimentaires',      isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Nutrition', compulsory: true,  legend: "La quantité totale de fibres alimentaires, rapportée à 100 grammes de produit. Il s'agit des polymères glucidiques composés de trois unités monomériques ou plus, qui ne sont ni digérés ni absorbés dans l’intestin grêle humain et appartiennent à l’une des catégories suivantes: - polymères glucidiques comestibles, présents naturellement dans la denrée alimentaire telle qu’elle est consommée, - polymères glucidiques comestibles qui ont été obtenus à partir de matières premières alimentaires brutes par des moyens physiques, enzymatiques ou chimiques et ont un effet physiologique bénéfique démontré par des données scientifiques généralement admises, - polymères glucidiques comestibles synthétiques qui ont un effet physiologique bénéfique démontré par des données scientifiques généralement admises." },
            { id: 19072, name: 'Protéines',                isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Nutrition', compulsory: true,  legend: "La teneur en protéines, rapportée à 100 grammes de produit. Elle peut être calculée à l’aide de la formule: <code>protéines = azote total (Kjeldahl) &times; 6,25</code>" },
            { id: 19073, name: 'Sel',                      isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Nutrition', compulsory: true,  legend: "La teneur en équivalent en sel, rapportée à 100 grammes de produit. Elle peut être calculée à l’aide de la formule: <code>sel = sodium &times; 2,5</code>." },
            { id: 19074, name: 'Eau',                      isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Nutrition', compulsory: false, legend: "" },

            { id: 18978, name: 'Vitamine A',               isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Vitamin',   compulsory: false, legend: "" },
            { id: 18739, name: 'Vitamine B1',              isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Vitamin',   compulsory: false, legend: "" },
            { id: 18740, name: 'Vitamine B2',              isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Vitamin',   compulsory: false, legend: "" },
            { id: 18741, name: 'Vitamine B3',              isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Vitamin',   compulsory: false, legend: "" },
            { id: 18744, name: 'Vitamine B5',              isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Vitamin',   compulsory: false, legend: "" },
            { id: 18983, name: 'Vitamine B6',              isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Vitamin',   compulsory: false, legend: "" },
            { id: 18743, name: 'Vitamine B8',              isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Vitamin',   compulsory: false, legend: "" },
            { id: 18742, name: 'Vitamine B9',              isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Vitamin',   compulsory: false, legend: "" },
            // { id: 18984, name: 'Vitamine B11',             isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Vitamin',   compulsory: false, legend: "" }, Seems to be a duplicate of B9
            { id: 18985, name: 'Vitamine B12',             isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Vitamin',   compulsory: false, legend: "" },
            { id: 18982, name: 'Vitamine C',               isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Vitamin',   compulsory: false, legend: "" },
            { id: 18979, name: 'Vitamine D',               isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Vitamin',   compulsory: false, legend: "" },
            { id: 18980, name: 'Vitamine E',               isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Vitamin',   compulsory: false, legend: "" },
            { id: 18981, name: 'Vitamine K',               isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Vitamin',   compulsory: false, legend: "" },
            // { id: 18986, name: 'Vitamine H',               isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Vitamin',   compulsory: false, legend: "" }, Seems to be a duplicate of B8

            { id: 19075, name: 'Aluminium',                isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Mineral',   compulsory: false, legend: "" },
            { id: 19076, name: 'Arsenic',                  isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Mineral',   compulsory: false, legend: "" },
            { id: 19077, name: 'Bore',                     isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Mineral',   compulsory: false, legend: "" },
            { id: 18989, name: 'Calcium',                  isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Mineral',   compulsory: false, legend: "" },
            { id: 18988, name: 'Chlore',                   isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Mineral',   compulsory: false, legend: "" },
            { id: 18998, name: 'Chrome',                   isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Mineral',   compulsory: false, legend: "" },
            { id: 19078, name: 'Cobalt',                   isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Mineral',   compulsory: false, legend: "" },
            { id: 18994, name: 'Cuivre',                   isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Mineral',   compulsory: false, legend: "" },
            { id: 18992, name: 'Fer',                      isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Mineral',   compulsory: false, legend: "" },
            { id: 18996, name: 'Fluor',                    isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Mineral',   compulsory: false, legend: "" },
            { id: 19000, name: 'Iode',                     isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Mineral',   compulsory: false, legend: "" },
            { id: 18991, name: 'Magnésium',                isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Mineral',   compulsory: false, legend: "" },
            { id: 18999, name: 'Molybdène',                isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Mineral',   compulsory: false, legend: "" },
            { id: 19079, name: 'Nickel',                   isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Mineral',   compulsory: false, legend: "" },
            { id: 18990, name: 'Phosphore',                isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Mineral',   compulsory: false, legend: "" },
            { id: 19080, name: 'Plomb',                    isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Mineral',   compulsory: false, legend: "" },
            { id: 18987, name: 'Potassium',                isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Mineral',   compulsory: false, legend: "" },
            { id: 19081, name: 'Sodium',                   isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Mineral',   compulsory: false, legend: "" },
            { id: 19082, name: 'Souffre',                  isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Mineral',   compulsory: false, legend: "" },
            { id: 19083, name: 'Silicium',                 isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Mineral',   compulsory: false, legend: "" },
            { id: 18997, name: 'Sélénium',                 isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Mineral',   compulsory: false, legend: "" },
            { id: 19084, name: 'Vanadium',                 isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Mineral',   compulsory: false, legend: "" },
            { id: 18993, name: 'Zinc',                     isMeasuredBy: {id:   3, _type: 'CommonUnit' }, type: 'Mineral',   compulsory: false, legend: "" },

            { id: 18070, name: "Vendanges Tardives",                                                      type: 'Label'},
            { id: 18262, name: "Sélection de grains nobles",                                              type: 'Label'},
            { id: 18263, name: "Dénomination de cépage",                                                  type: 'Label'},
            { id: 18264, name: "Appellation d'Origine Contrôlée",                                         type: 'Label'},
            { id: 18265, name: "Indication géographique protégée",                                        type: 'Label'},
            { id: 18266, name: "Appellation d'Origine Protégée",                                          type: 'Label'},
            { id: 18267, name: "Vin de pays",                                                             type: 'Label'},
            { id: 18268, name: "Appellation d'Origine Vin délimité de Qualité supérieure",                type: 'Label'},
            { id: 18269, name: "Denominação de Origem Controlada",                                        type: 'Label'},
            { id: 18270, name: "Denominazione di origine controllata",                                    type: 'Label'},
            { id: 18271, name: "Denominazione di origine controllata e garantita",                        type: 'Label'},
            { id: 18272, name: "Indicazione Geografica Tipica",                                           type: 'Label'},
            { id: 18419, name: "label manger bouger",                                                     type: 'Label'},
            { id: 18935, name: "Denominazione di origine protetta",                                       type: 'Label'},
            { id: 18942, name: "Label Rouge",                                                             type: 'Label'},
            { id: 19003, name: "Vin Doux Naturel",                                                        type: 'Label'},
            { id: 19094, name: "Fair Trade",                                                              type: 'Label'},
            { id: 19095, name: "Agriculture Biologique Européenne",                                       type: 'Label'},
            { id: 19096, name: "Agriculture Biologique Française",                                        type: 'Label'},
            { id: 19097, name: "Eko",                                                                     type: 'Label'},
            { id: 19098, name: "Bio-Équitable",                                                           type: 'Label'},
            { id: 19099, name: "Bio-Garantie",                                                            type: 'Label'},
            { id: 19100, name: "Montagnes Françaises",                                                    type: 'Label'},
            { id: 19101, name: "Demeter",                                                                 type: 'Label'},
            { id: 19102, name: "Nature et Progrès",                                                       type: 'Label'},
            { id: 19103, name: "Bio-Cohérence",                                                           type: 'Label'},
            { id: 19104, name: "Origine Française Garantie",                                              type: 'Label'},
            { id: 19105, name: "Viande de Porc Français",                                                 type: 'Label'},
            { id: 19106, name: "Viande de Bœuf Français",                                                 type: 'Label'},
            { id: 19107, name: "Bleu Blanc Cœur",                                                         type: 'Label'},
            { id: 19108, name: "Charte du Progrès Nutritionel (manger bouger)",                           type: 'Label'},
            { id: 19109, name: "Spécialité Traditionnelle Garantie",                                      type: 'Label'},
            { id: 19110, name: "Marine Stewardship Council",                                              type: 'Label'},
            { id: 19111, name: "Aquaculture Stewardship Council",                                         type: 'Label'},
            { id: 19112, name: "Rainforest Alliance",                                                     type: 'Label'},
            { id: 19113, name: "Saveur en Or",                                                            type: 'Label'},
            { id: 19114, name: "Eco-Label",                                                               type: 'Label'},
            { id: 19121, name: "Max Havelaar",                                                            type: 'Label'},
            { id: 19122, name: "Produit Certifié",                                                        type: 'Label'},
            { id: 19122, name: "Label Produit Certifié",                                                  type: 'Label'},
            { id: 19123, name: "Marquage CE",                                                             type: 'Label'},
            { id: 19124, name: "Marquage métrologique",                                                   type: 'Label'},
            { id: 19125, name: "Label éco-emballage",                                                     type: 'Label'},
            { id: 19126, name: "Label Saveur de l'année",                                                 type: 'Label'},
            { id: 19127, name: "Label papier recyclé",                                                    type: 'Label'},
            { id: 19128, name: "Label Blauer Engel",                                                      type: 'Label'},
            { id: 19129, name: "Label Forest Stewardship Council",                                        type: 'Label'},
            { id: 19130, name: "Symbole recyclable",                                                      type: 'Label'},
            { id: 19131, name: "Emballage en acier recyclable",                                           type: 'Label'},
            { id: 19132, name: "Label Energy Star",                                                       type: 'Label'},
            { id: 19133, name: "Logo femme enceinte",                                                     type: 'Label'},
            { id: 19134, name: "Label RADURA",                                                            type: 'Label'},
            { id: 19135, name: "Emballage en aluminium recyclable",                                       type: 'Label'},
            { id: 19137, name: "Emballage en carton ondulé recyclable",                                   type: 'Label'},
            { id: 19138, name: "Emballage en carton ondulé recyclé",                                      type: 'Label'},
            { id: 19139, name: "Label RESY",                                                              type: 'Label'},
            { id: 19140, name: "Emballage en Polyéthylène Teraphtalate",                                  type: 'Label'},
            { id: 19141, name: "Emballage en Polyéthylène haute densité",                                 type: 'Label'},
            { id: 19142, name: "Emballage en Polychlorure de Vinyle",                                     type: 'Label'},
            { id: 19143, name: "Emballage en Polyéthylène basse densité",                                 type: 'Label'},
            { id: 19144, name: "Emballage en Polypropylène",                                              type: 'Label'},
            { id: 19145, name: "Emballage en Polystyrène Expansé",                                        type: 'Label'},
            { id: 19146, name: "Produit exonéré d'écotaxe",                                               type: 'Label'},
            { id: 19147, name: "Emballage consigné",                                                      type: 'Label'},
            { id: 19148, name: "Emballage à jeter à la poubelle",                                         type: 'Label'},
            { id: 19149, name: "Label protège la couche d'ozone",                                         type: 'Label'},
            { id: 19150, name: "Label pour le contact alimentaire",                                       type: 'Label'},
            { id: 19151, name: "Label veau fermier élevé sous sa mère",                                   type: 'Label'},
            { id: 19152, name: "Label 1% pour la planète",                                                type: 'Label'},
            { id: 19153, name: "Label Agri-Confiance",                                                    type: 'Label'},
            { id: 19154, name: "Label aquaculture de nos régions",                                        type: 'Label'},
            { id: 19155, name: "Label Ecocert",                                                           type: 'Label'},
            { id: 19156, name: "Label Main dans la Main",                                                 type: 'Label'},
            { id: 19157, name: "Label Naturland",                                                         type: 'Label'},
            { id: 19158, name: "Label Pavillon France",                                                   type: 'Label'},
            { id: 19159, name: "Label Roundtable on Sustanaible Palm Oil",                                type: 'Label'},
            { id: 19160, name: "Label Soil Association",                                                  type: 'Label'},
            { id: 19161, name: "Label Vignerons en Développement Durable",                                type: 'Label'},
            { id: 19162, name: "Label Ensemble pour plus de sens",                                        type: 'Label'},
            { id: 19163, name: "Label Fair Flower Fair Plants",                                           type: 'Label'},
            { id: 19164, name: "Label STEP",                                                              type: 'Label'},
            { id: 19165, name: "Label MINGA",                                                             type: 'Label'},
            { id: 19166, name: "Label Produit de l'année",                                                type: 'Label'},
            { id: 19167, name: "Label Equitable Solidaire Responsable",                                   type: 'Label'},
            { id: 19168, name: "Label NF Environnement",                                                  type: 'Label'},
            { id: 19169, name: "Label Atout Certifié Qualité",                                            type: 'Label'},
            { id: 19170, name: "Label Critères Qualité Certifiés",                                        type: 'Label'},
            { id: 19171, name: "Label USDA Organic",                                                      type: 'Label'},
            { id: 10055, name: "Label Cosmétique Bio",                                                    type: 'Label'},
            { id: 10064, name: "Label Vegan",                                                             type: 'Label'},
            { id: 10262, name: "logo Alcool j'achète pas à moins de 18 ans",                              type: 'Label'},
            { id: 10265, name: "Label Approuvé par les médecins allergologues de l'ARCAA",                type: 'Label'},
            { id: 10321, name: "Label Blason Prestige",                                                   type: 'Label'},
            { id: 10326, name: "Label Agneau St George",                                                  type: 'Label'},
            { id: 10327, name: "Charte des bonnes pratiques d'élevage",                                   type: 'Label'},
            { id: 10328, name: "Label Fleur de Limousine",                                                type: 'Label'},
            { id: 10329, name: "Label Filière Qualité Carrefour",                                         type: 'Label'},
            { id: 10330, name: "Label Gourmet Naturel",                                                   type: 'Label'},
            { id: 10331, name: "Label Bœuf de Charolles",                                                 type: 'Label'},
            { id: 10332, name: "Label Sans Gluten ADFDIAG",                                               type: 'Label'},
            { id: 10333, name: "Label Éleveurs de Champagne-Ardennes",                                    type: 'Label'},
            { id: 10334, name: "Label Bovillage",                                                         type: 'Label'},
            { id: 10335, name: "Label Bœuf fermier de l'Aubrac",                                          type: 'Label'},
            { id: 10336, name: "Label Charoluxe",                                                         type: 'Label'},
            { id: 10337, name: "Label race à viande",                                                     type: 'Label'},
            { id: 10338, name: "Label Saveur Occitane",                                                   type: 'Label'},
            { id: 10339, name: "Label Terroir Charolais",                                                 type: 'Label'},
            { id: 10340, name: "Label Qualivet Filière Non OGM",                                          type: 'Label'},
            { id: 10341, name: "Label Qualité Limousine",                                                 type: 'Label'},
            { id: 10342, name: "Concours Général Agricole Or",                                            type: 'Label'},
            { id: 10343, name: "Concours Général Agricole Argent",                                        type: 'Label'},
            { id: 10344, name: "Concours Général Agricole Bronze",                                        type: 'Label'},
            { id: 10345, name: "Sélection Guide Hachette",                                                type: 'Label'},
            { id: 18935, name: "Dénomination d'Origine Protégée",                                         type: 'Label'},
            { id: 19114, name: "Label Eco-Label",                                                         type: 'Label'},
            { id: 10347, name: "Œuf pondu en France",                                                     type: 'Label'},
            { id: 10419, name: "Label IFFO RS assured",                                                   type: 'Label'},
            { id: 10431, name: "Label Sustainable Fisheries Partnership",                                 type: 'Label'}
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
            Campaign: abstractRepository(Campaign, $$sdkCampaign, $$cacheManager, $q, [], null),
            CommonUnit: abstractRepository(CommonUnit, $$sdkCrud, $$cacheManager, $q, commonUnits, addTextFrom('name')),
            Concept: abstractRepository(Concept, $$sdkCrud, $$cacheManager, $q, concepts, addTextFrom('name')),
            Organization: abstractRepository(Organization, $$sdkAuth, $$cacheManager, $q, [], addTextFrom('name')),
            Placement: abstractRepository(Placement, $$sdkCampaign, $$cacheManager, $q, [], addTextFrom('name')),
            Product: abstractRepository(Product, $$sdkCrud, $$cacheManager, $q, [], addTextFrom('nameLegal')),
            ProductNutritionalQuantity: abstractRepository(ProductNutritionalQuantity, $$sdkCrud, $$cacheManager, $q, [], null),
            ProductStandardQuantity: abstractRepository(ProductStandardQuantity, $$sdkCrud, $$cacheManager, $q, [], null),
            ProductInShopSegment: abstractRepository(ProductInShopSegment, $$sdkCrud, $$cacheManager, $q, [], null),
            ProductInShop: abstractRepository(ProductInShop, $$sdkCrud, $$cacheManager, $q, [], null),
            Shop: abstractRepository(Shop, $$sdkCrud, $$cacheManager, $q, [], addTextFrom('name')),
            User: abstractRepository(User, $$sdkAuth, $$cacheManager, $q, [], null),
            Website: abstractRepository(Website, $$sdkCrud, $$cacheManager, $q, [], addTextFrom('name'))
        };

        var repository = function (which) {
            return repositorys[which];
        };

        return {
            repository: repository
        };
}]);
