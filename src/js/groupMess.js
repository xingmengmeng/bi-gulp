/*let urlStr=window.location.href;
let id='';
    id=urlStr.queryURLParameter().id;*/

var groupMess=new Vue({
    el: '.deTail',
    data:{
        resData:[],
        librayData:[],
        messData:[],
        gropId:'',
        curName:'',/*当前用户群名*/
        selected:'',
        selectedStatus:'',
        status:'',
        psw:'',/*下载密码*/
        downLodeUrl:'',/*下载地址*/
        selectedGroup:'',/*选中的用户群*/
        groupData:null,/*用户群列表*/
        querySystemList:null,/*对接系统列表*/
        subject:'',/*活动主题*/
        counts:'',/*覆盖用户数*/
        downError:'',/*下载错误提示*/
        saveError:'',/*创建活动错误提示*/
        labelNum:'',
    },
    watch: {
        /*selectedStatus: function(val) {
            this.status = val == "启用" ? 1 : 0;
            console.log(this.status);
        },*/
        selectedGroup:function (val) {
            this.gropId=val;
            this.countNum();
        },
        selected: function(val) {
            for(var key in this.querySystemList){
                if(this.querySystemList[key]==val){
                    this.systemId=key;
                }
            }
        }
    },
    mounted(){
        this.getLocal();
        this.getData();
        this.status=this.selectedStatus=='启用'?1:0;
    },
    methods:{
        getData(){
            /*标签具体信息*/
            this.$http.get('/api/userGroup/getById.gm?id='+this.gropId).then(function (response) {
                this.resData=response.data.dataInfo;
                this.selectedStatus=this.resData.status==0?'禁用':'启用';
            });

            /*用户标签*/
            this.$http.get('/api/userGroup/tagRelation/queryList.gm?userGroupId='+this.gropId).then(function (response) {
                this.messData=response.data.dataInfo;
                this.labelNum=this.messData.length;
                if(this.messData.length>10){
                    this.messData.length=10;
                }
            });

            this.getLib();
        },
        /*点击编辑  变为可编辑状态*/
        changeStatus(){
            var editInput=document.querySelector('#editInput');
            editInput.removeAttribute('disabled');
        },
        /*改变状态*/
        selectChange(){
            this.status=this.selectedStatus=='启用'?1:0;
            this.editMess();
        },
        /*失去焦点  修改并改状态*/
        editMess(){
            /*var editInput=document.querySelector('#editInput');
            editInput.setAttribute('disabled',true);*/
            var val=this.resData.name;
            localStorage.thisGroupStatus=this.status;
            this.$http.post('/api/userGroup/update.gm',{"id":this.gropId,"name":val,"status":this.status},{emulateJSON:true}).then(function (response) {
                /*操作日志*/
                this.getLib();
            });
        },
        /*从localstorage里拿到当前的用户群id*/
        getLocal(){
            this.gropId=localStorage.thisGroupId;
            this.curName=localStorage.thisGroupName;
        },
        getLib(){
            /*操作日志*/
            this.$http.get('/api/operationLog/queryLastFive.gm?userGroupId='+this.gropId).then(function (response) {
                this.librayData=response.data.dataInfo;
            });
        },
        /*显示创建活动弹框*/
        showMark(){
            console.log(this.status);
            var overlay=document.querySelector('.overlay'),
                markWarp=document.querySelector('.markAddAct');
            overlay.style.display=markWarp.style.display='block';
            this.countNum();
            /*计算得到的对接系统列表*/
            this.$http.get('/api/marketActivity/querySystemList.gm').then(function (response) {
                this.querySystemList=response.data.dataInfo;
            })
        },
        /*提交事件*/
        addUserGroupFn(){
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
        /*下载弹框*/
        showDownMark(url){
            this.downError=this.psw='';
            var overlay=document.querySelector('.overlay'),
                markDown=document.querySelector('.markDown');
            overlay.style.display=markDown.style.display='block';
            this.countNum();
            this.downLodeUrl=url;
        },
        hideMark(){
            var overlay=document.querySelector('.overlay'),
                markDown=document.querySelector('.markDown'),
                markAddAct=document.querySelector('.markAddAct');
            overlay.style.display=markDown.style.display=markAddAct.style.display='none';
        },
        downCsv(){
            /*this.$http.get('/api/csv/'+this.downLodeUrl+'.gm?authPassword='+this.psw+'&userGroupId='+this.gropId+'&isFirst=true').then(function (res) {
                if(res.data.status=='error'){
                    this.downError=res.data.msg;
                }else if(res.data.dataInfo=='true'){
                    window.location.href='/api/csv/'+this.downLodeUrl+'.gm?authPassword='+this.psw+'&userGroupId='+this.gropId+'&isFirst=false';
                    this.getLib();
                    this.hideMark();
                }
            })*/
            this.$http.get('/api/csv/download.gm?authPassword='+this.psw+'&userGroupId='+this.gropId+'&isFirst=true').then(function (res) {
                if(res.data.status=='error'){
                    this.downError=res.data.msg;
                }else if(res.data.dataInfo=='true'){
                    window.location.href='/api/csv/download.gm?authPassword='+this.psw+'&userGroupId='+this.gropId+'&isFirst=false';
                    this.getLib();
                    this.hideMark();
                }
            })
        }

    }
})
