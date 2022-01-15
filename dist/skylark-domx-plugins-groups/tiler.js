/**
 * skylark-domx-plugins-groups - The skylark list plugin library.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-domx/skylark-domx-plugins-groups/
 * @license MIT
 */
define(["skylark-langx/langx","skylark-domx-query","skylark-domx-velm","skylark-domx-plugins-base","./groups","./group"],function(e,l,t,i,s,r){"use strict";var n=r.inherit({klassName:"Tiler",pluginName:"lark.groups.tiler",options:{alignment:"left",itemRendered:null,noItemsHTML:"no items found",item:{selector:"div.thumbnail",template:'<div class="thumbnail"><img height="75" src="<%= href %>" width="65"><span><%= title %></span></div>',selectable:!0,classes:{base:"thumbnail"}},renderItem:null},_construct:function(e,l){this.overrided(e,l)}});return i.register(n),s.Tiler=n});
//# sourceMappingURL=sourcemaps/tiler.js.map
