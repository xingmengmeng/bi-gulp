/*测试数据*/
/*var _list = [{name:"小明",age:23, checked: true,id:1},{name:"小红",age:20, checked: true,id:2},{name:"ddd",age:30, checked: true,id:3}];*/
new Vue({
    el: '.app',
    data:{
        list:[],
        searchContent:'',
        pageNum:1,/*当前显示的列表 页码  第几页 默认为第一页 全局变量*/
        gotoPage:1,
        shContent:'',
        pageCount:1,

    },
    mounted(){
        this.getUrlPage();
        this.getData();
    },
    computed: {
        allChecked: {
            get: function(){
                return this.checkedCount == this.list.length;
            },
            set: function(value){
                this.list.forEach(function(item){
                    item.checked = value
                })
                return value;
            }
        },
        checkedCount: {
            get: function(){
                var i = 0;
                this.list.forEach(function(item){
                    if(item.checked == true) i++;
                })
                return i;
            }
        },
    },
    methods:{
        //得到地址栏中的当前页码数  history设置
        getUrlPage(){
            var url=window.location.href,
                urlReg=/#(\w+)=(\d+)/,
                urlObj={};
            url.replace(urlReg,function ($0,$1,$2) {
                urlObj[$1]=$2;
            });
            if(urlObj['page']){//浏览器退回的page
                this.pageNum=urlObj['page'];
            }else{//单独请求的页面
                this.pageNum=1;
            }
        },
        getData(){
            if(this.shContent==''){
                var url='/api/userGroup/queryList.gm?pageNum='+this.pageNum+'&date='+Date.now();
            }else{
                this.gotoPage=this.pageNum=1;
                var url='/api/userGroup/queryList.gm?pageNum=1'+'&searchContent='+this.shContent+'&date='+Date.now();
                history.pushState({page:this.pageNum},'page','#page=1');
            }
            this.$http.get(url).then(function (response) {
                this.list=response.data.dataInfo.dataList;
                this.pageCount=response.data.dataInfo.pageCount;
                this.gotoPage=this.pageNum;

            });
        },
        /*deleteUserGroup(id){
            this.$http.delete('http://www.mengmeng.com/api/userGroup/delete.gm?id='+id).then(function (response) {
                if(response.data.code==200){
                    this.list=this.list.filter(function (item) {
                        return item.id!=id;
                    });
                }
            });
        },*/
        deleteUserGroup(id){
            /*显示弹框  确定否  然后点确定  则删除*/
            var overlay=document.querySelector('.overlay'),
                markDelet=document.querySelector('.markDelet');
            overlay.style.display=markDelet.style.display='block';
            localStorage.userGroupDeleteId=id;
        },
        deletFalse(){
            /*取消  关弹框*/
            var overlay=document.querySelector('.overlay'),
                markDelet=document.querySelector('.markDelet');
            overlay.style.display=markDelet.style.display='none';
        },
        deleteTrue(){
            /*确定  删除  关弹框*/
            var id=localStorage.userGroupDeleteId;
            this.$http.delete('/api/userGroup/delete.gm?id='+id).then(function (res) {
                if(res.data.code==200){
                    var overlay=document.querySelector('.overlay'),
                        markDelet=document.querySelector('.markDelet');
                    overlay.style.display=markDelet.style.display='none';
                    /*前台页面列表数组删除此条数据  或者再走一次接口*/
                    this.list=this.list.filter(function (item) {
                        return item.id!=id;
                    });
                }
            })
        },
        searchFun(con){/*用户群列表搜索的回车及点击搜索标事件  con为当前文本框的value*/
            this.getData();/*ajax后台获取要显示数据*/
        },
        getPageData(e){
            if(e.target.innerHTML=='上一页'){
                if(this.pageNum<=1) return;
                this.pageNum--;
                history.pushState({page:this.pageNum},'page','#page='+this.pageNum);
                this.getData();/*ajax后台获取要显示数据*/
            }else if(e.target.innerHTML=='下一页'){
                if(this.pageNum>=this.pageCount) return;
                this.pageNum++;
                history.pushState({page:this.pageNum},'page','#page='+this.pageNum);
                this.getData();/*ajax后台获取要显示数据*/
            }
        },
        gotoPageFn(){
            if(this.gotoPage<1||this.gotoPage>this.pageCount||this.gotoPage==this.pageNum){
                this.gotoPage=this.pageNum;
                history.pushState({page:this.pageNum},'page','#page='+this.pageNum);
                return;
            }else{
                this.pageNum=this.gotoPage;
                history.pushState({page:this.pageNum},'page','#page='+this.pageNum);
                this.getData();/*ajax后台获取要显示数据*/
            }
        },
        /*点击详情  本地存储用户群的id值  localStorage*/
        setIdLocal(id,curName,status,e){
            var event=window.event||e;
            if(event.target.innerHTML!='删除'){
                window.location.href='userGroupDetails.html?id='+id;
            }
            localStorage.thisGroupId=id;
            localStorage.thisGroupName=curName;
            localStorage.thisGroupStatus=status;
        }
    }
});
