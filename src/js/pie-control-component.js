/*堆积条形图   标签数据*/
Vue.component('pie-control-component', {
    template: `<div>
                    <div class="clearfix">
                        <div class="dataControl">四级标签数：<span>{{tagTotalData}}个</span></div> 
                    </div>
                    <div id="pieControlWrap">带环饼图</div>
               </div>`,
    data(){
        return {
            chart:null,
            tagData:null,
            tagTotalData:null,
            url:'/api/portal/tagFactory/getTagDataChart.gm'
        }
    },
    mounted(){
        this.fetchData(this.url);
    },
    methods: {
        fetchData(url) {
            var _this=this;
            this.$http.get(url).then((response) => {
                _this.tagData=response.data.dataInfo.tagData;
                _this.tagTotalData=response.data.dataInfo.tagTotal;
                _this.drawPie('pieControlWrap');/*画图*/
            },(response) => {
                //console.log(response);
            });
        },
        drawPie (id) {
            this.chart = echarts.init(document.getElementById(id))
            this.chart.setOption({
                color:['#fcf002','#0b95e1','#00a852','#0690a4','#a0cd3b','#1078f5','#37b647','#34b2f5'],
                calculable : false,
                tooltip : {
                    trigger: 'item',
                    formatter: "{b} : {c} 个"
                },
                series : [
                    {
                        name:'标签来源',
                        type:'pie',
                        radius : [80, 110],

                        // for funnel
                        x: '60%',
                        width: '35%',
                        funnelAlign: 'left',
                        max: 1048,
                        data:this.tagData
                    }
                ]
            })
        }
    }
})
