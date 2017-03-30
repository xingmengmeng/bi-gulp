~function (pro) {
    //->queryURLParameter:get url parameter or hash  获取url参数
    function queryURLParameter() {
        var reg = /([^?=&#]+)=([^?=&#]+)/g,
            obj = {};
        this.replace(reg, function () {
            obj[arguments[1]] = arguments[2];
        });

        //->HASH
        reg = /#([^?=&#]+)/g;
        this.replace(reg, function () {
            obj['HASH'] = arguments[1];
        });
        return obj;
    }

    //->formatTime:format time by template  格式化拿到的日期
    function formatTime(template) {
        template = template || '{0}年{1}月{2}日 {3}时{4}分{5}秒';
        var reg = /\d+/g,
            ary = this.match(reg);
        template = template.replace(/\{(\d+)\}/g, function () {
            var index = arguments[1],
                res = ary[index] || '00';
            res.length < 2 ? res = '0' + res : null;
            return res;
        });
        return template;
    }

    pro.formatTime = formatTime;
    pro.queryURLParameter = queryURLParameter;
}(String.prototype);

var setHeight=(function () {
    var leftSide=document.querySelector('.leftSide');
    var rightSide=document.querySelector('.rightSide');
    var showHide=document.querySelector('.show-hide');
    var leftMenu=document.querySelector('#leftMenu');

    var leftSideStatus=localStorage.leftSideStatus;
    if(leftSideStatus==undefined||leftSideStatus=='off'){
        document.querySelector('.leftSide').style.width=190+'px';
        rightSide.style.paddingLeft=200+'px';
        leftMenu.style.display='block';
    }else{
        document.querySelector('.leftSide').style.width=0;
        document.querySelector('.show-hide').className='show-hide2';
        rightSide.style.paddingLeft=0+'px';
        leftMenu.style.display='none';
    }

    /*点击左侧菜单  显示隐藏按钮*/
    function showOrHide() {
        var leftWidth=leftSide.offsetWidth;
        if(leftWidth==0){
            leftSide.style.width=190+'px';
            rightSide.style.paddingLeft=200+'px';
            leftMenu.style.display='block';
            document.querySelector('.show-hide2').className='show-hide';
            localStorage.leftSideStatus='off';
        }else{
            leftSide.style.width=0+'px';
            rightSide.style.paddingLeft=0+'px';
            leftMenu.style.display='none';
            document.querySelector('.show-hide').className='show-hide2';
            localStorage.leftSideStatus='on';
        }
    }

    /*设置中间整体部分的高度*/
    function setWinHeight() {
        var cHeight=document.documentElement.clientHeight;
        var headerHeight=document.getElementById('header').offsetHeight;
        var footerHeigh=document.getElementById('footer').offsetHeight;
        /*中间部分的高度   总高度-头-尾-20像素的间隔*/
        var centerHeight=cHeight-headerHeight-footerHeigh-20;
        var mainWrap=document.getElementById('mainWrap');
        mainWrap.style.height=centerHeight+'px';
    }

    return {
        init: function () {
            setWinHeight();
            showHide.onclick=showOrHide;
        }
    }
})();
setHeight.init();/*设置总体高度*/
window.onresize=function () {/*浏览器窗口大小改变时  重新计算高度*/
    setHeight.init();
}

/*右侧设置增加的标签列表块高度  及中间四级结构的高度*/
var serBiWrap=(function () {
    var biWrap=document.querySelector('.biWrap'),
        addUsersRight=document.querySelector('.addUsersRight'),
        biFooter=document.querySelector('.biFooter');

    var addUsersCenter=document.querySelector('.addUsersCenter'),
        searchWrap=document.querySelector('.searchWrap'),
        fourWrap=document.querySelector('.fourWrap');

    return {
        init:function () {
            var biWrapHeight=addUsersRight.offsetHeight-biFooter.offsetHeight;
            biWrap.style.height=biWrapHeight-40+'px';

            var fourWrapHeight=addUsersCenter.offsetHeight-searchWrap.offsetHeight;
            fourWrap.style.height=fourWrapHeight-50+'px';
        }
    }
})();

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

