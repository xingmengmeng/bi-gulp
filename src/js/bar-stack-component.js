/*堆积条形图   用户群活动推送*/
Vue.component('bar-stack-component', {
    template: `<div id="mainStack">多系列层叠图</div>`,
    data(){
        return {
            chart:null,
            legendData:[],
            activityCountData:[],
            pushCountData:[],
            yAxisData:[],
            url:'/api/portal/autoMatch/getUserGroupActivityPushChart.gm'
        }
    },
    mounted(){
        this.fetchData(this.url);
    },
    methods: {
        fetchData(url) {
            var _this=this;
            this.$http.get(url).then((response) => {
                var resData=response.data.dataInfo;
                resData.forEach(function (item,index) {
                    _this.activityCountData.push(item.activityCount);/*活动用户群数据*/
                    _this.pushCountData.push(item.pushCount);/*推送成功群数据*/
                    _this.yAxisData.push(item.pushedName);/*y轴 即每行*/
                    _this.legendData=['未使用活动数','推送成功活动数'];
                })
                _this.drawPie('mainStack');/*画图*/
            },(response) => {
                //console.log(response);
            });
        },
        drawPie (id) {
            this.chart = echarts.init(document.getElementById(id))
            this.chart.setOption({
                color:['#b9caf6','#8eb2f6'],
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                legend: {
                    data:this.legendData,
                    bottom:'10px',
                },
                calculable : true,
                grid:{
                    top:'15px',
                    left:'80px',
                },
                xAxis : [
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
                yAxis : [
                    {
                        type : 'category',
                        data : this.yAxisData,
                        axisLabel:{
                            textStyle:{
                                fontSize:10,
                            }
                        },
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
                        name:this.legendData[0],
                        type:'bar',
                        stack: '总量',
                        itemStyle : { normal: {label : {show: true, position: 'insideRight'}}},
                        data:this.activityCountData
                    },
                    {
                        name:this.legendData[1],
                        type:'bar',
                        stack: '总量',
                        itemStyle : { normal: {label : {show: true, position: 'insideRight'}}},
                        data:this.pushCountData
                    },
                ]
            })
        }
    }

})
