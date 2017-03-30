/**
 * 1.计算整个外框的宽度
 * 2.点击右键左
 * 3.点击右键右
 * n 当前图的索引
 */

function Slide(id) {
    this.oBox=document.getElementById(id);
    this.largeWrap=this.oBox.getElementsByTagName('div')[0];
    this.oUlWrap=this.largeWrap.getElementsByTagName('div')[0];
    this.aUl=this.oUlWrap.getElementsByTagName('ul');
    this.oBtnLeft=this.oBox.getElementsByTagName('a')[0];
    this.oBtnRight=this.oBox.getElementsByTagName('a')[1];
    this.width=0;
    this.n=0;
    this.init();
}
Slide.prototype={
    constructor:Slide,
    init:function () {
        var _this=this;
        this.setWidth();
        //this.leftRight();  当多于5个时放出
    },
    setWidth:function () {
        for(var i=0;i<this.aUl.length;i++){
            this.aUl[i].style.width=this.aUl[0].offsetWidth+'px';
        }
        this.width=this.aUl[0].offsetWidth*this.aUl.length;
        this.oUlWrap.style.width=this.width+'px';
    },
    autoMove:function () {
        if(this.n+5>=this.aUl.length){
            return;
        }
        this.n++;
        this.oUlWrap.style.left=(-this.n*(this.aUl[0].offsetWidth))+'px';
    },
    leftRight:function () {
        var _this=this;
        this.oBtnRight.onclick=function(){
            _this.autoMove();
        };
        this.oBtnLeft.onclick=function(){
            if(_this.n<=0){
                return;
            }
            _this.n--;
            _this.oUlWrap.style.left=(-_this.n*(_this.aUl[0].offsetWidth))+'px';
        }
    }
}