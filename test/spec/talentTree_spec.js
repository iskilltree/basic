/* global describe, it */

var requirejs = require("requirejs");
var assert = require("assert");
var should = require("should");
var skill = require('fs').readFileSync('./app/data/web.json', 'utf8');
var jsdom = require('mocha-jsdom');

requirejs.config({
  baseUrl: 'app/',
  nodeRequire: require
});

describe('Talent Tree', function () {
  var TalentTree, html_skill, all_skills;
  jsdom();

  before(function (done) {
    requirejs(['scripts/TalentTree'], function (TalentTree_Class) {
      TalentTree = TalentTree_Class;
      done();
    });
  });
  html_skill = JSON.parse(skill).skills[0];
  all_skills = JSON.parse(skill);

  it('should correctly call skill method', function () {
    var talent = new TalentTree(all_skills);
    talent.skills()[0].id.should.equal(html_skill.id);
  });
});
