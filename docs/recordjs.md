blue-button-record.js
==================

Master Health Record and Data Reconciliation Engine Persistance Layer (MongoDB)

## Library interfaces/APIs

This library provides following functionality

- Persist blue-button data with additional metadata
- Persist merge histories
- Persist merge candidates with match information
- Persist blue-button data source content and type

This implementation of blue-button-record uses MongoDB.

### Usage example

Require [blue-button](https://github.com/amida-tech/blue-button) and blue-button-record 
``` javascript
var bb = require("blue-button");
var bbr = require("blue-button-record");
```
blue-button-record assumes MongoDB is already running.  Connect to the database
``` javascript
bbr.connectDatabase('localhost', function(err)) {
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
Persist the file in the database as a source of patient data, various properties is the responsibility the caller
``` javascript
var fileInfo = {
  filename: 'demo.xml',
  type: 'text/xml'
};
var fileId = null;
bbr.saveRecord('patientKey', xmlString, fileInfo, 'ccda', function(err, result) {
  fileId = result._id;
});
```
Methods are provided to access patient data source records as a list or individually
``` javascript
bbr.getRecordList('patientKey', function(err, results) {
  console.log(results.length);
});

bbr.getRecord(fileId, function(err, filename, content) {
  console.log(filename);  
});

bbr.recordCount('patientKey', function(err, count) {
  console.log(count);
});

```

You can persist all the [blue-button](https://github.com/amida-tech/blue-button) sections as a whole
``` javascript
bbr.saveAllSections('patientKey', ccdJSON, fileId, function(err) {
  if (err) throw err;
});
```
or individually
``` javascript
bbr.saveSection('allergies', 'patientKey', ccdJSON.allergies, fileId, function(err) {
  if (err) throw err;
});
```
By default all sections supported by [blue-button](https://github.com/amida-tech/blue-button) are also supported by blue-button-record.  Currently these are demographics (ccda header), allergies, procedures, vitals, medications, results, encounters, immunizations and socialHistory. 

You can get the whole patient record back

``` javascript
bbr.getAllSections('patientKey',function(err) {
  if (err) throw err;
});
```
or get any section individually
``` javascript
var id = null;
bbr.getSection('allergies', 'patientKey', function(err, allergies) {
  if (err) throw err;
  id = allergies[0]._id;
});

```
In addition to [blue-button](https://github.com/amida-tech/blue-button) data, each entry also includes metadata and property '_id" which you can later use to access and update
``` javascript
var allergy = null;
bbr.getEntry('allergies', id, function(err, result) {
  allergy = result;
});

bbr.updateEntry('allergies', id, {severity: 'Severe'}, fileId, function(err) {
  if (err) throw(err);
};
```
You can clean up metadata and other non blue-button data 
``` javascript
var allergiesBBOnly = bbr.cleanSectionEntries(allergies);
```
which makes allergiesBBOnly comparable to ccdJSON.allergies.

Metadata property provides the source of the data as the "merge history"
``` javascript
var attribution = allergy.metadata.attribution;
console.log(attribution[0].merge_reason); // merge history starts with 'new'
console.log(attribution[0].record_id);    // fileId
```
Once you persists a new entry (saveSection) merge history will be initiated with merge_reason: 'new'.  Each update (updateEntry) also contributes to merge history
``` javascript
console.log(attribution[1].merge_reason); // 'update'
```
In addition to 'new' and 'update', another source can be persisted in merge history to have the duplicate of an existing entry
``` javascript
bbr.duplicateEntry('allergies', id, fileId, function(err) {
  if (err) throw err;
});

console.log(attribution[2].merge_reason); // 'duplicate'
```

Whole merge history for a patient is available
``` javascript
bbr.getMerges('allergies', 'patientKey', 'name severity', 'filename uploadDate', function(err, mergeList) {
  console.log(mergeList.length);
  var explMerge = mergeList[0];
});
```
where you can specify blue-button health data fields like allergy name or severity and record fields like filename or uploadDate
``` javascript
console.log(explMerge.merge_reason);
console.log(explMerge.entry_id.name);
console.log(explMerge.entry_id.severity);
console.log(explMerge.record_id.filename);
console.log(explMerge.record_id.uploadDate);
```
You can count merge history entries with various conditions
``` javascript
bbr.mergeCount('allergies', 'patientKey', {}, function(err, count) {
  console.log(count);
});

bbr.mergeCount('allergies', 'patientKey', {merge_reason: 'new'}, function(err, count) {
  console.log(count);
});

bbr.mergeCount('allergies', 'patientKey', {merge_reason: 'duplicate'}, function(err, count) {
  console.log(count);
});
```

blue-button-record also stores 'partial entries' which cannot immediately become part of the master health record since they are similar enough to existing entries but not identical to become duplicates.  In addition to blue-button health data, partial records also include a pointer to the existing entry and match information
``` javascript
var partialAllergy = {
  partial_array: allergy,
  match_record_id: id,
  partial_match: {
    diff: {severity: 'new'},
    percent: 80,
    subelements: []
  }
};
```
By default match information is assumed to have three fields: diff, subelements, and percent.  diff and sublements can be of any object and percent must be a number.  This default is to accomodate match information available from [blue-button-match](https://github.com/amida-tech/blue-button-match).  

Partial entries are persisted as sections
``` javascript
bbr.savePartialSection('allergies', 'patientKey', partialAllergies, fileId, function(err) {
  if (err) throw err;
});
```
blue-button health data piece of partial entries are available similarly to master health record sections
``` javascript
var partialId = null;
bbr.getPartialSection('allergies', 'patientKey', function(err, partialAllergies) {
  if (err) throw err;
  partialId = partialAllergies[0]._id;
});
```
the same data together with selected fields from the existing matching entry and the match information is available as a list
``` javascript
bbr.getMatches('allergies', 'patientKey', 'name severity', function(err, matches) {
  if (err) throw err;
  var match = mathches[0];
  console.log(match.entry_id.name);           // existing
  console.log(match.entry_id.severity);
  console.log(match.match_entry_id.name);     // partial
  console.log(match.match_entry_id.severity);
  console.log(match.diff.severity);           // match information  
  console.log(match.percent);
  var matchId = match._id;
});
```
Individual match access is also available and will return the full blue-button data both for the existing entries and the partial entries
``` javascript
bbr.getMatch('allergies', matchId, function(err, match) {
  if (err) throw err;
  console.log(match.entry_id.name);           // existing
  console.log(match.entry_id.status);
  console.log(match.match_entry_id.name);     // partial
  console.log(match.match_entry_id.status);
  console.log(match.diff.severity);           // match information  
  console.log(match.percent);
});
```
Only count of matches can be accessed instead of full list
``` javascript
bbr.matchCount('allergies', 'patientKey', {}, function(err, count) {
  console.log(count);
});

bbr.matchCount('allergies', 'patientKey', {percent: 90}, function(err, count) {
  console.log(count);
});
```

Matches can be canceled either outright or after contributing some fields to the existing entry
``` javascript
bbr.cancelMatch('allergies', matchId, 'ignored', function(err, count) {
  console.log(count);
});

bbr.cancelMatch('allergies', matchId, 'merged', function(err, count) {
  console.log(count);
});

```
or they can be accepted and become part of the master health record.
``` javascript
bbr.acceptMatch('allergies', matchId, 'added', function(err, count) {
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
  reviewed: Boolean,
  archived: Boolean
};
```

All the fields before 'patKey' directly comes from [blue-button](https://github.com/amida-tech/blue-button) models and is documented there.  Remaining fields are identical for all collections.  'patKey' is the key for the patient whom this entry belongs.  'metadata.attribution' links patient data collections to merge history collections.  'reviewed=false' identifies all partial entries.  'archieved=true' identifies all partial entries that are ignored or merged and is not part of the health record.

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

'entry_type' is a convenience field and holds the type of the entry.  It can have the values: 'allergy', 'demographic', 'social', 'problem', 'procedure', 'medication', 'vital', 'immunization', or 'encounter'.  'patKey' is the patient key.  'entry_id' and 'record_id' respectively link the merge history to patient data and source file.  'merged' is the time that the merge history record is created.  'merge_reason' can currently be 'new', 'update' or 'duplicate'.  'archived=true' identifies all the merge history entries that is linked to patient data collections that has the same flag and is an another convenience field.  

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

All the fields until the percent has identical descriptions to corresponding merge history collection ('allergymerges' for 'allergymatches'). 'percent', 'diff' and 'subelements' describe the details of the partial match for which detailed information can be found in [blue-button-match](https://github.com/amida-tech/blue-button-match).  'determination' describes the action that user took such as 'merged', 'added' or 'ignored'.
