(function(exports){
    exports.comfog = {};

    function TabObject(tabid, tabconfig){
        this.id = tabid;
        this.config = $.extend(tabconfig);
        this.items = [];
    }
    TabObject.prototype = {
        getJQ: function(){
            return $("#"+this.id);
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
        getValue: function(){
            return $("#"+this.compid).val();
        },
        getComp: function(){
            return $("#"+this.compid);
        },
        createComp: function(config){
            var cconf = config || this.config.comp;
            var comp;
            if (cconf.type == "text"){
                comp = $('<input type="text"/>');
            } else if (cconf.type == "hidden"){
                comp = $('<input type="hidden"/>');
            } else if (cconf.type == "button"){
                comp = $('<a class="btn"></a>');
            } else if (cconf.type == "number"){
                comp = $('<input type="number">');
                if (cconf.hasOwnProperty("max")){
                    comp.attr("max", cconf.max);
                }
                if (cconf.hasOwnProperty("min")){
                    comp.attr("min", cconf.min);
                }
            } else if (cconf.type == "checkbox"){
                comp = $('<input type="checkbox">');
                if (!cconf.hasOwnProperty("def")){
                    comp.val("true");
                }
                var prnt = $('<label class="checkbox"/>');
                if (cconf.hasOwnProperty("label")){
                    prnt.text(cconf.label);
                }
                comp.appendTo(prnt);
            } else {
                return;
            }
            comp.attr("id", cconf.id || this.compid);
            if (cconf.hasOwnProperty("size")){
                comp.attr("size", cconf.size);
            }
            if (cconf.hasOwnProperty("label")){
                comp.text(cconf.label);
            }
            if (cconf.hasOwnProperty("readonly") && cconf.readonly){
                comp.attr("readonly", "readonly");
            }
            if (cconf.hasOwnProperty("def")){
                comp.val(cconf.def);
            }
            if (cconf.listeners){
                $.each(cconf.listeners, function(event_name, func){
                    comp.on(event_name, func);
                });
            }
            return comp;
        }

    }

    function setup(config){
        function getComp(itemid){
            return $("#" + itemid + "_cmp");
        }
        function getItem(itemid){
            var findItem;
            $.each(this.tabs, function(idx, tab){
                var item = tab.getItem(itemid);
                if (item){
                    findItem = item;
                    return false;
                }
            });
            return findItem;
        }
        function save(){
        }
        var that = {
            tabs: [],
            save: save,
            getComp: getComp,
            getItem: getItem
        };

        var selector = config.selector || "#comfog-container";
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
            $('<div id="'+tabid+'" class="tab-pane " />').appendTo(content);

            var tab =new TabObject(tabid, tabconfig);
            that.tabs[idx] = tab;
            var tabJQ = tab.getJQ();

            if (!tabconfig.items){
                return;
            }
            //tab items
            $.each(tabconfig.items, function(idx2, itemconfig){
                var itemObj =new ItemObject(itemconfig); 
                tab.addItem(itemObj);

                var itemJQ = $('<div id="'+itemObj.id +'" class="span12" />');

                if (itemconfig.label){
                    var label = $('<label >').text(itemconfig.label);
                    itemJQ.append(label);
                }
                if (itemconfig.comp){
                    var comp = itemObj.createComp();
                    if (comp && comp.parent().length > 0){
                        itemJQ.append(comp.parent());
                    } else {
                        itemJQ.append(comp);
                    }
                }
                if (itemconfig.add_comps){
                    itemObj.comps = [];
                    $.each(itemconfig.add_comps, function(idx3, acomp){

                        var subcomp = itemObj.createComp(acomp);
                        if (subcomp && subcomp.parent().length > 0){
                            itemJQ.append(subcomp.parent());
                        } else {
                            itemJQ.append(subcomp);
                        }
                        itemObj.comps.push(subcomp);
                    });
                }
                if (itemconfig.visible === false){
                    itemJQ.css("display", "none");
                }
                tabJQ.append(itemJQ);
            });
        });
        $("a:first", nav).tab("show");


        if (config.listeners){
            if (config.listeners.load){
                setTimeout(function(){
                    config.listeners.load(that);
                }, 1);
            }
        }

        return that;
    }
    exports.comfog.setup = setup;
})(this);

