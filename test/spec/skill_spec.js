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
});
