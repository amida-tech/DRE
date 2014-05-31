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

exports.getMerges = function(dbinfo, type, typeFields, recordFields, callback) {
    var model = dbinfo.mergeModels[type];
    var allFields = typeFields + ' ' + recordFields + ' reviewed';
    var query = model.find({});
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

exports.count = function(dbinfo, type, conditions, callback) {
    var model = dbinfo.mergeModels[type];
    var recCount = 0;

    var query = model.find({});
    query.where(conditions);
    query.populate('entry_id record_id');
    query.exec(function(err, mergeResults) {

        for (var i in mergeResults) {
            if (mergeResults[i].entry_id.reviewed) {
            recCount++;
            }    
        }

        callback(null, recCount);
    });
};
