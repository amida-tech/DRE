'use strict';

angular.module('phrPrototypeApp')
    .controller('MedicationEntryModalCtrl', function ($scope, $modalInstance, $route, medapi, npiapi, medications, dataservice, format) {
        $scope.entryStep = 0;
        $scope.prescriberSearchActive = false;
        $scope.drugSearchActive = false;
        $scope.saveMedication = saveMedication;
        $scope.enteredMedication = {};
        $scope.saveMedicationStatus = null;
        $scope.pCurrentMedRadio = true;

        $scope.previousStep = function previousStep() {
            if ($scope.entryStep === 3 && $scope.medSearchType !== 'prescription') {
                $scope.entryStep = 1;
            } else {
                $scope.entryStep--;
            }
        };

        function enteredObject(callback) {

            var pmed_metadata = {};
            var pmed_product = {};
            var pmed_lowdate = {};
            var pmed_highdate = {};
            console.log("entering object...");
            if ($scope.medSearchType === 'prescription') {
                console.log("...was a prescription");
                $scope.enteredMedication = {};
                pmed_metadata = {
                    "patient_entered": true,
                    "is_prescription": true,
                    "attribution": [{
                        merged: new Date(),
                        merge_reason: "new"
                    }]
                };
                _.deepSet($scope.enteredMedication, 'med_metadata', pmed_metadata);
                if ($scope.selectedImage) {
                    _.deepSet($scope.enteredMedication, 'med_metadata.image', $scope.selectedImage);
                }

                if ($scope.pWhy) {
                    _.deepSet($scope.enteredMedication, 'sig', $scope.pWhy);
                }

                pmed_product = {
                    "name": $scope.selectedDrug.synonym,
                    "code": $scope.selectedDrug.rxcui,
                    "code_system_name": 'RxNorm'
                };
                _.deepSet($scope.enteredMedication, 'product.identifiers[0].rxcui', $scope.selectedDrug.rxcui);
                _.deepSet($scope.enteredMedication, 'product.product', pmed_product);

                _.deepSet($scope.enteredMedication, 'performer.address[0].street_lines[0]', $scope.selectedPrescriber.practice_address.address_line);
                _.deepSet($scope.enteredMedication, 'performer.address[0].city', $scope.selectedPrescriber.practice_address.city);
                _.deepSet($scope.enteredMedication, 'performer.address[0].state', $scope.selectedPrescriber.practice_address.state);
                _.deepSet($scope.enteredMedication, 'performer.name[0].first', $scope.selectedPrescriber.first_name);
                _.deepSet($scope.enteredMedication, 'performer.name[0].last', $scope.selectedPrescriber.last_name);

                if ($scope.pStart) {
                    pmed_lowdate = {
                        "date": moment($scope.pStart).format('YYYY-MM-DD') + 'T00:00:00.000Z',
                        "precision": 'day'
                    };
                    _.deepSet($scope.enteredMedication, 'date_time.low', pmed_lowdate);
                }
                if ($scope.pCurrentMedRadio) {
                    pmed_highdate = {
                        "date": moment($scope.pLast).format('YYYY-MM-DD') + 'T00:00:00.000Z',
                        "precision": 'day'
                    };
                    _.deepSet($scope.enteredMedication, 'date_time.high', pmed_highdate);
                }
            } else {

                $scope.enteredMedication = {};
                pmed_metadata = {
                    "patient_entered": true,
                    "is_prescription": false,
                    "attribution": [{
                        merged: new Date(),
                        merge_reason: "new"
                    }]
                };
                _.deepSet($scope.enteredMedication, 'med_metadata', pmed_metadata);
                if ($scope.selectedImage) {
                    _.deepSet($scope.enteredMedication, 'med_metadata.image', $scope.selectedImage);
                }

                console.log($scope.pWhy);
                if ($scope.pWhy) {
                    _.deepSet($scope.enteredMedication, 'sig', $scope.pWhy);
                }

                pmed_product = {
                    "name": $scope.selectedDrug.synonym,
                    "code": $scope.selectedDrug.rxcui,
                    "code_system_name": 'RxNorm'
                };
                _.deepSet($scope.enteredMedication, 'product.identifiers[0].rxcui', $scope.selectedDrug.rxcui);
                _.deepSet($scope.enteredMedication, 'product.product', pmed_product);

                if ($scope.pStart) {
                    pmed_lowdate = {
                        "date": moment($scope.pStart).format('YYYY-MM-DD') + 'T00:00:00.000Z',
                        "precision": 'day'
                    };
                    _.deepSet($scope.enteredMedication, 'date_time.low', pmed_lowdate);
                }
                console.log("pCurrentMedRadio" + $scope.pCurrentMedRadio);
                if ($scope.pCurrentMedRadio) {
                    if ($scope.pLast) {
                        pmed_highdate = {
                            "date": moment($scope.pLast).format('YYYY-MM-DD') + 'T00:00:00.000Z',
                            "precision": 'day'
                        };
                    } else {
                        pmed_highdate = {
                            "date": moment().format('YYYY-MM-DD') + 'T00:00:00.000Z',
                            "precision": 'day'
                        };
                    }
                    _.deepSet($scope.enteredMedication, 'date_time.high', pmed_highdate);
                }

            }
            console.log("...entered Medication: ", $scope.enteredMedication);
            callback();
        }

        $scope.nextStep = function nextStep() {
            switch ($scope.entryStep) {
            case 1:
                if (!$scope.selectedDrug) {
                    $scope.drugError = "You must select a drug";
                } else {
                    if ($scope.medSearchType === 'prescription') {
                        $scope.entryStep = 2;
                    } else {
                        $scope.entryStep = 3;
                    }
                    medapi.findImages($scope.selectedDrug.rxcui, function (err, imageData) {
                        if (err) {
                            console.log("Err: " + err);
                        } else {
                            $scope.rximageResults = imageData;
                        }
                    });
                }
                break;
            case 2:
                if (!$scope.selectedPrescriber) {
                    $scope.prescriberError = "You must select a prescriber";
                } else {
                    $scope.entryStep = 3;
                }
                break;
            case 3:
                enteredObject(function () {
                    if ($scope.enteredMedication.date_time) {
                        format.formatDate($scope.enteredMedication.date_time.low);
                        if ($scope.enteredMedication.date_time.high) {
                            format.formatDate($scope.enteredMedication.date_time.high);
                        }
                    }
                    if ($scope.enteredMedication.performer) {
                        if ($scope.enteredMedication.performer.address) {
                            format.formatAddress($scope.enteredMedication.performer.address[0]);
                        }
                        if ($scope.enteredMedication.performer.name) {
                            format.formatName($scope.enteredMedication.performer.name[0]);
                        }
                    }
                    console.log($scope.enteredMedication);
                    $scope.medication = $scope.enteredMedication;
                    $scope.entryStep = 4;
                });
                break;
            default:
                break;
            }
        };

        function saveMedication() {
            medications.addMedication($scope.enteredMedication, function (err, results) {
                if (err) {
                    // Display an error in the med entry modal
                    $scope.saveMedicationStatus = 'error';
                } else {
                    // Display success in the med entry modal
                    $scope.saveMedicationStatus = 'success';
                    $scope.medReset();
                    $modalInstance.close();
                    dataservice.forceRefresh();
                    $route.reload();
                }
            });
        }
        $scope.drugSearch = function drugSearch(drugName) {
            $scope.drugSearchActive = true;
            console.log("drugname: " + drugName);
            if ($scope.selectedDrug) {
                $scope.selectedDrug = null;
            }
            if ($scope.rxnormResults) {
                $scope.rxnormResults = null;
            }
            if ($scope.rximagesResults) {
                $scope.rximagesResults = null;
            }
            $scope.pDrugName = drugName;
            $scope.drugError = null;
            $scope.drugWarning = null;
            $scope.drugSpelling = null;
            medapi.findRxNormGroup(drugName, function (err, data) {
                //console.log("rxnormgroup data: "+JSON.stringify(data));
                $scope.drugSearchActive = false;
                if (err) {
                    console.log("Err: " + err);
                } else {
                    if (data.drugGroup.conceptGroup === undefined || data.drugGroup.conceptGroup === null) {
                        //$scope.rxnormResults = "No match found";
                        medapi.findRxNormSpelling(drugName, function (err2, data2) {
                            if (err2) {
                                console.log("Err: " + err2);
                                $scope.drugError = "No matches found.  Please Try Something Else";
                            } else {
                                if (data2.suggestionGroup !== null) {
                                    if (data2.suggestionGroup.suggestionList !== null) {
                                        if (data2.suggestionGroup.suggestionList.suggestion !== null) {
                                            if (data2.suggestionGroup.suggestionList.suggestion.length > 0) {
                                                $scope.drugWarning = "No matches found... did you mean one of these: ";
                                                $scope.drugSpelling = data2.suggestionGroup.suggestionList.suggestion;
                                            } else {
                                                $scope.drugError = "No matches found.  Please Try Something Else";
                                            }
                                        } else {
                                            $scope.drugError = "No matches found.  Please Try Something Else";
                                        }
                                    } else {
                                        $scope.drugError = "No matches found.  Please Try Something Else";
                                    }
                                } else {
                                    $scope.drugError = "No matches found.  Please Try Something Else";
                                }
                            }
                        });
                    } else {
                        $scope.rxnormResults = data;
                        var drugCount = 0;
                        for (var j = 0; j < data.drugGroup.conceptGroup.length; j++) {
                            if (data.drugGroup.conceptGroup[j].conceptProperties) {
                                drugCount += data.drugGroup.conceptGroup[j].conceptProperties.length;
                            }
                        }
                        $scope.drugError = null;
                        $scope.drugCount = drugCount;
                    }
                }
            });
        };

        $scope.setSelectedDrug = function setSelectedDrug() {
            if (this.rxdrug.selected) {
                this.rxdrug.selected = false;
                $scope.selectedDrug = null;
            } else {
                if ($scope.rxnormResults.compiled !== null) {
                    for (var j = 0; j < $scope.rxnormResults.compiled.length; j++) {
                        $scope.rxnormResults.compiled[j].selected = false;
                    }
                }
                this.rxdrug.selected = true;
                $scope.selectedDrug = this.rxdrug;
            }
        };

        $scope.setSelectedPrescriber = function setSelectedPrescriber() {
            if (this.prescriber.selected) {
                this.prescriber.selected = false;
                $scope.selectedPrescriber = null;
            } else {
                for (var k = 0; k < $scope.prescriberResults.length; k++) {
                    $scope.prescriberResults[k].selected = false;
                }
                this.prescriber.selected = true;
                $scope.selectedPrescriber = this.prescriber;
            }
        };

        $scope.setSelectedImage = function setSelectedImage(rxImage) {
            if (rxImage.selected) {
                rxImage.selected = false;
                $scope.selectedImage = null;
            } else {
                for (var k = 0; k < $scope.rximageResults.nlmRxImages.length; k++) {
                    $scope.rximageResults.nlmRxImages[k].selected = false;
                }
                rxImage.selected = true;
                $scope.selectedImage = rxImage;
            }
        };

        $scope.prescriberSearch = function prescriberSearch(firstName, lastName, state) {
            $scope.prescriberSearchActive = true;
            $scope.prescriberResults = null;
            $scope.prescriberCount = null;
            $scope.prescriberError = null;
            var searchTest = false;
            var searchObj = {};
            $scope.selectedPrescriber = null;
            if (firstName) {
                _.deepSet(searchObj, 'name[0].first', firstName);
            }
            if (lastName) {
                _.deepSet(searchObj, 'name[0].last', lastName);
            }
            if (state) {
                _.deepSet(searchObj, 'address[0].state', state);
            }
            if (!_.isEmpty(searchObj)) {
                npiapi.findNPI(searchObj, function (err, data) {
                    $scope.prescriberSearchActive = false;
                    if (err) {
                        console.log("Martz err: " + err);
                        $scope.prescriberError = "No matches found, please try again";
                    } else {
                        if ((data.length >= 100) && (_.isUndefined(state))) {
                            $scope.prescriberError = "More than 100 matches found, please enter a state";
                        } else {
                            console.log("Martz success: " + JSON.stringify(data));
                            $scope.prescriberResults = data;
                            $scope.prescriberCount = data.length;
                            $scope.prescriberError = null;
                        }
                    }
                });
            }
        };

        $scope.initInfoSearch = function (sType) {
            if (sType === 'prescription') {
                $scope.medSearchType = 'prescription';
            } else {
                $scope.medSearchType = 'otc-supplement';
            }
            $scope.entryStep = 1;
        };

        $scope.medReset = function () {
            console.log("RESETTING MEDICATION ENTRY");
            $scope.prescriberResults = null;
            $scope.pFirstName = null;
            $scope.pLastName = null;
            $scope.pDrugName = null;
            $scope.selectedImage = null;
            $scope.pCurrentMedRadio = true;
            //$scope.openfdanameResults = null;
            $scope.rxnormResults = null;
            //$scope.medlineResults = null;
            $scope.rximageResults = null;
            //$scope.openfdacodeResults = null;
            $scope.selectedDrug = null;
            $scope.selectedPrescriber = null;
            $scope.drugError = null;
            $scope.drugWarning = null;
            $scope.prescriberError = null;
            $scope.entryStep = 0;
            $scope.pWhy = null;
            $scope.pOften = "";
            $scope.pLast = null;
            $scope.pCurrentMedRadio = null;
            $scope.pStart = null;
            $scope.drugSpelling = null;
        };

        $scope.close = function () {
            $scope.medReset();
            $modalInstance.dismiss('cancel');
        };

        // $scope.medReset();
    })
    .controller('MedicationUpdateModalCtrl', function ($scope, $modalInstance, $route, medication, medapi, npiapi, medications, dataservice, format) {
        $scope.medication = medication.data;
        $scope.selectedImage = null;
        console.log($scope.selectedImage);
        $scope.updateMedication = updateMedication;
        $scope.updateMedicationStatus = null;
        $scope.saveMed = {};

        if ($scope.medication.med_metadata.is_prescription) {
            $scope.medSearchType = 'prescription';
        } else {
            $scope.medSearchType = 'otc-supplement';
        }

        //populate ng-model 
        //date_time and current med toggle
        if ($scope.medication.date_time) {
            if ($scope.medication.date_time.low && !$scope.medication.date_time.high) {
                $scope.pCurrentMedRadio = true;
            } else {
                $scope.pCurrentMedRadio = false;
            }
            if ($scope.medication.date_time.low) {
                $scope.pStart = moment($scope.medication.date_time.low.date).toDate();
            }
            if ($scope.medication.date_time.high) {
                $scope.pLast = moment($scope.medication.date_time.high.date).toDate();
            }
        }

        // sig
        if ($scope.medication.sig) {
            $scope.pWhy = $scope.medication.sig;
        }

        // prescriber
        if ($scope.medication.performer) {
            $scope.pFirstName = $scope.medication.performer.name[0].first;
            $scope.pLastName = $scope.medication.performer.name[0].last;

            if ($scope.medication.performer.address[0] && $scope.medication.performer.address[0].state) {
                $scope.pState = $scope.medication.performer.address[0].state;
            }
        }

        // image
        if ($scope.medication.med_metadata.image) {
            $scope.selectedImage = $scope.medication.med_metadata.image;
        }

        $scope.initStuff = function () {
            console.log("init-ing stuff... " + $scope.medication.med_metadata.is_prescription);
            medapi.findImages($scope.medication.product.product.code, function (err, data) {
                $scope.medImages = data;
                console.log('medImages', $scope.medImages);
            });
            //Add in prescriber alternate search?
        };

        $scope.setUpdatedPrescriber = function setUpdatedPrescriber() {
            if (this.prescriber.selected) {
                this.prescriber.selected = false;
                $scope.selectedPrescriber = null;
            } else {
                for (var k = 0; k < $scope.prescriberResults.length; k++) {
                    $scope.prescriberResults[k].selected = false;
                }
                this.prescriber.selected = true;
                $scope.selectedPrescriber = this.prescriber;
                _.deepSet($scope.saveMed, 'performer.address[0].street_lines[0]', $scope.selectedPrescriber.practice_address.address_line);
                _.deepSet($scope.saveMed, 'performer.address[0].city', $scope.selectedPrescriber.practice_address.city);
                _.deepSet($scope.saveMed, 'performer.address[0].state', $scope.selectedPrescriber.practice_address.state);
                _.deepSet($scope.saveMed, 'performer.name[0].first', $scope.selectedPrescriber.first_name);
                _.deepSet($scope.saveMed, 'performer.name[0].last', $scope.selectedPrescriber.last_name);
            }
        };

        $scope.setUpdatedImage = function setUpdatedImage(rxImage) {
            if (rxImage.selected) {
                rxImage.selected = false;
                $scope.selectedImage = null;
            } else {
                for (var k = 0; k < $scope.medImages.nlmRxImages.length; k++) {
                    $scope.medImages.nlmRxImages[k].selected = false;
                }
                rxImage.selected = true;
                $scope.selectedImage = rxImage;
            }
            console.log($scope.selectedImage);
        };

        $scope.prescriberSearch = function prescriberSearch(firstName, lastName, state) {
            $scope.prescriberSearchActive = true;
            var searchTest = false;
            var searchObj = {};
            $scope.selectedPrescriber = null;
            if (firstName) {
                _.deepSet(searchObj, 'name[0].first', firstName);
            }
            if (lastName) {
                _.deepSet(searchObj, 'name[0].last', lastName);
            }
            if (state) {
                _.deepSet(searchObj, 'address[0].state', state);
            }
            if (searchObj !== {}) {
                npiapi.findNPI(searchObj, function (err, data) {
                    $scope.prescriberSearchActive = false;
                    if (err) {
                        $scope.prescriberError = "No matches found, please try again";
                    } else {
                        $scope.prescriberResults = data;
                        $scope.prescriberCount = data.length;
                        $scope.prescriberError = null;
                    }
                });
            }
        };

        function updatedObject() {
            var pmed_date_time = {};
            var pmed_lowdate = {};
            var pmed_highdate = {};
            console.log("updating object...");

            // _id
            _.deepSet($scope.saveMed, '_id', $scope.medication._id);

            // product
            _.deepSet($scope.saveMed, 'product', $scope.medication.product);

            // med_metadata
            var attr_new = {
                "merged": new Date(),
                "merge_reason": "update"
            };
            _.deepSet($scope.saveMed, 'med_metadata.attribution[0]', attr_new);
            _.deepSet($scope.saveMed, 'med_metadata.is_prescription', $scope.medication.med_metadata.is_prescription);
            _.deepSet($scope.saveMed, 'med_metadata.patient_entered', $scope.medication.med_metadata.patient_entered);

            //original performer if not updated
            if (_.isUndefined($scope.saveMed.performer)) {
                _.deepSet($scope.saveMed, 'performer', $scope.medication.performer);
            }

            // image
            console.log($scope.selectedImage);
            if (!_.isNull($scope.selectedImage)) {
                _.deepSet($scope.saveMed, 'med_metadata.image', $scope.selectedImage);
            }

            // sig
            console.log($scope.pWhy);
            if ($scope.pWhy) {
                _.deepSet($scope.saveMed, 'sig', $scope.pWhy);
            }

            // dates
            if ($scope.pStart) {
                pmed_lowdate = {
                    "date": moment($scope.pStart).format('YYYY-MM-DD') + 'T00:00:00.000Z',
                    "precision": 'day'
                };
                _.deepSet($scope.saveMed, 'date_time.low', pmed_lowdate);
            }

            if ($scope.pCurrentMedRadio) {
                pmed_date_time = {
                    "low": {
                        "date": moment($scope.pStart).format('YYYY-MM-DD') + 'T00:00:00.000Z',
                        "precision": 'day'
                    }
                };
                _.deepSet($scope.saveMed, 'date_time', pmed_date_time);
            }

            if ($scope.pStart && !$scope.pCurrentMedRadio) {
                if ($scope.pLast) {
                    pmed_highdate = {
                        "date": moment($scope.pLast).format('YYYY-MM-DD') + 'T00:00:00.000Z',
                        "precision": 'day'
                    };
                } else {
                    pmed_highdate = {
                        "date": moment().format('YYYY-MM-DD') + 'T00:00:00.000Z',
                        "precision": 'day'
                    };
                }
                _.deepSet($scope.saveMed, 'date_time.high', pmed_highdate);
            }
            console.log("...entered Medication: ", $scope.saveMed);
        }

        $scope.medReset = function () {
            console.log("RESETTING MEDICATION ENTRY");
            $scope.prescriberResults = null;
            $scope.pFirstName = null;
            $scope.pLastName = null;
            $scope.pDrugName = null;
            $scope.selectedImage = null;
            //$scope.openfdanameResults = null;
            $scope.rxnormResults = null;
            //$scope.medlineResults = null;
            $scope.rximageResults = null;
            //$scope.openfdacodeResults = null;
            $scope.selectedDrug = null;
            $scope.selectedPrescriber = null;
            $scope.drugError = null;
            $scope.drugWarning = null;
            $scope.prescriberError = null;
            $scope.entryStep = 0;
            $scope.pWhy = null;
            $scope.pLast = null;
            $scope.pCurrentMedRadio = null;
            $scope.pStart = null;
            $scope.drugSpelling = null;
        };

        function updateMedication() {
            updatedObject();
            // format dates, address, names
            if ($scope.saveMed.date_time) {
                format.formatDate($scope.saveMed.date_time.low);
                if ($scope.saveMed.date_time.high) {
                    format.formatDate($scope.saveMed.date_time.high);
                }
            }
            if ($scope.saveMed.performer && $scope.saveMed.performer.address) {
                format.formatAddress($scope.saveMed.performer.address[0]);
            }
            if ($scope.saveMed.performer) {
                if ($scope.saveMed.performer.name) {
                    format.formatName($scope.saveMed.performer.name[0]);
                }
            }

            medications.editMedication($scope.saveMed, function (err, results) {
                if (err) {
                    // Display an error in the med entry modal
                    $scope.updateMedicationStatus = 'error';
                } else {
                    // Display success in the med entry modal
                    console.log($scope.medication, $scope.saveMed);
                    $scope.updateMedicationStatus = 'success';
                    $scope.medReset();
                    $modalInstance.close();
                    dataservice.forceRefresh();
                    $route.reload();
                }
            });
        }

        $scope.close = function () {
            $modalInstance.dismiss('cancel');
            $scope.medReset();

        };
    })
    .controller('MedicationDeleteModalCtrl', function ($scope, $modalInstance, $route, medication, medications) {
        $scope.medication = medication.data;
        $scope.deleteConfirm = deleteConfirm;

        function deleteConfirm() {
            medications.deleteMedication($scope.medication, function (err, results) {
                if (err) {
                    console.log("err: " + err);
                } else {
                    setTimeout(function () {
                        $modalInstance.close();
                        $route.reload();
                    }, 100);
                }
            });
        }

        $scope.close = function () {
            $modalInstance.dismiss('cancel');
        };
    })
    .controller('MedicationDetailModalCtrl', function ($scope, $modalInstance, medication, medapi, npiapi, medications, notes, dataservice) {
        $scope.medication = medication.data;
        $scope.comments = medication.metadata.comments;
        $scope.newComment = {
            starred: false
        };
        $scope.medicationDetailPath = "views/templates/details/medications.html";
        $scope.tabs = [{
            title: 'Details',
            type: 'details',
            icon: 'fa-ellipsis-h',
            selected: true
        }, {
            title: 'Notes',
            type: 'notes',
            icon: 'fa-comment',
            selected: false
        }, {
            title: 'Images',
            type: 'images',
            icon: 'fa-picture-o',
            selected: false
        }, {
            title: 'Adverse Events',
            type: 'adverse',
            icon: 'fa-exclamation-triangle',
            selected: false
        }, {
            title: 'Learn More',
            type: 'learn',
            icon: 'fa-question-circle',
            selected: false
        }, {
            title: 'History',
            type: 'history',
            icon: 'fa-clock-o',
            selected: false
        }];

        $scope.activeTab = 'details';

        $scope.selectTab = function () {
            $scope.activeTab = this.tab.type;
            console.log("this tab type: " + this.tab.type);
            for (var i = 0; i < $scope.tabs.length; i++) {
                if ($scope.tabs[i].type === this.tab.type) {
                    $scope.tabs[i].selected = true;
                } else {
                    $scope.tabs[i].selected = false;
                }
            }
        };

        function removeTab(tabTitle) {
            for (var i = $scope.tabs.length; i >= 0; i--) {
                if ($scope.tabs[i]) {
                    if ($scope.tabs[i].title === tabTitle) {
                        $scope.tabs.splice(i, 1);
                    }
                }
            }
        }

        medapi.findImages($scope.medication.product.product.code, function (err, data) {
            $scope.medImages = data;
            // if (data.nlmRxImages.length === 0) {
            //     removeTab('Images');
            // }
        });

        if (angular.isDefined($scope.medication.product.product.code)) {
            medapi.fdaCode($scope.medication.product.product.code, function (err, data) {
                $scope.fdaInfo = data;
                // if (data.error) {
                //     removeTab('Adverse Events');
                // }
                $scope.fdatotal($scope.fdaInfo.results);
            });
        } else {
            if (angular.isDefined($scope.medication.product.product.name)) {
                medapi.fdaName($scope.medication.product.product.name, function (err, data) {
                    $scope.fdaInfo = data;
                    // if (data.error) {
                    //     removeTab('Adverse Events');
                    // }
                    $scope.fdatotal($scope.fdaInfo.results);
                });
            } else {
                //product name and code not defined...  I don't think this is possible, but...
                // removeTab('Adverse Events');
            }
        }

        $scope.fdatotal = function fdatotal(eventsArray) {
            $scope.totalReports = _.sum(_.pluck(eventsArray, 'count'));
            _.forEach(eventsArray, function (event) {
                event.count = (100 * event.count / $scope.totalReports);
            });
        };

        medapi.findmedline($scope.medication.product.product.code, $scope.medication.product.product.name, function (err, data) {
            $scope.medline = data;
            // if (data.feed.entry.length === 0) {
            //     removeTab('Learn More');
            // }
        });

        $scope.addNote = function (inputComment) {
            $scope.newComment.entry = $scope.medication._id;
            $scope.newComment.note = inputComment;
            $scope.newComment.comment = inputComment;
            $scope.newComment.section = 'medications';

            notes.addNote($scope.newComment, function (err, data) {
                if (err) {
                    console.log('err ', err);
                } else {
                    $scope.newComment.entry_id = data.entry;
                    $scope.newComment.note_id = data._id;

                    $scope.comments = [$scope.newComment];

                    if ($scope.newComment.starred) {
                        notes.starNote($scope.newComment.note_id, $scope.newComment.starred, function (err, data) {
                            if (err) {
                                console.log('add note star error ', err);
                            } else {
                                $scope.comments[0].starred = data.star;
                            }
                        });
                    }

                    dataservice.forceRefresh();

                    $scope.newComment = {
                        starred: false
                    };
                }
            });

        };

        $scope.toggleStar = function () {
            notes.starNote($scope.comments[0].note_id, !$scope.comments[0].starred, function (err, data) {
                if (err) {
                    console.log("err: " + err);
                } else {
                    console.log("new star data: ", data);
                    $scope.comments[0].starred = !$scope.comments[0].starred;
                }
            });
        };

        $scope.toggleNewStar = function () {
            $scope.newComment.starred = !$scope.newComment.starred;
        };

        $scope.editNote = function () {
            console.log("edit note");
            $scope.editflag = true;
            $scope.editComment = $scope.comments[0].comment;
        };

        $scope.cancelEdit = function () {
            console.log("cancel edit");
            $scope.editflag = false;
        };

        $scope.deleteNote = function () {
            console.log("delete note");
            notes.deleteNote($scope.comments[0].note_id, function (err, data) {
                if (err) {
                    console.log('deleting note ', err);
                } else {
                    console.log('deleting note ', data);
                    $scope.comments = [];
                    $scope.editflag = false;
                }
            });
        };

        $scope.saveNote = function (editComment) {
            console.log("save note");
            $scope.comments[0].comment = editComment;
            var noteID = $scope.comments[0].note_id;
            notes.editNote(noteID, editComment, function (err, data) {
                if (err) {
                    console.log("err: " + err);
                } else {
                    console.log("edited note saved: ", data);
                    $scope.comments[0].date = data.datetime;
                }
            });
            $scope.editflag = false;
        };

        $scope.close = function () {
            var newMedInfo = {
                id: $scope.medication._id,
                comments: $scope.comments
            };
            $modalInstance.dismiss(newMedInfo);
        };
    })
    .controller('PrintModalCtrl', function ($scope, $window, $modalInstance) {
        $scope.close = function () {
            $modalInstance.dismiss();
        };

        $scope.printWithPatient = function () {
            $window.open('/#/print/patient', '_blank');
            $scope.close();
        };

        $scope.printWithoutPatient = function () {
            $window.open('/#/print', '_blank');
            $scope.close();
        };
    })
    .controller('ExportModalCtrl', function ($scope, $window, $modalInstance) {
        $scope.close = function () {
            $modalInstance.dismiss();
        };

        $scope.exportWithPatient = function () {
            $window.open('/api/v1/master_health_record/xml/patient');
            $scope.close();
        };

        $scope.exportWithoutPatient = function () {
            $window.open('/api/v1/master_health_record/xml');
            $scope.close();
        };
    });
