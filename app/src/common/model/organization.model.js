'use strict';

var Organization = function () {
    this.fromJson = function (json) {
        for (var key in json) {
            this[key] = json[key];
        }
        return this;
    };
    this._type = 'Organization';
};
Organization._type = 'Organization';

Organization.getProductSegmentRoot = function (organization) {
    var _ = window._;
    return _.find(organization.ownsProductSegment, function (segment) {
        if (_.indexOf(segment.permissions, 'root') > -1) { return true;}
        return false;
    });
};
