~function (pro) {
    //->queryURLParameter:get url parameter or hash  获取url参数
    function queryURLParameter() {
        var reg = /([^?=&#]+)=([^?=&#]+)/g,
            obj = {};
        this.replace(reg, function () {
            obj[arguments[1]] = arguments[2];
        });

        //->HASH
        reg = /#([^?=&#]+)/g;
        this.replace(reg, function () {
            obj['HASH'] = arguments[1];
        });
        return obj;
    }
    pro.queryURLParameter = queryURLParameter;
}(String.prototype);

let urlStr=window.location.href;
let _sno='';
_sno=urlStr.queryURLParameter().sno;
Vue.http.interceptors.push(function(request, next) {
    next(function(response) {
        if(response.status==200){
            if(response.body.code==203||response.body.code==undefined){
                window.location.href='login.html';
            }
        }
        return response;
    });
});

/*参与活动使用情况统计*/
Vue.component('useRed',{
    props: ['curId','curUrl'],/*放传递过来的参数*/
    template:`<div :id="curId">参与活动使用情况统计</div>`,
    data(){
        return {
            id:this.curId,
            url:this.curUrl,
            resData:[],
        }
    },
    mounted(){
        this.showChart();
    },
    methods:{
        showChart(){
            this.$http.get(this.url).then(function (res) {
                this.resData=res.data.dataInfo;
                this.drawPie(this.id);
            })
        },
        drawPie (id) {
            this.chart = echarts.init(document.getElementById(id))
            this.chart.setOption({
                /*color:['#8eb2f6','#b9caf6','#d1ddfd','#508afa'],*/
                color:['#d87a80','#2ec7c9'],
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    orient : 'vertical',
                    top:'10px',
                    right:'10px',
                    data:['成功使用红包用户数','未使用红包用户数'],
                },
                calculable : true,
                series : [
                    {
                        name:'数据来源',
                        type:'pie',
                        radius : '55%',
                        center: ['50%', '60%'],
                        data:this.resData,
                    }
                ]
            })
        }
    }
})
/*参与活动的客户数量*/
Vue.component('child', {
    props: ['curId','curUrl'],/*放传递过来的参数*/
    template: `<div>
                    <div class="clearfix">
                        <div class="dataControl">
                            <input type="radio" value="yesterday" v-model="radiodata" @click="showChart"><label>昨天</label>
                            <input type="radio" value="week" v-model="radiodata" @click="showChart"><label>近一周</label>
                            <input type="radio" value="month" v-model="radiodata" @click="showChart"><label>近一月</label>
                        </div>
                    </div>
                    <div :id="curId">参与活动的客户数量</div>
                </div>`,
    data(){
        return{
            id:this.curId,
            url:this.curUrl,
            resData:[],
            dateList:[],/*日期*/
            useRedFirst:[],/*使用红包首投*/
            useRedSecond:[],/*使用红包复投*/
            notUseRed:[],/*未使用红包*/
            basisList:[],/*平台客户对比*/
            radiodata:'week',
            barWidth:25,
        }
    },
    mounted(){
        this.fetchData(this.url,this.radiodata);
    },
    methods:{
        showChart(){/*点击切换事件*/
            /*daychart:近一月   weekChart 周  monthChart月份  yearChart 年*/
            this.fetchData(this.url,this.radiodata);
        },
        fetchData(url,radiovalue){
            if(this.resData.length==0){
                this.$http.get(url).then(function (res) {
                    this.resData=res.data.dataInfo;
                    this.setData(radiovalue);
                })
            }else{
                this.setData(radiovalue);
            }
        },
        setData(radiovalue){
            if(radiovalue=='month'){
                this.barWidth=10;
            }else{
                this.barWidth=25;
            }
            this.dateList=this.resData[radiovalue].dateList;
            this.useRedFirst=this.resData[radiovalue].useRedFirst;
            this.useRedSecond=this.resData[radiovalue].useRedSecond;
            this.notUseRed=this.resData[radiovalue].notUseRed;
            this.basisList=this.resData[radiovalue].basisList;
            this.drawPie(this.id);
        },
        drawPie (id) {
            this.chart = echarts.init(document.getElementById(id))
            this.chart.setOption({
                color:['#5ab1ef','#97b552','#e5cf0d','#b6a2de'],
                tooltip : {
                    trigger: 'axis',
                    formatter: "{a} : <br/>{b}: {c}%"
                },
                calculable : true,
                legend: {
                    data:['使用红包首投客户数','使用红包复投客户数','未用红包客户数','平台客户同比'],
                    bottom:'10px',
                },
                grid:{
                    top:'20px'
                },
                xAxis : [
                    {
                        type : 'category',
                        splitLine : {show : false},
                        data : this.dateList,
                        axisLine: {
                            lineStyle: {
                                color: '#8e8e8e',
                                width:1,
                            }
                        }
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        position: 'right',
                        axisLabel : {
                            formatter: '{value} %'
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#8e8e8e',
                                width:1,
                            }
                        }
                    },
                    {
                        type : 'value',
                        position: 'left',
                        axisLine: {
                            lineStyle: {
                                color: '#8e8e8e',
                                width:1,
                            }
                        }
                    }
                ],
                series : [
                    {
                        name:'使用红包首投客户数',
                        type:'bar',
                        tooltip : {trigger: 'item'},
                        stack: '广告',
                        data:this.useRedFirst,
                        barWidth:this.barWidth,
                    },
                    {
                        name:'使用红包复投客户数',
                        type:'bar',
                        tooltip : {trigger: 'item'},
                        stack: '广告',
                        data:this.useRedSecond,
                        barWidth:this.barWidth,
                    },
                    {
                        name:'未用红包客户数',
                        type:'bar',
                        tooltip : {trigger: 'item'},
                        stack: '广告',
                        data:this.notUseRed,
                        barWidth:this.barWidth,
                    },
                    {
                        name:'平台客户同比',
                        type:'line',
                        yAxisIndex: 1,
                        data:this.basisList,
                        barWidth:this.barWidth,
                    }
                ]
            })
        }
    }
})
/*参与活动的客户投资金额*/
Vue.component('investAmount', {
    props: ['curId','curUrl'],/*放传递过来的参数*/
    template: `<div>
                    <div class="clearfix">
                        <div class="leftBtnWrap">
                            <button :class="!firstAct?'selectBtn':'noSelectBtn'" @click="changeSelect">全部客户</button>
                            <button :class="firstAct?'selectBtn':'noSelectBtn'" @click="changeSelect">首投客户</button>
                        </div>
                        <div class="dataControl">
                            <input type="radio" value="yesterday" v-model="radiodata" @click="showChart"><label>昨天</label>
                            <input type="radio" value="week" v-model="radiodata" @click="showChart"><label>近一周</label>
                            <input type="radio" value="month" v-model="radiodata" @click="showChart"><label>近一月</label>
                        </div>
                    </div>
                    <div :id="curId">参与活动的客户投资金额</div>
                </div>`,
    data(){
        return{
            id:this.curId,
            url:this.curUrl,
            resData:[],
            dateList:[],/*日期*/
            useRedFirst:[],/*1数据*/
            useRedSecond:[],/*2数据*/
            notUseRed:[],/*3数据*/
            basisList:[],/*线数据*/
            radiodata:'week',
            firstAct:false,/*是否首投*/
            barWidth:30,
        }
    },
    mounted(){
        this.fetchData(this.url,this.radiodata);
    },
    methods:{
        /*切换首投非首投*/
        changeSelect(){
            this.firstAct=!this.firstAct;
            this.showChart();
        },
        showChart(){/*点击切换事件*/
            this.fetchData(this.url,this.radiodata);
        },
        fetchData(url,radiovalue){
            if(this.resData.length==0){
                this.$http.get(url).then(function (res) {
                    this.resData=res.data.dataInfo;
                    this.setData(radiovalue);
                })
            }else{
                this.setData(radiovalue);
            }
        },
        setData(radiovalue){
            if(radiovalue=='month'){
                this.barWidth=10
            }else{
                this.barWidth=30
            }
            console.log(radiovalue);
            this.dateList=this.resData[radiovalue].dateList;
            if(!this.firstAct){
                this.useRedFirst=this.resData[radiovalue].activity;
                this.useRedSecond=this.resData[radiovalue].notActivity;
                this.basisList=this.resData[radiovalue].basisList;
            }else{
                this.useRedFirst=this.resData[radiovalue].firstActivity;
                this.useRedSecond=this.resData[radiovalue].firstNotActivity;
                this.basisList=this.resData[radiovalue].firstBasisList;
            }
            this.drawPie(this.id);
        },
        drawPie (id) {
            this.chart = echarts.init(document.getElementById(id))
            this.chart.setOption({
                color:['#5ab1ef','#97b552','#e5cf0d','#ffb980'],
                tooltip : {
                    trigger: 'axis',
                    formatter: "{a} : <br/>{b}: {c}%"
                },
                calculable : true,
                legend: {
                    data:['活动投资额','非活动投资额','同比'],
                    bottom:'10px',
                },
                grid:{
                    top:'20px'
                },
                xAxis : [
                    {
                        type : 'category',
                        splitLine : {show : false},
                        data : this.dateList,
                        axisLine: {
                            lineStyle: {
                                color: '#8e8e8e',
                                width:1,
                            }
                        }
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        position: 'right',
                        axisLabel : {
                            formatter: '{value} %'
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#8e8e8e',
                                width:1,
                            }
                        }
                    },
                    {
                        type : 'value',
                        position: 'left',
                        axisLine: {
                            lineStyle: {
                                color: '#8e8e8e',
                                width:1,
                            }
                        }
                    }
                ],
                series : [
                    {
                        name:'活动投资额',
                        type:'bar',
                        tooltip : {trigger: 'item'},
                        stack: '堆积',
                        data:this.useRedFirst,
                        barWidth : this.barWidth,
                    },
                    {
                        name:'非活动投资额',
                        type:'bar',
                        tooltip : {trigger: 'item'},
                        stack: '堆积',
                        data:this.useRedSecond,
                        barWidth : this.barWidth,
                    },
                    {
                        name:'同比',
                        type:'line',
                        yAxisIndex: 1,
                        data:this.basisList,
                        barWidth : this.barWidth,
                    }
                ]
            })
        }
    }
})
/*参与活动的客户人均投资*/
Vue.component('perInvestAmount', {
    props: ['curId','curUrl'],/*放传递过来的参数*/
    template: `<div>
                    <div class="clearfix">
                        <div class="dataControl">
                            <input type="radio" value="yesterday" v-model="radiodata" @click="showChart"><label>昨天</label>
                            <input type="radio" value="week" v-model="radiodata" @click="showChart"><label>近一周</label>
                            <input type="radio" value="month" v-model="radiodata" @click="showChart"><label>近一月</label>
                        </div>
                    </div>
                    <div :id="curId">参与活动的客户人均投资</div>
                </div>`,
    data(){
        return{
            id:this.curId,
            url:this.curUrl,
            resData:[],
            dateList:[],/*日期*/
            useRedFirst:[],/*1数据*/
            useRedSecond:[],/*2数据*/
            notUseRed:[],/*3数据*/
            basisList:[],/*线数据*/
            radiodata:'week',
        }
    },
    mounted(){
        this.fetchData(this.url,this.radiodata);
    },
    methods:{
        showChart(){/*点击切换事件*/
            this.fetchData(this.url,this.radiodata);
        },
        fetchData(url,radiovalue){
            if(this.resData.length==0){
                this.$http.get(url).then(function (res) {
                    this.resData=res.data.dataInfo;
                    this.setData(radiovalue);
                })
            }else{
                this.setData(radiovalue);
            }
        },
        setData(radiovalue){
            this.dateList=this.resData[radiovalue].dateList;
            this.useRedFirst=this.resData[radiovalue].activity;
            this.useRedSecond=this.resData[radiovalue].notActivity;
            this.basisList=this.resData[radiovalue].basisList;
            this.drawPie(this.id);
        },
        drawPie (id) {
            this.chart = echarts.init(document.getElementById(id))
            this.chart.setOption({
                color:['#5ab1ef','#97b552','#e5cf0d','#b6a2de'],
                tooltip : {
                    trigger: 'axis',
                    formatter: "{a} : <br/>{b}: {c}%"
                },
                calculable : true,
                legend: {
                    data:['活动中的人均投资','历史的人均投资','同比'],
                    bottom:'10px',
                },
                grid:{
                    top:'20px'
                },
                xAxis : [
                    {
                        type : 'category',
                        splitLine : {show : false},
                        data : this.dateList,
                        axisLine: {
                            lineStyle: {
                                color: '#8e8e8e',
                                width:1,
                            }
                        }
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        position: 'right',
                        axisLabel : {
                            formatter: '{value} %'
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#8e8e8e',
                                width:1,
                            }
                        }
                    },
                    {
                        type : 'value',
                        position: 'left',
                        axisLine: {
                            lineStyle: {
                                color: '#8e8e8e',
                                width:1,
                            }
                        }
                    }
                ],
                series : [
                    {
                        name:'活动中的人均投资',
                        type:'bar',
                        tooltip : {trigger: 'item'},
                        stack: '',
                        data:this.useRedFirst,
                    },
                    {
                        name:'历史的人均投资',
                        type:'bar',
                        tooltip : {trigger: 'item'},
                        stack: '',
                        data:this.useRedSecond,
                    },
                    {
                        name:'同比',
                        type:'line',
                        yAxisIndex: 1,
                        data:this.basisList,
                    }
                ]
            })
        }
    }
})
/*客户投资产品情况*/
Vue.component('investProduct', {
    props: ['curId','curUrl'],/*放传递过来的参数*/
    template: `<div>
                    <div class="clearfix">
                        <div class="leftBtnWrap">
                            <button :class="!firstAct?'selectBtn':'noSelectBtn'" @click="changeSelect">全部客户</button>
                            <button :class="firstAct?'selectBtn':'noSelectBtn'" @click="changeSelect">首投客户</button>
                        </div>
                        <!--<div class="dataControl">
                            <input type="radio" value="yesterday" v-model="radiodata" @click="showChart"><label>昨天</label>
                            <input type="radio" value="week" v-model="radiodata" @click="showChart"><label>近一周</label>
                            <input type="radio" value="month" v-model="radiodata" @click="showChart"><label>近一月</label>
                        </div>-->
                    </div>
                    <div :id="curId">参与活动的客户投资金额</div>
                </div>`,
    data(){
        return{
            id:this.curId,
            url:this.curUrl,
            resData:[],
            dateList:[],/*日期*/
            useRedFirst:[],/*1数据*/
            useRedSecond:[],/*2数据*/
            notUseRed:[],/*3数据*/
            basisList:[],/*线数据*/
            radiodata:'week',
            firstAct:false,/*是否首投*/
        }
    },
    mounted(){
        this.fetchData(this.url,this.radiodata);
    },
    methods:{
        /*切换首投非首投*/
        changeSelect(){
            this.firstAct=!this.firstAct;
            this.showChart();
        },
        showChart(){/*点击切换事件*/
            this.fetchData(this.url,this.radiodata);
        },
        fetchData(url,radiovalue){
            if(this.resData.length==0){
                this.$http.get(url).then(function (res) {
                    this.resData=res.data.dataInfo;
                    this.setData(radiovalue);
                })
            }else{
                this.setData(radiovalue);
            }
        },
        setData(radiovalue){
            this.dateList.length=this.useRedFirst.length=this.useRedSecond.length=this.basisList.length=0;
            this.resData.forEach( (item)=> {
                this.dateList.push(item.name);
                if(!this.firstAct){
                    this.useRedFirst.push(item.activity)
                    this.useRedSecond.push(item.notActivity);
                    this.basisList.push(item.rate);
                }else{
                    this.useRedFirst.push(item.firstActivity)
                    this.useRedSecond.push(item.firstNotActivity);
                    this.basisList.push(item.firstRate);
                }
                this.drawPie(this.id);
            })
        },
        drawPie (id) {
            this.chart = echarts.init(document.getElementById(id));
            this.chart.setOption({
                color:['#5ab1ef','#97b552','#e5cf0d','#b6a2de'],
                tooltip : {
                    trigger: 'axis',
                    formatter: "{a} : <br/>{b}: {c}%"
                },
                calculable : true,
                legend: {
                    data:['活动投资额','非活动投资额','占比（全部投资额）'],
                    bottom:'10px',
                },
                grid:{
                    top:'20px'
                },
                xAxis : [
                    {
                        type : 'category',
                        splitLine : {show : false},
                        data : this.dateList,
                        axisLine: {
                            lineStyle: {
                                color: '#8e8e8e',
                                width:1,
                            }
                        }
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        position: 'right',
                        axisLabel : {
                            formatter: '{value} %'
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#8e8e8e',
                                width:1,
                            }
                        }
                    },
                    {
                        type : 'value',
                        position: 'left',
                        axisLine: {
                            lineStyle: {
                                color: '#8e8e8e',
                                width:1,
                            }
                        }
                    }
                ],
                series : [
                    {
                        name:'活动投资额',
                        type:'bar',
                        tooltip : {trigger: 'item'},
                        stack: '堆积',
                        data:this.useRedFirst,
                        barWidth : 20,
                    },
                    {
                        name:'非活动投资额',
                        type:'bar',
                        tooltip : {trigger: 'item'},
                        stack: '堆积',
                        data:this.useRedSecond,
                        barWidth : 20,
                    },
                    {
                        name:'占比（全部投资额）',
                        type:'line',
                        yAxisIndex: 1,
                        data:this.basisList,
                    }
                ]
            })
        }
    }
})
/*标签客户转化占比*/
Vue.component('tagCusTrans', {
    props: ['curId','curUrl'],/*放传递过来的参数*/
    template: `<div>
                    <div :id="curId">标签客户转化占比</div>
                </div>`,
    data(){
        return{
            id:this.curId,
            url:this.curUrl,
            resData:[],
            dateList:[],/* x轴*/
            useRedFirst:[],/*使用红包首投*/
            useRedSecond:[],/*使用红包复投*/
            notUseRed:[],/*未使用红包*/
            basisList:[],/*平台客户对比*/
            radiodata:'week',
        }
    },
    mounted(){
        this.showChart();
    },
    methods:{
        showChart(){
            this.$http.get(this.url).then(function (res) {
                this.resData=res.data.dataInfo;
                this.resData.forEach( (item) =>{
                    this.dateList.push(item.name);
                    this.useRedFirst.push(item.useRedCount);
                    this.useRedSecond.push(item.count);
                    this.drawPie(this.id);
                })
            })
        },
        drawPie (id) {
            this.chart = echarts.init(document.getElementById(id))
            this.chart.setOption({
                color:['#5ab1ef','#97b552','#e5cf0d','#b6a2de'],
                tooltip : {
                    trigger: 'axis',
                    formatter: "{a} : <br/>{b}: {c}"
                },
                calculable : true,
                legend: {
                    data:['未使用红包','使用红包'],
                    bottom:'10px',
                },
                grid:{
                    top:'20px'
                },
                xAxis : [
                    {
                        type : 'category',
                        splitLine : {show : false},
                        data : this.dateList,
                        axisLine: {
                            lineStyle: {
                                color: '#8e8e8e',
                                width:1,
                            }
                        }
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        position: 'left',
                        axisLine: {
                            lineStyle: {
                                color: '#8e8e8e',
                                width:1,
                            }
                        }
                    }
                ],
                series : [
                    {
                        name:'未使用红包',
                        type:'bar',
                        tooltip : {trigger: 'item'},
                        stack: '堆积',
                        barWidth : 30,
                        data:this.useRedFirst,
                    },
                    {
                        name:'使用红包',
                        type:'bar',
                        tooltip : {trigger: 'item'},
                        stack: '堆积',
                        barWidth : 30,
                        data:this.useRedSecond,
                    }
                ]
            })
        }
    }
})


var activityInfo=new Vue({
    el:'#activityWrap',
    data:{
        sno:_sno,
        taHeadData:[],
        tabData:[],
        taFootData:[],
        pageCount:'',/*总页数*/
        gotoPage:'1',
        pageNum:'1',
    },
    mounted(){
        this.getHeadData();
        this.getTabData();
        this.getTabFoot();
    },
    methods:{
        getHeadData(){
            this.$http.get('/api/activity/getBaseInfo.gm?sno='+this.sno).then(function (res) {
                this.taHeadData=res.data.dataInfo;
            })
        },
        getTabData(){
            this.$http.get('/api/activity/queryStatList.gm?sno='+this.sno+'&pageNum='+this.pageNum).then(function (res) {
                this.pageCount=res.data.dataInfo.pageCount;
                this.tabData=res.data.dataInfo.dataList;
                this.gotoPage=this.pageNum;
            })
        },
        getTabFoot(){
            this.$http.get('/api/activity/getStatBaseInfo.gm?sno='+this.sno).then(function (res) {
                this.taFootData=res.data.dataInfo;
            })
        },
        getPageData(e){
            if(e.target.innerHTML=='上一页'){
                if(this.pageNum<=1) return;
                this.pageNum--;
                this.getTabData();/*ajax后台获取要显示数据*/
            }else if(e.target.innerHTML=='下一页'){
                if(this.pageNum>=this.pageCount) return;
                this.pageNum++;
                this.getTabData();/*ajax后台获取要显示数据*/
            }
        },
        gotoPageFn(){
            if(this.gotoPage<1||this.gotoPage>this.pageCount||this.gotoPage==this.pageNum){
                this.gotoPage=this.pageNum;
                return;
            }else{
                this.pageNum=this.gotoPage;
                this.getTabData();/*ajax后台获取要显示数据*/
            }
        },
        downExcel(){
            this.$http.get('/api/activity/download.gm?sno='+this.sno).then(function (res) {

            })
        },
    }
})