/*线形图   推送客户统计*/
Vue.component('btn-click', {
    template: `<div class="clearfix">
                    <div class="right btnWrap"> 
                    <button v-for="cell in 3" class="btn" :class="{ 'btn-active': cell === selected }" @click="showChart(cell,btnDataMes[cell-1])" >{{btnData[cell-1]}}</button>
                   </div>
                </div>`,
    data(){
        return {
            selectedTime:'',

            selected:1,
            btnData:['近一周','近一月','近半年'],
            btnDataMes:['weekChart','monthChart','halfYearChart']
        }
    },
    methods:{
        showChart(index,times){/*点击切换事件*/
            /*console.log(times);*/
            this.selectedTime=times;
            coms.$emit('click', this.selectedTime);


            this.selected = index
            /*console.log(index)*/

        }
    }
})
Vue.component('bar-stack-y', {
    template: `<div class="clearfix twoPieWrap">
                    <div id="barStack"></div>
               </div>`,
    data(){
        return {
            chart:null,
            chart2:null,
            resData:[],
            pieData:[],
            selectedTime:'weekChart',
            xData:[],
            ySeries:[],
            url:'/api/portal/marketEffect/getAllCustomerTransformChart.gm'
        }
    },
    mounted(){
        this.fetchData(this.url,this.selectedTime);
    },
    created(){
        coms.$on('click',(target) => {
            //this.functionName(target)
            /*console.log(target);*/
            this.selectedTime=target;
            this.fetchData(this.url,this.selectedTime);
        });

    },
    methods: {
        fetchData(url,selTime) {
            this.$http.get(url).then(function(response) {
                /*大图数据*/
                this.resData=response.data.dataInfo[selTime];
                this.xData=this.resData.xAxis;
                var yData=this.resData.yAxis;
                this.ySeries.length=0;
                for(var key in yData){
                    var obj={
                        type:'bar',
                        tooltip : {trigger: 'item'},
                        stack: '堆积',
                        barWidth : 30,
                    }
                    obj.name=key;
                    obj.data=yData[key];
                    this.ySeries.push(obj);
                }
                this.drawPie('barStack');/*画图*/
            });
        },
        drawPie (id) {
            this.chart = echarts.init(document.getElementById(id))
            this.chart.setOption({
                color:['#fcf002','#0b95e1','#00a852','#0690a4','#a0cd3b','#1078f5','#37b647','#34b2f5'],
                tooltip : {
                    trigger: 'axis',
                    formatter: "{a} : {c}"
                },
                calculable : true,
                grid:{
                    top:'20px'
                },
                xAxis : [
                    {
                        type : 'category',
                        splitLine : {show : false},
                        data : this.xData,
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
                series : this.ySeries,
            });
        }
    }
})

var coms=new Vue();