/**
 * skylark-domx-plugins-groups - The skylark list plugin library.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-domx/skylark-domx-plugins-groups/
 * @license MIT
 */
(function(factory,globals) {
  var define = globals.define,
      require = globals.require,
      isAmd = (typeof define === 'function' && define.amd),
      isCmd = (!isAmd && typeof exports !== 'undefined');

  if (!isAmd && !define) {
    var map = {};
    function absolute(relative, base) {
        if (relative[0]!==".") {
          return relative;
        }
        var stack = base.split("/"),
            parts = relative.split("/");
        stack.pop(); 
        for (var i=0; i<parts.length; i++) {
            if (parts[i] == ".")
                continue;
            if (parts[i] == "..")
                stack.pop();
            else
                stack.push(parts[i]);
        }
        return stack.join("/");
    }
    define = globals.define = function(id, deps, factory) {
        if (typeof factory == 'function') {
            map[id] = {
                factory: factory,
                deps: deps.map(function(dep){
                  return absolute(dep,id);
                }),
                resolved: false,
                exports: null
            };
            require(id);
        } else {
            map[id] = {
                factory : null,
                resolved : true,
                exports : factory
            };
        }
    };
    require = globals.require = function(id) {
        if (!map.hasOwnProperty(id)) {
            throw new Error('Module ' + id + ' has not been defined');
        }
        var module = map[id];
        if (!module.resolved) {
            var args = [];

            module.deps.forEach(function(dep){
                args.push(require(dep));
            })

            module.exports = module.factory.apply(globals, args) || null;
            module.resolved = true;
        }
        return module.exports;
    };
  }
  
  if (!define) {
     throw new Error("The module utility (ex: requirejs or skylark-utils) is not loaded!");
  }

  factory(define,require);

  if (!isAmd) {
    var skylarkjs = require("skylark-langx-ns");

    if (isCmd) {
      module.exports = skylarkjs;
    } else {
      globals.skylarkjs  = skylarkjs;
    }
  }

})(function(define,require) {

define('skylark-domx-plugins-groups/groups',[
    "skylark-domx-plugins-base/plugins"
], function(plugins) {
    'use strict';

	return plugins.groups = {};
});

 define('skylark-domx-plugins-groups/group',[
  "skylark-langx/langx",
  "skylark-domx-query",
  "skylark-domx-velm",
  "skylark-domx-plugins-base",
  "./groups"
],function(langx,$,elmx,plugins,groups){
  'use strict'

    /*
     * The base plugin class for grouping items.
     */
    var Group = plugins.Plugin.inherit({
        klassName : "Group",

        pluginName : "lark.groups.group",

        options : {
        	classes : {
        	},

        	selectors : {
            //container : "ul", // 
        	},

          item : {
            template : "<span><i class=\"glyphicon\"></i><a href=\"javascript: void(0);\"></a> </span>",
            selector : "li",      // ".list-group-item"

            selectable: false,
            multiSelect: false,

            classes : {
              base : "item",
              selected : "selected",
              active : "active"
            }
          },

          //active : 0,

          //A collection or function that is used to generate the content of the group 
          /*
           * example1
           *itemsSource : [{  
           *  type: 'image',href : "https://xxx.com/1.jpg",title : "1"
           *},{
           *  type: 'image',href : "https://xxx.com/1.jpg",title : "1"
           * }],
           */
          /*
           * example2
           *itemsSource :  function(){},
           */
        },

        selected : null,
 
        _construct : function(elm,options) {
            this.overrided(elm,options);
            var self = this,
                velm = this._velm = elmx(this._elm),
                itemSelector = this.options.item.selector;

            velm.on('click', itemSelector, function () {
                var veItem = elmx(this);
                if (!veItem.hasClass('disabled')) {
                    let value = self.getItemValue(this);
                    self.setActiveItem(value);

                  if (self.options.item.selectable) {

                      if (self.options.item.multiSelect) {
                        self.toggleSelectOneItem(value);
                      } else {
                        self.clearSelectedItems();
                        self.selectOneItem(value);
                      }
                  }

                }


                //veItem.blur();
                return false;
            });

            this.resetItems();

            ///if (this.options.item.multiSelect) {
            ///  this.selected = [];
            ///} else {
            ///  this.selected = null;
            ///}
            ///this.selected = this.options.selected;
        },

        resetItems : function() {
            this._$items = this._velm.$(this.options.item.selector);
        },

        findItem : function (valueOrIdx) {
          var $item;
          if (langx.isNumber(valueOrIdx)) {
            $item = this._$items.eq(valueOrIdx);
          } else if (langx.isString(valueOrIdx)) {
            $item = this._$items.filter('[data-value="' + valueOrIdx + '"]');
          } else {
            $item = $(valueOrIdx);
          }
          return $item[0];
        },

        getItems : function() {
          return this._$items;
        },

        getItemValue : function(item) {
          let $item = $(item),
              value = $item.data("value");
          if (value === undefined) {
            value = this._$items.index($item[0]);
          }
          return value;
        },

        getItemsCount : function() {
            return this._$items.size();
        },

        getItemIndex : function(item) {
            return this._$items.index(item);
        },

        
        isSelectedItem : function(valueOrIdx) {
          return $(this.findItem(valueOrIdx)).hasClass(this.options.item.classes.selected);
        },
                 
        selectOneItem : function (valueOrIdx) {
          $(this.findItem(valueOrIdx)).addClass(this.options.item.classes.selected);
        },

        unselectOneItem : function (valueOrIdx) {
          $(this.findItem(valueOrIdx)).removeClass(this.options.item.classes.selected);
        },

        /*
         * clears the selected items.
         */
        clearSelectedItems : function() {
          let selectedClass = this.options.item.classes.selected;
          this._$items.filter(`.${selectedClass}`).removeClass(selectedClass);
        },

        getSelectedItemValues : function() {
          let selectedClass = this.options.item.classes.selected;
          return  this._$items.filter(`.${selectedClass}`).map( (el) => {
            return this.getItemValue(el);
          });
        },

        getSelectedItems : function() {
          let selectedClass = this.options.item.classes.selected;
          return  this._$items.filter(`.${selectedClass}`);
        },

        getActiveItem : function() {
          let activeClass = this.options.item.classes.active,
              $activeItem = this._$items.filter(`.${activeClass}`);
          return $activeItem[0] || null;
        },

        setActiveItem : function(valueOrIdx) {
          let current = this.getActiveItem(),
              next = this.findItem(valueOrIdx);
          if (next != current) {
            let activeClass = this.options.item.classes.active;
            $(current).removeClass(activeClass);
            $(next).addClass(activeClass);
          }
        },


        getSelectedItem : function() {
          let selectedItems = this.getSelectedItems();
          return selectedItems[0] || null;
        },

        toggleSelectOneItem : function(valueOrIdx) {
          if (this.isSelectedItem(valueOrIdx)) {
            this.unselectOneItem(valueOrIdx);
          } else {
            this.selectOneItem(valueOrIdx);
          }
        },

        renderItemHtml : function(itemData) {
          if (!this._renderItemHtml) {
            let itemTpl = this.options.item.template;
            if (langx.isString(itemTpl)) {
              this._renderItemHtml = langx.template(itemTpl);
            } else if (langx.isFunction(itemTpl)) {
              this._renderItemHtml = itemTpl;
            }
          }

          return this._renderItemHtml(itemData);
        }

  });


  plugins.register(Group);

  return groups.Group = Group;

});




 define('skylark-domx-plugins-groups/linear',[
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
        },
        data : {}
    },

    _construct: function (elm, options) {
      this.overrided(elm, options);

      if (this.options.data.items) {
          this.addItems(this.options.data.items);
      }
    }

  });

  plugins.register(Linear);

  return groups.Linear = Linear;

});




define('skylark-domx-plugins-dnd/draggable',[
    "skylark-langx/langx",
    "skylark-domx-noder",
    "skylark-domx-data",
    "skylark-domx-finder",
    "skylark-domx-geom",
    "skylark-domx-eventer",
    "skylark-domx-styler",
    "skylark-domx-plugins-base",
    "./dnd",
    "./manager"
], function(langx, noder, datax, finder, geom, eventer, styler, plugins, dnd,manager) {
    var on = eventer.on,
        off = eventer.off,
        attr = datax.attr,
        removeAttr = datax.removeAttr,
        offset = geom.pagePosition,
        addClass = styler.addClass,
        height = geom.height;



    var Draggable = plugins.Plugin.inherit({
        klassName: "Draggable",
        
        pluginName : "lark.dnd.draggable",

        options : {
            draggingClass : "dragging"
        },

        _construct: function(elm, options) {
            this.overrided(elm,options);

            var self = this,
                options = this.options;

            self.draggingClass = options.draggingClass;

            ["preparing", "started", "ended", "moving"].forEach(function(eventName) {
                if (langx.isFunction(options[eventName])) {
                    self.on(eventName, options[eventName]);
                }
            });


            eventer.on(elm, {
                "mousedown": function(e) {
                    var options = self.options;
                    if (options.handle) {
                        self.dragHandle = finder.closest(e.target, options.handle);
                        if (!self.dragHandle) {
                            return;
                        }
                    }
                    if (options.source) {
                        self.dragSource = finder.closest(e.target, options.source);
                    } else {
                        self.dragSource = self._elm;
                    }
                    manager.prepare(self);
                    if (self.dragSource) {
                        datax.attr(self.dragSource, "draggable", 'true');
                    }
                },

                "mouseup": function(e) {
                    if (self.dragSource) {
                        //datax.attr(self.dragSource, "draggable", 'false');
                        self.dragSource = null;
                        self.dragHandle = null;
                    }
                },

                "dragstart": function(e) {
                    datax.attr(self.dragSource, "draggable", 'false');
                    manager.start(self, e);
                },

                "dragend": function(e) {
                    eventer.stop(e);

                    if (!manager.dragging) {
                        return;
                    }

                    manager.end(false);
                }
            });

        }

    });

    plugins.register(Draggable,"draggable");

    return dnd.Draggable = Draggable;
});
define('skylark-domx-plugins-dnd/droppable',[
    "skylark-langx/langx",
    "skylark-domx-noder",
    "skylark-domx-data",
    "skylark-domx-finder",
    "skylark-domx-geom",
    "skylark-domx-eventer",
    "skylark-domx-styler",
    "skylark-domx-plugins-base",
    "./dnd",
    "./manager"
], function(langx, noder, datax, finder, geom, eventer, styler, plugins, dnd,manager) {
    var on = eventer.on,
        off = eventer.off,
        attr = datax.attr,
        removeAttr = datax.removeAttr,
        offset = geom.pagePosition,
        addClass = styler.addClass,
        height = geom.height;


    var Droppable = plugins.Plugin.inherit({
        klassName: "Droppable",

        pluginName : "lark.dnd.droppable",

        options : {
            draggingClass : "dragging"
        },

        _construct: function(elm, options) {
            this.overrided(elm,options);

            var self = this,
                options = self.options,
                draggingClass = options.draggingClass,
                hoverClass,
                activeClass,
                acceptable = true;

            ["started", "entered", "leaved", "dropped", "overing"].forEach(function(eventName) {
                if (langx.isFunction(options[eventName])) {
                    self.on(eventName, options[eventName]);
                }
            });

            eventer.on(elm, {
                "dragover": function(e) {
                    e.stopPropagation()

                    if (!acceptable) {
                        return
                    }

                    var e2 = eventer.create("overing", {
                        overElm: e.target,
                        transfer: manager.draggingTransfer,
                        acceptable: true
                    });
                    self.trigger(e2);

                    if (e2.acceptable) {
                        e.preventDefault() // allow drop

                        e.dataTransfer.dropEffect = "copyMove";
                    }

                },

                "dragenter": function(e) {
                    var options = self.options,
                        elm = self._elm;

                    var e2 = eventer.create("entered", {
                        transfer: manager.draggingTransfer
                    });

                    self.trigger(e2);

                    e.stopPropagation()

                    if (hoverClass && acceptable) {
                        styler.addClass(elm, hoverClass)
                    }
                },

                "dragleave": function(e) {
                    var options = self.options,
                        elm = self._elm;
                    if (!acceptable) return false

                    var e2 = eventer.create("leaved", {
                        transfer: manager.draggingTransfer
                    });

                    self.trigger(e2);

                    e.stopPropagation()

                    if (hoverClass && acceptable) {
                        styler.removeClass(elm, hoverClass);
                    }
                },

                "drop": function(e) {
                    var options = self.options,
                        elm = self._elm;

                    eventer.stop(e); // stops the browser from redirecting.

                    if (!manager.dragging) return

                    // manager.dragging.elm.removeClass('dragging');

                    if (hoverClass && acceptable) {
                        styler.addClass(elm, hoverClass)
                    }

                    var e2 = eventer.create("dropped", {
                        transfer: manager.draggingTransfer
                    });

                    self.trigger(e2);

                    manager.end(true)
                }
            });

            manager.on("dndStarted", function(e) {
                var e2 = eventer.create("started", {
                    transfer: manager.draggingTransfer,
                    acceptable: false
                });

                self.trigger(e2);

                acceptable = e2.acceptable;
                hoverClass = e2.hoverClass;
                activeClass = e2.activeClass;

                if (activeClass && acceptable) {
                    styler.addClass(elm, activeClass);
                }

            }).on("dndEnded", function(e) {
                var e2 = eventer.create("ended", {
                    transfer: manager.draggingTransfer,
                    acceptable: false
                });

                self.trigger(e2);

                if (hoverClass && acceptable) {
                    styler.removeClass(elm, hoverClass);
                }
                if (activeClass && acceptable) {
                    styler.removeClass(elm, activeClass);
                }

                acceptable = false;
                activeClass = null;
                hoverClass = null;
            });

        }
    });

    plugins.register(Droppable,"droppable");

    return dnd.Droppable = Droppable;
});
define('skylark-domx-plugins-groups/sortable',[
    "./groups",
    "skylark-langx/langx",
    "skylark-domx-noder",
    "skylark-domx-data",
    "skylark-domx-geom",
    "skylark-domx-eventer",
    "skylark-domx-styler",
    "skylark-domx-query",
    "skylark-domx-plugins-base",
    "skylark-domx-plugins-dnd/draggable",
    "skylark-domx-plugins-dnd/droppable"
],function(groups, langx,noder,datax,geom,eventer,styler,$,plugins,Draggable,Droppable){
   'use strict'

    var on = eventer.on,
        off = eventer.off,
        attr = datax.attr,
        removeAttr = datax.removeAttr,
        offset = geom.pagePosition,
        addClass = styler.addClass,
        height = geom.height,
        some = Array.prototype.some,
        map = Array.prototype.map;

    var Sorter = plugins.Plugin.inherit({
        "klassName" : "Sorter",

        enable : function() {

        },
        
        disable : function() {

        },

        destory : function() {

        }
    });


    var dragging, placeholders = $();


    var Sortable = plugins.Plugin.inherit({
        klassName: "Sortable",

        pluginName : "lark.groups.sortable",
        
        options : {
            connectWith: false,
            placeholder: null,
            placeholderClass: 'sortable-placeholder',
            draggingClass: 'sortable-dragging',
            items : null
        },

        /*
         * @param {HTMLElement} container  the element to use as a sortable container
         * @param {Object} options  options object
         * @param {String} [options.items = ""] 
         * @param {Object} [options.connectWith =] the selector to create connected groups
         * @param {Object} [options
         * @param {Object} [options
         */
        _construct : function (container,options) {
            this.overrided(container,options);

            options = this.options;

            var isHandle, index, 
                $container = $(container), 
                $items = $container.children(options.items);
            var placeholder = $(options.placeholder || noder.createElement(/^(ul|ol)$/i.test(container.tagName) ? 'li' : 'div',{
                "class" : options.placeholderClass
            }));

            Draggable(container,{
                source : options.items,
                handle : options.handle,
                draggingClass : options.draggingClass,
                preparing : function(e) {
                    //e.dragSource = e.handleElm;
                },
                started :function(e) {
                    e.ghost = e.dragSource;
                    e.transfer = {
                        "text": "dummy"
                    };
                    index = (dragging = $(e.dragSource)).index();
                },
                ended : function(e) {
                    if (!dragging) {
                        return;
                    }
                    dragging.show();
                    placeholders.detach();
                    if (index != dragging.index()) {
                        dragging.parent().trigger('sortupdate', {item: dragging});
                    }
                    dragging = null;                
                }

            });

            
            Droppable(container,{
                started: function(e) {
                    e.acceptable = true;
                    e.activeClass = "active";
                    e.hoverClass = "over";
                },
                overing : function(e) {
                    if ($items.is(e.overElm)) {
                        if (options.forcePlaceholderSize) {
                            placeholder.height(dragging.outerHeight());
                        }
                        dragging.hide();
                        $(e.overElm)[placeholder.index() < $(e.overElm).index() ? 'after' : 'before'](placeholder);
                        placeholders.not(placeholder).detach();
                    } else if (!placeholders.is(e.overElm) && !$(e.overElm).children(options.items).length) {
                        placeholders.detach();
                        $(e.overElm).append(placeholder);
                    }                
                },
                dropped : function(e) {
                    placeholders.filter(':visible').after(dragging);
                    dragging.show();
                    placeholders.detach();

                    dragging = null;                
                  }
            });

            $container.data('items', options.items)
            placeholders = placeholders.add(placeholder);
            if (options.connectWith) {
                $(options.connectWith).add(this).data('connectWith', options.connectWith);
            }
            
        }
    });

    plugins.register(Sortable,"sortable");

    return groups.Sortable = Sortable;
});

 define('skylark-domx-plugins-groups/tiler',[
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
        infiniteScroll: false,
        itemRendered: null,
        noItemsHTML: 'no items found',
        selectable: false,
        viewClass: "repeater-tile",
        template : '<div class="clearfix repeater-tile" data-container="true" data-infinite="true" data-preserve="shallow"></div>',
        item : {
            template: '<div class="thumbnail"><img height="75" src="<%= href %>" width="65"><span><%= title %></span></div>',
            selectable : true
        },
        renderItem : null
    },

    _construct: function (elm, options) {
      this.overrided(elm, options);

      this._renderItem = langx.template(this.options.item.template);

      for (var i=0;i<options.items.length;i++) {
        var itemHtml = this._renderItem(options.items[i]);
        this._velm.append($(itemHtml));
      }
    }

  });


  plugins.register(Tiler);

  return groups.Tiler = Tiler;	
});
define('skylark-domx-plugins-groups/main',[
    "./groups",
    "./group",
    "./linear",
    "./sortable",
    "./tiler"
], function(groups) {
    return groups;
});
define('skylark-domx-plugins-groups', ['skylark-domx-plugins-groups/main'], function (main) { return main; });


},this);
//# sourceMappingURL=sourcemaps/skylark-domx-plugins-groups.js.map
