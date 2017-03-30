Vue.component('bar-left-right', {
    template: `<div>
                    <div id="barLeftRight">带环饼图</div>
               </div>`,
    data(){
        return {
            chart:null,
            userData:[],
            lData:[],
            rData:[],
            url:'/api/portal/sysOperation/getOperationChart.gm'
        }
    },
    mounted(){
        this.fetchData(this.url);
    },
    methods: {
        fetchData(url) {
            /*var _this=this;
             this.$http.get(url).then((response) => {
             _this.tagData=response.data.dataInfo.tagData;
             _this.tagTotalData=response.data.dataInfo.tagTotal;
             _this.drawPie('wordcloud');/!*画图*!/
             },(response) => {
             //console.log(response);
             });*/
            this.$http.get(url).then(function (res) {
                var resData=res.data.dataInfo;
                resData.forEach( (item)=> {
                    this.userData.push(item.name);
                    this.lData.push(item.csvCount);
                    this.rData.push(item.userGroupCount);
                });
                this.drawPie('barLeftRight');
            });
        },
        drawPie (id) {
            this.chart = echarts.init(document.getElementById(id))
            this.chart.setOption({
                color:['#5ab1ef','#2ec7c9'],
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                legend: {
                    data:['下载csv次数', '新增用户群数'],
                    bottom:10
                },
                calculable : true,
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
                        axisLine: {
                            lineStyle: {
                                color: '#8e8e8e',
                                width:1,
                            }
                        },
                        axisTick : {show: false},
                        data : this.userData,
                    }
                ],
                grid:{
                    top:30
                },
                series : [
                    {
                        name:'新增用户群数',
                        type:'bar',
                        barWidth : 5,
                        itemStyle : { normal: {label : {show: true, position: 'right'}}},
                        data:this.rData
                    },
                    {
                        name:'下载csv次数',
                        type:'bar',
                        stack: '总量',
                        barWidth : 20,
                        itemStyle: {normal: {
                            label : {show: true}
                        }},
                        data:this.lData
                    }
                    /*{
                        name:'新增用户群数',
                        type:'bar',
                        stack: '总量',
                        itemStyle : { normal: {label : {show: true, position: 'insideRight'}}},
                        data:this.rData
                    },
                    {
                        name:'下载csv次数',
                        type:'bar',
                        stack: '总量',
                        itemStyle : { normal: {label : {show: true, position: 'insideRight'}}},
                        data:this.lData
                    },*/
                ]
            })
        }
    }
})