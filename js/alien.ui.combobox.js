/**
 * [alien-ui combobox 插件]
 * @param  {[type]} $ [description]
 * @return {[type]}   [description]
 */
(function ($) {
    //step03-a 插件的默认值属性
    var defaults = {
        item:[
            {text:'first',val:0,chosen:false},
            {text:'second',val:1,chosen:true}
        ]
    };

    var show = function (obj,options) {
        var chosenText='';
        var chosenVal;
        var liListHtml='';
        var formerStyle=$(obj).attr('style');//获取原dom元素的style样式
        for(var j=0;j<options.item.length;j++){//为ul循环设置li样式
            var active='';
            if(options.item[j].chosen){//选中时，需要将被选中的li的class设置为active，并为input与显示框赋值
                chosenText=options.item[j].text;
                active='class="active"';
                chosenVal=options.item[j].val;
            }
            //包装li元素
            liListHtml+='<li '
                        +active
                        +' data-val="'
                        +options.item[j].val
                        +'">'
                        +options.item[j].text
                        +'</li>';
        }
        var outerHeadHtml='<div class="alien-combobox" style="'
                            +formerStyle
                            +'"><a class="alien-combobox-toggle">'
                            +'<span class="text">'
                            +chosenText
                            +'</span><span class="button"></span></a>'
                            +'<ul class="alien-combobox-option">'
                            +'<div class="arrow"></div>';
        var outerFootHtml='</ul></div>';
        //为显式输入框绑定点击事件（点击显示项目面板）
        $(obj).hide().val(chosenVal).after(outerHeadHtml+liListHtml+outerFootHtml).next('div').click(function(event) {
            toggleOption($(this));
        });
        //为li元素添加点击方法（选择该项目）
        $(obj).next('div').children('ul').children('li').each(function(index, el) {
            $(this).click(function(event) {
                chooseItem($(this));
                event.stopPropagation();//防止冒泡到父节点上的click事件（上一个）
            });
        });

        //为点击combobox控件之外的区域添加单击方法
        //使用on方法可以支持追加多个事件
        //点击其他区域时，需要收起项目显示面板
        $(document).on('click',function(e){
            e = window.event || e;//兼容ie
            var target = e.srcElement || e.target;//兼容ie
            //判断单击的元素为combobox外的其他地方的元素
            if(!$(target).is($(obj).next('div').eq(0))
                && !$(target).is($(obj).next('div').children('ul').eq(0))
                && !$(target).is($(obj).next('div').children('a').children('span').eq(0))
                && !$(target).is($(obj).next('div').children('a').children('span').eq(1))) {
                $(obj).next('div').removeClass('open-status');
            }
        });
    }

    /**
     * [toggleOption 切换面板的状态（显示/隐藏）]
     * @param  {[jq obj]} jq [input]
     * @return {[type]}    [description]
     */
    var toggleOption=function(jq){
        jq.toggleClass('open-status');
    }

    /**
     * [chooseItem 选择面板上的某一项内容]
     * @param  {[jq obj]} jq [input]
     * @return {[type]}    [description]
     */
    var chooseItem=function(jq){
        if(jq.hasClass('active')){//当前项目已被激活（选中），不需要操作
            return;
        }
        var ulJq=jq.parent('ul');
        ulJq.children('li').each(function() {
            $(this).removeClass('active');//移除已激活的项目
        });
        jq.addClass('active');//设置class
        ulJq.parent('div').prev('input').eq(0).val(jq.data('val'));//为隐藏的input框赋值
        ulJq.prev('a').children('span').eq(0).text(jq.text());//为显示的input框赋值
        ulJq.parent('div').removeClass('open-status');//隐藏面板
    }

    $.fn.alienCombobox = function (options,param) {
        if (typeof options == 'string'){
            return $.fn.alienCombobox.methods[options](this, param);
        }

        var options = $.extend(defaults, options);
        return this.each(function () {
            //step06-b 在插件里定义方法
            show(this,options);
        });
    }

    $.fn.alienCombobox.methods = {
        getValue: function(jq){
            return jq.val();
        }
    };
})(jQuery);
