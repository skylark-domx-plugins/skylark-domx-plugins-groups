 define([
  "skylark-langx/langx",
  "skylark-domx-query",
  "skylark-domx-velm",
  "skylark-domx-plugins-base",
  "skylark-domx-plugins-toggles/collapse",
  "./groups",
  "./group"
],function(langx,$,elmx,plugins,Collapse,groups,Group){
  'use strict'

  var Linear = Group.inherit({
    klassName : "Linear",

    pluginName : "lark.groups.linear",

    options: {
        item : {
          selectable: true
        }
    },

    _construct: function (elm, options) {
      this.overrided(elm, options);

    }

  });

  plugins.register(Linear);

  return groups.Linear = Linear;

});



