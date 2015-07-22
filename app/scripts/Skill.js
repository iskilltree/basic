define(['lib/knockout', 'scripts/Utils'],
	function (ko, Utils) {
		'use strict';
		return function (_e) {
			var e = _e || {};
			var self = this;

			self.id = e.id || 0;
			self.maxPoints = e.maxPoints || 1;
			self.points = ko.observable(e.points || 0);
			self.dependencies = ko.observableArray([]);
			self.dependents = ko.observableArray([]);
			self.rankDescriptions = e.rankDescriptions || [];

			//计算值
			self.hasDependencies = ko.computed(function () {
				return self.dependencies().length > 0;
			});
			self.dependenciesFulfilled = ko.computed(function () {
				var result = true;
				ko.utils.arrayForEach(self.dependencies(), function (item) {
					if (!item.hasPoints()) {
						result = false;
					}
				});
				return result;
			});
			self.dependentsUsed = ko.computed(function () {
				var result = false;
				ko.utils.arrayForEach(self.dependents(), function (item) {
					if (item.hasPoints()) {
						result = true;
					}
				});
				return result;
			});

			self.hasPoints = ko.computed(function () {
				return self.points() > 0;
			});
			self.hasMultiplePoints = ko.computed(function () {
				return self.points() > 1;
			});
			self.hasMaxPoints = ko.computed(function () {
				return self.points() >= self.maxPoints;
			});
			self.canAddPoints = ko.computed(function () {
				return self.dependenciesFulfilled() && !self.hasMaxPoints();
			});
			self.canRemovePoints = ko.computed(function () {
				return (self.dependentsUsed() && self.hasMultiplePoints()) || (!self.dependentsUsed() && self.hasPoints());
			});

			self.addPoint = function () {
				if (self.canAddPoints()) {
					self.points(self.points() + 1);
				}
			};
			self.removePoint = function () {
				if (self.canRemovePoints()) {
					self.points(self.points() - 1);
				}
			};
		};
	});
