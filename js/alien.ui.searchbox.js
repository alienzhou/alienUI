/**
 * [alien-ui input 插件]
 * @param  {[type]} $ [description]
 * @return {[type]}   [description]
 */
(function ($) {
    var defaults = {
        placeholder: 'searchbox'
    };
    var show = function (obj,options) {
        var formerStyle=$(obj).attr('style');//获取原dom元素style样式
        /*文本框备注*/
        if(options.placeholder!=null){
            $(obj).attr('placeholder',options.placeholder);
        }
        $(obj).removeAttr('style');
        var outerHtml=obj.outerHTML;
        var inputHtml='<div class="alien-searchbox" style="'
                        +formerStyle
                        +'">'
                        +outerHtml
                        +'<a href="javascript:void(0)"></a>'
                        +'</div>'
        $(obj).after(inputHtml).remove();
    }

    $.fn.alienSearchbox = function (options,param) {
        if (typeof options == 'string'){
            return $.fn.alienSearchbox.methods[options](this, param);
        }

        var options = $.extend(defaults, options);
        return this.each(function () {
            show(this,options);
        });
    }

    $.fn.alienSearchbox.methods = {
        getValue: function(jq){
            jq.children('input').val();
        },
        setValue: function(jq,value){
            jq.children('input').val(value);
        }
    };
})(jQuery);
