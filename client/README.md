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

```grunt``` - Does nothing but linting.

```grunt build``` - Executes build and puts it into /dist.

```grunt dev``` - Build and watch files for development (just linting, compiling styles and watching).

####Release Build

Running ```grunt serve``` will serve a version of the interface which is meant for development; this command skips several build steps for quicker compilation.

For a release or deployment of the interface, running ```grunt build:dist``` will compile a more thoroughly optimized version.  Additionally, running ```grunt serve:dist``` will serve this optimized version.

####e2e Testing

This project uses [Protractor](https://angular.github.io/protractor/#/) to run end-to-end tests. To set up for Protractor testing:
```
npm install -g protractor
webdriver-manager update
webdriver-manager start
```
This will start a Selenium server for Protractor to use. To learn more, check out the [tutorial](https://angular.github.io/protractor/#/tutorial).

In order to successfully execute the tests, you will also need to run the DRE server.

####License

Licensed under [Apache 2.0 License]('http://www.apache.org/licenses/LICENSE-2.0').

All original content licensed under the [Creative Commons 4.0 Attribution License]('http://creativecommons.org/licenses/by/4.0/').