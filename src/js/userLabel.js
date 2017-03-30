/*用户标签详情页面*/

var userLabel=new Vue({
    el: '.deTail',
    data:{
        resData:'',
        gropId:'',
        thisGroupName:'',
        selected:'',
        querySystemList:null,/*对接系统列表*/
        subject:'',/*活动主题*/
        counts:'',/*覆盖用户数*/
        saveError:'',
        subject:'',/*主题*/
        status:'',/*当前用户群使用状态*/
    },
    mounted(){
        this.getLocal();
        this.getData();
    },
    watch: {
        selected: function(val) {
            for(var key in this.querySystemList){
                if(this.querySystemList[key]==val){
                    this.systemId=key;
                }
            }
        }
    },
    methods:{
        getData(){
            /*用户标签*/
            this.$http.get('/api/userGroup/tagRelation/queryDetail.gm?userGroupId='+this.gropId).then(function (response) {
                this.resData=response.data.dataInfo;
                this.resData=this.resData.replace(/or/ig,function () {
                    return '或';
                });
                this.resData=this.resData.replace(/and/ig,function () {
                    return '且';
                });
            });
        },
        /*从localstorage里拿到当前的用户群id*/
        getLocal(){
            this.gropId=localStorage.thisGroupId;
            this.thisGroupName=localStorage.thisGroupName;
        },
        /*提交事件*/
        addUserGroupFn(){
            this.getLocalStatus();
            if(this.status==0){
                this.saveError='当前用户群已被禁用';
                return false;
            }
            if(this.systemId==''||this.subject==''){
                this.saveError='对接系统、主题不能为空';
                return false;
            }
            this.$http.post('/api/marketActivity/save.gm',{"systemCode":this.systemId,"userGroupId":this.gropId,"subject":this.subject},{emulateJSON:true}).then(function (res) {
                if(res.data.code==200){
                    window.location.href='pushActivities.html';
                }else if(res.data.status=='error'){
                    this.saveError=res.data.msg;
                }
            })
        },
        /*计算活动覆盖用户数*/
        countNum(){
            this.$http.get('/api/userGroup/queryUserCount.gm?id='+this.gropId).then(function (res) {
                this.counts=res.data.dataInfo;
            })
        },
        /*显示创建活动弹框*/
        showMark(){
            var overlay=document.querySelector('.overlay'),
                markWarp=document.querySelector('.markAddAct');
            overlay.style.display=markWarp.style.display='block';
            this.countNum();
            /*计算得到的对接系统列表*/
            this.$http.get('/api/marketActivity/querySystemList.gm').then(function (response) {
                this.querySystemList=response.data.dataInfo;
            })
        },
        hideMark(){
            var overlay=document.querySelector('.overlay'),
                markAddAct=document.querySelector('.markAddAct');
            overlay.style.display=markAddAct.style.display='none';
        },
        getLocalStatus(){
            this.status=localStorage.thisGroupStatus;
        }
    }
})