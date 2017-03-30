var rightHeight=document.querySelector('.rightSide').offsetHeight;
document.querySelector('.logScroll').style.height=rightHeight-130+'px';

var liabry=new Vue({
    el: '.deTail',
    data:{
        groupId:'',
        psw:'',
        downLodeUrl:'',
        actCount:'',
        downError:'',/*下载错误提示*/
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
            this.$http.get('/api/userGroup/queryUserCount.gm?id='+this.groupId).then(function (res) {
                this.actCount=res.data.dataInfo;
            })
        },
        getLocal(){
            this.groupId=localStorage.thisGroupId;
            this.thisGroupName=localStorage.thisGroupName;
        },
        showDownMark(url){
            this.downError=this.psw='';
            var overlay=document.querySelector('.overlay'),
                markDown=document.querySelector('.markDown');
            overlay.style.display=markDown.style.display='block';
            this.downLodeUrl=url;
        },
        hideMark(){
            var overlay=document.querySelector('.overlay'),
                markWarp=document.querySelector('.markAddAct'),
                markDown=document.querySelector('.markDown');
            overlay.style.display=markWarp.style.display=markDown.style.display='none';
        },
        downCsv(){
            /*this.$http.get('/api/csv/'+this.downLodeUrl+'.gm?authPassword='+this.psw+'&userGroupId='+this.groupId+'&isFirst=true').then(function (res) {
                if(res.data.status=='error'){
                    this.downError=res.data.msg;
                }else if(res.data.dataInfo=='true'){
                    window.location.href='/api/csv/'+this.downLodeUrl+'.gm?authPassword='+this.psw+'&userGroupId='+this.groupId+'&isFirst=false';
                    this.hideMark();
                }
            })*/
            this.$http.get('/api/csv/download.gm?authPassword='+this.psw+'&userGroupId='+this.groupId+'&isFirst=true').then(function (res) {
                if(res.data.status=='error'){
                    this.downError=res.data.msg;
                }else if(res.data.dataInfo=='true'){
                    window.location.href='/api/csv/download.gm?authPassword='+this.psw+'&userGroupId='+this.groupId+'&isFirst=false';
                    this.hideMark();
                }
            })
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
            this.$http.post('/api/marketActivity/save.gm',{"systemCode":this.systemId,"userGroupId":this.groupId,"subject":this.subject},{emulateJSON:true}).then(function (res) {
                if(res.data.code==200){
                    window.location.href='pushActivities.html';
                }else if(res.data.status=='error'){
                    this.saveError=res.data.msg;
                }
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
        /*计算活动覆盖用户数*/
        countNum(){
            this.$http.get('/api/userGroup/queryUserCount.gm?id='+this.groupId).then(function (res) {
                this.counts=res.data.dataInfo;
            })
        },
        getLocalStatus(){
            this.status=localStorage.thisGroupStatus;
        }
    }
})