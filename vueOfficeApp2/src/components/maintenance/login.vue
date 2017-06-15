<template>
    <div id="app">
        <div class="page page-current" id='router'>
            <header class="bar bar-nav">
                <h1 class="title">工厂宝-机床保养</h1>
            </header>
            <div class="content">
                <div class="list-block">
                    <ul>
                        <li>
                            <div class="item-content">
                                <div class="item-inner">
                                    <div class="item-title label">手机号</div>
                                    <div class="item-input">
                                        <input id="input-phone" type="text" placeholder="请输入手机号" value="">
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="item-content">
                                <div class="item-inner">
                                    <div class="item-title label">密码</div>
                                    <div class="item-input">
                                        <input id="input-pwd" type="password" placeholder="请输入密码" value="">
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="content-block">
                    <div class="row">
                        <div class="col-100"><a id="login-btn" class="button button-big button-fill button-success">登录</a></div>
                    </div>
                </div>
            </div>
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
                $('#login-btn').click(function() {
                    login();
                });

                function login() {
                    var phone = $('#input-phone').val();
                    var pwd = $('#input-pwd').val();
                    if(isEmpty(phone) || isEmpty(pwd)) {
                        // $.toast('手机号或密码不能为空');
                        vueThis.$message("手机号或密码不能为空")
                        return ;
                    }
                    // $.showPreloader('登录中');
                    vueThis.$message({
                        message:'登录中',
                        duration:0
                    })
                    $.ajax({
                        url: requestBaseUrl + 'users/authorization',
                        type: 'POST',
                        data: {
                            mobile: phone,
                            password: pwd
                        },
                        success: function(response) {
                            // $.hidePreloader();
                            vueThis.$message.closeAll()
                            if(response != null) {
                                if(response.status == 10001) {
                                    // $.toast('登录成功');
                                    // window.localStorage.setItem('phone',phone);
                                    vueThis.$message("登陆成功");
                                    if(window.js_interface != undefined) {
                                        try {
                                            window.js_interface.saveAccessToken(response.data.access_token);
                                        } catch(e) {
                                        }
                                    }
                                    // $.router.load('main2.html', true);
                                    window.location='#/main2'
                                }else {
                                    // $.toast('登录失败' + response.status);
                                    vueThis.$message('登录失败' + response.status)
                                }
                            }
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            vueThis.$message.closeAll()
                        }
                    })
                }
            }
        }
    	
    </script>