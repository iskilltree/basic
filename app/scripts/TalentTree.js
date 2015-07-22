define(['lib/knockout', 'scripts/Skill', 'scripts/Utils'],
	function (ko, Skill, Utils) {
		'use strict';
		return function (_e) {
			var e = _e || {};
			var self = this;

			self.skills = ko.observableArray(ko.utils.arrayMap(e.skills, function (skill) {
				return new Skill(skill);
			}));

			ko.utils.arrayForEach(e.skills, function (skill) {
				if (skill.dependsOn) {
					var dependent = Utils.getSkillById(self.skills(), skill.id);
					ko.utils.arrayForEach(skill.dependsOn, function (dependencyId) {
						var dependency = Utils.getSkillById(self.skills(), dependencyId);
						dependent.dependencies.push(dependency);
						dependency.dependents.push(dependent);
					});
				}
			});
		};
	});
