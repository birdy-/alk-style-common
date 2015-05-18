'use strict'

angular.module('jDashboardFluxApp').factory('$$ajr',function(){
    //Values taken from http://fr.wikipedia.org/wiki/Apports_journaliers_recommandés
    return {
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
      19073: 6
    }
});

