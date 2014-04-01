angular.module('bt.tooltip', [])
	.directive('btTooltip', function() {
		return {
			restrict: 'A',
			link: function(scope, elem, attr) {
				elem.tooltip({
					title: attr.btTooltip
				});
			}
		};
	});