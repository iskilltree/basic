define(['lib/knockout', 'scripts/Link', 'scripts/Utils'],
	function (ko, Link, Utils) {
		'use strict';
		return function (_e) {
			var e = _e || {};
			var self = this;

			self.id = e.id || 0;
			self.title = e.title || 'Unknown Skill';
			self.description = e.description;
			self.maxPoints = e.maxPoints || 1;
			self.points = ko.observable(e.points || 0);
			self.links = ko.utils.arrayMap(e.links, function (item) {
				return new Link(item);
			});
			self.dependencies = ko.observableArray([]);
			self.dependents = ko.observableArray([]);
			self.stats = e.stats || [];
			self.rankDescriptions = e.rankDescriptions || [];
			self.talents = e.talents || [];

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

			self.helpMessage = ko.computed(function () {
				if (!self.dependenciesFulfilled()) {
					var s = [];
					ko.utils.arrayForEach(self.dependencies(), function (item) {
						if (!item.hasMaxPoints()) {
							s.push(item.title);
						}
					});
					return '学习 ' + Utils.prettyJoin(s) + ' 才能解锁.';
				} else if (self.canAddPoints()) {
					return '点击添加技能点';
				}
				return '';
			});

			self.currentRankDescription = ko.computed(function () {
				return self.rankDescriptions[self.points() - 1];
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
