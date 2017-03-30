/**
 * 页面加载查看cookie有没有存用户名密码
 * 如果有的话则发送ajax请求  拿到用户名 密码  填入到文本框  点击登录则ajax（参数cookie登录）  然后返回信息登录跳转
 * 没有：点击时 1.勾选了记住密码  则发送ajax  获取用户名密码  存cookie 跳转（参数非cookie登录）
 * (总逻辑)没有勾选记住密码  清cookie  则发送ajax 请求ajax 登录跳转
 */


var login=new Vue({
    el: '#login',
    data: {
        errorMessage: '',
        isCookerLogin:false,
        cookieNm:'',
        cookiePsd:'',
        isSaveCheck:null,
    },
    mounted(){
        this.getCookie();
    },
    methods:{
        setCookie(usern,psw){
            var Then = new Date()
            Then.setTime(Then.getTime() + 1866240000000);
            document.cookie ="username=" + usern + "%%"+psw+";expires="+ Then.toGMTString();
            console.log('设置cooddddkie')
        },
        getCookie(){
            var nm,psd;
            var cookieString = new String(document.cookie);
            var cookieHeader = "username="
            var beginPosition = cookieString.indexOf(cookieHeader);
            cookieString = cookieString.substring(beginPosition);
            var ends=cookieString.indexOf(";");
            console.log(ends,beginPosition);
            if (ends!=-1){
                cookieString = cookieString.substring(0,ends);
                this.isCookerLogin=false;
            }
            if (beginPosition>-1){
                var nmpsd = cookieString.substring(cookieHeader.length);
                if (nmpsd!=""){
                    beginPosition = nmpsd.indexOf("%%");
                    nm=nmpsd.substring(0,beginPosition);
                    psd=nmpsd.substring(beginPosition+2);
                    document.getElementById('username').value=this.cookieNm=nm;
                    /*document.getElementById('password').setAttribute("type","password");*/
                    document.getElementById('password').value=this.cookiePsd=psd;
                    if(nm!="" && psd!=""){
                        document.getElementById('rememberPass').checked = true;
                        this.isSaveCheck=true;
                    }
                }
            }
        },
        saveInfo(){
            try{
                console.log('按钮点击')
                var isSave = document.getElementById('rememberPass').checked;   //保存按键是否选中
                var usernm = document.getElementById('username').value;
                var userpsw = document.getElementById('password').value;
                this.isSaveCheck=isSave;
                localStorage.userName=usernm;
                if(usernm==''||userpsw==''){
                    this.errorMessage='用户名、密码不能为空'
                }else{
                    if(usernm==this.cookieNm&&userpsw==this.cookiePsd){
                        this.isCookerLogin=true;
                    }else{
                        this.isCookerLogin=false;
                    }
                    if (isSave) {
                        console.log(usernm,userpsw);
                        /*{'userName':usernm,'userPwd':userpsw,'isRemember':true,'isCookerLogin':false}*/
                        /*登录接口*/
                        this.$http.post('/api/dologin.gm',{"userName":usernm,"userPwd":userpsw,"isRemember":true,"isCookerLogin":this.isCookerLogin},{emulateJSON:true}).then(function (response) {
                            console.log(response);
                            if(this.isCookerLogin==false){
                                userpsw=response.data.dataInfo.uuid;
                            }
                            if(response.data.dataInfo.responseCode=='10000'){
                                console.log(usernm,userpsw);
                                this.setCookie(usernm,userpsw);
                                window.location.href='index.html';
                            }else{

                                console.log(response.data.dataInfo.responseMsg);
                                this.errorMessage=response.data.dataInfo.responseMsg
                            }
                        })

                    }else {
                        this.$http.post('/api/dologin.gm',{"userName":usernm,"userPwd":userpsw,"isRemember":true,"isCookerLogin":this.isCookerLogin},{emulateJSON:true}).then(function (response) {
                            if(response.data.dataInfo.responseCode=='10000'){
                                this.setCookie(usernm,userpsw);
                                window.location.href='index.html';
                            }else{
                                console.log(response.data.dataInfo.responseMsg);
                                this.errorMessage=response.data.dataInfo.responseMsg;
                            }
                            this.setCookie("","");
                        })

                    }
                }



            }catch(e){

            }
        }
    }
})