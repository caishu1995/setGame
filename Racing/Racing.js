var Racing = {
    baseCanvas: "racing", //canvas的id
    context: null,       //画布
    size: null,          //canvas的宽高
    fieldDeviation: 0,   //视觉偏移, +视觉向左偏，山和道路尽头向左偏。-视觉向右偏

    speed: 0,            //车速，0~6

    config: function(){
        ///修改配置文件
        this.config = {
            skyHeight: this.size.height * 0.3 - 3,
            mountain: [
                {
                    siteX: this.size.width * -0.2 - this.fieldDeviation,
                    siteY: this.size.height * 0.3,
                    width: this.size.width * 0.21,
                    height: this.size.height * 0.2
                },{
                    siteX: this.size.width * -0 - this.fieldDeviation,
                    siteY: this.size.height * 0.3,
                    width: this.size.width * 0.22,
                    height: this.size.height * 0.15
                },{
                    siteX: this.size.width * 0.15 - this.fieldDeviation,
                    siteY: this.size.height * 0.3,
                    width: this.size.width * 0.23,
                    height: this.size.height * 0.22
                },{
                    siteX: this.size.width * 0.5 - this.fieldDeviation,
                    siteY: this.size.height * 0.3,
                    width: this.size.width * 0.28,
                    height: this.size.height * 0.15
                },{
                    siteX: this.size.width * 0.7 - this.fieldDeviation,
                    siteY: this.size.height * 0.3,
                    width: this.size.width * 0.19,
                    height: this.size.height * 0.28
                },{
                    siteX: this.size.width * 0.8 - this.fieldDeviation,
                    siteY: this.size.height * 0.3,
                    width: this.size.width * 0.25,
                    height: this.size.height * 0.18
                }
            ],
            land: {
                colorList: ['8FC04C', '73B043'],
                firstColorIndex: 0
            },
            road: {
                sideColor: "FFF",
                wayColor: "606A7C",
                middleColor: 'FFF'
            }
        };
    },


    init: function() {
        var context = document.getElementById(this.baseCanvas).getContext("2d");

        ///修改canvas宽度高度的属性
        this.size = {
            height: document.body.scrollHeight - 70,
            width: document.body.scrollWidth
        };
        $("#" + this.baseCanvas).attr("height", this.size.height);
        $("#" + this.baseCanvas).attr("width", this.size.width);

        ///初始化配置文件
        this.config();

        ///画内容
        var that = this;
        setInterval(function(){
            context.clearRect(0, 0, that.size.width, that.size.height);    //清空区域

            ///画背景
            that.drawSky(context, that.size.width, that.config.skyHeight);//画天空
            //画山峰们
            for(var i in that.config.mountain){
                that.drawMountain(context, that.config.mountain[i].siteX, that.config.mountain[i].siteY, that.config.mountain[i].width, that.config.mountain[i].height);
            }
            that.drawLand(context, that.size.width, that.size.height - that.config.skyHeight, that.config.skyHeight, that.config.land);//画地
            that.drawRoad(context, that.size.width, that.size.height - that.config.skyHeight, that.config.skyHeight, that.fieldDeviation, that.config.road);//画街道
            that.drawIndexDial(context, that.size.width - 100, that.size.height - 100, 135 + that.speed * 45);//画车速

            that.context = context;
        }, 5000);//20
    },

    ///画天空
    /// height：高度
    /// width ： 宽度
    drawSky: function(context, width, height) {
        context.save();

        context.fillStyle = "#D4F5FE";
        context.strokeStyle = "#D4F5FE";
        context.fillRect(0, 0, width, height);
        context.fill();

        context.restore();
    },
    ///画地
    /// height：高度
    /// width ： 宽度
    /// beginHeight ： 开始高度
    /// landConfig ： 地配置数据
    drawLand: function(context, width, height, beginHeight, landConfig){
        var hasDrawHeight = 0; //已画高度
        var i = 3;            //此次长方形的高
        var index = landConfig.firstColorIndex; //此次长方形颜色序号

        context.save();
        while(hasDrawHeight < height){
            //画长方形地面
            context.fillStyle = "#" + landConfig.colorList[index];
            context.fillRect(0, beginHeight + hasDrawHeight, width, i);

            //修改参数
            hasDrawHeight += i;
            i = i * 1.2;
            index = (index >= landConfig.colorList.length - 1) ? 0: (index + 1);
        }
        context.restore();
    },
    ///画道路
    /// height：高度
    /// width ： 宽度
    /// beginHeight ： 开始高度
    /// deviation   ： 偏移量
    /// roadConfig  ： 道路配置数据
    drawRoad: function(context, width, height, beginHeight, deviation, roadConfig){
        context.save();

        //中轴线
        context.beginPath();
        context.moveTo(width / 2 + deviation, beginHeight);
        context.strokeStyle = "#" + roadConfig.middleColor;
        context.quadraticCurveTo(width / 2 - deviation, height + beginHeight, width / 2, beginHeight + height);
        context.stroke();

        context.restore();
    },
    ///画山
    /// context：画布
    /// left  ：开始点的左边距
    /// top   ：开始点的上边距
    /// height：高度
    /// width ： 宽度
    drawMountain: function(context, left, top, width, height) {
        context.save();

        context.fillStyle = "#83CACE";
        context.strokeStyle = "#83CACE";
        context.lineJoin = "round";
        context.lineWidth = 20;
        context.beginPath();
        context.moveTo(left, top);
        context.lineTo(left + (width / 2), top - height);
        context.lineTo(left + width, top);
        context.closePath();
        context.fill();
        context.stroke();

        context.restore();
    },
    ///画刻盘
    /// context：画布
    /// pointX ：中心点坐标X
    /// pointY ：中心点坐标Y
    /// angle  ：指针角度
    drawIndexDial: function (context, pointX, pointY, angle){
        ///画刻盘
        context.save();

        context.translate(pointX, pointY);   //修改中心点坐标
        context.strokeStyle = "white";  //设置外框颜色
        context.lineWidth = 10;         //框宽

        //画盘
        context.beginPath();
        context.arc(0, 0, 70, Math.PI * 3 / 4, Math.PI * 1 / 4, false);//创建圆
        context.stroke();     //绘制轮廓形状

        //画刻度
        context.rotate(Math.PI / 2); //旋转
        for(var i = 0; i < 7; i++){
            context.rotate(Math.PI * 1 / 4); //旋转
            context.beginPath();
            context.moveTo(75,0);
            context.lineTo(55, 0);//创建线
            context.stroke();     //绘制轮廓形状
        }

        //画中心点
        context.beginPath();
        context.arc(0, 0, 3, 0, Math.PI * 2, false);//创建圆
        context.stroke();     //绘制轮廓形状
        context.fillStyle = "white"; //设置填充颜色，默认为黑色
        context.fill();              //填充

        context.restore();//恢复上次保存的状态


        ///画指针
        context.save();

        context.translate(pointX, pointY);   //修改中心点坐标
        context.strokeStyle = "orange";  //设置外框颜色
        context.lineWidth = 5;         //框宽
        context.rotate(Math.PI * angle / 180); //旋转
        context.beginPath();
        context.moveTo(7,0);
        context.lineTo(45, 0);//创建线
        context.stroke();     //绘制轮廓形状

        context.restore();//恢复上次保存的状态
    }

};
Racing.init();

document.onkeydown = function(e) {
    var e = window.event ? window.event : e;
    if(e.keyCode == 38) { //up
        Racing.speed++;
        if(Racing.speed >= 6) Racing.speed = 6;
    }
    if(e.keyCode == 40) { //down
        Racing.speed--;
        if(Racing.speed <= 0) Racing.speed = 0;
    }
    if(e.keyCode == 37) { //left
    }
    if(e.keyCode == 39) { //right
    }
};