'use strict';

angular.module('jDashboardFluxApp').factory('$$recommendedDailyAllowance',function(){
    //Values taken from http://fr.wikipedia.org/wiki/Apports_journaliers_recommandés
    return {
      //Déclaration nutritionnelle
      //Energie, kJ
      19195: 8400,
      //Energie, kCal
      19196: 2000,
      //Matieres grasses, gr
      19058: 70,
      //Acides gras saturés, gr
      19059: 20,
      //Glucides, gr
      19067: 260,
      //Sucres, gr
      19068: 90,
      //Protéines, gr
      19072: 50,
      //Fibres alimentaires, gr : pas d'AJR officiel, mais une valeur courante :
      //http://www.fondation-louisbonduelle.org/france/fr/connaitre-les-legumes/sante-et-nutriments/fibres-3.html#axzz3aUhg0LG4
      19071: 25,
      //Sel, gr
      19073: 6,

      //Vitamines
      //Values are written a/b, where a is the value in its common unit
      //A
      18978:800/1000000,
      //B1
      18739:1.1/1000,
      //B2
      18740:1.4/1000,
      //B3
      18741:16/1000,
      //B5
      18744:6/1000,
      //B6
      18983:1.4/1000,
      //B8
      18743:50/1000000,
      //B9
      18742:200/1000000,
      //B12
      18985:2.5/1000000,
      //C
      18982:80/1000,
      //D
      18979:5/1000000,
      //E
      18980:12/1000,
      //K
      18981:75/1000000,

      //Minéraux et métaux
      //Calcium
      18989:800/1000,
      //Fer
      18992:14/1000,
      //Iode
      19000:150/1000000,
      //Magnésium
      18991:375/1000,
      //Phosphore
      18990:700/1000,
      //Sélénium
      18997:55/1000000,
      //Zinc
      18993:10/1000,
      //Potassium
      18987:2000/1000,
      //Chlorure

      //Cuivre
      18994:1/1000,
      //Manganèse
      18995:2/1000,
      //Fluorure
      18996:3.5/1000,
      //Chrome
      18998:40/1000000,
      //Molybdène
      18999:50/1000000
    };
});
