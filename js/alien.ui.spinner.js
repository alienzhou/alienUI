/**
 * [alien-ui input 插件]
 * [当前不支持按住后持续增加/减少，下一版本会改进]
 * @param  {[type]} $ [description]
 * @return {[type]}   [description]
 */
(function ($) {
    var defaults = {
        min:0,
        max:100,
        increment:10,
        init:10
    };
    var show = function (obj,options) {
        var formerStyle=$(obj).attr('style');//获取原dom元素的style样式
        var html='<div class="alien-spinner" style="'
                    +formerStyle
                    +'"><div class="text forbid-select">'
                    +options.init
                    +'</div><div class="control"><div class="up"></div><div class="down"></div></div><div class="alien-clear"></div></div>';
        $(obj).hide().after(html).val(options.init);
        $(obj).next('div').children('.control').children('div').each(function(index, el) {
            if(index==0){//第一个元素（增加按钮）
                $(this).click(function(event) {
                    increase($(obj),options.increment,options.max);
                });
            }else{//第二个元素（减少按钮）
                $(this).click(function(event) {
                    decrease($(obj),options.increment,options.min);
                });
            }
        });;
    }

    var increase=function(jq,increment,max){
        if(jq.val()==max){
            return;
        }
        var result;
        if((jq.val()*1+increment*1)>=max){//达到或超过最大值
            result=max;
        }else{
            result=jq.val()*1+increment*1;
        }
        jq.val(result);
        jq.next('div').children('.text').text(result);
    }

    var decrease=function(jq,increment,min){
        if(jq.val()==min){
            return;
        }
        var result;
        if((jq.val()*1-increment*1)<=min){//达到或低于最小值
            result=min;
        }else{
            result=jq.val()*1-increment*1;
        }
        jq.val(result);
        jq.next('div').children('.text').text(result);
    }

    $.fn.alienSpinner = function (options,param) {
        /*如果检测到的输入参数为string类型，则调用methods里面的方法*/
        if (typeof options == 'string'){
            return $.fn.alienSpinner.methods[options](this, param);
        }

        var options = $.extend(defaults, options);
        return this.each(function () {
            show(this,options);
        });
    }

    $.fn.alienSpinner.methods = {
        getValue: function(jq){
            return jq.val();
        },
        setValue: function(jq,value){
            jq.val(value);
            jq.next('div').children('.text').text(value);
        }
    };
})(jQuery);
