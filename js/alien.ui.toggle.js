/**
 * [alien-ui toggle 插件 此插件需要id属性]
 * @param  {[type]} $ [description]
 * @return {[type]}   [description]
 */
(function ($) {
    var defaults = {
        status:1//初始状态，0表示关闭，1表示开启
    };

    var show = function (obj,options) {
        var toggleInput=$(obj);
        var toggleClass='';
        var statusClass='';
        //根据toggle初始化的状态，设置相应class
        if (options.status == 1) {
            statusClass='start-on on';
            toggleClass='toggle-on';
        } else {
            statusClass='start-off off';
            toggleClass='toggle-off';
        }
        var formerStyle=toggleInput.attr('style');//获取html原元素中的style属性值
        var innerHtml='<div id="'
                        +toggleInput.attr('id')
                        +'-toggle" class="toggle-button-az '
                        +toggleClass
                        +'" style="'
                        +formerStyle
                        +'"><div class="'
                        +statusClass
                        +'"></div></div>';
        toggleInput.hide();
        toggleInput.after(innerHtml);
        toggleInput.val(options.status);
        $('#'+toggleInput.attr('id')+'-toggle').children('div').click(function() {
            switchStatus($('#'+toggleInput.attr('id')+'-toggle'));
        });
    }

    /**
     * [switchStatus 切换开关状态]
     * @param  {[jq obj]} obj [显式的input（toggle）]
     * @return {[type]}     [description]
     */
    var switchStatus=function (obj){
        var toggleId=obj.attr('id');
        var inputId=toggleId.substring(0,toggleId.length-7);
        if ($('#'+inputId).val() == 0) {//根据开关状态（input值），调用不同的方法
            turnOn(obj);
        } else {
            turnOff(obj);
        }
    }

    /**
     * [turnOn 打开开关]
     * @param  {[jq obj]} obj [显式的input（toggle）]
     * @return {[type]}     [description]
     */
    var turnOn=function(obj){
        var toggleId=obj.attr('id');
        var inputId=toggleId.substring(0,toggleId.length-7);
        obj.children('div').removeClass('toggle-on-off').removeClass('off').addClass(
                    'toggle-off-on').addClass('on');
        obj.removeClass('toggle-off').addClass('toggle-on');
        $('#'+inputId).val(1);
    }

    /**
     * [turnOff 关闭开关]
     * @param  {[jq obj]} obj [显式的input（toggle）]
     * @return {[type]}     [description]
     */
    var turnOff=function(obj){
        var toggleId=obj.attr('id');
        var inputId=toggleId.substring(0,toggleId.length-7);
        obj.children('div').removeClass('toggle-off-on').removeClass('on').addClass(
                    'toggle-on-off').addClass('off');
        obj.removeClass('toggle-on').addClass('toggle-off');
        $('#'+inputId).val(0);
    }

    $.fn.alienToggle = function (options,param) {
        /*如果检测到的输入参数为string类型，则调用methods里面的方法*/
        if (typeof options == 'string'){
            return $.fn.alienToggle.methods[options](this, param);
        }

        var options = $.extend(defaults, options);

        return this.each(function () {
            show(this,options);
        });
    }

    $.fn.alienToggle.methods = {
        setValue: function(jq,value){
            if(jq.val()==value){
                return;
            }
            var toggle=$('#'+jq.attr('id')+'-toggle');
            if(value==1){
                turnOn(toggle);
            }else{
                turnOff(toggle);
            }
        },
        getValue: function(jq){
            return jq.val();
        }
    };
})(jQuery);