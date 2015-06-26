define(['lib/knockout', 'scripts/Book', 'scripts/Link', 'scripts/Skill', 'scripts/Utils'],
  function (ko, Book, Link, Skill, Utils) {
    'use strict';
    var TalentTree = function (_e) {
      var e = _e || {};
      var self = this;


      var hashDelimeter = '_';

      var numPortraits = 1;

      //Mega skill list population
      self.skills = ko.observableArray(ko.utils.arrayMap(e.skills, function (item) {
        return new Skill(item);
      }));

      //Wire up dependency references
      function handleDependencies() {
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
      }

      handleDependencies();

      //Avatar properties
      self.avatarName = ko.observable('Name');
      //level = total of all points spent
      self.level = ko.computed(function () {
        var totalSkillPoints = 0;
        ko.utils.arrayForEach(self.skills(), function (skill) {
          totalSkillPoints += skill.points();
        });
        var totalLevel = totalSkillPoints + 1;
        return totalLevel;
      });
      self.noPointsSpent = ko.computed(function () {
        return !Boolean(ko.utils.arrayFirst(self.skills(), function (skill) {
          return (skill.points() > 0);
        }));
      });
      self.stats = ko.computed(function () {
        var totals = {
          '魅力': 9,
          '灵巧': 9,
          '坚韧': 9,
          '智力': 9,
          '力量': 9,
          '智慧': 9
        };
        //get all the skill name/value pairs and add/create them, using the stat name as the index
        ko.utils.arrayForEach(self.skills(), function (skill) {
          var p = skill.points();
          if (p > 0) {
            ko.utils.arrayForEach(skill.stats, function (stat) {
              var total = totals[stat.title] || 0;
              total += stat.value * p; //multiply the stat value by the points spent on the skill
              totals[stat.title] = total;
            });
          }
        });
        //Translate into a view-friendly array
        var result = [];
        for (var statName in totals) {
          result.push({
            title: statName,
            value: totals[statName]
          });
        }
        return result;
      });
      //String of unique characteristics, comma delimeted
      self.talentSummary = ko.computed(function () {
        var a = [];
        ko.utils.arrayForEach(self.skills(), function (skill) {
          if (skill.hasPoints()) {
            a = a.concat(skill.talents);
          }
        });
        return a.join(', ');
      });
      //Portrait stuff
      self.portrait = ko.observable(Math.ceil(Math.random() * numPortraits));
      self.portraitURL = ko.computed(function () {
        if(self.avatarName() !== 'Name') {
          return 'https://avatars.githubusercontent.com/' + self.avatarName();
        } else{
          return 'app/images/portraits/portrait-' + self.portrait() + '.jpg';
        }
      });
      self.choosePreviousPortrait = function () {
        var n = self.portrait() - 1;
        if (n < 1) {
          n = numPortraits;
        }
        self.portrait(n);
      };
      self.chooseNextPortrait = function () {
        var n = self.portrait() + 1;
        if (n > numPortraits) {
          n = 1;
        }
        self.portrait(n);
      };

      //Utility functions
      self.newbMode = function () {
        ko.utils.arrayForEach(self.skills(), function (skill) {
          skill.points(0);
        });
      };
    };

    return TalentTree;
  });