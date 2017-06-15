<style>
    .running * {  /** 正常运行，绿色 */
        background-color: #449D44;
        color: white;
    }
    .warning * {  /** 出现故障，红色 */
        background-color: red;
        color: white;
    }
    .await * {  /** 待机状态，黄色 */
        background-color: #EC971F;
        color: white;
    }
    .stop * {  /** 停机状态，黑色 */
        background-color: black;
        color: white;
    }
</style>
<template>
    <div id="app">
        <div class="content">
            <div class="content-block-title">一号车间</div>
            <div class="list-block">
                <ul>
                    <li>
                        <div class="row">
                            <div class="col-33">
                                <div class="card running">
                                    <div class="card-header">机器1-1</div>
                                    <div class="card-content">
                                        <div class="card-content-inner">机床信息</div>
                                    </div>
                                    <div class="card-footer">运行正常</div>
                                </div>
                            </div>
                            <div class="col-33">
                                <div class="card running">
                                    <div class="card-header">机床1-2</div>
                                    <div class="card-content">
                                        <div class="card-content-inner">机床信息</div>
                                    </div>
                                    <div class="card-footer">运行正常</div>
                                </div>
                            </div>
                            <div class="col-33">
                                <div class="card warning">
                                    <div class="card-header">机器1-3</div>
                                    <div class="card-content">
                                        <div class="card-content-inner">机床信息</div>
                                    </div>
                                    <div class="card-footer">出现故障</div>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="row">
                            <div class="col-33">
                                <div class="card running">
                                    <div class="card-header">机器1-4</div>
                                    <div class="card-content">
                                        <div class="card-content-inner">机床信息</div>
                                    </div>
                                    <div class="card-footer">运行正常</div>
                                </div>
                            </div>
                            <div class="col-33">
                                <div class="card running">
                                    <div class="card-header">机器1-5</div>
                                    <div class="card-content">
                                        <div class="card-content-inner">机床信息</div>
                                    </div>
                                    <div class="card-footer">运行正常</div>
                                </div>
                            </div>
                            <div class="col-33">
                                <div class="card running">
                                    <div class="card-header">机器1-6</div>
                                    <div class="card-content">
                                        <div class="card-content-inner">机床信息</div>
                                    </div>
                                    <div class="card-footer">运行正常</div>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="content-block-title">二号车间</div>
            <div class="list-block">
                <ul>
                    <li>
                        <div class="row">
                            <div class="col-33">
                                <div class="card running">
                                    <div class="card-header">机器2-1</div>
                                    <div class="card-content">
                                        <div class="card-content-inner">机床信息</div>
                                    </div>
                                    <div class="card-footer">运行正常</div>
                                </div>
                            </div>
                            <div class="col-33">
                                <div class="card await">
                                    <div class="card-header">机器2-2</div>
                                    <div class="card-content">
                                        <div class="card-content-inner">机床信息</div>
                                    </div>
                                    <div class="card-footer">待机中</div>
                                </div>
                            </div>
                            <div class="col-33">
                                <div class="card running">
                                    <div class="card-header">机器2-3</div>
                                    <div class="card-content">
                                        <div class="card-content-inner">机床信息</div>
                                    </div>
                                    <div class="card-footer">运行正常</div>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="row">
                            <div class="col-33">
                                <div class="card stop">
                                    <div class="card-header">机器2-4</div>
                                    <div class="card-content">
                                        <div class="card-content-inner">机床信息</div>
                                    </div>
                                    <div class="card-footer">已停机</div>
                                </div>
                            </div>
                            <div class="col-33">
                                <div class="card running">
                                    <div class="card-header">机器2-5</div>
                                    <div class="card-content">
                                        <div class="card-content-inner">机床信息</div>
                                    </div>
                                    <div class="card-footer">运行正常</div>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
    
<script type="text/javascript">
    export default {
        data(){
          return {
            content:''
          }
        },
        mounted:function(){
            $("#titleName").text('机床列表');
            layer.closeAll();

            //菜单按下时改变背景透明度
            $('.card').bind('touchstart', function() {
                $(this).css('opacity', '0.6');
            });

            //菜单不被按下时取消透明度
            $('.card').bind('touchend', function() {
                $(this).css('opacity', '');
            });

            //点击卡片跳转到机床详情
            $('.card').click(function() {
                // window.location = projectBaseUrl + 'machine/machine_detail.html';
                window.location='#/machine_detail'
            });

        }
    }

</script>
