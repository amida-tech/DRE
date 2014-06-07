var _ = require('underscore');

exports.saveMerge = function(dbinfo, mergeObject, callback) {
    var Model = dbinfo.mergeModels[mergeObject.entry_type];
    var saveMerge = new Model(mergeObject);

    saveMerge.save(function(err, saveResults) {
        if (err) {
            callback(err);
        } else {  
            callback(null, saveResults);
        }
    });
};

exports.getMerges = function(dbinfo, type, patientKey, typeFields, recordFields, callback) {
    var model = dbinfo.mergeModels[type];
    var allFields = typeFields + ' ' + recordFields + ' reviewed';
    var query = model.find({patKey: patientKey});
    query.where('archived').in([null, false]);
    query.where('entry_type', type);
    query.lean();
    query.populate('entry_id record_id', allFields);

    query.exec(function (err, mergeResults) {
        if (err) {
            callback(err);
        } else {

            //Filter out unreviewed entries.
            var returnMerges = [];
            for (var iMerge in mergeResults) {
                if (mergeResults[iMerge].entry_id.reviewed !== false) {
                    returnMerges.push(mergeResults[iMerge]);
                }
            }

            callback(null, returnMerges);
        }
    });
};

exports.count = function(dbinfo, type, patKey, conditions, callback) {
    var model = dbinfo.mergeModels[type];
    var condsWPat = _.clone(conditions);
    condsWPat.patKey = patKey;
    var query = model.find({});
    query.where(condsWPat);
    query.populate('entry_id');
    query.exec(function(err, mergeResults) {
        var recCount = mergeResults.reduce(function(r, mergeResult) {
            if (mergeResult.entry_id.reviewed) {
                r++;
            }
            return r;    
        }, 0);
        callback(null, recCount);
    });
};
