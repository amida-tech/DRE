var _ = require('underscore');

exports.save = function(dbinfo, secName, input, mergeInfo, callback) {
    var Model = dbinfo.mergeModels[secName];
    var mergeObject = new Model({
        entry_type: dbinfo.sectionToType[secName],
        patKey: input.patKey,
        entry_id: input._id,
        record_id: mergeInfo.record_id,
        merged: new Date(),
        merge_reason: mergeInfo.merge_reason
    });

    mergeObject.save(function(err, mergeResult) {
        if (err) {
            callback(err);
        } else {
            if (! input.metadata) {
                input.metadata = {};
            }
            if (! input.metadata.attribution) {
                input.metadata.attribution = [];
            }
            input.metadata.attribution.push(mergeResult._id);
            input.save(function(err, result) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, result._id);
                }
            });
        }
    });
};

exports.getAll = function(dbinfo, secName, ptKey, typeFields, recordFields, callback) {
    var model = dbinfo.mergeModels[secName];
    var allFields = typeFields + ' ' + recordFields + ' reviewed';
    var query = model.find({patKey: ptKey});
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

exports.count = function(dbinfo, secName, ptKey, conditions, callback) {
    var model = dbinfo.mergeModels[secName];
    var condsWPat = _.clone(conditions);
    condsWPat.patKey = ptKey;
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
