<template>
    <div id="app">
        <div class="content">
            <div class="content-block-title">新建机床任务</div>
            <div class="list-block">
                <ul>
                    <li>
                        <div class="item-content">
                            <div class="item-inner">
                                <div class="item-title label">任务名称</div>
                                <div class="item-input">
                                    <input type="text" placeholder="填写任务名称">
                                </div>
                            </div>
                        </div>
                    </li>
                    <li class="item-content item-link" id="menu-get-current-time">
                        <div class="item-inner">
                            <div class="item-title">开始时间</div>
                            <div class="item-after" id="current-time-label">点击获取当前时间</div>
                        </div>
                    </li>
                    <li class="item-content">
                        <div class="item-inner">
                            <div class="item-title">操作人</div>
                            <div class="item-after">张三</div>
                        </div>
                    </li>
                    <li class="item-content">
                        <div class="item-inner">
                            <div class="item-title label">备注</div>
                            <div class="item-input">
                                <input type="text" placeholder="填写备注信息">
                            </div>
                            <div class="item-after">
                                <a href="javascript:;" class="button" id="btn-submit-remark">提交</a>
                            </div>
                        </div>
                    </li>
                </ul>
                <div class="content-block">
                    <div class="row">
                        <div class="col-50"><a href="javascript:;" id="btn-stop-task" class="button button-big button-fill button-danger">结束</a></div>
                        <div class="col-50"><a href="javascript:;" id="btn-start-task" class="button button-big button-fill button-success">开始</a></div>
                    </div>
                </div>
            </div>
            <div class="content-block-title">历史任务记录（最近10条）</div>
            <div class="list-block">
                <ul id="history-task-list">
                </ul>
            </div>
        </div>
        <el-dialog
          title="提示" size="large"
          v-model="dialogVisible1">
          <span>确定要开始任务吗？</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible1 = false">取 消</el-button>
            <el-button type="primary" @click="dialogVisible1 = false">确 定</el-button>
          </span>
        </el-dialog>
        <el-dialog
          title="提示"  size="large"
          v-model="dialogVisible2">
          <span>确定要结束任务吗？</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible2 = false">取 消</el-button>
            <el-button type="primary" @click="dialogVisible2= false">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>
    <script type="text/javascript">
        export default {
            data(){
              return {
                dialogVisible1:false,
                dialogVisible2:false
              }
          },
          mounted:function(){
            var vueThis=this;
            //点击获取并显示当前时间
            $('#menu-get-current-time').click(function() {
                var dateStr = getTimeStr(new Date().getTime() / 1000);
                $('#current-time-label').text(dateStr);
            })

            //开始任务按钮
            $('#btn-start-task').click(function() {
               vueThis.dialogVisible1=true;
            })

            //结束任务按钮
            $('#btn-stop-task').click(function() {
                vueThis.dialogVisible2=true
            })
            //加载历史任务
            function loadHistoryTasks() {
                var currentTime = new Date().getTime() / 1000;
                var str = '';
                for(var i = 0; i < 10; i++) {
                    str += '<li class="item-content">';
                    str += '<div class="item-inner">';
                    str += '<div class="item-title">' + getTimeStr(currentTime - 1000 * i) + '</div>';
                    str += '<div class="item-after">加工模具' + (i + 1) + '</div>';
                    str += '</div>';
                    str += '</li>';
                }
                $('#history-task-list').html(str);
            }
            loadHistoryTasks();
              }
          }        
    </script>
