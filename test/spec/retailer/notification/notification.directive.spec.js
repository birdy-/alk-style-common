'use strict';

describe('[alkNotification] It', function () {

  beforeEach(module('jDashboardFluxApp'));
  beforeEach(module('alkDashboardFluxTemplates'));

  var alkNotification, $compile, $rootScope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));

  var notifications = [
    {
      notification: { "event": { "user_id": 187, "timestamp": 1416408786, "brandName": "Nestlé", "type": "BrandClaimCreated" } },
      expectedHtmls: [
        'Nous avons bien reçu votre demande pour la marque : <strong class="ng-binding">Nestlé</strong>. Nous étudions votre demande et revenons vers vous dans les plus brefs délais.'
      ]
    },
    {
      notification: { "event": { "user_id": 187, "timestamp": 1416408786, "brandName": "Nestlé", "type": "BrandClaimAccepted" } },
      expectedHtmls: [
        'Votre demande pour la marque <strong class="ng-binding">Nestlé</strong> a été acceptée. Rendez-vous sur <a href="/#/maker/brand">la page de vos marques</a> pour la gérer !'
      ]
    },
    {
      notification: { "event": { "user_id": 187, "timestamp": 1416408786, "brandName": "Nestlé", "type": "BrandClaimRefused" } },
      expectedHtmls: [
        'Votre demande pour la marque <strong class="ng-binding">Nestlé</strong> a été refusée.',
        '<a href="mailto:support@alkemics.com">Contactez-notre support</a>'
      ]
    },
    {
      notification: { "event": { "user_id": 187, "timestamp": 1416408786, "brandName": "Nestlé", "type": "BrandClaimErrored" } },
      expectedHtmls: [
        'Une erreur est survenue lors de votre demande pour la marque <strong class="ng-binding">Nestlé</strong>.',
        '<a href="mailto:support@alkemics.com">contactez-notre support</a>'
      ]
    }
  ]

  for (var notificationIndex in notifications) {
    var notificationItem = angular.copy(notifications[notificationIndex]);
    var notification = notificationItem.notification;

    it('(' + notification.event.type + ') should replace the body with appropriate content', function () {
      $rootScope.notification = notification;
      var element = $compile('<div alk-notification="notification"></div>')($rootScope);

      $rootScope.$digest();
      for (var expectedIndex in notificationItem.expectedHtmls) {
        expect(element.html())
        .toContain(notificationItem.expectedHtmls[expectedIndex]);
      }
    });
  }
});
