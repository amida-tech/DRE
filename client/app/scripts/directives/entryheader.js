'use strict';

/**
 * @ngdoc directive
 * @name phrPrototypeApp.directive:entryHeader
 * @description
 * # entry header information
 */
angular.module('phrPrototypeApp')
    .directive('entryHeader', function (format) {
        return {
            template: '<div class="col-sm-6">\
        <h4 class="text-left">{{entryTitle}}</h4>\
        <h5 class="text-left">{{entrySubTitleOne}}</h5>\
        <h5 class="text-left">{{entrySubTitleTwo}}</h5>\
        </div>',
            restrict: 'EA',
            link: function postLink(scope, element, attrs) {
                scope.entryTitle = "";
                scope.entrySubTitleOne = "";
                scope.entrySubTitleTwo = "";

                switch (scope.type) {

                case 'allergies':
                    if (scope.recordEntry.metadata.displayDate) {
                        scope.entrySubTitleTwo = scope.recordEntry.metadata.displayDate;
                    }
                    if (scope.entryData.observation) {
                        if (scope.entryData.observation.allergen && scope.entryData.observation.allergen.name) {
                            scope.entryTitle = scope.entryData.observation.allergen.name;
                        }
                    }
                    if (scope.entryData.observation.reactions) {
                        angular.forEach(scope.entryData.observation.reactions, function (reactionObj, index) {
                            if (index === 0) {
                                scope.entrySubTitleOne = scope.entrySubTitleOne + reactionObj.reaction.name;
                            } else {
                                scope.entrySubTitleOne = scope.entrySubTitleOne + ', ' + reactionObj.reaction.name;

                            }
                        });
                    }
                    break;
                case 'encounters':
                    if (scope.entryData.encounter && scope.entryData.encounter.name) {
                        scope.entryTitle = scope.entryData.encounter.name;
                    }
                    if (scope.entryData.locations && scope.entryData.locations[0].name) {
                        scope.entrySubTitleOne = scope.entryData.locations[0].name;
                    }
                    if (scope.recordEntry.metadata.displayDate) {
                        scope.entrySubTitleTwo = scope.recordEntry.metadata.displayDate;
                    }
                    break;
                case 'immunizations':
                    if (scope.entryData.product && scope.entryData.product.product && scope.entryData.product.product.name) {
                        scope.entryTitle = scope.entryData.product.product.name;
                    }
                    if (scope.recordEntry.metadata.displayDate) {
                        scope.entrySubTitleOne = scope.recordEntry.metadata.displayDate;
                    }
                    break;
                case 'medications':
                    if (scope.entryData.product && scope.entryData.product.product && scope.entryData.product.product.name) {
                        scope.entryTitle = scope.entryData.product.product.name;
                    }
                    if (scope.entryData.administration && scope.entryData.administration.route && scope.entryData.administration.route.name) {
                        scope.entrySubTitleOne = scope.entryData.administration.route.name;
                    }
                    // if (scope.recordEntry.metadata.displayDate) {
                    //     scope.entrySubTitleTwo = scope.recordEntry.metadata.displayDate;
                    // }
                    if (scope.entryData.administration && scope.entryData.administration.dose && scope.entryData.administration.dose.value && scope.entryData.administration.dose.unit) {
                        scope.entrySubTitleTwo = " - " + scope.entryData.administration.dose.value + " " + scope.entryData.administration.dose.unit;
                    }
                    break;
                case 'conditions':
                    if (scope.entryData.problem && scope.entryData.problem.code && scope.entryData.problem.code.name) {
                        scope.entryTitle = scope.entryData.problem.code.name;
                    }
                    if (scope.recordEntry.metadata.displayDate) {
                        scope.entrySubTitleOne = scope.recordEntry.metadata.displayDate;
                    }
                    break;
                case 'procedures':
                    if (scope.entryData.procedure && scope.entryData.procedure.name) {
                        scope.entryTitle = scope.entryData.procedure.name;
                    }
                    // if (scope.entryData.status) {
                    //     scope.entrySubTitleOne = scope.entryData.status;
                    // }
                    if (scope.recordEntry.metadata.displayDate) {
                        scope.entrySubTitleOne = scope.recordEntry.metadata.displayDate;
                    }
                    break;
                case 'vitals':
                    if (scope.entryData.vital && scope.entryData.vital.name) {
                        scope.entryTitle = scope.entryData.vital.name;
                    }
                    var quantityUnit = "";
                    if (scope.entryData.unit) {
                        if (scope.entryData.unit === "[in_i]" || scope.entryData.unit === "[in_us]") {
                            quantityUnit = "inches";
                        } else if (scope.entryData.unit === "[lb_av]") {
                            quantityUnit = "lbs";
                        } else if (scope.entryData.unit === "mm[Hg]") {
                            quantityUnit = "mm";
                        } else {
                            quantityUnit = scope.entryData.unit;
                        }
                        if (scope.entryData.value && scope.entryData.value + " " + quantityUnit) {
                            scope.entrySubTitleOne = scope.entryData.value + " " + quantityUnit;
                        }
                    }
                    if (scope.recordEntry.metadata.displayDate) {
                        scope.entrySubTitleTwo = scope.recordEntry.metadata.displayDate;
                    }
                    break;
                case 'results':
                    if (scope.entryData.result_set && scope.entryData.result_set.name) {
                        scope.entryTitle = scope.entryData.result_set.name;
                    }
                    if (scope.recordEntry.metadata.displayDate) {
                        scope.entrySubTitleOne = scope.recordEntry.metadata.displayDate;
                    }
                    break;
                case 'social':
                    if (scope.entryData.value) {
                        scope.entryTitle = scope.entryData.code.name;
                    }
                    if (scope.entryData.code && scope.entryData.code.name) {
                        scope.entrySubTitleOne = scope.entryData.value;
                    }
                    if (scope.recordEntry.metadata.displayDate) {
                        scope.entrySubTitleTwo = scope.recordEntry.metadata.displayDate;
                    }
                    break;
                case 'claims':
                    if (scope.entryData.payer[0]) {
                        scope.entryTitle = scope.entryData.payer[0];
                    }
                    if (scope.recordEntry.metadata.displayDate) {
                        scope.entrySubTitleOne = scope.recordEntry.metadata.displayDate;
                    }
                    break;
                case 'insurance':
                    //console.log("INSURANCE", scope.entryData, scope.recordEntry.metadata);
                    if (scope.entryData.policy.insurance.performer.organization[0].name[0]) {
                        //scope.entryTitle = scope.entryData.name;
                        scope.entryTitle = scope.entryData.policy.insurance.performer.organization[0].name[0];
                    }
                    if (scope.entryData.participant.date_time) {
                        scope.entrySubTitleOne = scope.recordEntry.metadata.displayDate;
                    }
                    break;
                }

            }
        };
    });
