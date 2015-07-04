/* global describe, it */

var requirejs = require("requirejs");
var assert = require("assert");
var should = require("should");
requirejs.config({
  baseUrl: 'app/',
  nodeRequire: require
});

describe('Link', function () {
  var Book, Link;
  before(function (done) {
    requirejs(['scripts/Link'], function (Link_Class) {
      Link = Link_Class;
      done();
    });
  });

  describe('Link Test', function () {
    it('should return link label & url', function () {
      var label = 'Head First HTML与CSS';
      var url = 'http://www.phodal.com';
      var link = {
        label: label,
        url: url
      };

      var _link = new Link(link);
      _link.label.should.equal(label);
      _link.url.should.equal(url);
    });
  });
});
