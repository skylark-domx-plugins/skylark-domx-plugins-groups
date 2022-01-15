 define([
  "skylark-langx/langx",
  "skylark-domx-query",
  "skylark-domx-velm",
  "skylark-domx-plugins-base",
  "./groups",
  "./group"
],function(langx,$,elmx,plugins,groups,Group){
  'use strict'

  var Tiler = Group.inherit({
    klassName : "Tiler",

    pluginName : "lark.groups.tiler",

    options: {
        alignment: 'left',
        itemRendered: null,
        noItemsHTML: 'no items found',
        item : {
            selector : "div.thumbnail",
            template: '<div class="thumbnail"><img height="75" src="<%= href %>" width="65"><span><%= title %></span></div>',
            selectable : true,
            classes : {
              base : "thumbnail"
            }
        },
        renderItem : null
    },

    _construct: function (elm, options) {
      this.overrided(elm, options);
    }

  });


  plugins.register(Tiler);

  return groups.Tiler = Tiler;	
});