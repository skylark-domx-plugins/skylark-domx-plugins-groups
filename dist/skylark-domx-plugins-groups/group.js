/**
 * skylark-domx-plugins-groups - The skylark list plugin library.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-domx/skylark-domx-plugins-groups/
 * @license MIT
 */
define(["skylark-langx/langx","skylark-domx-query","skylark-domx-velm","skylark-domx-plugins-base","./groups"],function(e,t,s,i,l){"use strict";var n=i.Plugin.inherit({klassName:"Group",pluginName:"lark.groups.group",options:{classes:{},selectors:{},item:{template:'<span><i class="glyphicon"></i><a href="javascript: void(0);"></a> </span>',selector:"li",selectable:!1,multiSelect:!1,classes:{base:"item",selected:"selected",active:"active"}}},selected:null,_construct:function(e,t){this.overrided(e,t);var i=this,l=this._velm=s(this._elm),n=this.options.item.selector;l.on("click",n,function(){if(!s(this).hasClass("disabled")){let e=i.getItemValue(this);i.setActiveItem(e),i.options.item.selectable&&(i.options.item.multiSelect?i.toggleSelectOneItem(e):(i.clearSelectedItems(),i.selectOneItem(e)))}return!1}),this.resetItems()},resetItems:function(){this._$items=this._velm.$(this.options.item.selector)},findItem:function(s){return(e.isNumber(s)?this._$items.eq(s):e.isString(s)?this._$items.filter('[data-value="'+s+'"]'):t(s))[0]},getItems:function(){return this._$items},getItemValue:function(e){let s=t(e),i=s.data("value");return void 0===i&&(i=this._$items.index(s[0])),i},getItemsCount:function(){return this._$items.size()},getItemIndex:function(e){return this._$items.index(e)},isSelectedItem:function(e){return t(this.findItem(e)).hasClass(this.options.item.classes.selected)},selectOneItem:function(e){t(this.findItem(e)).addClass(this.options.item.classes.selected)},unselectOneItem:function(e){t(this.findItem(e)).removeClass(this.options.item.classes.selected)},clearSelectedItems:function(){let e=this.options.item.classes.selected;this._$items.filter(`.${e}`).removeClass(e)},getSelectedItemValues:function(){let e=this.options.item.classes.selected;return this._$items.filter(`.${e}`).map(e=>this.getItemValue(e))},getSelectedItems:function(){let e=this.options.item.classes.selected;return this._$items.filter(`.${e}`)},getActiveItem:function(){let e=this.options.item.classes.active;return this._$items.filter(`.${e}`)[0]||null},setActiveItem:function(e){let s=this.getActiveItem(),i=this.findItem(e);if(i!=s){let e=this.options.item.classes.active;t(s).removeClass(e),t(i).addClass(e)}},getSelectedItem:function(){return this.getSelectedItems()[0]||null},toggleSelectOneItem:function(e){this.isSelectedItem(e)?this.unselectOneItem(e):this.selectOneItem(e)},renderItemHtml:function(t){if(!this._renderItemHtml){let t=this.options.item.template;e.isString(t)?this._renderItemHtml=e.template(t):e.isFunction(t)&&(this._renderItemHtml=t)}return this._renderItemHtml(t)}});return i.register(n),l.Group=n});
//# sourceMappingURL=sourcemaps/group.js.map