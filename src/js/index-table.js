Vue.component('index-table', {
    template: `<div class="indexTabWrap">
                    <table class="indexTab" width="100%">
                        <thead>
                            <tr>
                                <th width="105" class="lsTh">
                                    <div class="thDiv">
                                        <span class="leftF">输出项</span>
                                        <i></i>
                                        <span class="rightF">筛选项</span>
                                    </div>
                                </th>
                                <!--<th v-for="index in resHead">{{index}}</th>-->
                                <th>充值(1-5)</th>
                                <th>充值(6-10)</th>
                                <th>提现(1-5)</th>
                                <th>提现(6-10)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="curTr in comparedData">
                                <td>{{curTr.name}}</td>
                                <td v-for="index in resHead">{{curTr[index]}}</td>
                            </tr>
                        </tbody>
                    </table>
               </div>`,
    data(){
        return {
            url:'/api/portal/userPortrait/getTagRelationChart.gm',
            resData:[],
            resHead:[],
            comparedData:[],
        }
    },
    mounted(){
        this.getData(this.url);
    },
    methods: {
        getData(url) {
            this.$http.get(url).then(function (res) {
                this.resData=res.data.dataInfo.data;
                this.resHead=res.data.dataInfo.head;
                var ary=[];

                for(var key in this.resData){
                    var cur=this.resData[key];
                    for(var curKey in cur){
                        var cun=false;
                        var c;
                        for(var i=0;i<ary.length;i++){
                            if(ary[i]['name']==curKey){//已存在
                                cun=true;
                                c=ary[i];
                            }
                        }
                        if(cun){//存在
                            c[key]=cur[curKey];
                        }else {//不存在
                            var obj={};
                            obj.name=curKey;
                            obj[key]=cur[curKey];
                            ary.push(obj);
                        }
                    }

                }
                this.comparedData=ary;
            });
        },

    }
})