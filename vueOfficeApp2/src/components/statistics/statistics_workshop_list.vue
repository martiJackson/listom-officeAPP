<style type="text/css">
    .chart-content {
        width: 100%;
        height: 500px;
    }
</style>
<template>
    <div id="app">
        <div class="content">
            <div class="content-block-title">车间列表</div>
            <div class="list-block" id="list-content">
                <ul id="workshop-list">
                     <li class="item-content item-link workshop-item" v-for='lis,index of list' :id="lis.id" @click='workshopItem(index)'>
                        <div class="item-inner">
                            <div class="item-title">{{lis.name}}</div>
                            <div class="item-after">
                                {{lis.machine_count + "台机床"}}
                            </div>
                        </div>
                        <div class="row" :id='"machine-list-" + lis.id' hidden="hidden"></div>
                    </li>
                    
                </ul>
            </div>
        </div>
    </div>
</template>
    <script type="text/html" id="workshop-item">
      
    </script>
    <script type="text/javascript">
        export default {
                  data(){
                    return {
                        list:'',
                        workshop:''
                    }
                },
                methods:{
                    workshopItem(index){
                        this.workshop(index)
                    }
                },
                mounted:function(){
                    var vueThis=this;
                    getWorkshops();
                    function getWorkshops() {
                        $.ajax({
                            type: 'GET',
                            url: requestBaseUrl + 'iot/companies/workshops',
                            headers: {
                                'Authorization': 'Bearer ' + getToken()
                            },
                            success: function(response) {
                                console.log('车间信息：' + formatJSON(JSON.stringify(response)));
                                if (response.status == 10001) {
                                    if (response.data.total > 0) {
                                      var  workshopList = response.data.list;
                                        showWorkshops(response.data.list);
                                    } else {
                                        // $.toast('没有车间信息');
                                        vueThis.$message('没有车间信息')
                                    }
                                } else {
                                    // $.toast('获取车间信息失败' + response.status);
                                    vueThis.$message('获取车间信息失败' + response.status)
                                }
                            },
                            error: function(jqXHR, textStatus, errorThrown) {
                                // $.toast('加载车间列表出错' + textStatus);
                                vueThis.$message('加载车间列表出错' + textStatus)
                            }
                        })
                    }

                    function showWorkshops(list) {
                        // var data = {
                        //     list: list
                        // };
                        // var html = template('workshop-item', data);
                        // $('#workshop-list').html(html);
                        vueThis.list=list;
                        // $('li.workshop-item').click(function() {
                            vueThis.workshop=function(index){
                            //点击车间列表item，获取车间id，然后获取对应的机床列表
                            var workshopId = $("#workshop-list>li").eq(index).attr('id');
                            var workshopName = $("#workshop-list>li").eq(index).find('.item-title').text();
                            var str = $("#workshop-list>li").eq(index).find('.item-after').text();
                            var machineCount = str.substring(0, str.indexOf('台'));
                            machineCount = trimStr(machineCount);
                            console.log('machine count: ' + machineCount);
                            // window.location.href = "statistics_workshop_detail.html?workshopId=" + workshopId + "&workshopName=" + escape(workshopName) + "&machineCount=" + parseInt(machineCount, 10);
                           window.location.href ='http://localhost:8080/#/statistics_workshop_detail?workshopId='+ workshopId + "&workshopName=" + encodeURIComponent(workshopName) + "&machineCount=" + parseInt(machineCount, 10);
                        }
                        // })
                    }
                }
            }
    
    </script>
