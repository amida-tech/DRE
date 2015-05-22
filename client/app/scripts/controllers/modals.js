'use strict';

angular.module('phrPrototypeApp')
    .controller('MedicationEntryModalCtrl', function ($scope, $modalInstance, $route, medapi, npiapi, medications) {
        $scope.entryStep = 0;
        $scope.prescriberSearchActive = false;
        $scope.drugSearchActive = false;
        $scope.saveMedication = saveMedication;
        $scope.enteredMedication = {};
        $scope.saveMedicationStatus = null;

        $scope.previousStep = function previousStep() {
            if ($scope.entryStep === 3 && $scope.medSearchType !== 'prescription') {
                $scope.entryStep = 1;
            } else {
                $scope.entryStep--;
            }
        };

        function enteredObject() {
            console.log("entering object...");
            if ($scope.medSearchType === 'prescription') {
                console.log("...was a prescription");
                $scope.enteredMedication = {
                    //"identifiers": [],
                    "med_metadata": {
                        image: $scope.selectedImage,
                        patient_entered: true,
                        is_prescription: true,
                        attribution: [{
                            merged: new Date(),
                            merge_reason: "new"
                        }]
                    },
                    "sig": $scope.selectedDrug.name,
                    "status": "Completed",
                    //"is_brand": true,
                    "administration": {
                        "dose": {
                            "value": $scope.pDosevalue,
                            "unit": $scope.pDoseUnit
                        },
                        "form": $scope.pAdminister,
                        "rate": $scope.pOften,
                        //"route": "",
                        //"dose_restriction": "",
                        //"site": "",
                        /*"interval": {
                            "xsiType": "",
                            "phase": "",
                            "period": "",
                            "frequency": true,
                            "alignment": "",
                            "event": "",
                            "event_offset": {
                                "low": "",
                                "high": "",
                                "center": "",
                                "width": ""
                            }
                        }*/
                    },
                    /*"precondition": {
                        "code": "",
                        "value": ""
                    },*/
                    "product": {
                        "identifiers": [{
                            rxcui: $scope.selectedDrug.rxcui
                        }],
                        "product": {
                            'name': $scope.selectedDrug.synonym,
                            'code': $scope.selectedDrug.rxcui,
                            'code_system_name': 'RxNorm'
                        },
                        // "unencoded_name": $scope.selectedDrug.name //,
                        //"manufacturer": 
                    },
                    "supply": {
                        //"date_time": "",
                        //"repeatNumber": "",
                        //"quantity": "",
                        "author": {
                            "identifiers": [{
                                npi: ""
                            }],
                            //"date_time": "",
                            "name": "",
                            "npi": "",
                            //"organization": ""
                        }
                    },
                    /*"indication": {
                        "identifiers": [],
                        "code": "",
                        "date_time": "",
                        "value": ""
                    },*/
                    "performer": {
                        "address": [
                            $scope.selectedPrescriber.practice_address,
                            $scope.selectedPrescriber.business_address
                        ],
                        "name": {
                            "first": $scope.selectedPrescriber.first_name,
                            "last": $scope.selectedPrescriber.last_name
                        }
                    } //,
                    //"drug_vehicle": "",
                    /*
                    "dispense": {
                        "identifiers": [],
                        "performer": ""
                    }*/
                };
            } else {
                $scope.enteredMedication = {
                    //"identifiers": [],
                    "med_metadata": {
                        image: $scope.selectedImage,
                        patient_entered: true,
                        is_prescription: false,
                        attribution: [{
                            merged: new Date(),
                            merge_reason: "new"
                        }]
                    },
                    "sig": $scope.selectedDrug.name,
                    "status": "Completed",
                    //"is_brand": true,
                    "administration": {
                        "dose": {
                            "value": $scope.pDosevalue,
                            "unit": $scope.pDoseUnit
                        },
                        "form": $scope.pAdminister,
                        "rate": $scope.pOften,
                        //"route": "",
                        //"dose_restriction": "",
                        //"site": "",
                        /*"interval": {
                            "xsiType": "",
                            "phase": "",
                            "period": "",
                            "frequency": true,
                            "alignment": "",
                            "event": "",
                            "event_offset": {
                                "low": "",
                                "high": "",
                                "center": "",
                                "width": ""
                            }
                        }*/
                    },
                    /*"precondition": {
                        "code": "",
                        "value": ""
                    },*/
                    "product": {
                        "identifiers": [{
                            rxcui: $scope.selectedDrug.rxcui
                        }],
                        "product": {
                            'name': $scope.selectedDrug.synonym,
                            'code': $scope.selectedDrug.rxcui,
                            'code_system_name': 'RxNorm'
                        },
                        // "unencoded_name": $scope.selectedDrug.name //,
                        //"manufacturer": 
                    },
                    "supply": {
                        //"date_time": "",
                        //"repeatNumber": "",
                        //"quantity": "",
                        "author": {
                            "identifiers": [{
                                npi: ""
                            }],
                            //"date_time": "",
                            "name": "",
                            "npi": "",
                            //"organization": ""
                        }
                    },
                    /*"indication": {
                        "identifiers": [],
                        "code": "",
                        "date_time": "",
                        "value": ""
                    },*/
                    //,
                    //"drug_vehicle": "",
                    /*
                    "dispense": {
                        "identifiers": [],
                        "performer": ""
                    }*/
                };
            }
            console.log("...entered Medication: " + $scope.enteredMedication);
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
                enteredObject();
                $scope.medication = $scope.enteredMedication;
                $scope.entryStep = 4;
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
                    setTimeout(function () {
                        $modalInstance.close();
                        $route.reload();
                    }, 100);
                }
            });
            $scope.medReset();
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

        $scope.prescriberSearch = function prescriberSearch(firstName, lastName, zipCode, state) {
            $scope.prescriberSearchActive = true;
            var searchTest = false;
            var searchObj = {
                name: [],
                address: []
            };
            $scope.selectedPrescriber = null;
            if (firstName !== "" && lastName !== "") {
                searchObj.name.push({
                    first: firstName,
                    last: lastName
                });
                searchTest = true;
            } else {
                if (lastName !== "") {
                    searchObj.name.push({
                        last: lastName
                    });
                    searchTest = true;
                }
            }
            if (zipCode !== "" && state !== "") {
                searchObj.address.push({
                    zip: zipCode,
                    state: state
                });
                searchTest = true;
            } else {
                if (zipCode !== "") {
                    searchObj.address.push({
                        zip: zipCode
                    });
                    searchTest = true;
                }
                if (state !== "") {
                    searchObj.address.push({
                        state: state
                    });
                    searchTest = true;
                }
            }
            if (searchTest) {
                npiapi.findNPI(searchObj, function (err, data) {
                    $scope.prescriberSearchActive = false;
                    if (err) {
                        console.log("Martz err: " + err);
                        $scope.prescriberError = "No matches found, please try again";
                    } else {
                        console.log("Martz success: " + JSON.stringify(data));
                        $scope.prescriberResults = data;
                        $scope.prescriberCount = data.length;
                        $scope.prescriberError = null;
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
            $scope.pZip = null;
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
            $scope.pWhy = "";
            $scope.pAdminister = "";
            $scope.pDoseValue = "";
            $scope.pDoseUnit = "";
            $scope.pOften = "";
            $scope.pLast = "";
            $scope.pCurrentMedRadio = null;
            $scope.pStart = "";
            $scope.drugSpelling = null;
        };

        $scope.close = function () {
            $scope.medReset();
            $modalInstance.dismiss('cancel');
        };

        $scope.medReset();
    })
    .controller('MedicationUpdateModalCtrl', function ($scope, $modalInstance, $route, medication, medapi, npiapi, medications) {
        $scope.medication = medication.data;
        $scope.saveMedication = saveMedication;

        $scope.initStuff = function () {
            console.log("init-ing stuff... " + $scope.medication.med_metadata.is_prescription);
            medapi.findImages($scope.medication.product.product.code, function (err, data) {
                $scope.medImages = data;
            });
            //Add in prescriber alternate search?
        };

        function saveMedication() {
            medications.editMedication($scope.medication, function (err, results) {
                if (err) {
                    // Display an error in the med entry modal
                    $scope.saveMedicationStatus = 'error';
                } else {
                    // Display success in the med entry modal
                    $scope.saveMedicationStatus = 'success';
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
    .controller('MedicationDetailModalCtrl', function ($scope, $modalInstance, medication, medapi, npiapi, medications, notes) {
        $scope.medication = medication.data;
        $scope.comments = medication.metadata.comments;
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
            title: 'History',
            type: 'history',
            icon: 'fa-clock-o',
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

        medapi.findImages($scope.medication.product.product.code, function (err, data) {
            $scope.medImages = data;
        });

        if (angular.isDefined($scope.medication.product.product.code)) {
            medapi.fdaCode($scope.medication.product.product.code, function (err, data) {
                $scope.fdaInfo = data;
                $scope.fdatotal($scope.fdaInfo.results);
            });
        } else {
            if (angular.isDefined($scope.medication.product.product.name)) {
                medapi.fdaName($scope.medication.product.product.name, function (err, data) {
                    $scope.fdaInfo = data;
                    $scope.fdatotal($scope.fdaInfo.results);
                });
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
        });

        $scope.addNote = function (inputComment) {
            console.log("medication: ", medication);
            var newComment = {
                entry: $scope.data.medication._id,
                note: inputComment,
                section: 'medications'
            };
            //$scope.newComment.entry = $scope.recordEntry.data._id;
            //$scope.newComment.note = $scope.newComment.comment;
            //$scope.newComment.section = $scope.recordEntry.category;

            notes.addNote(newComment, function (err, data) {
                if (err) {
                    console.log("err: ", err);
                } else {
                    console.log('data ', data);
                    $scope.comments[0] = data;
                    $scope.comments[0].starred = false;

                    $scope.newComment = {};
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
                console.log('deleting note ', err);
                console.log('deleting note ', data);
            });
            $scope.comments = [];
            $scope.editflag = false;
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
                }
            });
            $scope.editflag = false;
        };

        $scope.close = function () {
            $modalInstance.dismiss('cancel');
        };
    });
