dre-record
==================

Data Raconciliation Engine Persistance Layer (MongoDB)

## Library interfaces/APIs

This library provides following functionality

- Persist blue-button data with additional metadata
- Persist merge histories
- Persist partial match information
- Persist patient data files

dre-record uses MongoDB.

### Usage example

Require blue-button and dre-record which currently lives in server/lib/recordjs directory. 

``` javascript
var bb = require("blue-button");
var record = require("./server/lib/records");
```

record assumes MongoDB is already running.  Connect to the database

``` javascript
record.connectDatabase('localhost', function(err)) {
  if (err) throw err;
}
```

Read a ccd file and convert it to JSON

``` javascript
var fs = require('fs');
var filepath  = '/tmp/demo.xml';
var xmlString = fs.readFileSync(filepath, 'utf-8');
var result = bb.parseString(xmlString);
var ccdJSON = result.data;
```

Persist the file in the database, various properties is the responsibility the caller

``` javascript
var fileInfo = {
  filename: 'demo.xml',
  type: 'text/xml'
};
var fileId = null;
record.saveRecord('patientKey', xmlString, fileInfo, 'ccda', function(err, result) {
  fileId = result._id;
});
```

Persist sections in the database

``` javascript
record.saveNewAllergies('patientKey', ccdJSON.allergies, fileId, function(err) {
  if (err) throw err;
});

record.saveNewProcedures('patientKey', ccdJSON.procedures, fileId, function(err) {
  if (err) throw err;
});
```

or you can persist the whole record

``` javascript
record.saveAllSectionsAsNew('patientKey', ccdJSON, fileId, function(err) {
  if (err) throw err;
});
```

you can get the whole record back

``` javascript
record.getAllSections('patientKey',function(err) {
  if (err) throw err;
});
```

or get the sections individually from the database

``` javascript
var id0 = null;
record.getAllergies('patientKey', function(err, result) {
  if (err) throw err;
  id0 = result[0]._id;
});

```

Result is an array of allergies.  Each entry includes metadata and property '_id" which you can later to access
specific allergy and update

``` javascript
record.updateAllergy('patientKey', id0, updateData, function(err, updatedRecord) {
  if (err) throw(err);
};
```

You can clean up metadata and other non blue-button data which is comparable to ccdJSON.allergies

``` javascript
var cleanResult = record.cleanSectionEntries(result);
```

You can count number of entries for a particular section

``` javascript
  record.allergyCount({patKey: 'patientKey'}, function(err, count) {
    console.log(count);
  });
```

Once you persists a new entry merge history will be updated with merge_reason: 'new'.  Once you find the same 
entry in a new file you can update the merge history.  Currently only record_id and merge_reason
fields are supported

``` javascript
 var mergeInfo = {record_id: newfileId, merge_reason: 'duplicate'};
 record.addAllergyMergeEntry(id0, mergeInfo, function(err) {
  if (err) throw err;
 });
```

You can get all the merge history for a section and also specify the fields you want from the section and the 
storage

``` javascript
record.getMerges('patientKey', 'allergy', 'name severity', 'filename uploadDate', function(err, mergeList) {
  console.log(mergeList.length);
  var explMerge = mergeList[0];
});
```

You can update a specific merge

``` javascript
record.setMerge(explMerge, function(err) {
  if (err) throw err;
});
```

You can count merge history with various conditions

``` javascript
record.count('allergy', {}, function(err, count) {
  console.log(count);
})

record.count('allergy', {merge_reason: 'new'}, function(err, count) {
  console.log(count);
})

record.count('allergy', {merge_reason: 'duplicate', patKey: 'patientKey'}, function(err, count) {
  console.log(count);
})

```

Persisted files are availble

``` javascript
record.getRecordList('patientKey', function(err, result) {
    var fileId = result[0]._id;
    console.log(result.length);
});

record.getRecord(fileId, function(err, result) {
    if (err) throw err;
};

record.recordCount('patientKey', function(err, count) {
    console.log(count);
});
```

Partially matched section entries can be persisted

``` javascript
record.savePartialAllergies('patientKey', partialAllergies, fileId, function(err) {
  if (err) throw err;
});

record.savePartialAllergies('patientKey', partialProcedures, fileId, function(err) {
  if (err) throw err;
});
```

Persisted partial match entries can be obtained

``` javascript
record.getPartialAllergies('patientKey', function(err, result) {
  if (err) throw err;
  var partialId = result[0]._id;
});
```

and removed

``` javascript
record.removePartialAllergy('patientKey', partialId, function(err) {
  if (err) throw err;
});
```

You can add match entries

``` javascript
record.addAllergyMatchEntry('patientKey', inputArray, function(err) {
  if (err) throw err;
});
```

You can obtain matches as a list

``` javascript
record.getMatches('allergy', 'name severity', 'filename uploadDate', function(err, matchList) {
  if (err) throw err;
  var matchId = matchList[0]._id;
});
```

or individually

``` javascript
record.getMatch('allergy', matchId, function(err, result) {
  if (err) throw err;
});
```

and later update

``` javascript
record.updateMatch('allergy', matchId, updateParams, function(err, updateResults) {
  if (err) throw err;
});
```

you can also count matches

``` javascript
record.countMatch('allergy', {}, function(err, count) {
   console.log(count);
});
```

## Schemas

Underlying MongoDB collections can be classified into four categories

- Patient data and metadata
- Merge history
- Partial match
- Source file storage

### Source file storage

This is a single collection named 'storage.files'.  It contains file content and few additional file metadata fields.  This collection is used through MongoDB GridFS specification since the content can be larger than the MongoDB 16M size limit.  The schema is as follows (GridFS specific schema fields are not shown)

``` javascript
var schema = {
  filename: String,
  contentType: String,
  uploadDate: Date,
  metadata: {
    patKey: String,
    fileClass: String
  }
};
```

'contentType' is the file MIME type such as 'application/xml'.  'patKey' is used to identify the patient file belongs to.  If it exists 'fileClass' can only have the value of 'ccda' and indicates that file was read as a ccda document succesfully.  

### Patient data and metadata

Patient data collections closely follows [blue-button](https://github.com/amida-tech/blue-button) models that implement CCDA header or sections.  Collection 'demographics' store CCDA header data.  Currently there are eight collections for supported CCDA sections: 'medications', 'procedures', 'socialHistories', 'problems', 'allergies', 'results', 'vitals', and 'encounters'.  Each element in the collections is a single entry in a CCDA section.  Allergy schema is

``` javascript
var schema = {
  name: String,
  code: String,
  code_system_name: String,
  date: [{date: Date, precision: String}],
  identifiers: [{
     identifier:String,
     identifier_type: String
  }],
  severity: String,
  reaction: [{
     code: String, 
     name: String, 
     code_system_name: String, 
     severity: String
  }],
  
  patKey: String,
  metadata: {
    attribution: [{type: ObjectId, ref: 'allergymerges'}]
  },
  __index: Number,
  reviewed: Boolean,
  archived: Boolean
};
```

All the fields before 'patKey' directly comes from [blue-button](https://github.com/amida-tech/blue-button) models and is documented there.  Remaining fields are identical for all collections.  'patKey' is the key for the patient whom this entry belongs.  'metadata.attribution' links patient data collections to merge history collections that are explained in the next section. '__index' is used internally to record the order entries in the source file to ease testing.  'reviewed=false' identifies all entries that are queued for patient review.  'archieved=true' identifies all entries that are created for patient review and later is ignored or merged and is not part of the health record.

Since schema for all other collections follows the same pattern they will not be explicitly shown here.

### Merge History

Collections for merge history hold information on where and how a patient data entry is added to the health record.  There is one merge history collection for each patient data collection: 'allergymerges', 'demographicmerges', 'encountermerges', 'socialmerges', 'vitalmerges', 'immunizationmerges', 'medicationmerges', 'proceduremerges', and 'resultmerges'.  The schema for each follows a general pattern and shown for 'allergymerges' below

``` javascript
var schema = {
  entry_type: String,
  patKey: String,
  entry_id: {type: ObjectId, ref: allergies},
  record_id: {type: ObjectId, ref: 'storage.files'},
  merged: Date,
  merge_reason: String,
  archived: Boolean
};
```

'entry_type' is a convenience field and holds the type of the entry.  It can have the values: 'allergy', 'demographic', 'social', 'problem', 'procedure', 'medication', 'vital', 'immunization', or 'encounter'.  'patKey' is the patient key.  'entry_id' and 'record_id' respectively link the merge history to patient data and source file.  'merged' is the time that the merge history record is created.  'merge_reason' can currently be either 'new' or 'duplicate'.  'new' describes new patient data entries that are added to the health record and 'duplicate' describes patient data that  already existed in the health record.  'archived=true' identifies all the merge history entries that is linked to patient data collections that has the same flag and is an another convenience field.  

### Partial Match

Collections for partial match history describe partial matches and the action that the patient took.  There is one partial match history collection for each patient data collection: 'allergymatches', 'demographicmatches', 'encountermatches', 'socialmatches', 'vitalmatches', 'immunizationmatches', 'medicationmatches', 'procedurematches', and 'resultmatches'.  The schema for each follows a general pattern and shown for 'allergymatches' below

``` javascript
var schema = {
  entry_type: String,
  patKey: String,
  entry_id: {type: ObjectId, ref: allergies},
  record_id: {type: ObjectId, ref: 'storage.files'},
  determination: String,
  percent: Number,
  diff: {},
  subelements: {}
};
```

All the fields until the percent has identical descriptions to corresponding merge history collection ('allergymerges' for 'allergymatches'). 'percent', 'diff' and 'subelements' describe the details of the partial match for which detailed information can be found in [blue-button-match](https://github.com/amida-tech/blue-button-match).  'determination' describes the action that user took and can be 'merged', 'added', or 'ignored'.

