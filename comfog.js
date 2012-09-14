(function(exports){
    function TabObject(tabid, tabconfig){
        this.id = tabid;
        this.config = $.extend(tabconfig);
        this.items = [];
    }
    TabObject.prototype = {
        getJQ: function(){
            return $("#"+this.id);
        },
        getForm: function(){
            return $("#"+this.id + " form");
        },
        addItem: function(item){
            this.items.push(item);
        },
        getItem: function(key){
            var findItem;
            $.each(this.items, function(i, item){
                if (item.id == key){
                    findItem = item;
                    return false;
                }
            });
            return findItem;
        }
    };

    function ItemObject(itemconfig){
        this.id = itemconfig.id;
        this.compid = itemconfig.id + "_cmp";
        this.config = $.extend(itemconfig);
    }
    ItemObject.prototype = {
        getJQ: function(){
            return $("#"+this.id);
        },
        getComp: function(){
            return $("#"+this.compid);
        },
        createComp: function(){
            var cconf = this.config.comp;
            var comp;
            if (cconf.type == "text"){
                comp = $('<input type="text"/>');
            } else if (cconf.type == "button"){
                comp = $('<button></button>');
            } else {
                return;
            }
            comp.attr("id", this.compid);
            if (cconf.size){
                comp.attr("size", cconf.size);
            }
            if (cconf.label){
                comp.text(cconf.label);
            }
            if (cconf.listeners){
                $.each(cconf.listeners, function(event_name, func){
                    comp.on(event_name, func);
                });
            }
            return comp;
        }

    }

    var comfog = function(config){
        var that = {
            tabs: [],
        };

        function setup(selector){
            selector = selector || "#comfog-container";
            var cont = $(selector);

            var tabOwner = $('<div id="comfog-tab-owner" class=""/>');
            var nav = $('<ul id="comfog-nav" class="nav nav-tabs"/>');
            var content = $('<div id="comfog-content" class="tab-content"/>');

            cont.append(tabOwner.append(nav).append(content));

            $.each(config.tabs, function(idx, tabconfig){
                var tabid = tabconfig.id || ""+idx;
                tabid = "comfog-tab-"+tabid;
                //tab index
                $('<li/>').append(
                    $('<a href="#'+tabid+'" data-toggle="tab"/>').text(tabconfig.label)
                ).appendTo(nav);

                //tab body
                $('<div id="'+tabid+'" class="tab-pane" />').appendTo(content);

                var tab =new TabObject(tabid, tabconfig);
                that.tabs[idx] = tab;
                var tabJQ = tab.getJQ();
                var tabForm = $("<form />").appendTo(tabJQ);

                if (!tabconfig.items){
                    return;
                }
                //tab items
                $.each(tabconfig.items, function(idx2, itemconfig){
                    var itemObj =new ItemObject(itemconfig); 
                    tab.addItem(itemObj);

                    if (itemconfig.label){
                        var label = $('<label for="'+itemObj.compid+'">').text(itemconfig.label);
                        tabForm.append(label);
                    }
                    if (itemconfig.comp){
                        tabForm.append(itemObj.createComp());
                    }
                });
            });
            $("a:first", nav).tab("show");
            return that;

        }
        that.setup = setup;
        

        return that;
    }
    exports.comfog = comfog;
})(this);

