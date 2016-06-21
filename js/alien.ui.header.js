/**
 * [alien-ui header 插件]
 * @param  {[type]} $ [description]
 * @return {[type]}   [description]
 */
(function ($) {

    var defaults = {
        fontSize: 30,
        text: 'header',
        size:'32'//字体大小
    };

    var show = function (obj,options) {
        var clear='<div class="alien-clear"></div>';
        var decHeight=options.fontSize/2;
        var spacing=options.fontSize>40?options.fontSize/15:0;
        var weight=options.fontSize>40?600:400;
        var htmlHeader='<span class="text" style="font-size:'
                        +options.fontSize
                        +'px;letter-spacing:'
                        +spacing
                        +'px;font-weight:'
                        +weight
                        +';">'
                        +options.text
                        +'</span><span class="decoration" style="height:'
                        +decHeight
                        +'px;margin-top:'
                        +(decHeight+5)
                        +'px;"></span><span class="decoration" style="height:'
                        +(decHeight*2/3)
                        +'px;margin-top:'
                        +(decHeight*4/3+5)
                        +'px;"></span><span class="decoration" style="height:'
                        +(decHeight*1/3)
                        +'px;margin-top:'
                        +(decHeight*5/3+5)
                        +'px;"></span>'
                        +clear
                        +'</div>';

        $(obj).empty();
        $(obj).html(htmlHeader);

    }

    $.fn.alienHeader = function (options) {
        var options;
        return this.each(function () {
            var text=$(this).text();
            if(text!=null){
                options.text=text;
            }
            options = $.extend(defaults, options);
            show(this,options);
        });
    }
})(jQuery);
