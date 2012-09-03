(function(exports){
    var comfog = function(config){
        var that = {};


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
                $('<li/>').append(
                    $('<a href="#'+tabid+'"/>').text(tabconfig.label)
                ).appendTo("#tabs ul");
                $('<div id="'+tabid+'"/>').appendTo("#tabs-inner");
            });
            $("#tabs").tabs();

        }
        that.setup = setup;
        

        return that;
    }
    exports.comfog = comfog;
})(this);

