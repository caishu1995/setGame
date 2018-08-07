var Racing = {
    baseCanvas: "racing", //canvas的id
    context: null,       //画布
    size: null,          //canvas的宽高
    fieldDeviation: 0,   //视觉偏移

    speed: 0,            //车速，0~6


    init: function() {
        var context = document.getElementById(this.baseCanvas).getContext("2d");

        ///修改canvas宽度高度的属性
        this.size = {
            height: document.body.scrollHeight - 70,
            width: document.body.scrollWidth
        };
        $("#" + this.baseCanvas).attr("height", this.size.height);
        $("#" + this.baseCanvas).attr("width", this.size.width);

        var that = this;
        setInterval(function(){
            context.clearRect(0, 0, that.size.width, that.size.height);  //类似矩形擦除器，会清空区域内的像素

            ///画背景
            that.drawSky(context, that.size.width, that.size.height * 0.3 - 3);//画天空
            //画山峰们
            that.drawMountain(context, that.size.width * -0.2 - that.fieldDeviation, that.size.height * 0.3, that.size.width * 0.21, that.size.height * 0.2);
            that.drawMountain(context, that.size.width * -0 - that.fieldDeviation, that.size.height * 0.3, that.size.width * 0.22, that.size.height * 0.15);
            that.drawMountain(context, that.size.width * 0.15 - that.fieldDeviation, that.size.height * 0.3, that.size.width * 0.23, that.size.height * 0.22);
            that.drawMountain(context, that.size.width * 0.5 - that.fieldDeviation, that.size.height * 0.3, that.size.width * 0.28, that.size.height * 0.15);
            that.drawMountain(context, that.size.width * 0.7 - that.fieldDeviation, that.size.height * 0.3, that.size.width * 0.19, that.size.height * 0.28);
            that.drawMountain(context, that.size.width * 0.8 - that.fieldDeviation, that.size.height * 0.3, that.size.width * 0.25, that.size.height * 0.18);


            that.drawIndexDial(context, that.size.width - 100, that.size.height - 100, 135 + that.speed * 45);//画车速

            that.context = context;
        }, 20);
    },

    ///画天空
    /// height：高度
    /// width ： 宽度
    drawSky: function(context, width, height) {
        context.fillStyle = "#D4F5FE";
        context.strokeStyle = "#D4F5FE";
        context.fillRect(0, 0, width, height);
        context.fill();
    },
    ///画山
    /// context：画布
    /// left  ：开始点的左边距
    /// top   ：开始点的上边距
    /// height：高度
    /// width ： 宽度
    drawMountain: function(context, left, top, width, height) {
        context.fillStyle = "#83CACE";
        context.strokeStyle = "#83CACE";
        context.lineJoin = "round";
        context.lineWidth = 20;
        context.beginPath();
        context.moveTo(left, top);
        context.lineTo(left + (width / 2), top - height);
        context.lineTo(left + width, top);
        context.closePath();
        context.stroke();
        context.fill();
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