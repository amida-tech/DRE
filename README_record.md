blue-button-record
==================

Blue Button Mongo Layer

## Library interfaces/APIs

This library provides following functionality

- Persist blue-button data
- Persist merges
- Persist files

### Usage example

Require blue-button and blue-button-record modules

``` javascript
var bb = require("blue-button");
var record = require("blue-button-record");
```

record assumes mongodb is already running.  Connect to the database

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

Get the sections from the database

``` javascript
var id0 = null;
record.getAllergies('patientKey', function(err, result) {
  if (err) throw err;
  id0 = result._id;
});

```
Result is an array of allergies.  Each entry includes metadata and property '_id" which you can later to access
specific allergy.  You can clean up metadata and other non blue-button data which is comparable to ccd.allergies

``` javascript
var cleanResult = record.cleanSectionEntries(result);
```

You can count number of entries for a particular section

``` javascript
  record.allergyCount({patKey: 'patientKey'}, function(err, count) {
    console.log(count);
  });
```

Once you persists a new entry it will be saved with merge_reason: 'new'.  Once you find the same 
entry in a new file you can update the merge data.  Currently only record_id and merge_reason
fields are supported

``` javascript
 var mergeInfo = {record_id: newfileId, merge_reason: 'duplicate'};
 record.addAllergyMergeEntry(id0, mergeInfo, function(err) {
  if (err) throw err;
 });
```

You can get all the merges for a section and also specify the fields you want from the section and the 
storage

``` javascript
record.getMerges('allergy', 'name severity', 'filename uploadDate', function(err, mergeList) {
  console.log(mergeList.length);
});
```

You can count merges

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

finally you can access all the persisted files

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

