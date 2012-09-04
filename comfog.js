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
        addItem: function(item){
            this.items.push(item);
        }
        
    };

    function ItemObject(itemconfig){
        this.id = itemconfig.id;
        this.config = $.extend(itemconfig);
    }
    ItemObject.prototype = {
        getJQ: function(){
            return $("#"+this.id);
        },
        getValue: function(){
            return $("#"+this.formid).val();
        },
        createForm: function(){
            var fconf = this.config.form;
            var form;
            if (fconf.type == "text"){
                form = $('<input type="text"/>');
            } else if (fconf.type == "button"){
                form = $('<button></button>');
            } else {
                return;
            }
            if (fconf.size){
                form.attr("size", fconf.size);
            }
            if (fconf.label){
                form.text(fconf.label);
            }
            if (fconf.listeners){
                $.each(fconf.listeners, function(key, value){
                    form.on(key, value);
                });
            }
            return form;
        }

    }

    var comfog = function(config){
        var that = {
            tabs: {},
        };

        function setup(selector){
            var cont = $(selector);

            cont.append(
                $('<div id="tabs"/>')
                    .append('<ul/>')
                    .append('<div id="tabs-inner"/>')
            );

            $.each(config.tabs, function(idx, tabconfig){
                var tabid = tabconfig.id || ""+idx;
                tabid = "tabs-"+tabid;
                //tab index
                $('<li/>').append(
                    $('<a href="#'+tabid+'"/>').text(tabconfig.label)
                ).appendTo("#tabs ul");

                //tab body
                $('<div id="'+tabid+'"/>').appendTo("#tabs-inner");

                var tab =new TabObject(tabid, tabconfig);
                that.tabs[tabid] = tab;
                var tabJQ = tab.getJQ();

                if (!tabconfig.items){
                    return;
                }
                //tab items
                $.each(tabconfig.items, function(idx2, itemconfig){
                    var itemObj =new ItemObject(itemconfig); 
                    tab.addItem(itemObj);

                    var cont = $('<div id="'+itemconfig.id+'_cont"/>').append(
                        $('<label for="'+itemconfig.id+'">').text(itemconfig.label)
                    );
                    if (itemconfig.form){
                        cont.append(itemObj.createForm());
                    }
                    tabJQ.append(cont);
                });
            });
            $("#tabs").tabs();

        }
        that.setup = setup;
        

        return that;
    }
    exports.comfog = comfog;
})(this);
