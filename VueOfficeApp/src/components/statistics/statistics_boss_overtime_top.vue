<style type="text/css">
    .chart-content {
        width: 100%;
        height: 500px;
    }
    
    #headpic {
        width: 2rem;
        height: 2rem;
    }
</style>
<template>
    <div id="app">
         <div class="content">
            <div class="content-block-title">加班前十名列表</div>
            <div class="list-block" id="list-content"></div>
        </div>
    </div>
</template>
   
    <script type="text/javascript">
         export default {
                  data(){
                    return {
                    }
                },
                mounted:function(){
                    var vueThis=this;
                    var data = {};
                    getOvertimeTop();

                    //获取加班前十数据
                    function getOvertimeTop() {
                        $.ajax({
                            url: requestBaseUrl + 'companies/statistic/overtimes/10',
                            type: 'GET',
                            async: false,
                            headers: {
                                'Authorization': 'Bearer ' + getToken()
                            },
                            data: getStartEndTime(yearNow, monthNow),
                            success: function(response) {
                                console.log("response = " + JSON.stringify(response));
                                if (response.status == 10001) {
                                    data = response.data;
                                    showData(data);
                                } else {
                                    // $.toast('获取数据失败');
                                    vueThis.$message('获取数据失败')
                                }
                            },
                            error: function(jqXHR, textStatus, errorThrown) {
                                console.log("request error!");
                                // $.toast('获取数据失败');
                                vueThis.$message('获取数据失败')
                            }
                        })
                    }

                    //显示数据
                    function showData(obj) {
                        var str = '<ul>';
                        if(obj==''){
                            str+='<li style="margin-top:1rem;color:rgba(0,0,0,.4)">该列表为空</li>'
                        }else{
                            for (var i = 0; i < obj.length; i++) {
                            str += generateListItem(obj[i]);
                            }
                        }
                        
                        str += '</ul>';
                        $('#list-content').html(str);
                    }

                    //生成一个列表item
                    function generateListItem(obj) {
                        var imgUrl = '';
                        if (isEmpty(obj.headpic)) {
                            imgUrl = '../images/headpic_default.png';
                        } else {
                            imgUrl = "https://img.listome.com" + obj.headpic;
                        }
                        var str = '';
                        str += '<li class="item-content">';
                        str += '<div class="item-media"><i class="icon"><img id="headpic" src="' + imgUrl + '"></i></div>';
                        str += '<div class="item-inner">';
                        str += '<div class="item-title">' + obj.name + '</div>';
                        str += '<div class="item-after">' + obj.times + '小时</div>';
                        str += '</div>';
                        str += '</li>';
                        return str;
                    }
                }
            }
    
    </script>
