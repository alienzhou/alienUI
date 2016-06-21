/**
 * [alien-ui slider 插件]
 * @param  {[type]} $ [description]
 * @return {[type]}   [description]
 */
(function ($) {
    var defaults = {
        max:100,
        min:0,
        step:5,
        init:10
    };

    var show = function (obj,options) {
        //在此处设置一个对象来进行深度复制
        //防止在dragStart函数中使用直接options
        //直接使用options传递的并不是参数的值，而是参数的引用
        //因为变量作用域的原因，在有多个slider控件时，后一个控件的options会覆盖前一个
        var deepOptions = {
            max:100,
            min:0,
            step:5,
            init:10
        };
        deepOptions.max=options.max;
        deepOptions.min=options.min;
        deepOptions.step=options.step;
        deepOptions.init=options.init;

        var formerStyle=$(obj).attr('style');//获取原dom元素的style样式
        var inputVal='';//input值
        var html='<div class="alien-slider" style="'
                    +formerStyle
                    +'"><span class="button"><span class="text">'
                    +options.init
                    +'</span></span></div>';
        $(obj).hide().val(options.init).after(html);
        //计算button的初始位置
        var initLeft=(options.init-options.min)/(options.max-options.min)*$(obj).next('div').eq(0)[0].clientWidth;
        //设置初始left属性
        $(obj).next('div').children('.button').eq(0)[0].style.left=initLeft+'px';
        //拖拽函数
        dragStart($(obj).next('div').eq(0).children('.button').eq(0)[0],deepOptions);
    }

    /**
     * [dragStart 控件按钮的拖拽方法]
     * @param  {[type]}   obj      [被拖拽的对象]
     * @param  {Function} callback [回调函数]
     * @return {[type]}            [description]
     */
    var dragStart=function (obj,deepOptions,callback){
        //存储拖拽的变量
        var dragParams = {
            left: 0,
            currentX: 0,
            initVal:0,
            flag: false
        };

        //获取slider容器的总宽度(-2是为了使button在最右侧时不会超出显示)
        var divWidth=$(obj).parent('div').eq(0)[0].clientWidth-2;
        //获取当前元素的左边距
        dragParams.left = getCss(obj, 'left');

        obj.onmousedown = function(event){
            //获取mousedown时控件的初值，依次为基础跟随鼠标移动调整输出的值
            dragParams.initVal=$(obj).parent('div').prev('input').eq(0).val();
            dragParams.flag = true;
            if(!event){
                event = window.event;
                //防止IE文字选中
                document.onselectstart = function(){
                    return false;
                }
            }else{
                //其他浏览器（firefox、chrome等）使用css方法防止文字被选中
                $('body').addClass('forbid-select');
            }
            //使按住鼠标情况下，光标使用显示“手”的样式
            $('body').eq(0)[0].style.cursor = 'pointer';
            //获取按下时的鼠标位置
            var e = event;
            dragParams.currentX = e.clientX;

            document.onmouseup = function(){
                dragParams.flag = false;
                //释放鼠标时，需要把选择文字功能恢复
                $('body').removeClass('forbid-select');
                //恢复鼠标样式
                $('body').eq(0)[0].style.cursor = 'default';
                dragParams.left = getCss(obj, 'left');
            };

            document.onmousemove = function(event){
                //兼容ie
                var e = event ? event: window.event;
                var nowX = e.clientX;//当前鼠标位置
                var disX = nowX - dragParams.currentX;//鼠标移动距离

                if(dragParams.flag){
                    /**如果鼠标横移超出slider控件容器范围，则停止移动button（button不能超出slider）**/
                    //第一个“或”判断是为了处理，当button已经在最左边时，还向左拉动（disX为负），此时留在原处，阻止button滑动，值为最小值
                    //第二个“或”判断是为了处理，当鼠标移动过快，导致某一次监听使得更新后的位置直接超过最左侧，阻止超过的动作，最多只能到最左侧
                    if((parseInt(getCss(obj,'left'))<=0 && parseInt(disX)<0) || (parseInt(dragParams.left) + disX)<0){
                        $(obj).children('span').text(deepOptions.min);
                        $(obj).parent('div').prev('input').eq(0).val(deepOptions.min);//input赋值
                        obj.style.left = '0px';//为元素左边距赋新值
                        //超出边界时，使鼠标样式变为箭头，暗示使用者此时不要再按住拖拽了
                        $('body').eq(0)[0].style.cursor = 'default';
                    }
                    //第一个“或”判断是为了处理，当button已经在最右边时，还向右拉动（disX为正），此时留在原处，阻止button滑动，值为最大值
                    //第二个“或”判断是为了处理，当鼠标移动过快，导致某一次监听使得更新后的位置直接超过最右侧，阻止超过的动作，最多只能到最右侧
                    else if(parseInt(getCss(obj,'left'))>=divWidth && parseInt(disX)>0 || (parseInt(dragParams.left) + disX)>divWidth){
                        $(obj).children('span').text(deepOptions.max);
                        $(obj).parent('div').prev('input').eq(0).val(deepOptions.max);//input赋值
                        obj.style.left = divWidth + 'px';//为元素左边距赋新值
                        //超出边界时，使鼠标样式变为箭头，暗示使用者此时不要再按住拖拽了
                        $('body').eq(0)[0].style.cursor = 'default';
                    }
                    //正常更新位置
                    else{
                        //根据最大最小值与step，计算拉动距离所对应的需要更新的数值
                        var num=(deepOptions.max-deepOptions.min)/deepOptions.step;
                        var leftUnit=divWidth/num;
                        var index=Math.floor(disX/leftUnit);
                        var text=parseInt(dragParams.initVal)+index*deepOptions.step;
                        //写入text
                        $(obj).children('span').text(text);
                        //input赋值
                        $(obj).parent('div').prev('input').eq(0).val(text);
                        //为元素左边距赋新值
                        obj.style.left = parseInt(dragParams.left) + disX + "px";
                    }
                }
                //执行回调函数
                if (typeof callback == "function") {
                    callback(parseInt(dragParams.left) + disX, parseInt(dragParams.top) + disY);
                }
            }
        };
    }

    /**
     * [getElementPosition （循环父元素，相加）获取元素相对于document的位置]
     * @param  {[type]} e [dom元素]
     * @return {[type]}   [位置对象]
     */
    var getElementPosition=function (e) {
        var x = 0, y = 0;
        while (e != null) {
            x += e.offsetLeft;
            y += e.offsetTop;
            e = e.offsetParent;
        }
        return { x: x, y: y };
    }

    /**
     * [getCss 获取当前元素的css属性值]
     * @param  {[js object]} o   [js对象]
     * @param  {[string]} key [css属性名]
     * @return {[type]}     [description]
     */
    var getCss = function(o,key){
        return o.currentStyle? o.currentStyle[key] : document.defaultView.getComputedStyle(o,false)[key];//兼容ie
    };

    $.fn.alienSlider = function (options,param) {
        /*如果检测到的输入参数为string类型，则调用methods里面的方法*/
        if (typeof options == 'string'){
            return $.fn.alienSlider.methods[options](this, param);
        }

        var options = $.extend(defaults, options);
        return this.each(function () {
            show(this,options);
        });
    }

    $.fn.alienSlider.methods = {
        setValue: function(jq,value){
            //计算button的初始位置
            var initLeft=(value-mergeOptions.min)/(mergeOptions.max-mergeOptions.min)*jq.next('div').eq(0)[0].clientWidth;
            //设置初始left属性
            jq.next('div').children('.button').eq(0)[0].style.left=initLeft+'px';
            jq.next('div').children('.button').children('span').text(value);
            jq.val(value);
        },
        getValue: function(jq){
            return jq.val();
        }
    };
})(jQuery);

