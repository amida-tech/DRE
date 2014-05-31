DRE-UX
=========

DRE-UX is demo frontend for Raccoon. [Raccoon](https://github.com/amida-tech/Raccoon) is a node.js Data Raccoonciliation Engine for Health Data.

[![Build Status](https://travis-ci.org/amida-tech/DRE-UX.svg)](https://travis-ci.org/amida-tech/DRE-UX)
[![Coverage Status](https://coveralls.io/repos/amida-tech/DRE-UX/badge.png)](https://coveralls.io/r/amida-tech/DRE-UX)


###Prerequisites

- Node.js (v0.10+) and NPM
- Grunt.js
- MongoDB

###Quick up and running quide

```
# you need Node.js and Grunt.js installed
# and MongoDB runnning

#build client app
cd client
npm install
grunt

#run server side tests
cd ..
cd server
npm install
grunt

#run server
node server.js

# go to localhost:3000 in your browser
```

###Screenshots of demo app

![Dashboard](./docs/images/dashboard.png)
![Storage](./docs/images/storage.png)
![Allergies Section](./docs/images/allergies.png)
![Updates](./docs/images/updates.png)
