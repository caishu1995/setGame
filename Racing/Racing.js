var Racing = {
    baseCanvas: "racing", //canvas的id
    context: null,       //画布


    config: function(height, width){
        ///修改配置文件
        this.config = {
            size: {
                height: height - 70,
                width: width
            }, //canvas的宽高
            skyHeight: height * 0.3 - 3,
            mountain: [
                {
                    siteX:  width * -0.2,
                    siteY:  height * 0.3,
                    width:  width * 0.21,
                    height: height * 0.2
                },{
                    siteX:  width * -0,
                    siteY:  height * 0.3,
                    width:  width * 0.22,
                    height: height * 0.15
                },{
                    siteX:  width * 0.15,
                    siteY:  height * 0.3,
                    width:  width * 0.23,
                    height: height * 0.22
                },{
                    siteX:  width * 0.5,
                    siteY:  height * 0.3,
                    width:  width * 0.28,
                    height: height * 0.15
                },{
                    siteX:  width * 0.7,
                    siteY:  height * 0.3,
                    width:  width * 0.19,
                    height: height * 0.28
                },{
                    siteX:  width * 0.8,
                    siteY:  height * 0.3,
                    width:  width * 0.25,
                    height: height * 0.18
                }
            ],
            landColorList: ['8FC04C', '73B043'],
            road: {
                sideColor: "FFF",
                wayColor: "606A7C",
                middleColor: 'FFF',
                length: 5000        //车道长度
            },
            car: {
                width : 160,
                left: (width / 2) - 80,
                top: 320,
                height : 100
            }
        };
    },
    parameter: {
        time: null,          //计时器

        hasRun: 0,            //已跑长度
        landFirstColorIndex: 0,//地第一条颜色序号

        fieldDeviation: 0,   //视觉偏移, +视觉向左偏，山和道路尽头向左偏。-视觉向右偏
        speed: 0             //车速，0~6
    },


    init: function() {
        this.context = document.getElementById(this.baseCanvas).getContext("2d");

        ///初始化配置文件
        this.config(document.body.scrollHeight, document.body.scrollWidth);

        ///修改canvas宽度高度的属性
        $("#" + this.baseCanvas).attr("height", this.config.size.height);
        $("#" + this.baseCanvas).attr("width", this.config.size.width);

        this.resetGame();
    },
    //重置游戏
    resetGame: function() {
        ///重置
        this.parameter.hasRun = 0;
        this.parameter.landFirstColorIndex = 0;
        this.parameter.fieldDeviation = 0;
        this.parameter.speed = 0;


        ///画内容
        var speedRecord = { lastSpeed : this.parameter.speed, timeHistory : 0};
        var that = this;
        this.parameter.time = setInterval(function(){ that.timeInterval(speedRecord); }, 100);//20
    },
    //定时器事件
    timeInterval: function(speedRecord) {
        //如果车速改变，则改变车速
        if(this.parameter.speed != speedRecord.lastSpeed) {
            speedRecord.lastSpeed = this.parameter.speed;
            speedRecord.timeHistory = 0;
        }


        ///画内容
        var context = this.context;
        context.clearRect(0, 0, this.config.size.width, this.config.size.height);    //清空区域

        this.roundedRectangle(context, "#D4F5FE", 0, 0, this.config.size.width, this.config.skyHeight, 0);//画天空
        //画山峰们
        for(var i in this.config.mountain){
            this.drawMountain(context, this.config.mountain[i].siteX, this.config.mountain[i].siteY, this.config.mountain[i].width, this.config.mountain[i].height, this.parameter.fieldDeviation);
        }
        this.drawLand(context, this.config.size.width, this.config.size.height - this.config.skyHeight, this.config.skyHeight, this.config.landColorList, this.parameter.landFirstColorIndex);//画地
        this.drawRoad(context, this.config.size.width, this.config.size.height - this.config.skyHeight, this.config.skyHeight, this.parameter.fieldDeviation, this.config.road);//画街道
        this.drawIndexDial(context, this.config.size.width - 60, this.config.size.height - 60, 135 + this.parameter.speed * 45);//画车速
        this.drawCar(context, this.config.car.left, this.config.car.top, this.config.car.width, this.config.car.height);       //画车

        this.context = context;


        //根据已过的事件和车速，判断是否修改颜色
        if((speedRecord.timeHistory == 0) && (speedRecord.lastSpeed != 0)){
            this.parameter.landFirstColorIndex = (this.parameter.landFirstColorIndex + 1 >= this.config.landColorList.length) ? 0: (this.parameter.landFirstColorIndex + 1); //修改下次的样色
        }
        speedRecord.timeHistory += speedRecord.lastSpeed;
        if(speedRecord.timeHistory >= 6) speedRecord.timeHistory = 0; //如果时间到了即清零

        ///计算车跑了的路程
        this.parameter.hasRun += this.parameter.speed * 10;
        if(this.config.road.length <= this.parameter.hasRun) clearInterval(this.parameter.time);
    },


    ///画地
    /// context：画布
    /// height ：高度
    /// width  ：宽度
    /// beginHeight：开始高度
    /// landColor  ：地颜色列表
    /// index  ：开始的序号
    drawLand: function(context, width, height, beginHeight, landColor, index){
        var hasDrawHeight = 0; //已画高度
        var i = 3;            //此次长方形的高

        context.save();
        while(hasDrawHeight < height){
            //画长方形地面
            context.fillStyle = "#" + landColor[index];
            context.fillRect(0, beginHeight + hasDrawHeight, width, i);

            //修改参数
            hasDrawHeight += i;
            i = i * 1.2;
            index = (index >= landColor.length - 1) ? 0: (index + 1);
        }
        context.restore();
    },
    ///画道路
    /// context：画布
    /// height ：高度
    /// width  ：宽度
    /// beginHeight：开始高度
    /// deviation  ：偏移量
    /// roadConfig ：道路配置数据
    drawRoad: function(context, width, height, beginHeight, deviation, roadConfig){
        context.save();

        //边线
        context.beginPath();
        context.fillStyle = "#" + roadConfig.sideColor;
        context.moveTo(width / 2 + deviation / 5 - 55, beginHeight);
        context.quadraticCurveTo(width / 2 + deviation / 2.5 - 165, height / 2 + beginHeight, width / 2 + deviation - 275, beginHeight + height);
        context.lineTo(width / 2 + deviation - 250, beginHeight + height);
        context.quadraticCurveTo(width / 2 + deviation / 2.5 - 150, height / 2 + beginHeight, width / 2 + deviation / 5 - 50, beginHeight);
        context.closePath();
        context.fill();
        context.moveTo(width / 2 + deviation / 5 + 55, beginHeight);
        context.quadraticCurveTo(width / 2 + deviation / 2.5 + 165, height / 2 + beginHeight, width / 2 + deviation + 275, beginHeight + height);
        context.lineTo(width / 2 + deviation + 250, beginHeight + height);
        context.quadraticCurveTo(width / 2 + deviation / 2.5 + 150, height / 2 + beginHeight, width / 2 + deviation / 5 + 50, beginHeight);
        context.closePath();
        context.fill();


        //路面
        context.beginPath();
        context.moveTo(width / 2 + deviation / 5 - 50, beginHeight);
        context.quadraticCurveTo(width / 2 + deviation / 2.5 - 150, height / 2 + beginHeight, width / 2 + deviation - 250, beginHeight + height);
        context.lineTo(width / 2 + deviation + 250, beginHeight + height);
        context.quadraticCurveTo(width / 2 + deviation / 2.5 + 150, height / 2 + beginHeight, width / 2 + deviation / 5 + 50, beginHeight);
        context.closePath();
        context.fillStyle = "#" + roadConfig.wayColor;
        context.fill();


        //中轴线
        context.beginPath();
        context.setLineDash([15, 10]);
        context.lineWidth = 4;
        context.strokeStyle = "#" + roadConfig.middleColor;
        context.moveTo(width / 2 + deviation / 5, beginHeight);
        context.quadraticCurveTo(width / 2 + deviation/ 2.5, height / 2 + beginHeight, width / 2 + deviation, beginHeight + height);
        context.stroke();

        context.restore();
    },
    ///画山
    /// context：画布
    /// left  ：开始点的左边距
    /// top   ：开始点的上边距
    /// height：高度
    /// width ： 宽度
    /// fieldDeviation ： 偏移量
    drawMountain: function(context, left, top, width, height, fieldDeviation) {
        context.save();

        context.fillStyle = "#83CACE";
        context.strokeStyle = "#83CACE";
        context.lineJoin = "round";
        context.lineWidth = 20;
        context.beginPath();
        context.moveTo(left - fieldDeviation, top);
        context.lineTo(left - fieldDeviation + (width / 2), top - height);
        context.lineTo(left - fieldDeviation + width, top);
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
        context.arc(0, 0, 45, Math.PI * 3 / 4, Math.PI * 1 / 4, false);//创建圆
        context.stroke();     //绘制轮廓形状

        //画刻度
        context.rotate(Math.PI / 2); //旋转
        for(var i = 0; i < 7; i++){
            context.rotate(Math.PI * 1 / 4); //旋转
            context.beginPath();
            context.moveTo(50,0);
            context.lineTo(30, 0);//创建线
            context.stroke();     //绘制轮廓形状
        }

        context.restore();//恢复上次保存的状态

        this.light(context, "white", pointX, pointY, 5);


        ///画指针
        context.save();

        context.translate(pointX, pointY);   //修改中心点坐标
        context.strokeStyle = "orange";  //设置外框颜色
        context.lineWidth = 5;         //框宽
        context.rotate(Math.PI * angle / 180); //旋转
        context.beginPath();
        context.moveTo(5,0);
        context.lineTo(25, 0);//创建线
        context.stroke();     //绘制轮廓形状

        context.restore();//恢复上次保存的状态
    },
    ///画车
    /// context：画布
    /// left   ：区域左侧
    /// top    ：区域顶部
    /// width  ：区域宽度
    /// height ：区域高度
    drawCar: function(context, left, top, width, height) {
        this.roundedRectangle(context, "#FFF", left + 90, top + height - 100, 10, 10, 0);             // 车头
        this.roundedRectangle(context, "#FFF", left + 30, top + height - 90, width - 60, 40, 7, 10);  // 车后档
        this.roundedRectangle(context, "#C2C2C2", left + 7, top + height - 75, width - 14, 34, 17);   // 车顶
        this.roundedRectangle(context, "#DEE0E2", left + 27, top + height - 75, width - 54, 40, 0, 10);  // 车后阴影
        this.roundedRectangle(context, "rgba(0, 0, 0, 0.35)", left, top + height - 5, width, 20, 9); // 车下阴影
        this.roundedRectangle(context, "#111", left, top + height - 5, 30, 13, 6);                   // 左车轮
        this.roundedRectangle(context, "#111", left + width - 30, top + height - 5, 30, 13, 6);      // 右车轮
        this.roundedRectangle(context, "#DEE0E2", left - 6, top + height - 50, width + 12, 50, 12);  // 车底座
        this.light(context, "#FF9166", left + 10, top + height - 35, 5);         // 车灯1
        this.light(context, "#FF9166", left + 25, top + height - 35, 5);         // 车灯2
        this.light(context, "#FF9166", left + width - 10, top + height - 35, 5); // 车灯3
        this.light(context, "#FF9166", left + width - 25, top + height - 35, 5); // 车灯4
        this.roundedRectangle(context, "#FFF", left + width / 2 - 20, top + height - 33, 40, 17, 5); // 车牌
        this.roundedRectangle(context, "#474747", left - 2, top + height - 55, width + 4, 10, 3);    // 后杠1
        this.roundedRectangle(context, "#474747", left + 50, top + height - 50, width - 100, 10, 5); // 后杠2
    },


    ///画圆角四边形
    /// context：画布
    /// color  ：颜色
    /// x：左边距
    /// y：上边距
    /// width ： 宽度
    /// height ： 高度
    /// radius ： 圆角半径
    /// inclination ： 斜度
    roundedRectangle: function (context, color, x, y, width, height, radius, inclination) {
        if(inclination == undefined) inclination = 0;

        context.save();

        context.fillStyle = color;
        context.beginPath();
        context.moveTo(x + radius + inclination, y);
        context.lineTo(x + width - inclination - radius, y);
        context.arcTo(x + width - inclination, y, x + width - inclination, y + 10, radius);
        context.lineTo(x + width, y + height - radius);
        context.arcTo(x + width, y + height, x + width - radius, y + height, radius);
        context.lineTo(x + radius, y + height);
        context.arcTo(x, y + height, x, y + height - radius, radius);
        context.lineTo(x + inclination, y + radius);
        context.arcTo(x + inclination, y, x + radius + inclination, y, radius);
        context.fill();

        context.restore();
    },
    ///画实心圆
    /// context：画布
    /// color  ：颜色
    /// x： 左边距
    /// y： 上边距
    /// r： 半径
    light: function(context, color, x, y, r) {
        context.save();

        context.beginPath();
        context.arc(x, y, r, 0, Math.PI * 2, false);
        context.fillStyle = color;
        context.fill();

        context.restore();
    }
};
Racing.init();

document.onkeydown = function(e) {
    var e = window.event ? window.event : e;
    if(e.keyCode == 38) { //up
        Racing.parameter.speed++;
        if(Racing.parameter.speed >= 6) Racing.parameter.speed = 6;
    }
    if(e.keyCode == 40) { //down
        Racing.parameter.speed--;
        if(Racing.parameter.speed <= 0) Racing.parameter.speed = 0;
    }
    if(e.keyCode == 37) { //left
        Racing.parameter.fieldDeviation += 10;
        if(Racing.parameter.fieldDeviation >= 165) Racing.parameter.fieldDeviation = 165;
    }
    if(e.keyCode == 39) { //right
        Racing.parameter.fieldDeviation -= 10;
        if(Racing.parameter.fieldDeviation <= -165) Racing.parameter.fieldDeviation = -165;
    }
};