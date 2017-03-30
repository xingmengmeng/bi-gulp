var comCloud=Vue.component('wordcloud', {
    template: `<div class="wordWrap">
                    <div class="lcHead clearfix" v-cloak>
                        <span class="leftF">{{showStr}}{{totalNum}}</span>
                        <div class="lcBtnWrap">
                            <input type="button" value="昨日投资" :class="actIndex==0?'active':''" @click="fetchData('yesData')">
                            <input type="button" value="总用户" :class="actIndex==1?'active':''" @click="fetchData('data')">
                        </div>
                    </div>
                    <div id="loadings" v-show="showLoading">
                        <ul>
                            <li><span>Loading...</span></li>
                        </ul>
                    </div>
                    <div id="wordcloud"></div>
               </div>`,
    data(){
        return {
            cloudData:[],
            resData:[],
            totalNum:'',
            showStr:'',
            actIndex:0,
            showLoading:true,
            url:'/api/portal/userPortrait/getMylcTagChart.gm'
        }
    },
    mounted(){
        this.getData(this.url,'yesData');
    },
    methods: {

        getData(url,val) {
            this.$http.get(url,{before:function () {
                //console.log(this.showLoading)
            }}).then(function (res) {
                this.showLoading=false;
                this.resData=res.data.dataInfo;
                //console.log(val);
                this.cloudData=this.resData[val];
                this.totalNum=this.resData.yesTotal;
                this.showStr='昨日理财投资用户数：';
                this.actIndex=0;
                this.drawPie('wordcloud');
            });
        },
        fetchData(val){
            console.log(val);
            this.cloudData=this.resData[val];
            this.totalNum=val=='data'?this.resData.total:this.resData.yesTotal;
            this.showStr=val=='data'?'全部理财用户数：':'昨日理财投资用户数：';
            this.actIndex=val=='data'?1:0;
            this.drawPie('wordcloud');
        },
        drawPie (id) {
            this.chart = echarts.init(document.getElementById(id))
            this.chart.setOption({
                color:['#91aff3'],
                tooltip: {
                    show: true
                },
                series: [{
                    /*name: 'Google Trends',*/
                    type: 'wordCloud',
                    size: ['100%', '100%'],
                    /*textRotation : [0, 45, 90, -45],*/
                    textPadding: 0,
                    autoSize: {
                        enable: true,
                        minSize: 14
                    },
                    data:this.cloudData,
                }]
            })
        }
    }
});

