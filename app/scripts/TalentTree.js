define(['lib/knockout', 'scripts/Link', 'scripts/Skill', 'scripts/Utils'],
	function (ko, Link, Skill, Utils) {
		'use strict';
		return function (_e) {
			var e = _e || {};
			var self = this;

			//技能列表
			self.skills = ko.observableArray(ko.utils.arrayMap(e.skills, function (item) {
				return new Skill(item);
			}));

			//Wire up dependency references
			ko.utils.arrayForEach(e.skills, function (item) {
				if (item.dependsOn) {
					var dependent = Utils.getSkillById(self.skills(), item.id);
					ko.utils.arrayForEach(item.dependsOn, function (dependencyId) {
						var dependency = Utils.getSkillById(self.skills(), dependencyId);
						dependent.dependencies.push(dependency);
						dependency.dependents.push(dependent);
					});
				}
			});

			self.noPointsSpent = ko.computed(function () {
				return !Boolean(ko.utils.arrayFirst(self.skills(), function (skill) {
					return (skill.points() > 0);
				}));
			});
		};
	});
