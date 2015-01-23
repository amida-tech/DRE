Data Reconciliation Engine (DRE)
=========

DRE is a demo frontend and Node.js server for reconciling health data.

aka. Raccoon - Data Raccoonciliation Engine for Health Data.

![Raccoon](http://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Yawning_Raccoon.jpg/976px-Yawning_Raccoon.jpg)

[![Build Status](https://travis-ci.org/amida-tech/DRE.svg)](https://travis-ci.org/amida-tech/DRE)

High Level Overview
===================
![Raccoon High Level Diagram](docs/images/dre_overview_new.png)

The purpose of the Data Raccoonciliation Engine is to take personal health data in a variety of formats (starting with BlueButton/CCDA) from multiple sources and parse/normalize/de-duplicate/merge it into a single Patient's Master Health Record with patient assistance (although most of hard work will be done automagically).


Raccoon's components
=================
![Raccoon Components Diagram](docs/images/dre_four_components.png)

Raccoon has 4 primary elements

#### 1 - Parsing and Normalization Library.

This parses incoming data into a homogenous, simplified and normalized data model in JSON format. 

Parsing library code: [amida-tech/blue-button](https://github.com/amida-tech/blue-button)


#### 2 - Matching Library.

This takes the standardized data elements and flags probable duplicate values. New patient records are compared against the existing Master Health Record and automatically matched. The result produces a list of all entries in the new record, labelled as duplicates (0 % match), new entries (100% match), or partial matches (to be reconciled by patient in a next step).

Matching library code: [amida-tech/blue-button-match](https://github.com/amida-tech/blue-button-match)

#### 3 - Reconciliation Interface.

This provides a RESTful API and UI for review and evaluation of duplicate or partially matched entries, by the patient.

#### 4 - Master Record Interface.

This provides a API for interaction with and access to the aggregated health record.

Documentation for record.js [API](./docs/recordjs.md)

###Screenshots of demo app

![Home Screen](./docs/images/dre_01.png)
![Master Health Record View](./docs/images/dre_02.png)
![Files Upload](./docs/images/dre_03.png)
![Notifications](./docs/images/dre_04.png)
![Updates](./docs/images/dre_05.png)
![Updates Review](./docs/images/dre_06.png)
![Partial Match Review](./docs/images/dre_07.png)


##Quick up and running quide

###Prerequisites

- Node.js (v0.10+) and NPM
- Grunt.js
- MongoDB
- Redis

```
# you need Node.js and Grunt.js installed
# and MongoDB + Redis runnning

#build client app
cd client
npm install
grunt

#run server side tests
cd ..
npm install
grunt

#run server
node server.js

# go to localhost:3000 in your browser
```


## Contributing

Contributors are welcome. See issues https://github.com/amida-tech/DRE/issues

## Release Notes

See release notes [here] (./RELEASENOTES.md)

## License

Licensed under [Apache 2.0](./LICENSE)
