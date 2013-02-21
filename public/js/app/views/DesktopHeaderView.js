define([ 'marionette', 'handlebars', 'text!templates/desktopHeader.html'],
    function ( Marionette, Handlebars, template) {
        //ItemView provides some default rendering logic
        return Marionette.ItemView.extend({
            template:Handlebars.compile(template)
        });
    });