define([], function () {
	'use strict';
	return function (_e) {
		var e = _e || {};
		var self = this;

		self.label = e.label || (e.url || '了解详细');
		self.url = e.url || 'javascript:void(0)';
	};
});
