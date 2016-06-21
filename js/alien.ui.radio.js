/**
 * [alien-ui radio 插件 此插件需要id属性]
 * @param  {[type]} $ [description]
 * @return {[type]}   [description]
 */
(function ($) {
    var defaults = {
        item:[
            {text:'first',val:0,chosen:false},
            {text:'second',val:1,chosen:true}
        ]
    };

    var show = function (obj,options) {
        var inputObj=$(obj);
        var inputId=inputObj.attr('id');
        var formerStyle=inputObj.attr('style');//获取原dom元素style样式
        var ulHtml='<ul id="'+inputId+'-radio" class="alien-radio">';
        var inputVal;//隐藏的输入框的值
        for(var i=0;i<options.item.length;i++){
            //默认为非选中（class样式）
            var status=(typeof(options.item[i].chosen) == "undefined"||!options.item[i].chosen)?'':'chosen';
            if(options.item[i].chosen){//判断是否选中
                inputVal=options.item[i].val;
            }
            var liHtml='<li id="1" data-val="'
                        +options.item[i].val
                        +'"><div class="button">'
                        +'<div class="'
                        +status
                        +'"></div></div>'
                        +'<div class="text">'
                        +options.item[i].text
                        +'</div><div class="alien-clear"></div></li>';
            ulHtml+=liHtml;
        }
        $(obj).hide().val(inputVal).after(ulHtml+'</ul>');
        var ulObj=$('#'+inputId+'-radio');
        ulObj.attr('style',formerStyle);//将原input的样式赋给新的dom元素
        ulObj.children('li').each(function() {
            $(this).children('div').each(function() {
                $(this).click(function() {
                    itemChoose($(this));
                });
            });
        });
    }

    /**
    * [itemChoose 选择某一个项目]
    * @param  {[jq obj]} jq [input]
    * @return {[type]}    [description]
    */
    var itemChoose=function (jq){
        var liObj=jq.parent('li');
        var ulObj=liObj.parent('ul');
        var inputId=ulObj.attr('id').substring(0,ulObj.attr('id').length-6);
        ulObj.find('.chosen').removeClass('chosen');//将其他项目变为非选中
        liObj.children('div').eq(0).children('div').addClass('chosen');//选中项目
        $('#'+inputId).val(liObj.attr('data-val'));//为隐藏的输入框赋值
    }

    $.fn.alienRadio = function (options,param) {
        /*如果检测到的输入参数为string类型，则调用methods里面的方法*/
        if (typeof options == 'string'){
            return $.fn.alienRadio.methods[options](this, param);
        }

        var options = $.extend(defaults, options);
        return this.each(function () {
            show(this,options);
        });
    }

    $.fn.alienRadio.methods = {
        setValue: function(jq,value){
            if(jq.val()==value){
                return;
            }
            $('#'+jq.attr('id')+'-radio').children('li').each(function() {
                if($(this).attr('data-val')==value){
                    itemChoose($(this).children('div').eq(0));
                }
            });
        },
        /**
         * [choose 选择某一个项目]
         * @param  {[jq obj]} jq    [input]
         * @param  {[int]} index [序号]
         * @return {[type]}       [description]
         */
        choose: function(jq,index){
            var liList=$('#'+jq.attr('id')+'-radio').children('li');
            if(liList.length-1<index){
                return;
            }
            itemChoose(liList.eq(index).children('div').eq(0));
        },
        getValue: function(jq){
            return jq.val();
        }
    };
})(jQuery);

