MRB-Lite (Marionette Require Boilerplate)
==================================
![Example](http://sidnet.info/sites/default/files/marionette-logo.png)   ![Example](http://3.bp.blogspot.com/-JFOJ-k6tLnA/TsiKgBYPvqI/AAAAAAAAAT8/dGXeu0LeuTE/s320/backbone-js-logo.png) ![Example](http://requirejs.org/i/logo.png)

#Description
A Lightweight boilerplate project based off [Marionette-Require-Boilerplate](https://github.com/brettjonesdev/Marionette-Require-Boilerplate), providing a simple Marionette application built with Require.js and Grunt in keeping with best practices.  Part of the [BoilerplateMVC](https://github.com/BoilerplateMVC) suite.

#What's different from Marionette-Require-Boilerplate?
   This project eschews the mobile/desktop dichotomy, instead providing a single application Init file, and falling back on the App.mobile flag to differentiate behavior between environments.  This makes it faster to get up and running. It also does not include jQueryUI and jQueryMobile, relying on bootstrap's responsive nature instead.  

#Getting Started
   1. Download and install [Node.js](http://nodejs.org/#download)
   2. Clone this repository
   3. On the command line, type `npm install nodemon -g` to install the [nodemon](https://github.com/remy/nodemon) library globally.  If it complains about user permissions type `sudo npm install nodemon -g`.
   4.  If you have installed [Grunt](http://gruntjs.com/) globally in the past, you will need to remove it first by typing `npm uninstall -g grunt`.  If it complains about user permissions, type `sudo npm uninstall -g grunt`.
   5.  Next, install the latest version of [Grunt](http://gruntjs.com/) by typing `npm install -g grunt-cli`.  If it complains about user permissions, type `sudo npm install -g grunt-cli`. 
   6. Navigate to inside of the **Backbone-Require-Boilerplate** folder and type `npm install`
   7. Next, type `nodemon` (this will start your Node.js web server and restart the server any time you make a file change thanks to the wonderful **nodemon** library)
   8. To view the demo page, go to `http://localhost:8001`
   9. To view the Jasmine test suite page, go to `http://localhost:8001/specRunner.html`
   10. Type `grunt` to run your grunt build and create minified .js and .css files
   11. Enjoy using Marionette, Backbone, Require, Grunt, Lodash, jQuery,Twitter Bootstrap, and Handlebars!

#Tour of the Boilerplate Files

index.html
----------
    _Development Mode_
    Include Require.js via script tag, specifying your application init file `Init.js` via the `data-main` attribute, and `app.css` as your CSS file.

    _Production Mode_
    Include `Init.min.js` in your script tag, and `app.min.css` as your CSS file.

Init.js
-------------
   Configure Require.js, starting with the paths.  Setting paths allow you to define an alias name and file path for any file that you like.

   Typically, you want to set a path for any file that will be listed as a dependency in more than one module (eq. jQuery, Marionette, Backbone).  This saves you some typing, since you just have to list the alias name, and not the entire file path, when listing dependencies.  After all of the file paths are set, you will find the Shim configuration (Added in Require.js 2.0).

   The Shim configuration allows you to easily include non-AMD compatible JavaScript files with Require.js.  This is very important, because Backbone versions > 0.5.3 no longer support AMD (meaning you will get an error if you try to use both Require.js and the latest version of Backbone).  Marionette also does not support AMD.  This configuration is a much better solution than manually editing non-AMD compatible JavaScript files to make sure the code is wrapped in a `define` method.  Require.js creator [James Burke](http://tagneto.blogspot.com/) previously maintained AMD compatible forks of both Backbone.js and Underscore.js because of this exact reason.

        shim:{
            "bootstrap":["jquery"],
            "jqueryui":["jquery"],
            "backbone":{
                "deps":["underscore"],
                // Exports the global window.Backbone object
                "exports":"Backbone"
            },
            "marionette":{
                "deps":["underscore", "backbone", "jquery"],
                // Exports the global window.Marionette object
                "exports":"Marionette"
            },
            "handlebars":{
                "exports":"Handlebars"
            },
            // Backbone.validateAll plugin (https://github.com/gfranko/Backbone.validateAll)
            "backbone.validateAll":["backbone"]
        }

   The Shim configuration also takes the place for the old Require.js `order` plugin.  Within the Shim configuration, you can list files and their dependency tree.  An example is jQuery plugins being dependent on jQuery:

         shim: {
            // Twitter Bootstrap plugins depend on jQuery
            "bootstrap": ["jquery"]
         }

   **Note**: You do not need a shim configuration for [jQuery](http://www.jquery.com) or [lodash](https://github.com/bestiejs/lodash) because they are both AMD compatible.

   After Require is configured, our dependencies are loaded, and we start `App`, our Marionette.Application!

App.js
------
   Here we create a new instance of a Marionette.Application.

   [Marionette.Application](https://github.com/marionettejs/backbone.marionette/blob/master/docs/marionette.application.md) is the heart of the Marionette framework.  The [Regions](https://github.com/marionettejs/backbone.marionette/blob/master/docs/marionette.region.md), [Layouts](https://github.com/marionettejs/backbone.marionette/blob/master/docs/marionette.layout.md) and [AppRouters](https://github.com/marionettejs/backbone.marionette/blob/master/docs/marionette.approuter.md) you create are typically hung off of a singleton instance of `Marionette.Application`.

   One of Marionette's strengths is that it introduces a Composite architecture, which lets you organize your application into separate regions or areas, with their own self-contained logic and structure.  One of the main ways this can be done is with [Regions](https://github.com/marionettejs/backbone.marionette/blob/master/docs/marionette.region.md).  In App.js, we divide our application into two regions - the `headerRegion` and `mainRegion`, like so:

        App.addRegions({
            headerRegion:"header",
            mainRegion:"#main"
        });

   This searches the DOM for a `<header>` element and for an element with an `id` of `main` and creates a new `Marionette.Region` for each.  Regions have a `show` method which can be passed a `View`.  When a view is passed to a `Region.show`, the view is appended to the Regions associated DOM element and its `render` method is triggered.  An associated `close` method is also available, which contains some basic logic for tearing down the Region's view.  We will see how `show` is used later in MobileController.js.

AppRouter.js
------------
   AppRouter.js is where you can configure application-level routing paths.  It is a simple example of a Marionette.js AppRouter class, which is a variation of a Backbone.Router.  AppRouter's allow you to configure routes in an `appRoutes` map.  When a route in `appRoutes` is fired from a hash change event, it gets handled in the AppRouter's associated `controller` attribute object.  `AppRouter.controller` can actually be any object with method names that match the values in `appRoutes`, but Marionette provides a simple `Marionette.Controller` object which can be used for this purpose, and which provides Marionette event-handling and an `initialize` method.  

   Here is a simple example of how a Marionette.Controller and Marionette.AppRouter interact:
        
        var AppRouter = new Backbone.Marionette.AppRouter({
           //"index" must be a method in AppRouter's controller
           appRoutes: {
               "home": "home"
           }, 
           controller: new Backbone.Marionette.Controller({
                home: function() {
                    //do something
                }
            })
        });

   Here we see that when a URL change event occurs and the URL hash matches `#home`, the `index` method in `AppRouter.controller` will be fired.  In our application, we implement a different Controller for Mobile than for Desktop.  This is just an optional way to handle differences between Mobile and Desktop versions of the application - the same routes will be handled by different controllers depending on the user's device.  There is currently only one appRoute listed in AppRouter.js (which gets called if there is no hash tag on the url), but feel free to create more for your application.

MobileController.js
----------------
   MobileController.js is an example of a `Marionette.Controller` as described above.  Please note that a Controller in Marionette is different than a typical MVC controller.  Read more about it [here](https://github.com/marionettejs/backbone.marionette/blob/master/docs/marionette.controller.md).  In MobileController's `initialize` method, we show our first View, `MobileHeaderView` in the `App.headerRegion` region. 

        initialize:function (options) {
            App.headerRegion.show(new MobileHeaderView());
        },

   Then, in our `index` function - which handles hash change routing from the `AppRouter` as described above - we show a `WelcomeView` in the Application's `mainRegion`:

        index:function () {
            App.mainRegion.show(new WelcomeView());
        }


DesktopController.js
--------------------
   DesktopController.js is almost identical to MobileController, except that instead of showing a `MobileHeaderView` in the `headerRegion`, we rather predictably show a `HeaderView`.  Again, note that this parallel DesktopController/MobileController is just one way that an application could handle the differences between a mobile and desktop version of an application.  There are many, many other ways this could be done, so don't let this get in your way if it's not exactly what you're after.


WelcomeView.js
-----------
   WelcomeView.js will be used by both the mobile and desktop versions of your application.  It starts with a define method that lists all of its dependencies.

   The rest of the file is a simple implementation of Marionette.ItemView, which is itself a derivative of Backbone.View.  The RequireJS `text` plugin is used to load `welcome.html` as a string, which is set as the `template` attribute on our `WelcomeView` class.  

   Backbone.js View's have a one-to-one relationship with DOM elements, and a View's DOM element is listed in the `el` property, or is created as a simple `div` if none is specified.  The jQuery-wrapped DOM element is then available as `$el`.  The View's `model` is set to a new instance of Model.js, listed above as a dependency.  

   Marionette.ItemView is an extension of the base Backbone.View, but contains some basic logic for rendering and tearing down the view.  If a View's `template` attribute is set to a template function created by an engine like Handlebars or Underscore, ItemView's `render` method will automatically render the View's `$el` for you.  Of course you are also free to write your own simple `render` method.  Our `HeaderView` is a good example of the simplest of possible views:

define(['underscore', 'jquery', 'handlebars', 'text!templates/header.html'],
    function (_, $, Handlebars, template) {
        return Backbone.Marionette.ItemView.extend({
            template:Handlebars.compile(template)
        });
    });

Here we use the `text` plugin to load header.html in as a template string, and then compile it into a function with Handlebars.  There are handy plugins out there which condense this step for you.  For Handlebars, consider using the [require-handlebars-plugin](https://github.com/SlexAxton/require-handlebars-plugin).  For Underscore, consider [require-tpl](https://github.com/ZeeAgency/requirejs-tpl).

   Next you will find an `events` object.  This is where all of your View DOM event handlers associated with the HTML element referenced by your View's `el` property should be stored.  Keep in mind that Backbone is using the jQuery `delegate` method, so it expects a selector that is within your View's `el` property.  I did not include any events by default, so you will have to fill those in yourself.  Below is an example of having an events object with one event handler that calls a View's `someMethod()` method when an element with a class name of _someElement_ is clicked.

            // View Event Handlers
            events: {

               "click .someElement": "someMethod"

            },


   Finally, I am returning the View class.


   **Note**: If you have read all of the documentation up until this point, you will most likely have already noticed that [lodash](https://github.com/bestiejs/lodash) is being used instead of Underscore.js.  Apart from having a bit better cross-browser performance and stability than Underscore.js, lodash also provides a custom build process.  Although I have provided a version of lodash that has all of the Underscore.js methods you would expect, you can download a custom build and swap that in.  Also, it doesn't hurt that Lodash creator, [John-David Dalton](https://twitter.com/jdalton), is an absolute performance and API consistency maniac =)


welcome.html
------------
 This file includes a template that is included via the Require.js [text plugin](https://github.com/requirejs/text).  Templates are typically a useful way for you to update your View (the DOM) if a Model attribute changes.  They are also useful when you have a lot of HTML and JavaScript that you need to fit together, and instead of concatenating HTML strings inside of your JavaScript, templates provide a cleaner solution.  Look at Handlebars' and Underscore's documentation to read more about the respective syntax of these handy templating solutions.

Model.js
--------
   Model.js is used by both the mobile and desktop versions of your application.  It starts with a define method that lists jquery and backbone as dependencies.

   The rest of the file is a pretty standard Backbone.js Model class.

   Like other Backbone.js classes, there is an `initialize()` method that acts as the Model's constructor function.  There is also a **defaults** object that allows you to set default Model properties if you wish.

   Finally, The Backbone.js `validate` method is provided for you.  This method is called any time an attribute of the model is set.  Keep in mind that all model attributes will be validated (once set), even if a different model attribute is being set/validated.  This does not make much sense to me, so if you prefer only the Model attributes that are currently being saved/set to be validated, then use the validateAll option provided by [Backbone.validateAll](https://github.com/gfranko/Backbone.validateAll).

   Finally, a new Model class is returned.

Collection.js
------------------
   Collection.js is used by both the mobile and desktop versions of your application.  It starts with a define method that lists jquery, backbone, and UserModel.js as dependencies.

   The rest of the file is a pretty standard Backbone.js Collection class that is used to store all of your Backbone Models.  The Collection model property is set to indicate that all Models that will be within this Collection class will be of type Model (the dependency that is passed into the file).

   Finally, a new Collection class is returned.

app.build.js
------------
   This file is ready made for you to have your entire project optimized using Node.js, the [Require.js Optimizer](https://github.com/jrburke/r.js/) and (optionally) [almond.js](https://github.com/jrburke/almond).

   Almond.js a lightweight AMD shim library created by [James Burke](https://github.com/jrburke), the creator of Require.js.  Almond is meant for small to medium sized projects that use one concatenated/minified JavaScript file.  If you don't need some of the advanced features that Require.js provides (lazy loading, etc) then Almond.js is great for performance.  



**Note**: The Require.js optimizer works by **static* analysis - it looks at your main config file and then peeks in each specified dependency file, noting their dependencies as well until all dependencies have been discovered, and then concatenates them all into an optionally minified output file.  However, in App.js of our application, we **dynamically** load either MobileController.js or DesktopController.js.  That means that in the static analysis, these dependencies are not detected.  If we are using Almond.js, then our build output will error out saying these dependencies are not found, since Almond does not actually perform asynchronous script loading like the full Require.js does.  For this reason, in our project we will not be using Almond at this time.  To make sure that as many dependencies are combined into our build output as possible though, we explicitly add DesktopController and MobileController to our build configuration, like so:


        //Mobile build config
        include: ["app/config/MobileInit", "app/controllers/MobileController"]

        //Desktop build config
        include: ["app/config/DesktopInit", "app/controllers/DesktopController"]


   Marionette-Require-Boilerplate sets you up to use Require.js in both development and production, for the reason stated above.  I hope to find a way to use Almond.js with dynamically loaded dependencies and would welcome any contribution which makes this possible.  

   By default, Marionette-Require-Boilerplate is in _development_ mode, so if you want to try out the production build, read the production instructions below.

   **Production Build Instructions**

   Navigate to within the **deploy** folder and then type **node app.build.js** and wait a few seconds.  Once the script has finished, you will see that both _DesktopInit.min.js_ and _MobileInit.min.js_ will be updated.

   Next, update the `loadRequireJS` method calls inside of **index.html** to now point to your minified desktop and mobile init files instead of the non-minified versions.  Look at the index.html file in this [gist](https://gist.github.com/3752005) for the correct _production_ setup.

   And that's it!  If you have any questions just create in an issue on Github.

SpecRunner.html
---------------
   This file is the starting point to your Jasmine test suite.  It includes Require.js and points it to **testInit.js**

TestInit.js
-----------
   This file includes all of the Require.js configurations for your Jasmine unit tests.  This file will look very similar to the **MobileInit.js** and **DesktopInit.js** files, but will also include Jasmine and the jasmine-jquery plugin as dependencies.

   You will also notice a _specs_ array that will allow you to add as many specs files as your application needs (Specs folders are where your unit tests are).  The boilerplate only includes one specs js file by default, so only one specs item is added to the array.  Finally, once the specs file is included by the `require()` call, Jasmine is initialized

spec.js
-------
   This file contains all of your Jasmine unit tests.  Only seven tests are provided, with unit tests provided for Views, Models, Collections, and Routers (Mobile and Desktop).  I'd write more, but why spoil your fun?  Read through the tests and use them as examples to write your own.

   The entire file is wrapped in an AMD define method, with all external module (file) dependencies listed.  The Jasmine tests should be self explanatory (BDD tests are supposed to describe an app's functionality and make sense to non-techy folk as well), but if you have any questions, just file an issue and I'll respond as quickly as I can.


#FAQ

**What libraries have you included?**

   -Marionette, Backbone, Require, Lodash, Almond, jQuery, jQueryUI, jQuery Mobile, Twitter Bootstrap, and Handlebars

**What Require.js plugins are you using?**

   -Just the Require.js text plugin, since it provides an easy way to keep templates in their own folders (instead of just embedding them in your html files).  I was previously using Use.js to load non-AMD compatible scripts, but Require.js 2.0 now provides this functionality.

**Why are you not using the Require.js Internationalization plugin?**

   -I found that when I built using the Require.js Optimizer, only one lang-locale could be included per optimized file.  That would mean, that if you had to support 10 different langs/locales, you would need 20 different optimized builds (Desktop and Mobile).  If I am mistaken about this, please let me know, and I will update the Boilerplate with the Internationalization plugin.  A solution for including localized text is in the roadmap and will be included in a future release of the project.

**You're not using Grunt for your build process?  Are you some sort of newb?**

   -No, but I am still debating whether or not I will include Grunt for this project.

**Do I have to use everything the boilerplate gives me?**

   -No!  Feel free to update the boilerplate to fit the needs of your application.  Certain things that you might not want/need include templates, mobile and desktop versions, jQuery Mobile, etc.

**Do I need a web server to test the boilerplate?**

   -Yep, because the Require.js text plugin dynamically pulls in template files via ajax (which is not allowed with the `File://` local extension.  Luckily for you I have provided an easy to use Node.js web server for convenience.

**Can I contribute to this project?**

   -Please do!  I am learning just like you.  If you want to contribute, please send pull requests to the dev branch.



##Change Log

`0.1.0` - January 21, 2012

Cloned project based off of [Greg Franko](https://github.com/gfranko)'s [Backbone-Require-Boilerplate](https://github.com/gfranko/Backbone-Require-Boilerplate) project.  

Added Marionette and Handlebars

##Contributors
[Brett Jones](https://github.com/brettjonesdev), [Greg Franko](https://github.com/gfranko), [Nick Pack](https://github.com/nickpack)

## License
Copyright (c) 2012 Brett Jones, Greg Franko  
Licensed under the MIT license.		


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/bitdeli/bd-toydata-widget-gallery/trend.png)](https://bitdeli.com/free "Bitdeli Badge")
