<style type="text/css">
    .light-img {
        width: 20px;
        height: 20px;
        margin-top: 5px;
    }

    .menu-btn {
        float: left;
    }
    #popup-edit{
        transform:translate(0,0);
    }
    #popup-add-manifest{
        transform:translate(0,0);
    }
    .el-dialog__wrapper{
        overflow:hidden;
    }
</style>
<template>
    <div id="app">
        <div class="page page-current" id='router-maintenance-list'>
            <header class="bar bar-nav">
                <a class="button button-link button-nav pull-left back">
                    <span class="icon icon-left"></span> 返回
                </a>
                <a class="button button-link button-nav pull-right" id="header-add-btn">
                    <span class="icon icon-edit"></span> 添加
                </a>
                <h1 class="title">机床保养项目列表</h1>
            </header>
            <div class="content infinite-scroll" id="infinite-scroll-bottom" data-distance="50">
                <div class="cards" id="card-content">
                     <div class="card" v-for='lis,index of list' :id="'card-'+lis.id">
                        <div class="card-header">
                            <span>{{lis.name}}</span>
                            <span><img src="static/images/ic_light_red.png" class="light-img" style="display: none;"></span>
                        </div>
                        <div class="card-content">
                            <div class="card-content-inner">
                                <div>{{lis.list}}</div>
                                <hr style="background-color: #ececec; border: none; height: 1px;" /> 备注：
                                <br/>{{lis.remark}}
                            </div>
                        </div>
                        <div class="card-footer">
                            <span>保养周期：{{lis.cycle}}</span>
                            <span :id="lis.id">
                                <button @click="editBtnClick(index)" class="button button-success button-fill menu-btn menu-btn-edit">编辑</button>
                                <button @click="deleteBtnClick(index)" class="button button-danger button-fill menu-btn menu-btn-delete">删除</button>
                            </span>
                        </div>
                    </div>
                </div>
                <div class="infinite-scroll-preloader" hidden="hidden">
                    <div class="preloader"></div>
                </div>
            </div>
        </div>
        <el-dialog
          title="提示"
          v-model="dialogVisible" id='bar-nav'>
          <!-- 编辑保养项目时弹出的Popup界面 -->
            <div class="popup" id="popup-edit" >
                <header class="bar bar-nav">
                    <a class="button button-link button-nav pull-left" id="popup-back-edit" @click='dialogVisible=false'>
                        <span class="icon icon-left"></span> 返回
                    </a>
                    <h1 class="title">编辑保养项目</h1>
                </header>
                <div class="content">
                    <div class="list-block">
                        <ul>
                            <li>
                                <div class="item-content">
                                    <div class="item-inner">
                                        <div class="item-title label">保养项目名称</div>
                                        <div class="item-input">
                                            <textarea id="maintenance-name" placeholder="请填写保养项目名称"></textarea>
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <li id="add-maintenance-list" @click='dialog=true'>
                                <div class="item-content item-link">
                                    <div class="item-inner">
                                        <div class="item-title">添加保养清单</div>
                                        <div class="item-after" id="maintenance-list-hint" ></div>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div class="item-content">
                                    <div class="item-inner">
                                        <div class="item-title label">保养周期</div>
                                        <div class="item-input">
                                            <input type="text" placeholder="请填写保养周期，单位为天" id="input-maintenance-cycle">
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div class="item-content">
                                    <div class="item-inner">
                                        <div class="item-title label">备注</div>
                                        <div class="item-input">
                                            <textarea id="remark" placeholder="请填写备注信息"></textarea>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="content-padded" style="font-size: 15px; color: red;">注意：保养周期的单位是天。</div>
                    <div class="content-block">
                        <div class="row">
                            <div class="col-100"><a @click="submitMaintenance" class="button button-big button-fill button-success">提交</a></div>
                        </div>
                    </div>
                </div>
            </div>
        </el-dialog>
        <el-dialog
          title="提示"
          v-model="dialog" id='bar-nav'>
          <div class="popup" id="popup-add-manifest">
            <header class="bar bar-nav">
                <a class="button button-link button-nav pull-left" id="popup-back-manifest" @click='dialog=false'>
                    <span class="icon icon-left"></span> 返回
                </a>
                <a class="button button-link button-nav pull-right" @click="newMaintenanceListItem">
                    <span class="icon icon-edit"></span> 新建
                </a>
                <h1 class="title">添加保养清单</h1>
            </header>
            <div class="content">
                <div class="content-block-title">保养清单</div>
                <div class="list-block">
                    <ul id="maintenance-list">
                        <li class="item-content">
                            <div class="item-inner">
                                <div class="label">1、</div>
                                <div class="item-input">
                                    <input type="text" placeholder="输入保养内容">
                                </div>
                                <div class="item-after">
                                    <div class="item-media remove-item-btn"><i class="icon icon-remove"></i></div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="content-block">
                    <div class="row">
                        <div class="col-100"><a @click="submitList" class="button button-big button-fill button-success">提交</a></div>
                    </div>
                </div>
            </div>
        </div>
        </el-dialog>
    </div>
</template>

    <script type="text/javascript">
        export default {
          data(){
            return {
                list:'',
                editBtn:'',
                submitMaint:'',
                dialogVisible:false,
                dialog:false,
                newMaint:'',
                submitL:'',
                deleteBtn:''
            }
        },
        methods:{
            editBtnClick(index){
               this.editBtn(index) 
            },
            submitMaintenance(){
                this.submitMaint()
            },
           newMaintenanceListItem(){
                this.newMaint()
            },
            submitList(){
                this.submitL()
            },
            deleteBtnClick(index){
                this.deleteBtn(index)
            }
        },
        mounted:function(){
            layer.closeAll();
            var vueThis=this;
            var maintenanceList; //所有的保养项目
            var editManifestList; //待编辑的保养清单
            var modifiedManifestList; //修改后的保养清单
            var modifiedMaintenanceId; //要修改的保养项ID

            $('#header-add-btn').click(function() {
                window.location.href = '#/machine_maintenance_add';
            });

            getMaintenanceList();
            //获取保养列表
            function getMaintenanceList() {
                // $.showPreloader();
                $.ajax({
                    type: 'GET',
                    url: requestBaseUrl + 'iot/companies/machines/maintenances',
                    headers: {
                        'Authorization': 'Bearer ' + getToken()
                    },
                    success: function(response) {
                        // $.hidePreloader();
                        if (response.status == 10001) {
                            console.log('maintenance list: \n' + formatJSON(JSON.stringify(response)));
                            var data = response.data.list;
                            if (data != null && data.length > 0) {
                                maintenanceList = data;
                                showMaintenanceList(data);
                            } else {
                                // $.toast('暂无保养项目');
                                vueThis.$message('暂无保养项目')
                            }
                        } else {
                            // $.toast('加载保养列表出错' + response.status);
                            vueThis.$message('加载保养列表出错' + response.status)
                        }
                    },
                    error: function(xhr) {
                        // $.hidePreloader();
                        // $.toast('加载保养列表出错' + xhr.status);
                        vueThis.$message('加载保养列表出错' + xhr.status)
                    }
                })
            }

            //显示保养项目列表
            function showMaintenanceList(data) {
                for(var i=0;i<data.length;i++){
                    data[i].list=getMaintenanceManifest(data[i].list);
                    data[i].cycle=getCycleStr(data[i].cycle)
                }
                vueThis.list=data
            }

            //编辑保养项
            vueThis.editBtn=function(index) {
                vueThis.dialogVisible=true;
                //获取保养ID
                var maintenanceId = $(".card").eq(index).find('.menu-btn-edit').parent().attr('id');
                if (maintenanceList != undefined && maintenanceList != null && maintenanceList.length > 0) {
                    for (var i = 0; i < maintenanceList.length; i++) {
                        var obj = maintenanceList[i];
                        if (maintenanceId == obj.id) {
                            //显示保养名称
                            $('#maintenance-name').text(obj.name);
                            //显示保养周期
                            $('#input-maintenance-cycle').val(parseInt( obj.cycle / (24 * 60 * 60), 10));
                            //显示保养备注
                            $('#remark').text(obj.remark);
                            //显示保养清单
                            var manifestList = obj.list;
                            if (manifestList != null) {
                                editManifestList = [];
                                for(var j = 0; j < manifestList.length; j++) {
                                    editManifestList.push(manifestList[j].name);
                                }
                                modifiedManifestList = editManifestList;
                                $('#maintenance-list-hint').text('已添加' + manifestList.length + '项');
                            }
                            modifiedMaintenanceId = maintenanceId;
                            break;

                        }
                    }
                }
            }

            //删除保养项
            vueThis.deleteBtn=function(index) {
                //获取保养ID
                var maintenanceId = $(".card").eq(index).find('.menu-btn-delete').parent().attr('id');
                // $.confirm('确定要删除该保养项吗？', '提示', function() {
                //     //删除保养项
                    deleteMaintenance(maintenanceId);
                // });
            }

            //周期转换，unix时间戳转字符串，最后的结果是天
            function getCycleStr(unixTime) {
                return parseInt(unixTime / (24 * 60 * 60), 10) + "天";
            }

            //获取保养清单
            function getMaintenanceManifest(list) {
                if (list == null) {
                    return "暂无保养清单";
                }
                var str = '保养清单：\n';
                for (var i = 0; i < list.length; i++) {
                    str += list[i].name;
                    if (i != list.length - 1) {
                        str += '\n';
                    }
                }
                return str;
            }

            //根据ID删除一条保养项
            function deleteMaintenance(id) {
                // $.showPreloader();
                $.ajax({
                    type: 'DELETE',
                    url: requestBaseUrl + 'iot/companies/machines/maintenances/' + id,
                    headers: {
                        'Authorization': 'Bearer ' + getToken()
                    },
                    success: function(response) {
                        // $.hidePreloader();
                        if (response != null && response.status == 10001) {
                            // $.toast('删除成功');
                            vueThis.$message('删除成功')
                            $('#card-' + id).remove();
                        } else {
                            // $.toast('删除失败');
                            vueThis.$message('删除失败')
                        }
                    },
                    error: function(xhr) {
                        // $.hidePreloader();
                        // $.toast('删除失败' + xhr.status);
                        vueThis.$message('删除失败' + xhr.status)
                    }
                })
            }

            //关闭popup
            $('#popup-back-edit').click(function() {
                // $.closeModal($('#popup-edit'));
                vueThis.dialogVisible=false
            });

            //关闭popup
            $('#popup-back-manifest').click(function() {
                // $.closeModal($('#popup-add-manifest'));
                vueThis.dialog=false
            });

            //跳转到添加保养清单项页面
            $('#add-maintenance-list').click(function() {
                // $.popup($('#popup-add-manifest'));
                vueThis.dialog=true
                if (editManifestList != undefined && editManifestList != null) {
                    var html = '';
                    for (var i = 0; i < editManifestList.length; i++) {
                        html += '<li class="item-content">\
                                <div class="item-inner">\
                                    <div class="label">' + (i + 1) + '、</div>\
                                    <div class="item-input">\
                                        <input type="text" value="' + editManifestList[i] + '" placeholder="输入保养内容">\
                                    </div>\
                                    <div class="item-after">\
                                        <div class="item-media remove-item-btn"><i class="icon icon-remove"></i></div>\
                                    </div>\
                                </div>\
                            </li>';
                    }
                    $('ul#maintenance-list').html(html);
                    //删除一个保养清单条目
                    $('.remove-item-btn').click(function() {
                        $(this).parents('li.item-content').remove();
                        reOrder();
                    });
                }
            });

            //新建保养清单项目
            vueThis.newMaint=function() {
                var itemSize = $('#maintenance-list').children('li').length;
                var content = $('#maintenance-list').find('input').last().val();
                if (content == '') {
                    // $.toast('请填写保养内容再添加新条目');
                    vueThis.$message('请填写保养内容再添加新条目')
                } else {
                    appendNewItem(itemSize);
                }
            }

            //追加一个新的保养条目
            function appendNewItem(currentItemSize) {
                $('#maintenance-list').append('<li class="item-content">\
                                <div class="item-inner">\
                                    <div class="label">' + (currentItemSize + 1) + '、</div>\
                                    <div class="item-input">\
                                        <input type="text" placeholder="输入保养内容">\
                                    </div>\
                                    <div class="item-after">\
                                        <div class="item-media remove-item-btn"><i class="icon icon-remove"></i></div>\
                                    </div>\
                                </div>\
                            </li>');
                $('.remove-item-btn').click(function() {
                    $(this).parents('li.item-content').remove();
                    reOrder();
                });
            }

            //条目重新排序，按1、 2、 3的顺序
            function reOrder() {
                var list = $('#maintenance-list').find('div.label');
                if (list != undefined && list.length > 0) {
                    for (var i = 0; i < list.length; i++) {
                        list[i].innerHTML = (i + 1) + "、";
                    }
                }
            }

            //提交保养清单，保存保养清单
           vueThis.submitL=function() {
            vueThis.dialog=false;
                var list = $('#maintenance-list').find('input');
                if (list != undefined) {
                    modifiedManifestList = [];
                    for (var i = 0; i < list.length; i++) {
                        if (list[i].value != '') {
                            modifiedManifestList.push(list[i].value);
                        }
                    }
                }
                if (modifiedManifestList.length == 0) {
                    // $.toast('没有添加保养清单');
                    vueThis.$message('没有添加保养清单')
                    modifiedManifestList = editManifestList;
                } else {
                    $('#maintenance-list-hint').text('已添加' + list.length + '项');
                    editManifestList = modifiedManifestList;
                    // $.closeModal($('#popup-add-manifest'));
                }
            }

            //提交修改后的保养项目
            vueThis.submitMaint=function() {
                var data = {};
                //保养项目名称
                var maintenanceName = $('#maintenance-name').val();
                if(maintenanceName == '') {
                    // $.toast('请填写保养项目名称');
                    vueThis.$message('请填写保养项目名称')
                    return ;
                }
                data.name = maintenanceName;
                //保养项目清单
                if (modifiedManifestList.length == 0) {
                    // $.toast('请添加保养清单');
                    vueThis.$message('请填写保养项目名称')
                    return;
                }
                var maintenanceListStr = JSON.stringify(modifiedManifestList);
                data.list = maintenanceListStr;
                //保养周期
                var maintenanceCycle = 0;
                var cycle = $('#input-maintenance-cycle').val();
                if(cycle != '') {
                    maintenanceCycle = parseInt(cycle, 10);    
                    if(isNaN(maintenanceCycle)) {
                        // $.toast('保养周期填写有误');
                        vueThis.$message('保养周期填写有误')
                        return ;    
                    }
                    data.cycle = maintenanceCycle * 24 * 60 * 60;
                }
                //备注
                var remark = $('#remark').val();
                if(remark != '') {
                    data.remark = remark;
                }
                //到这里就可以修改保养项目了
                // $.showPreloader();
                $.ajax({
                    type: 'PUT',
                    url: requestBaseUrl + 'iot/companies/machines/maintenances/' + modifiedMaintenanceId,
                    headers: {
                        'Authorization': 'Bearer ' + getToken()
                    },
                    data: data,
                    success: function(response) {
                        // $.hidePreloader();
                        if(response != null && response.status == 10001) {
                            // $.closeModal($('#popup-edit'));
                                //重新加载页面
                                window.location.reload(true);
                           
                        }else {
                            // $.toast('修改保养项失败');
                            vueThis.$message('修改保养项失败')
                        }
                    },
                    error: function(xhr) {
                        // $.hidePreloader();
                        // $.toast('修改保养项失败' + xhr.status);
                        vueThis.$message('修改保养项失败' + xhr.status)
                    }
                })
            }
        }
    }
    
    </script>

