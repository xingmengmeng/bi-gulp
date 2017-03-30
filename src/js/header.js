Vue.http.interceptors.push(function(request, next) {
    next(function(response) {
        if(response.status==200){
            if(response.body.code==203||response.body.code==undefined){
                window.location.href='login.html';
            }
        }
        return response;
    });
});
var _urlData,_menuData;
function getUrlPage(){
    var url=window.location.href;
    var reg=/(\/\w+\.html)/g;
    url.replace(reg,function (){
        _menuData=_urlData=arguments[1];
    });
    if(_urlData=='/userGroupDetails.html'||_urlData=='/liabry.html'||_urlData=='/userLabel.html'||_urlData=='/downloadLink.html'||_urlData=='/addUserGroup.html'){
        _urlData='/userGroup.html';
    }
};
getUrlPage();
var headers=new Vue({
    el:'#header',
    data:{
        userName:'',
        timer:null,
        menuData:[],
        pageData:[],
        urlData:_urlData,/*地址栏中拿到当前地址的name*/
    },
    mounted(){
        this.getData();
    },
    methods:{
        getData(){
            this.userName=localStorage.userName.split('@')[0];
            this.$http.get('/api/getMenus.gm').then(function (res) {
                //得到链接
                res.data.dataInfo.forEach( (item)=> {
                    item.type=='menu'?this.menuData.push(item):this.pageData.push(item);
                });
            })
        },
        logoutFn(e){
            if(e.target.innerHTML=='注销'){
                this.$http.get('/api/logout.gm').then(function (res) {
                    if(res.data.code==200){
                        window.location.href='login.html';
                    }
                })
            }
        },
        toolEnter(){
            clearTimeout(this.timer);
            var headerTool=document.querySelector('.headerTool');
            headerTool.style.display='block';
        },
        toolLeave(){
            this.timer=setTimeout(function () {
                var headerTool=document.querySelector('.headerTool');
                headerTool.style.display='none';
            },100)
        }
    }
});
