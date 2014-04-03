angular.module('bt.dropdown', [])
	.directive('btDropdown', function() {
		return {
			restrict: 'A',
			link: function(scope, elem, attr) {
				elem.dropdown();
			}
		};
	});