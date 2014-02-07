jQuery Custom Validation Plugin
Author: Donald Jones

This plugin will validate a form input as focus leaves the form element and will validate all form elements within a given HTML form when the form is submitted. 

The submit functionality can be extended as are the required attribute configurable by overriding its settings. 

It will specify the error message for a given input below the input in a created span unless otherwise given a target in the settings. 

Unless overriden in the sattings the plugin will use the 'data-val-required' HTML attribute (the default for ASP.NET MVC) to determine which HTML inputs require a value to submit. 

It uses a series of regular expressions matched by the data type of the input to determine whether or not an input value is valid.


