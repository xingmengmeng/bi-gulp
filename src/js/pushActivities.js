
/*推送活动*/
var activity=new Vue({
    el: '.deTail',
    data:{
        list:[],
        gropId:'',/*用户群id*/
        pageNum:'1',
        gotoPage:'1',
        pageCount:'',
        querySystemList:null,/*对接系统列表*/
        groupData:null,/*用户群列表*/
        activeName:'',
        selected:'',/*选中的对接系统*/
        selectedGroup:'',/*选中的用户群*/
        systemId:'',/*对接系统id*/
        subject:'',/*活动主题*/
        counts:'',/*覆盖用户数*/
        subject:'',
        actDetail:{

        },/*活动详情*/
        shContent:'',/*搜索内容*/
    },
    mounted(){
        this.getLocal();
        this.getTabList();
        this.getData();
    },
    watch: {
        selected: function(val) {
            for(var key in this.querySystemList){
                if(this.querySystemList[key]==val){
                    this.systemId=key;
                }
            }
        },
        selectedGroup:function (val) {
            this.gropId=val;
            this.countNum();
        }
    },
    methods:{
        getData(){
            /*计算得到的对接系统列表*/
            this.$http.get('/api/marketActivity/querySystemList.gm').then(function (response) {
                this.querySystemList=response.data.dataInfo;
            })
        },
        /*得到列表信息*/
        getTabList(){
            if(this.shContent==''){
                var url='/api/marketActivity/queryList.gm?pageNum='+this.pageNum+'&date='+Date.now();
            }else{
                this.gotoPage=this.pageNum=1;
                var url='/api/marketActivity/queryList.gm?pageNum=1'+'&searchContent='+this.shContent+'&date='+Date.now();
            }
            this.$http.get(url).then(function (response) {
                this.list=response.data.dataInfo.dataList;
                this.pageCount=response.data.dataInfo.pageCount;
                this.gotoPage=this.pageNum;
            });
        },
        /*从localstorage里拿到当前的用户群id*/
        getLocal(){
            this.gropId=localStorage.thisGroupId;
        },
        /*通过监听select框变化  得到用户群id*/
        getGroupId(){

        },
        /*显示弹框*/
        showMark(){
            var overlay=document.querySelector('.overlay'),
                markWarp=document.querySelector('.markAddAct');
            overlay.style.display=markWarp.style.display='block';
            this.$http.get('/api/userGroup/querySelectList.gm').then(function (response) {
                this.groupData=response.data.dataInfo;
            });
        },
        /*关闭按钮 隐藏弹框*/
        hideMark(){
            var overlay=document.querySelector('.overlay'),
                markWarp=document.querySelector('.markAddAct'),
                markActDetail=document.querySelector('.markActDetail'),
                markDelet=document.querySelector('.markDelet');
            overlay.style.display=markWarp.style.display=markActDetail.style.display=markDelet.style.display='none';
        },
        /*提交事件*/
        addUserGroupFn(){
            this.$http.post('/api/marketActivity/save.gm',{"systemCode":this.systemId,"userGroupId":this.gropId,"subject":this.subject},{emulateJSON:true}).then(function (res) {
                if(res.data.code==200){
                    var overlay=document.querySelector('.overlay'),
                        markWarp=document.querySelector('.markAddAct');
                    /*弹框消失  列表刷新*/
                    overlay.style.display=markWarp.style.display='none';
                    this.getTabList();
                }
            })
        },
        /*计算活动覆盖用户数*/
        countNum(){
            this.$http.get('/api/userGroup/queryUserCount.gm?id='+this.gropId).then(function (res) {
                this.counts=res.data.dataInfo;
            })
        },
        getPageData(e){
            if(e.target.innerHTML=='上一页'){
                if(this.pageNum<=1) return;
                this.pageNum--;
                this.getTabList();/*ajax后台获取要显示数据*/
            }else if(e.target.innerHTML=='下一页'){
                if(this.pageNum>=this.pageCount) return;
                this.pageNum++;
                this.getTabList();/*ajax后台获取要显示数据*/
            }
        },
        gotoPageFn(){
            if(this.gotoPage<1||this.gotoPage>this.pageCount||this.gotoPage==this.pageNum){
                this.gotoPage=this.pageNum;
                return;
            }else{
                this.pageNum=this.gotoPage;
                this.getTabList();/*ajax后台获取要显示数据*/
            }
        },
        /*活动详情*/
        showActDetail(id,e){
            var event=window.event||e;
            if(event.target.innerHTML!='活动分析'&&event.target.innerHTML!='删除'){
                var overlay=document.querySelector('.overlay'),
                    markActDetail=document.querySelector('.markActDetail');
                overlay.style.display=markActDetail.style.display='block';
                this.$http.get('/api/marketActivity/getById.gm?id='+id).then(function (res) {
                    this.actDetail=res.data.dataInfo;
                })
            }
        },
        deleteUserGroup(id){
            /*显示弹框  确定否  然后点确定  则删除*/
            var overlay=document.querySelector('.overlay'),
                markDelet=document.querySelector('.markDelet');
            overlay.style.display=markDelet.style.display='block';
            console.log(id);
            localStorage.actDeleteId=id;
        },
        deletFalse(){
            /*取消  关弹框*/
            var overlay=document.querySelector('.overlay'),
                markDelet=document.querySelector('.markDelet');
            overlay.style.display=markDelet.style.display='none';
        },
        deleteTrue(){
            /*确定  删除  关弹框*/
            var id=localStorage.actDeleteId;
            console.log(id);
            this.$http.delete('/api/marketActivity/delete.gm?id='+id).then(function (res) {
                if(res.data.code==200){
                    var overlay=document.querySelector('.overlay'),
                        markDelet=document.querySelector('.markDelet');
                    overlay.style.display=markDelet.style.display='none';
                    /*前台页面列表数组删除此条数据  或者再走一次接口*/
                    this.list=this.list.filter( (item)=> {
                        return id!=item.id;
                    })
                }
            })
        },
        /*搜索*/
        searchFun(){
            this.getTabList();
        },
    }
})
