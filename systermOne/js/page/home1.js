// var width = (document.body.clientWidth)*(98/100)*(40/100)+'px';
var width = 360+ 'px';
var height = 196+'px';
var resizeCss = function() {
    $("#circleOne").css("width", width).css("height", height);
    $("#circleTwo").css("width", width).css("height", height);
    $("#circleThree").css("width", width).css("height", height);
};
resizeCss();
var circleOne = echarts.init(document.getElementById('circleOne'));
var circleTwo = echarts.init(document.getElementById('circleTwo'));
var circleThree = echarts.init(document.getElementById('circleThree'));
var option  = option1 = option2  =   null;
option = option1 = option2  = {
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    color:['#5ec3ea','#7962ed','#5ae5da','#ed80ce'],
    legend: {
        orient: 'vertical',
        x: 'right',
        y: 'center',
        icon:'circle',
        data:['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
    },
    series: [
        {
            name:'访问来源',
            type:'pie',
            center:['30%','50%'],
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
                normal: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    show: true,
                    textStyle: {
                        fontSize: '30',
                        fontWeight: 'bold'
                    }
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data:[
                {value:335, name:'直接访问'},
                {value:310, name:'邮件营销'},
                {value:234, name:'联盟广告'},
                {value:135, name:'视频广告'},
                {value:1548, name:'搜索引擎'}
            ]
        }
    ]
};
circleOne.clear();
circleOne.setOption(option,true);
circleTwo.clear();
circleTwo.setOption(option1,true);
circleThree.clear();
circleThree.setOption(option2,true);
//Echars自适应浏览器大小
window.onresize = function() {
    resizeCss();
    circleOne.resize();
    circleTwo.resize();
    circleThree.resize();
};


function test(){
    $("#lookDetail").click(function(){
        console.log("ok");
    })

}
function outClick(){
    $("#out").click(function(){
        window.location.href="login.html";
        $("#userName").html("");
    })
}
function keywordSearch(){
    $("#searchKey").keyup(function(){
        var searchKey = $(this).val();
        var reg = new RegExp(searchKey, "i"); //忽略大小写匹配搜索框中输入的内容
        $.ajax({
            type: "get",
            url: "js/project.json",
            dataType: "json",
            success: function (data) {
                ProjectListA = new ProjectList(data);
                var arr = [];
                for (var i = 0, len = data.length; i < len; i++) {
                    if (searchKey != "" && (data[i].initial.search(reg) != -1 || data[i].keyword.search(reg) != -1)) {
                        arr.push("<li class='keyList' id='keyList'>" + data[i].keyword + "<img class='peizhi' data-toggle='modal' data-target='#configModal' src='../../../../testOne/systermOne/img/peizhi.png' alt=''></li><span style='display: none;'>"+data[i].geo+"</span>");
                    }
                }
                $(".keywords_list").html(arr).show();
                $("#testList").setItemHeight();                        //地图上高亮显示
                $(".keyList").click(function(){
                    var geo = $(this).next("span").text();
                    var arr = geo.split(",");
                    for(var i=0;i<arr.length;i++){
                        var marker = new BMap.Marker(new BMap.Point(arr[0],arr[1]));
                        map.addOverlay(marker);
                        // marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
                    }
                    //创建信息窗口
                    var title = $(this).html();
                    var sContent ="";
                    sContent +=    "<div class='infoBox'><h4 class='infoTitle'>"+ title +"</h4>" +
                        "<p class='process'>工程进度:</p>" +"<p class='mointor'>监测状态:</p>"+
                        "</div>";
                    var infoWindow = new BMap.InfoWindow(sContent);  // 创建信息窗口对象
                    marker.addEventListener("click", function(){
                        this.openInfoWindow(infoWindow);
                        //图片加载完毕重绘infowindow
                    });
                    //右键菜单事件
                    var markerMenu=new BMap.ContextMenu();
                    marker.addEventListener("rightclick",function(){
                        this.addContextMenu(markerMenu);//给标记添加右键菜单
                    });
                    markerMenu.addItem(new BMap.MenuItem('进入项目',EventMarker.bind(map)));
                    marker.addContextMenu(markerMenu);
                    function EventMarker(map){
                        console.log(map);
                    }
                })
            }
        });
        $(".keywords_list").css("display","block");

    })
}
function userName(){
    $.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    };
    var userName = $.getUrlParam('userName');
    $("#userName").html(userName);
}
function nowData(){
    var myDate = new Date();
    var nowDay = myDate.toLocaleDateString();                         //获取当前日期
    var hours = myDate.getHours();                                    //获取当前小时数(0-23)
    var minutes = myDate.getMinutes();                                //获取当前分钟数(0-59)
    var times = hours+":"+minutes;
    $(".nowDay").html(nowDay);
    $(".nowTime").html(times);
}
function programList(){
    $("#programClose").click(function(){
        $(".tabList").css("display","none");
    });

}
$(function(){
    nowData();                                         //当前日期
    userName();                                        //保存用户名
    keywordSearch();                                   //关键字搜索
    programList();
    outClick();                                         //退出
    test();
});
