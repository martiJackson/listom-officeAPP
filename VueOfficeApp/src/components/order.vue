<style type="text/css">
        .subtitle {
            font-size: 0.7rem;
            text-align: left;
        }
        .divider {
            width: 100%;
            height: 1px;
            background-color: #ececec;
        }
        .item {
            padding: 10px;
        }
</style>
<template>
    <div id="app">
        <div class="page">
            <header class="bar bar-nav">
                <h1 class="title">机床故障报修</h1>
            </header>
            <div class="content">
                <div class="list-block">
                    <ul>
                        <li>
                            <div class="item-content">
                                <div class="item-inner">
                                    <div class="item-title label">机床类型</div>
                                    <div class="item-input">
                                        <input type="text" placeholder="选择或填写机床类型">
                                    </div>
                                    <div class="item-after">
                                        <span class="icon icon-menu"></span>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="item-content">
                                <div class="item-inner">
                                    <div class="item-title label">机床产地</div>
                                    <div class="item-input">
                                        <input type="text" placeholder="选择或填写机床产地">
                                    </div>
                                    <div class="item-after">
                                        <span class="icon icon-menu"></span>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="item-content">
                                <div class="item-inner">
                                    <div class="item-title label">机床品牌</div>
                                    <div class="item-input">
                                        <input type="text" placeholder="选择或填写机床品牌">
                                    </div>
                                    <div class="item-after">
                                        <span class="icon icon-menu"></span>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="item-content">
                                <div class="item-inner">
                                    <div class="item-title label">机床系统</div>
                                    <div class="item-input">
                                        <input type="text" placeholder="选择或填写机床系统">
                                    </div>
                                    <div class="item-after">
                                        <span class="icon icon-menu"></span>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="item-content">
                                <div class="item-inner">
                                    <div class="item-title label">设备故障代码</div>
                                    <div class="item-input">
                                        <input type="text" placeholder="填写设备故障代码或拍照">
                                    </div>
                                    <div class="item-after">
                                        <span class="icon icon-menu"></span>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="item-content">
                                <div class="item-inner">
                                    <div class="item-title label">设备故障描述</div>
                                    <div class="item-input">
                                        <input type="text" placeholder="填写设备故障描述">
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="item-content">
                                <div class="item-inner">
                                    <div class="item-title label">服务电话</div>
                                    <a href="tel:0755-32997069">
                                        <div class="item-after">
                                            0755-32997069（点击拨打）
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div> 
                <div class="content-block">
                    <div class="row">
                      <div class="col-50"><a class="button button-big button-fill button-danger">清空</a></div>
                      <div class="col-50"><a class="button button-big button-fill button-success">提交</a></div>
                    </div>
                </div>   
            </div>
        </div>
    </div>
</template>

