(function () {
    var canvas = document.querySelector(".openDoorDiv .lockDiv");
    var canvas2d = canvas.getContext("2d");
    //画圆
    canvas2d.arc(100, 100, 100, 0, Math.PI * 2, true);
    canvas2d.closePath();        //连接首尾
    canvas2d.fillStyle = "green";
    canvas2d.fill();             //填充
    //长方形
    canvas2d.fillStyle = "white";
    canvas2d.fillRect(75, 25, 50, 150); //画长方形
})();

function dropFunction(e, thisEle) {
    e.preventDefault();
    if(e.dataTransfer.getData("Text")){
        thisEle.style.opacity = 0;
        thisEle.nextElementSibling.style.opacity = 0;
        thisEle.parentNode.style.opacity = 0;
        thisEle.parentNode.style.transitionDuration = "1s";
    }
}