/**
 * [alien-ui input 插件]
 * @param  {[type]} $ [description]
 * @return {[type]}   [description]
 */
(function ($) {
    //step03-a 插件的默认值属性
    var defaults = {
        height: 40,
        width: 200,
    };
    //step06-a 在插件里定义方法
    var show = function (obj,options) {
        var styleCss='height:'
                        +options.height
                        +'px;width:'
                        +options.width
                        +'px;'
                        +'line-height:'
                        +options.height
                        +'px;'
                        +$(obj).attr('style');//原属性

        /*根据高度设置字体大小*/
        var fontSize=12;
        if(options.height>35){
            fontSize=15;
        }else if(options.height>50){
            fontSize=20;
        }
        styleCss+='font-size:'+fontSize+'px;';

        //设置属性
        $(obj).attr('style',styleCss);

        /*文本框备注*/
        if(options.placeholder!=null){
            $(obj).attr('placeholder',options.placeholder);
        }
    }

    //step02 插件的扩展方法名称
    $.fn.alienTextbox = function (options,param) {
        /*如果检测到的输入参数为string类型，则调用methods里面的方法*/
        if (typeof options == 'string'){
            return $.fn.alienTextbox.methods[options](this, param);
        }

        //step03-b 合并用户自定义属性，默认属性
        var options = $.extend(defaults, options);
        //step4 支持JQuery选择器
        //step5 支持链式调用
        return this.each(function () {
            //step06-b 在插件里定义方法
            show(this,options);
        });
    }

    $.fn.alienTextbox.methods = {
        getValue: function(jq){
            return jq.val();
        },
        setValue: function(jq,value){
            jq.val(value);
        }
    };
})(jQuery);
