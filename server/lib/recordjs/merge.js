var _ = require('underscore');

exports.save = function(dbinfo, secName, input_entry, mergeInfo, callback) {
    var Model = dbinfo.mergeModels[secName];
    var mergeObject = new Model({
        entry_type: dbinfo.sectionToType[secName],
        patKey: input_entry.patKey,
        entry_id: input_entry._id,
        record_id: mergeInfo.record_id,
        merged: new Date(),
        merge_reason: mergeInfo.merge_reason
    });

    mergeObject.save(function(err, saveResults) {
        if (err) {
            callback(err);
        } else {
            if (! input_entry.metadata) {
                input_entry.metadata = {};
            }
            if (! input_entry.metadata.attribution) {
                input_entry.metadata.attribution = [];
            }
            input_entry.metadata.attribution.push(saveResults._id);
            input_entry.save(function(err, saveObject) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, saveObject._id);
                }
            });
        }
    });
};

exports.getAll = function(dbinfo, secName, patientKey, typeFields, recordFields, callback) {
    var model = dbinfo.mergeModels[secName];
    var allFields = typeFields + ' ' + recordFields + ' reviewed';
    var query = model.find({patKey: patientKey});
    query.where('archived').in([null, false]);
    query.where('entry_type', dbinfo.sectionToType[secName]);
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

exports.count = function(dbinfo, secName, patKey, conditions, callback) {
    var model = dbinfo.mergeModels[secName];
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
