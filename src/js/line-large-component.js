/*堆积条形图   标签数据*/
Vue.component('line-large-component', {
    template: `<div>
                    <div class="slideDiv" id="box">
                        <div class="largWrap">
                            <div class="ulWrap clearfix">
                                <ul v-for="cusType in cusTypeList">
                                    <li><img :src="'images/'+cusType.code+'.png'"></li>
                                    <li><span>{{cusType.name}}</span></li>
                                    <li><span>{{cusType.value}}</span></li>
                                </ul>
                                <!--<ul>
                                    <li><img src="images/gmjj.png"></li>
                                    <li><span>国美基金</span></li>
                                    <li><span>111</span></li>
                                </ul>
                                <ul>
                                    <li><img src="images/gmjj.png"></li>
                                    <li><span>国美dsf</span></li>
                                    <li><span>222</span></li>
                                </ul>
                                <ul>
                                    <li><img src="images/gmjj.png"></li>
                                    <li><span>防守打法</span></li>
                                    <li><span>333</span></li>
                                </ul>
                                <ul>
                                    <li><img src="images/gmjj.png"></li>
                                    <li><span>的是非失</span></li>
                                    <li><span>444</span></li>
                                </ul>
                                <ul>
                                    <li><img src="images/gmjj.png"></li>
                                    <li><span>东方大道</span></li>
                                    <li><span>555</span></li>
                                </ul>
                                <ul>
                                    <li><img src="images/gmjj.png"></li>
                                    <li><span>第三方的</span></li>
                                    <li><span>666</span></li>
                                </ul>
                                <ul>
                                    <li><img src="images/gmjj.png"></li>
                                    <li><span>第三方的</span></li>
                                    <li><span>777</span></li>
                                </ul>
                                <ul>
                                    <li><img src="images/gmjj.png"></li>
                                    <li><span>第三方的</span></li>
                                    <li><span>888</span></li>
                                </ul>
                                <ul>
                                    <li><img src="images/gmjj.png"></li>
                                    <li><span>第三方的</span></li>
                                    <li><span>999</span></li>
                                </ul>-->
                            </div>
                        </div>
                        <!--多于5个时放出-->
                        <!--<a href="javascript:;" class="slideIcon leftIcon"></a>
                        <a href="javascript:;" class="slideIcon rightIcon"></a>-->
                    </div>
                    <div id="lineLarge">入库客户数据</div>
               </div>`,
    data(){
        return {
            chart:null,
            dateList:null,
            cusCountList:null,
            cusTypeList:null,
            url:'/api/portal/tagFactory/getInboundCustomerChart.gm'
        }
    },
    mounted(){
        this.fetchData(this.url);
    },
    methods: {
        fetchData(url) {
            var _this=this;
            this.$http.get(url).then((response) => {
                _this.cusTypeList=response.data.dataInfo.cusTypeList;
                this.$nextTick(function () {
                    var myslid=new Slide('box');/*页面渲染完成后实例化轮播图*/
                })
                _this.dateList=response.data.dataInfo.dateList;
                _this.cusCountList=response.data.dataInfo.cusCountList;
                _this.drawPie('lineLarge');/*画图*/
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
                grid:{
                    top:40,
                    left:'70px',
                },
                calculable : true,
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap : false,
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
                        axisLine: {
                            lineStyle: {
                                color: '#8e8e8e',
                                width:1,
                            }
                        },
                        min:850000
                    }
                ],
                series : [
                    {
                        name:'用户数',
                        type:'line',
                        smooth:true,
                        itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        data:this.cusCountList
                    }
                ]
            })
        }
    }
})
