#Prototype User Interface for Personal Health Record

##This project uses design practices discovered during Amida's user experience efforts to show a fully clickable and responsive implementation of a prototype Personal Health Record.


####Overview

This project is written in [AngularJS](https://angularjs.org/), and uses a few complimentary projects:
	
 - [Yeoman](http://yeoman.io/) for project templating.
 - [Yeoman AngularJS Generator](https://github.com/yeoman/generator-angular) for AngularJS templating.
 - [Bower](http://bower.io/) for dependency management.
 - [Compass](http://compass-style.org/) for SCSS compilation.
 - [Grunt](http://gruntjs.com/) for build management.

Additional dependencies exist for this project, and are managed through Bower.

####Getting Started

To get started you will need to install Bower, Compass, Yeoman and Grunt.  Instructions for installation of those packages are available on the respective websites. 

Below is quick summary, assuming you have Ruby, Node.js and NPM running.

```
npm install -g bower

gem update --system
gem install compass

npm install -g yo

npm install -g grunt-cli

npm install -g generator-angular

```

Install dependencies from base project directory:

```
npm install

bower install
```

From the base project directory, you can use Grunt to build and execute the following commands:

```grunt``` - Will execute build and run all test cases.

```grunt build``` - Executes build without running tests.

```grunt test``` - Runs all test cases against current build.

```grunt serve``` - Runs build and serves pages on localhost.

####License

Licensed under [Apache 2.0 License]('http://www.apache.org/licenses/LICENSE-2.0').

All original content licensed under the [Creative Commons 4.0 Attribution License]('http://creativecommons.org/licenses/by/4.0/').