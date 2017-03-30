serBiWrap.init();
var adduser=new Vue({
    el: '.app',
    data:{
        list:null,
        searchContent:'',
        pageNum:1,
        treeResData:[],/*树的数据*/
        fourResData:[],/*得到的四级结构的数据*/
        ishow: false,
        i: -1,/*二级树的class样式*/
        j:-1,/*三级树点击后状态  文字颜色变化*/
        addUserLeftScroll:null,/*用户群树结构的iscroll实例*/
        fourTreeScroll:null,/*中间四级结构的iscroll*/
        biSelectAry:[],/*点击四级后添加的数组 总数据数组*/
        /**
         * [
         *  {"id":232,"name":"二线城市","parentId":230,"level":4,"checked":true},
         *  {"id":233,"name":"三线城市","parentId":230,"level":4,"checked":true}
         * ]
         */
        biAllAry:[],/*点击四级后添加的数组  所有标签数组*/
        /**
         * [
         *  {parentId:1,'value':'本科，专科，研究生','idAry':[12,13,14,15]}，
         *  {parentId:2,'value':'本科，专科，研究生'}，
         * ]
         */
        biEveryAry:[],/*点击四级后添加的数组  任意标签数组*/
        tagRelations:[],/*点击提交向后台发送的数据数组*/
        checkdId:[],/*checked为true的标签*/

        userGroupName:'',
        addGroupSearchCon:'',
        n:'0',/*选择的标签数*/
        savaError:'',/*创建用户群保存确定后的接口状态  错误提示*/
        statisUsers: {rate: "0%", count: 0},
        showLoading: false
    },
    mounted(){
        this.getData();
        this.saveGroup();/*提交按钮样式*/
    },
    computed: {

    },
    methods:{
        /*得到树的数据*/
        getData(){
            this.$http.get('/api/baseTag/queryTree.gm').then(function (response) {
                this.treeResData=response.data.dataInfo;

                this.$nextTick(function(){
                    this.addUserLeftScroll=new IScroll('.addUsersLeft',{
                        mouseWheel: true,
                        scrollbars: true,
                        checkDOMChanges:true,
                        bounce: false,
                        interactiveScrollbars:true
                    });
                    /*this.addUserCenterScroll=new IScroll('.fourWrap',{
                        mouseWheel: true,
                        scrollbars: true,
                        checkDOMChanges:true,
                        bounce: false
                    });*/
                    this.addUserRightScroll=new IScroll('.biWrap',{
                        mouseWheel: true,
                        scrollbars: true,
                        checkDOMChanges:true,
                        bounce: false,
                        interactiveScrollbars:true
                    });
                })
            })
        },
        /*显示三级树*/
        showChild(index){
            if(this.i==index){
                //console.log('同一个');
                this.i=-1;
            }else{
                //console.log('不同个');
                this.i=index;
            }
            this.$nextTick(function () {
                this.addUserLeftScroll.refresh();
            })
        },
        /*显示四级*/
        showFourTree(id){
            if(this.j==id){
                //console.log('同一个');
                return;
            }else{
                //console.log('不同个');
                this.j=id;
                this.fourResData.length=0;
            }
            this.$http.get('/api/baseTag/queryByParentId.gm?parentId='+id).then(function (response) {
                this.setFour(response);
            })

        },
        /*点击四级标签事件  添加到右侧*/
        getSendData(checkData){

            if(navigator.userAgent.toLowerCase().indexOf('firefox')!='-1'){//火狐浏览器兼容
                if(checkData.checked==undefined||checkData.checked==false){
                    checkData.checked=true;
                }else {
                    checkData.checked=false;
                }
            };

            if(checkData.checked){/*选中状态  查找放好的数组中有没有padrentid相同的  有的话拼到一个数组中，没有的话拼到另一个数组中  整体是一个大数组*/
                /*查找已有数组，看是否存有当前的父级id*/
                /*var isHave=this.biAllAry.filter(function (item) {
                    return item.parentId==checkData.parentId
                });
                if(isHave.length!=0){/!*有当前父级  向后追加*!/
                    this.biAllAry.map(function (item) {
                        if(item.parentId==checkData.parentId){
                            item.value=item.value+'，'+checkData.name;
                            item.idAry.push(checkData.id);
                        }
                    })
                }else{
                    var idAry=new Array;/!*存放逻辑数组*!/
                    idAry.push(checkData.id);
                    var obj={
                        "parentId":checkData.parentId,
                        "value":checkData.name,
                        "idAry":idAry
                    }
                    this.biAllAry.push(obj);
                }
                this.biSelectAry.push(checkData);/!*选中的数组*!/
                this.checkdId.push(checkData.id);/!*选中项的id数组*!/*/
                var biAllAryNohas=this.biAllAry.filter(function (item) {
                    return item.parentId==checkData.parentId;
                })
                var biEveryAryHas=this.biEveryAry.filter(function (item) {
                    return item.parentId==checkData.parentId;
                })
                if(biAllAryNohas.length==0&&biEveryAryHas.length!=0){
                    this.checkTrue(checkData,this.biEveryAry);
                }else{
                    this.checkTrue(checkData,this.biAllAry);
                }
            }
            else{/*不选中状态   看原数组中有无这项  有：删除总数组中此项   拼好的数组中  删除此项*/
                var biAllAryNohas=this.biAllAry.filter(function (item) {
                    return item.parentId==checkData.parentId;
                })
                var biEveryAryHas=this.biEveryAry.filter(function (item) {
                    return item.parentId==checkData.parentId;
                })
                if(biAllAryNohas.length==0&&biEveryAryHas.length!=0){
                    this.checkFalse(checkData,this.biEveryAry);
                }else{
                    this.checkFalse(checkData,this.biAllAry);
                }
            }
            /*点击复选按钮以后得到的新的数组  所有标签都必须满足的数组
            * 循环拿到的biAllAry数组，把idAry中的数组拼为一个新数组
            * this.tagRelations先致空  再拼接
            * */
            this.pingAry();
            this.$nextTick(function () {
                this.addUserRightScroll.refresh();
            })
        },
        /*选中状态*/
        checkTrue(checkData,aryData){
            this.n++;
            this.saveGroup();
            var isHave=aryData.filter(function (item) {
                return item.parentId==checkData.parentId
            });
            if(isHave.length!=0){/*有当前父级  向后追加*/
                aryData.map(function (item) {
                    if(item.parentId==checkData.parentId){
                        item.value=item.value+'，'+checkData.name;
                        item.idAry.push(checkData.id);
                    }
                })
            }else{
                var idAry=new Array;/*存放逻辑数组*/
                idAry.push(checkData.id);
                var obj={
                    "parentId":checkData.parentId,
                    "value":checkData.name,
                    "idAry":idAry
                }
                aryData.push(obj);
            }
            this.biSelectAry.push(checkData);/*选中的数组*/
            this.checkdId.push(checkData.id);/*选中项的id数组*/
        },
        /*从选中到未选中状态*/
        checkFalse(checkData,aryData){
            this.n--;
            this.saveGroup();
            aryData.map(function (item) {
                if(item.parentId==checkData.parentId){
                    //item.value=item.value.split('').removeByValue(checkData.value).join(' ，');
                    var tmpl=item.value.split('，');
                    for(var i=0; i<tmpl.length; i++) {
                        if(tmpl[i] == checkData.name) {
                            tmpl.splice(i, 1);
                            break;
                        }
                    }
                    for(var i=0;i<item.idAry.length;i++){
                        if(item.idAry[i] == checkData.id) {
                            item.idAry.splice(i, 1);
                            break;
                        }
                    }
                    item.value=tmpl.join('，');
                }
            });
            for(var i=0;i<aryData.length;i++){
                if(aryData[i].value==''&&aryData[i].parentId){
                    aryData.splice(i,1);
                    break;
                }
            }
            this.checkdId=this.checkdId.filter(function (item) {
                return item!=checkData.id;
            });
            /*this.biSelectAry=this.biSelectAry.filter(function (item) {
             return item.id!=checkData.id;
             });*/
        },
        /*下移*/
        toDown(pId){
            /*通过父级的id  得到上个模块数组总的此项数据  上级块数组删掉此数据  下块增加此条数据*/
            var dowData;
            this.biAllAry.forEach( (item,index)=> {
                if(item.parentId==pId){
                    this.biEveryAry.push(item);
                    this.biAllAry.splice(index,1);
                }
            });
            this.pingAry();/*拼接数组函数（得到tagRelations）*/
            this.$nextTick(function () {
                this.addUserRightScroll.refresh();
            })
        },
        /*上移*/
        toUp(pId){
            /*通过父级的id  得到上个模块数组总的此项数据  上级块数组增加此数据  下块删除此条数据*/
            var dowData;
            this.biEveryAry.forEach( (item,index)=> {
                if(item.parentId==pId){
                    this.biAllAry.push(item);
                    this.biEveryAry.splice(index,1);
                }
            });
            this.pingAry();/*拼接数组函数（得到tagRelations）*/
            this.$nextTick(function () {
                this.addUserRightScroll.refresh();
            })
        },
        /*拼接数组函数（得到tagRelations）*/
        pingAry(){
            this.tagRelations=[];
            this.biAllAry.forEach( (item) =>{
                this.tagRelations.push(item.idAry);
            });
            var biTmpAry=[];
            this.biEveryAry.forEach( (item) =>{
                item.idAry.forEach( (curId) =>{
                    biTmpAry.push(curId);
                })
            })
            this.tagRelations.push(biTmpAry);/*得到向后台发送的总数组*/

            var tagRelationsStr=JSON.stringify(this.tagRelations);
            //console.log('统计用户数');
            this.$http.get('/api/baseTag/queryCount.gm?tagRelations='+tagRelationsStr).then(function (res) {
                this.statisUsers=res.data.dataInfo;
            });
            console.log(JSON.stringify(this.tagRelations));
        },
        /*删除*/
        deleteData(pId){
            /*
            * 上下两块的数组查找删掉此项
            * 向后台发送的数据重新拼接(两个接口的数据都要变)
            * 存储的checkid数组（checkdId）更新删除里面的id
            * */
            var tmId;
            this.biEveryAry.forEach( (item,index) =>{
                if(item.parentId==pId){
                    this.biEveryAry.splice(index,1);
                    tmId=item.idAry;
                    return false;
                }
            });
            this.biAllAry.forEach( (item,index) =>{
                if(item.parentId==pId){
                    this.biAllAry.splice(index,1);
                    tmId=item.idAry;
                    return false;
                }
            });

            /*checkid的变化*/
            tmId.forEach((item)=>{
                this.checkdId=this.checkdId.filter((curid)=>{
                    return curid!=item;
                })
            });
            this.fourResData.forEach( (item) =>{
                tmId.forEach(function (cur) {
                    if(item.id==cur){
                        item.checked=false;
                    }
                })
            });
            this.n=this.checkdId.length;
            this.pingAry();
            this.$nextTick(function () {
                this.addUserRightScroll.refresh();
            });
            this.saveGroup();
        },
        /*显示弹框*/
        showMark(){
            this.savaError='';
            var overlay=document.querySelector('.overlay'),
                markWarp=document.querySelector('.markWarp');
            overlay.style.display=markWarp.style.display='block';
        },
        /*关闭按钮 隐藏弹框*/
        hideMark(){
            var overlay=document.querySelector('.overlay'),
                markWarp=document.querySelector('.markWarp');
            overlay.style.display=markWarp.style.display='none';
        },
        /*两个取消按钮*/
        goList(){
            window.location.href='userGroup.html';
        },
        /*清空列表*/
        clearList(){
            this.checkdId=[];
            this.biSelectAry=[];
            this.biAllAry=[];
            this.biEveryAry=[];
            this.tagRelations=[];
            this.fourResData.forEach(function (item) {
                item.checked=false;
            });
            this.n=0;
            this.statisUsers={rate: "0%", count: 0};
            this.saveGroup();
        },
        /*弹框中 确定按钮事件  提交信息 */
        addUserGroupFn(){
            if(this.userGroupName==''){
                this.savaError='用户群名称不能为空';
                return false;
            }else if(this.userGroupName.length>10){
                this.savaError='最多可输入10个字符';
                return false;
            }
            this.$http.post('/api/userGroup/save.gm',{"name":this.userGroupName,"tagRelations":JSON.stringify(this.tagRelations)},{emulateJSON:true}).then(function (response) {
                if(response.data.code==200){
                    window.location.href='userGroup.html';
                }
                if(response.data.status=='error') {
                    this.savaError = response.data.msg;
                }
            })
        },
        /*搜索*/
        addUserGroupSearch(){
            this.$http.get('/api/baseTag/queryListBySearch.gm?searchContent='+this.addGroupSearchCon).then(function (response) {
                this.setFour(response);
            })
        },
        /*搜索及点出四级树后的操作*/
        setFour(response){
            var _this=this;
            this.fourResData=response.data.dataInfo;
            /*设置返回的数据中哪一项为选中状态*/
            if(this.fourResData){
                this.fourResData.forEach(function (item) {
                    _this.checkdId.forEach(function (cur) {
                        if(item.id==cur){
                            item.checked=true;
                        }
                    })
                })
            }
            this.$nextTick(function(){
                if(this.fourTreeScroll==null){
                    this.fourTreeScroll=new IScroll('.fourWrap',{
                        mouseWheel: true,
                        scrollbars: true,
                        checkDOMChanges:true,
                        bounce: false,
                        interactiveScrollbars:true
                    })
                }else {
                    this.fourTreeScroll.refresh();
                }

            });
        },
        /*设置提交按钮状态*/
        saveGroup(){
            var btnsave=document.querySelector('#saveGroup');
            if(this.n==0){
                btnsave.style.background='#ddd';
                btnsave.style.color='#333';
                btnsave.style.cursor='default';
                btnsave.setAttribute('disabled','true');
            }else{
                btnsave.style.background='#1078f5';
                btnsave.style.color='#fff';
                btnsave.style.cursor='pointer';
                btnsave.removeAttribute('disabled');
            }
        }
    }
});

Vue.http.interceptors.push((request, next) => {
    var url=request.url;
    var reg=/(queryByParentId|queryListBySearch)/;
    if(reg.test(url)){
        adduser.showLoading = true;
    }
    next((response) => {
        adduser.showLoading = false;
        return response;
    });
});


