/**
 * [alien-ui checkbox 插件 此插件需要id属性]
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
        var inputId=inputObj.attr('id');//input的id
        var formerStyle=inputObj.attr('style');//获取原dom元素的style样式
        var ulHtml='<ul id="'+inputId+'-checkbox" class="alien-checkbox">';
        var inputVal='';//input值
        for(var i=0;i<options.item.length;i++){
            //默认为非选中
            var status=(typeof(options.item[i].chosen) == "undefined"||!options.item[i].chosen)?'':'chosen';
            if(options.item[i].chosen){
                inputVal+=options.item[i].val+',';
            }
            //循环添加li标签，data-val用来存储项目对应的val值
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
        inputVal=inputVal.length==0?inputVal:inputVal.substring(0,inputVal.length-1);
        $(obj).hide().val(inputVal).after(ulHtml+'</ul>');//给ul元素封口
        var ulObj=$('#'+inputId+'-checkbox');
        ulObj.attr('style',formerStyle);//将原input的样式赋给新的dom元素
        ulObj.children('li').each(function() {//循环为所有li元素中的div添加click方法
            $(this).children('div').each(function() {
                $(this).click(function() {
                    itemToggel($(this));
                });
            });
        });
    }

    /**
     * [itemToggel 切换项目的选中状态]
     * @param  {[jq obj]} jq [input]
     * @return {[type]}    [description]
     */
    var itemToggel=function (jq){
        var ulId=jq.parent('li').parent('ul').attr('id');
        var buttonJq=jq.parent('li').children('div').eq(0).children('div');
        buttonJq.toggleClass('chosen');//切换dom元素的class状态
        //重新获取checkbox的值
        var valArr=new Array();
        $('#'+ulId).find('.chosen').each(function() {
            valArr.push($(this).parent('div').parent('li').attr('data-val'));
        });
        $('#'+ulId.substring(0,ulId.length-9)).val(valArr.join(','));
    }

    $.fn.alienCheckbox = function (options,param) {
        /*如果检测到的输入参数为string类型，则调用methods里面的方法*/
        if (typeof options == 'string'){
            return $.fn.alienCheckbox.methods[options](this, param);
        }

        var options = $.extend(defaults, options);
        return this.each(function () {
            show(this,options);
        });
    }

    $.fn.alienCheckbox.methods = {
        setValues: function(jq,value){
            if(jq.val()==value){//选择的值与当前相同，不需要操作
                return;
            }
            var valArr=value.split(',');//将获取到的值分解为数组
            var resultArr=new Array();//最后处理完的结果数组
            $('#'+jq.attr('id')+'-checkbox').children('li').each(function() {//循环判断ul下的所有li
                $(this).children('div').children('div').removeClass('chosen');//首先默认取消li的chosen状态class
                for(var j=0;j<valArr.length;j++){//循环设置的值数组
                    if($(this).attr('data-val')==valArr[j]){//判断当前li中data-val是否存在在值列表中（是否需要被选中）
                        //选中的相关操作
                        $(this).children('div').children('div').addClass('chosen');
                        resultArr.push($(this).attr('data-val'));
                        break;//选中后退出循环
                    }
                }
            });
            jq.val(resultArr.join(','));//为隐藏的input赋值
        },
        /**
         * [choose 选中某一项]
         * @param  {[jq obj]} jq    [input]
         * @param  {[int]} index [序号，从0开始]
         * @return {[type]}       [description]
         */
        choose: function(jq,index){
            var liList=$('#'+jq.attr('id')+'-checkbox').children('li');
            if(liList.length-1<index){
                return;
            }
            if(liList.eq(index).children('div').children('div').hasClass('class')){
                return;
            }
            itemToggel(liList.eq(index).children('div').eq(0));
        },
        /**
         * [cancel 取消选中某一项]
         * @param  {[jq obj]} jq    [input]
         * @param  {[int]} index [序号，从0开始]
         * @return {[type]}       [description]
         */
        cancel: function(jq,index){
            var liList=$('#'+jq.attr('id')+'-checkbox').children('li');
            if(liList.length-1<index){
                return;
            }
            if(!liList.eq(index).children('div').children('div').hasClass('class')){
                return;
            }
            itemToggel(liList.eq(index).children('div').eq(0));
        },
        getValue: function(jq){
            return jq.val();
        }
    };
})(jQuery);

