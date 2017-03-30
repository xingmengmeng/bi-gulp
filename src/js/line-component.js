/*线形图   推送客户统计*/
Vue.component('line-component', {
    template: `<div>
                    <div class="clearfix">
                        <div class="dataControl">
                            <input type="radio" name="timeSelect" value="dayChart" v-model="radiodata" @click="showChart"><label>近一月</label>
                            <input type="radio" name="timeSelect" value="weekChart" v-model="radiodata" @click="showChart"><label>周</label>
                            <input type="radio" name="timeSelect" value="monthChart" v-model="radiodata" @click="showChart"><label>月份</label>
                            <input type="radio" name="timeSelect" value="yearChart" v-model="radiodata" @click="showChart"><label>年</label>
                        </div>
                    </div>
                    
                    <div id="lineDiv">入库客户数据</div>
               </div>`,
    data(){
        return {
            chart:null,
            legendData:['美易理财'],
            chartxData:[],
            chartyData:[],
            resData:[],
            radiodata:'dayChart',
            url:'/api/portal/marketEffect/getPushCustomerChart.gm'
        }
    },
    mounted(){
        this.fetchData(this.url,this.radiodata);
    },
    methods: {
        showChart(){/*点击切换事件*/
            /*daychart:近一月   weekChart 周  monthChart月份  yearChart 年*/
            this.fetchData(this.url,this.radiodata);
        },
        fetchData(url,radiovalue) {
            var _this=this;
            this.$http.get(url).then((response) => {
                /*_this.resData=response.data.dataInfo;
                console.log(response.data.dataInfo);*/
                /*switch (radiovalue){
                    case 'weekChart':
                        console.log(2);
                        _this.chartxData=_this.resData.weekChart.dateList;
                        _this.chartyData=_this.resData.weekChart.valueList;
                        break;
                    case 'monthChart':
                        console.log(3);
                        _this.chartxData=_this.resData.monthChart.dateList;
                        _this.chartyData=_this.resData.monthChart.valueList;
                        _this.drawPie('lineDiv');
                        break;
                    case 'yearChart':
                        _this.chartxData=_this.resData.yearChart.dateList;
                        _this.chartyData=_this.resData.yearChart.valueList;
                        _this.drawPie('lineDiv');
                        break;
                    default:
                        console.log(_this.resData);
                        _this.chartxData=_this.resData.dayChart.dateList;
                        _this.chartyData=_this.resData.dayChart.valueList;
                        _this.drawPie('lineDiv');
                        break;
                }*/
                _this.chartxData=response.data.dataInfo[radiovalue].dateList;
                _this.chartyData=response.data.dataInfo[radiovalue].valueList;
                _this.drawPie('lineDiv');/*画图*/
            },(response) => {
                //console.log(response);
            });
        },
        drawPie (id) {
            this.chart = echarts.init(document.getElementById(id))
            this.chart.setOption({
                color:['#91aff3','#789cf0','#28c9f1','#268ca5','#105b6e',
                    '#1ce8b1','#ba55d3','#cd5c5c','#ffa500','#40e0d0'],
                tooltip : {
                    trigger: 'axis'
                },
                legend: {
                    data:['美易理财'],
                    bottom:'10px',
                },
                grid:{
                    top:'15px',
                },
                calculable : true,
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap : false,
                        data : this.chartxData,
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
                        name:'美易理财',
                        type:'line',
                        stack: '总量',
                        data:this.chartyData
                    }
                ]
            })
        }
    }
})