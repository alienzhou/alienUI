/**
 * [alien-ui input 插件]
 * @param  {[type]} $ [description]
 * @return {[type]}   [description]
 */
(function ($) {
    var defaults = {
        position: 'top',
        text:'提示文本',
        width:'50%'
    };
    var show = function (obj,options) {
        var domHeight=obj.clientHeight;
        var domWidth=obj.clientWidth;
        var hiddenCss='';
        var hoverCss='';
        switch(options.position)
        {
            case 'top':
                hiddenCss='right:0px;bottom:'+(domHeight*1+40)+'px;';
                hoverCss='right:0px;bottom:'+(domHeight*1+20)+'px;';
                break;
            case 'bottom':
                hiddenCss='right:0px;top:'+(domHeight*1+40)+'px;';
                hoverCss='right:0px;top:'+(domHeight*1+20)+'px;';
                break;
            case 'left':
                hiddenCss='right:'+(domWidth*1+40)+'px;top:0px;';
                hoverCss='right:'+(domWidth*1+20)+'px;top:0px;';
                break;
            case 'right':
                hiddenCss='left:'+(domWidth*1+40)+'px;top:0px;';
                hoverCss='left:'+(domWidth*1+20)+'px;top:0px;';
                break;
            default:
                hiddenCss='right:0px;bottom:'+(domHeight*1+40)+'px;';
                hoverCss='right:0px;bottom:'+(domHeight*1+20)+'px;';
        }
        hiddenCss+='width:'+options.width+';';
        hoverCss+='width:'+options.width+';';
        var tipHtml='<div class="tip-panel tip-'
                        +options.position
                        +'" style="'
                        +hiddenCss
                        +'">'
                        +options.text
                        +'</div>';
        $(obj).append(tipHtml);
        $(obj).on('mouseover',function(e){
            $(this).addClass('tooltip-open').children('.tip-panel').attr('style',hoverCss);
        }).on('mouseleave',function(e){
            $(this).removeClass('tooltip-open').children('.tip-panel').attr('style',hiddenCss);
        });
    }

    $.fn.alienTooltip = function (options,param) {
        if (typeof options == 'string'){
            return $.fn.alienTooltip.methods[options](this, param);
        }

        var options;
        return this.each(function () {
            options = $.extend(defaults, options);
            show(this,options);
        });
    }

    $.fn.alienTooltip.methods = {
    };
})(jQuery);
