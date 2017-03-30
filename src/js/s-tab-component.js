Vue.component('s-tab-component', {
    template: `<div class="clearfix">
                    <ul class="factoryNum clearfix">
                        <li class="clearfix titleLi"><span>月新增标签</span><span>季新增标签</span><span>年新增标签</span></li>
                        <li class="clearfix dataLi">
                            <span v-for="key in dataList">{{key}}</span>
                        </li>
                    </ul>
               </div>`,
    data(){
        return {
            dataList:null,
            url:'/api/portal/tagFactory/getTagHandleProgressChart.gm'
        }
    },
    mounted(){
        this.fetchData(this.url);
    },
    methods: {
        fetchData(url) {
            var _this=this;
            this.$http.get(url).then((response) => {
                _this.dataList=response.data.dataInfo;
            },(response) => {
                //console.log(response);
            });
        }
    }
})