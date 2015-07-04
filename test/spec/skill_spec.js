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

describe('Skill', function () {
  var Skill, html_skill, css_skill;
  jsdom();
  before(function (done) {
    requirejs(['scripts/Skill'], function (Skill_Class) {
      Skill = Skill_Class;
      done();
    });
  });
  html_skill = JSON.parse(skill).skills[0];
  css_skill = JSON.parse(skill).skills[1];

  describe('Parse Test', function () {
    it('should parse html skill tree', function () {
      var _skill = new Skill(html_skill);
      _skill.id.should.equal(1);
      _skill.hasPoints().should.equal(false);
      _skill.hasMaxPoints().should.equal(false);
      _skill.hasDependencies().should.equal(false);
      _skill.hasMultiplePoints().should.equal(false);
      _skill.canAddPoints().should.equal(true);
      _skill.canRemovePoints().should.equal(false);
      _skill.talentSummary().should.equal('');
      _skill.helpMessage().should.equal('点击添加技能点');
    });

    it('should parse books & links', function () {
      var _skill = new Skill(html_skill);
      _skill.links[0].label.should.equal('无处不在的html');
      _skill.links[0].url.should.equal('http://www.phodal.com/blog/be-a-geek-chapter-1-anywhere-html/');
    });
  });

  describe('Skill Points Test', function () {
    it('should can not add point after add 2 points', function () {
      var _skill = new Skill(html_skill);
      _skill.addPoint();
      _skill.addPoint();
      _skill.canAddPoints().should.equal(false);
      _skill.canRemovePoints().should.equal(true);
    });
  });

  describe('Skill Help Message Test', function () {
    it('should return correct help message', function () {
      var _skill = new Skill(css_skill);
      _skill.id.should.equal(2);
      _skill.hasDependencies().should.equal(false);
      _skill.helpMessage().should.equal('点击添加技能点');
    });
    it('should return empty help message', function () {
      var _skill = new Skill(css_skill);
      _skill.addPoint();
      _skill.addPoint();
      _skill.helpMessage().should.equal('');
    });
  });

  describe('Skill Rank Description Test', function () {
    it('should return current description', function () {
      var _skill = new Skill(css_skill);
      _skill.addPoint();
      _skill.currentRankDescription().should.equal('熟悉基础CSS的格式和CSS盒模式');
    });
  });
});
