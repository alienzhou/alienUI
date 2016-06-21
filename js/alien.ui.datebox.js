/**
 * [alien-ui databox 插件]
 * @param  {[type]} $ [description]
 * @return {[type]}   [description]
 */
(function ($) {
    //step03-a 插件的默认值属性
    var defaults = {
    };

    var show = function (obj,options) {
        var formerStyle=$(obj).attr('style');//获取原dom元素的style样式
        var now = new Date();//获取当前日期
        var nowYear=now.getFullYear();//获取完整的年份(4位,1970-????)
        var nowMonth=now.getMonth();//获取当前月份(0-11,0代表1月)
        var nowDay=now.getDate();//获取当前日(1-31)

        var panelHtml='<div class="date-panel">'
                            +'<div class="date-header forbid-select">'
                                +'<div class="year">'
                                    +'<span class="btn left"><</span>'
                                    +'<span class="text">'
                                    +nowYear
                                    +'</span>'
                                    +'<span class="btn right">></span>'
                                    +'<div class="alien-clear"></div>'
                                +'</div>'
                                +'<div class="month">'
                                    +'<span class="btn left"><</span>'
                                    +'<span class="text">'
                                    +(parseInt(nowMonth)+parseInt(1))
                                    +'</span>'
                                    +'<span class="btn right">></span>'
                                    +'<div class="alien-clear"></div>'
                                +'</div>'
                                +'<div class="alien-clear"></div>'
                            +'</div>'
                            +'<div class="date-body">'
                                +'<div class="content">'
                                +'</div>'
                            +'</div>'
                        +'</div>';

        var dateboxHtml='<div class="alien-datebox" style="'
                            +formerStyle
                            +'">'
                            +'<a class="date-input">'
                                +'<span class="text"></span>'
                                +'<span class="button"></span>'
                            +'</a>'
                            +panelHtml
                        +'</div>';

        //为显式输入框绑定点击事件（点击显示项目面板）
        $(obj).hide().val(nowYear+'/'+(nowMonth*1+1)+'/'+nowDay).after(dateboxHtml).next('div').click(function(event) {
            toggleOption($(this));
        }).children('div').click(function(event) {
            event.stopPropagation();//阻止冒泡
        });

        $(obj).next('div').children('.date-input').children('.text').text(nowYear+'/'+(nowMonth*1+1)+'/'+nowDay);

        $(obj).next('div').children('.date-panel').children('.date-header').find('.btn').click(function(event) {
            switchDate($(this));
        });
        //绑定table中td元素点击事件
        bindTdClick($(obj).next('div').children('.date-panel').find('table'));

        //为点击datebox控件之外的区域添加单击方法
        //使用on方法可以支持追加多个事件
        //点击其他区域时，需要收起项目显示面板
        $(document).on('click',function(e){
            e = window.event || e;//兼容ie
            var target = e.srcElement || e.target;//兼容ie
            //判断单击的元素为datebox外的其他地方的元素
            //由于date-panel被阻止了事件冒泡，所以需要单独判断这一层
            if(!$(target).is($(obj).next('div').children('div').eq(0))
                && !$(target).is($(obj).next('div').children('a').children('span').eq(0))
                && !$(target).is($(obj).next('div').children('a').children('span').eq(1))) {
                $(obj).next('div').removeClass('open-status');
            }
        });
    }

    /**
     * [toggleOption 切换面板的状态（显示/隐藏）]
     * @param  {[jq obj]} jq [alien-datebox]
     * @return {[type]}    [description]
     */
    var toggleOption=function(jq){
        if(!jq.hasClass('open-status')){
            var dateArr=jq.prev('input').val().split('/');
            updateCalendarHtml(dateArr[0],(dateArr[1]*1-1),dateArr[2],jq.children('.date-panel').children('.date-body').children('.content'));
        }
        jq.toggleClass('open-status');
    }

    /**
     * [switchDate 切换日历的“年”、“月”]
     * @param  {[jquery对象]} jq [“年”/“月”按钮]
     * @return {[type]}    [description]
     */
    var switchDate=function(jq){
        if(jq.parent('div').hasClass('year')){
            if(jq.hasClass('left')){
                jq.next('span').text(jq.next('span').text()*1-1);
            }else{
                jq.prev('span').text(jq.prev('span').text()*1+1);
            }
        }else{
            if(jq.hasClass('left')){
                if(jq.next('span').text()==1){
                    var temp=jq.parent('div').prev('div').children('.text');
                    temp.text(temp.text()*1-1);
                    jq.next('span').text(12);
                }else{
                    jq.next('span').text(jq.next('span').text()*1-1);
                }
            }else{
                if(jq.prev('span').text()==12){
                    var temp=jq.parent('div').prev('div').children('.text');
                    temp.text(temp.text()*1+1);
                    jq.prev('span').text(1);
                }else{
                    jq.prev('span').text(jq.prev('span').text()*1+1);
                }
            }
        }
        var year=jq.parent('div').parent('div').children('.year').children('.text').text();
        var month=jq.parent('div').parent('div').children('.month').children('.text').text();
        var inputVal=jq.parent('div').parent('div').parent('div').parent('div').prev('input').val();
        var day=(inputVal.split('/')[0]==year && inputVal.split('/')[1]==month)?inputVal.split('/')[2]:null;

        updateCalendarHtml(year,(month*1-1),day,jq.parent('div').parent('div').next('div').children('div').eq(0));
    }

    /**
     * [generateDateSerial 生成日期序列html（table）]
     * @param  {[int]} year       [四位数年份]
     * @param  {[int]} month      [月份，注意是0-11]
     * @param  {[int]} day       [若“天”参数存在，则激活日期中对应的“天”；为null时表示没有要激活的]
     * @return {[string]}            [返回日期序列html（table）]
     */
    var generateDateSerial=function(year,month,day){
        var tdListHtml='';//日期号部分的html
        var startWeek=new Date(year,month,1).getDay();//获取nowYear年nowMonth月的第一天是星期几
        var maxDay=new Date(year,month+1,0).getDate();//获取nowYear年nowMonth月(当前日历的年月)的最大天数

        //获取上一个月的最大天数
        //若该月为1月，则获取上一年12月的最大天数
        var prevMaxDay = month==0?(new Date((year-1),12,0).getDate()):(new Date(year,month,0).getDate());

        var prevCount=0?7:startWeek;//显示在日历最前部分的上个月补充日期数量
        var nextCount=7-(prevCount+maxDay)%7;//显示在日历最后部分的下个月补充日期数量
        var columnCount=Math.floor((maxDay-(7-startWeek))/7)+2;//日期panel的列数
        for(var j=0;j<columnCount;j++){//循环设置table中td的样式
            tdListHtml+='<tr>';
            for(var k=0;k<7;k++){
                var thisTD='';
                var endClass='';
                var todayClass='';
                if(k==0){
                        endClass='first ';
                }else if(k==6){
                    endClass='last ';
                }
                if((j*7+k+1-prevCount)==day){
                    todayClass=' today';
                }

                if((j*7+k+1)<=prevCount){
                    thisTD='<td class="'
                            +endClass
                            +'other">'
                            +(prevMaxDay-prevCount+1+k)
                            +'</td>';
                }else if((j*7+k+1)>(prevCount+maxDay)){
                    thisTD='<td class="'
                            +endClass
                            +'other">'
                            +(j*7+k+1-maxDay-prevCount)
                            +'</td>';
                }else{
                    thisTD='<td class="'
                            +endClass
                            +'normal'
                            +todayClass
                            +'">'
                            +(j*7+k+1-prevCount)
                            +'</td>';
                }
                tdListHtml+=thisTD;
            }
            tdListHtml+='</tr>';
        }


        //包装table元素
        var tableHtml='<table class="date-tb forbid-select">'
                            +'<thead>'
                                +'<tr>'
                                    +'<th class="first">日</th>'
                                    +'<th>一</th>'
                                    +'<th>二</th>'
                                    +'<th>三</th>'
                                    +'<th>四</th>'
                                    +'<th>五</th>'
                                    +'<th class="last">六</th>'
                                +'</tr>'
                            +'</thead>'
                            +'<tbody>'
                                +tdListHtml
                            +'</tbody>'
                        +'</table>';
        return tableHtml;
    }

    /**
     * [updateCalendarHtml 更新日历的html]
     * @param  {[int]} year      [四位数年份]
     * @param  {[int]} month     [月份0-11]
     * @param  {[int]} day       [日]
     * @param  {[jquery对象]} jq        [table的直接父容器content]
     * @return {[type]}           [description]
     */
    var updateCalendarHtml=function(year,month,day,jq){
        var headerJq=jq.parent('div').prev('div');
        headerJq.children('.year').children('.text').text(year);
        headerJq.children('.month').children('.text').text(month*1+1);
        //替换table日历
        jq.empty().html(generateDateSerial(year,month,day)).children('table');
        //绑定点击方法
        bindTdClick(jq.children('table'));
    }

    /**
     * [bindTdClick 通过js事件冒泡，为table中所有当前月的日期格绑定点击事件]
     * @param  {[jquery对象]} jq [table]
     * @return {[type]}    [description]
     */
    var bindTdClick=function(jq){
        jq.children('tbody').children('tr').on('click',function(event) {
            event=event||window.event;
            if($(event.target).hasClass('other')){
                return;
            }
            $(this).parent('tbody').parent('table').find('.today').removeClass('today');
            $(event.target).addClass('today');
            var dateHeader=$(this).parent('tbody').parent('table').parent('div').parent('div').prev('div');
            var yearStr=dateHeader.children('.year').children('.text').text();
            var monthStr=dateHeader.children('.month').children('.text').text();
            var dayStr=$(event.target).text();
            dateHeader.parent('div').prev('a').children('.text').text(yearStr+'/'+monthStr+'/'+dayStr);
            dateHeader.parent('div').parent('div').prev('input').val(yearStr+'/'+monthStr+'/'+dayStr);
            toggleOption(dateHeader.parent('div').parent('div'));
        });
    }


    $.fn.alienDatebox = function (options,param) {
        if (typeof options == 'string'){
            return $.fn.alienDatebox.methods[options](this, param);
        }

        var options = $.extend(defaults, options);
        return this.each(function () {
            //step06-b 在插件里定义方法
            show(this,options);
        });
    }

    $.fn.alienDatebox.methods = {
        getValue: function(jq){
            return jq.val();
        }
    };
})(jQuery);
