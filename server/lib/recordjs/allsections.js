var section = require('./section');
var record = require('./index');

exports.getAllSections = function(dbinfo, patientKey, callback) {
    var types = Object.keys(record.typeToSection);
    var sectionCount = types.length;
    var result = {};
    var inError = false;
    var count = 0;
    types.forEach(function(type) {
        section.getSection(dbinfo, type, patientKey, function(err, sectionResult) {
            if (err) {
                inError = true;
                callback(err);
            } else {
                if (! inError) {
                    var sectionName = record.typeToSection[type];
                    result[sectionName] = sectionResult; 
                    ++count;
                    if (count === sectionCount) {
                        callback(null, result);
                    }
                }
            }
        });
    });
};

exports.saveAllSectionsAsNew = function(dbinfo, patientKey, patientRecord, fileId, callback) {
    var types = Object.keys(record.typeToSection);
    var sectionCount = types.length;
    var result = {};
    var inError = false;
    var count = 0;
    
    var onSectionHandled = function() {
        ++count;
        if (count === sectionCount) {
            callback(null);
        }
    };
    
    types.forEach(function(type) {
        var sectionName = record.typeToSection[type];
        var sectionRecord = patientRecord[sectionName];
        if (! sectionRecord) {
            onSectionHandled();
        } else {
            section.saveNewEntries(dbinfo, type, patientKey, sectionRecord, fileId, function(err) {
                if (err) {
                    inError = true;
                    callback(err);
                } else {
                    if (! inError) {
                        onSectionHandled();
                    }
                }
            });
        }
    });
};
