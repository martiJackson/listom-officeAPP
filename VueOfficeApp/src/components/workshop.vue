<style>
    .status-red {  /* 红色，报警 */
        background-color: red;
        color: white;
    }

    .status-green {  /* 绿色，工作 */
        background-color: #00FF00;
        color: white;
    }

    .status-yellow {  /* 黄色，待机 */
        background-color: #EC971F;
        color: white;
    }

    .status-purple {  /* 紫色，正常 */
        background-color: #5329CE;
        color: white;   
    }

    .module-status-power-off {  /* 灰色，模块断电 */
        background-color: #666666;
        color: white;
    }
    .module-status-power-off .machine-name{
        color:white;
    }
    .icon-operated {
        width: 35px;
        height: 35px;
    }

    .machine-name {
        font-size: 15px;
    }

    .alert-machine-name {
        font-size: 15px;   
    }

    .light-cell {
        text-align: center;
        padding-top: 15px;
    }

    .light-img {
        width: 45px;
        height: 45px;
    }

    .icon {
        width: 30px;
        height: 30px;
    }

    .tab-header-block {
        margin-top: 2.5rem;
        margin-bottom: 0.5rem;
        margin-left: 0;
        margin-right: 0;
        padding: 0 0.5rem;
    }
    .content-block{
        margin-top:0;
    }
    .tab>.tips{
        text-align: center;
        font-size:12px;
        color: gray;
    }
    .toggle{
        position: relative;
    }
    .cardCover{
        height:82%;
        width:96%;
        border-radius:7px;
        position:absolute;
        left:2%;
        top:2%;
        background:#999;
        z-index:12000;
        opacity:.4;
    }
    #dialog{
        top:-100%;
    }
    #dialog>.el-dialog{
        width:101%;
        height:100%;
        top:0!important;
        right:0;      
    }
    #dialog.el-dialog__wrapper{
        visibility: hidden;
    }
    .tab-header-block{
        margin-top:0;
    }
    .v-modal{
        visibility: hidden;
    }
    .el-dialog__wrapper{
        overflow: hidden;
        z-index:100000;
    }
    #machine-list-19,#alert-machine-list-19{
        margin-left:-8%;
    }
    .item-content.item-link.workshop-item,.item-content.item-link.alert-workshop-item{
       display: flex;
       display: -webkit-flex;
       flex-direction: column;
       -webkit-flex-direction: column;
    }
    .tab-header-block{
        margin-top:3rem;
    }
</style>
<template>
    <div id="app">
        <div class="content" id='content'>
            <div class="content-block-title"> 车间列表 </div>
            <div class="list-block">
                <ul id="workshop-list">
                    <li class="item-content item-link workshop-item" v-for='lis,index of list' :id="lis.id" @click='workshopItem(index)'>
                        <div class="item-inner">
                            <div class="item-title">{{lis.name}}</div>
                            <div class="item-after machine-count-hint">
                                {{lis.machine_count + "台机床"}}
                                <img class="icon" :id="lis.id" src="/static/images/ic_light_green.png"></img>
                            </div>
                        </div> 
                        <div class="row" :id='"machine-list-"+lis.id' hidden="hidden" ></div>
                    </li>                                                                         
                </ul>
            </div>

            <div class="content-block-title">保养报警</div>
            <div class="list-block">
                <ul id="maintenance-alert-list" >
                    <li class="item-content item-link alert-workshop-item" v-for='lis2,index of list2' :id="lis2.id" @click='alertWorkshopItem(index)'>
                        <div class="item-inner">
                             <div class="item-title">{{lis2.name}}</div>
                             <div class="item-after">
                               {{lis2.machine_count + "台机床"}}
                               <img class="icon" :id="'alert-machine-img-'+lis2.id" src="/static/images/ic_light_green.png"></img>
                            </div>
                        </div>
                        <div class="row" :id="'alert-machine-list-'+lis2.id" hidden="hidden"></div>                       
                    </li>
                </ul>
                
            </div>
        </div>
        <!-- 车间分组的popup -->
       <!--  <el-dialog title="提示" v-model="dialogVisible" class="popup-group" id="dialog"> -->
       <div class="popup-group" id="dialog" style='display:none;position:fixed;left:0;height:100%;width:100%;background:#fff;z-index:100000'>
           <header class="bar bar-nav">
              <button class="button button-link button-nav pull-left close-popup" id="close-pop-btn" @click='dialogVisible=false'>
                关闭
              </button>
              <h1 class="title" id="popup-title"></h1>
            </header>
            <div id="group-content"></div>
       </div>
            
        <!-- </el-dialog> -->
    </div>
</template>
    <script type="text/javascript">
         export default {
            data(){
              return {
                content:'',
                list:'',
                list2:'',
                list3:'',
                list4:'',
                fn:'',
                fn2:'',
                dialogVisible:false              
              }
            },
            methods:{
               alertWorkshopItem(index){                
                    this.fn(index);
               },
               workshopItem(index){
                var vueThis=this;
                  this.fn2(index); 
               }
            },
            mounted:function(){
            $("#close-pop-btn").click(function(){
                 $("#dialog").animate({top:'-100%'},500);
             });                           
              var vueThis=this;
              setTimeout(function(){
                // vueThis.dialogVisible=false
                 $("#dialog").animate({top:'-100%'},500);
            },10);            
              if(window.js_interface) {
                try {
                    window.js_interface.useGoBack(true);
                }catch (e) {
                    console.log(e);
                }
            };
            function LocalStorageUtils() {
                this.set = function(name, value, expireSecs) {
                    if(window.localStorage) {
                        var obj = {
                            name: value,
                            expires: new Date().getTime() + expireSecs * 1000
                        };
                        window.localStorage.setItem(name, JSON.stringify(obj));
                    }
                }

                this.get = function(name) {
                    if(window.localStorage) {
                        var str = window.localStorage.getItem(name);
                        if(str != null) {
                            var obj = JSON.parse(str);
                            var time = new Date().getTime();
                            if(time > obj.expires) {
                                window.localStorage.removeItem(name);
                                return null;
                            }
                            return obj.name;
                        }
                    }
                    return null;
                }

                this.remove = function(name) {
                    if(window.localStorage) {
                        window.localStorage.removeItem(name);   
                    }
                }
            };
            function Map() {
                this.keys = [];
                this.values = [];

                //将一个键值对放入map中
                this.put = function(key, value) {
                    if(!this.containKey(key)) {
                        this.keys.push(key);
                        this.values.push(value);
                    }else {
                        for (var i = 0; i < this.keys.length; i++) {
                            if(this.keys[i] == key) {
                                this.values[i] = value;
                            }
                        }
                    }
                }
                //根据key删除一个键值对
                this.remove = function(key) {
                    for (var i = 0; i < this.keys.length; i++) {
                        if(this.keys[i] == key) {
                            this.keys.splice(i, 1);
                            this.values.splice(i, 1);
                        }
                    }
                }
                //判断是否存在key
                this.containKey = function(key) {
                    for (var i = 0; i < this.keys.length; i++) {
                        if(this.keys[i] == key) {
                            return true;
                        }
                    }
                    return false;
                }

                //根据key获取对应的value
                this.get = function(key) {
                    for (var i = 0; i < this.keys.length; i++) {
                        if(this.keys[i] == key) {
                            return this.values[i];
                        }
                    }
                    return null;
                }

                //获取map的大小
                this.size = function() {
                    return this.keys.length;
                }
            }
            var dataExpireTime = 10;
            var workshopList = null;
            var statusData = null;
            var selectedWorkshopId; //当前点击的车间
            var groupMachineMap = new Map(); //groupId-machineList保存分组机床数据
            var workshopMachineMap = new Map(); //workshopId-machineList保存车间和车间中的机床数据
            var isClickedWorkshopList = true; // 标识点击的是车间列表还是保养报警列表
            var workshopMaintenanceMap = new Map(); //保养的map，存放的是workshopId-maintenanceList
            var groupMaintenanceMap = new Map(); // 保养的map，存放的是groupId-maintenanceList
            // setInterval(getStatus, 1000 * 10); // 定时刷新机器状态

            var localStorageUtils = new LocalStorageUtils();

            //用于保存用户选择的车间id，当页面跳转返回后，根据id恢复页面上次展示的样子
            var idContainer = {
                ids: [],
                alertIds: [],
                popid: null,
                addOrRemoveId: function(id, type) {  // type取值"id" or "alert"
                    var index = idContainer.idExists(id, type);
                    if(index == -1) {
                        if(type == 'id') {
                            idContainer.ids.push(id);
                        } else if(type == 'alert') {
                            idContainer.alertIds.push(id);
                        }
                    } else {
                        if(type == 'id') {
                            idContainer.ids.splice(index, 1);
                        } else if(type == 'alert') {
                            idContainer.alertIds.splice(index, 1);
                        }
                    }
                    idContainer.saveIds();
                },
                removeId: function(id, type) {
                    var index = idExists(id, type);
                    if(index >= 0) {
                        if(type == 'id') {
                            idContainer.ids.splice(index, 1);
                        } else if(type == 'alert') {
                            idContainer.alertIds.splice(index, 1);
                        }   
                    }
                },
                idExists: function(id, type) {
                    var arr;
                    if(type == 'id') {
                        arr = idContainer.ids;
                    } else if(type == 'alert') {
                        arr = idContainer.alertIds;
                    }
                    for(var i = 0; i < arr.length; i++) {
                        if(arr[i] == id) {
                            return i;
                        }
                    }
                    return -1;
                },
                saveIds: function() {
                    localStorageUtils.set('ids', idContainer.ids, 60);
                    localStorageUtils.set('alertIds', idContainer.alertIds, 60);
                    localStorageUtils.set('popid', idContainer.popid, 60);
                },
                recoverPageState: function() {
                    idContainer.popid = localStorageUtils.get('popid');
                    if(idContainer.popid != null) {
                        var arr = idContainer.popid.split('-');
                        if(arr[0] == 'id') {
                            isClickedWorkshopList = true;
                        } else if(arr[0] == 'alert') {
                            isClickedWorkshopList = false;
                        }
                        selectedWorkshopId = arr[1];
                        getWorkshopGroups(arr[1]);  
                        return ;
                    }
                    idContainer.ids = localStorageUtils.get('ids');
                    if(idContainer.ids == null) {
                        idContainer.ids = [];
                    }
                    for(var i = 0; i < idContainer.ids.length; i++) {
                      var  id = idContainer.ids[i];
                        if(id != '' && id != null && id != undefined) {
                            console.log('id = ' + id);
                            isClickedWorkshopList = true;
                            selectedWorkshopId = id;
                            getWorkshopGroups(id);  
                        }
                    }
                    idContainer.alertIds = localStorageUtils.get('alertIds');
                    if(idContainer.alertIds == null) {
                        idContainer.alertIds = [];
                    }
                    for(var i = 0; i < idContainer.alertIds.length; i++) {
                        id = idContainer.alertIds[i];
                        if(id != '' && id != null && id != undefined) {
                            console.log('alert id = ' + id);
                            isClickedWorkshopList = false;
                            selectedWorkshopId = id;
                            getWorkshopGroups(id);  
                        }
                    }
                }
            }
            getWorkshops();

            //获取车间信息
            function getWorkshops() {
                var url = requestBaseUrl + 'iot/companies/workshops';
                var response = localStorageUtils.get(url);
                if(response != null) {
                    getWorkshopsSuccessCallback(response);

                    return ;
                }
                $.ajax({
                    type: 'GET',
                    url: url,
                    async: false,
                    headers: {
                        'Authorization': 'Bearer ' + getToken()
                    },
                    success: function(response) {
                        // console.log('workshops: ' + formatJSON(JSON.stringify(response)));
                        localStorageUtils.set(url, response, dataExpireTime);
                        getWorkshopsSuccessCallback(response);
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        vueThis.$message('加载车间列表出错');
                    }
                })
            }
            //获取车间成功后的回调
            function getWorkshopsSuccessCallback(response) {
                if(response.status == 10001) {
                    if(response.data.total > 0) {
                     workshopList = response.data.list; 
                     vueThis.list=workshopList;
                     vueThis.list2=workshopList;
                        showWorkshops(workshopList);
                        showAlertWorkshops(workshopList);
                        idContainer.recoverPageState();
                        getStatus(); // 加载机器状态信息
                    }else{
                       vueThis.$message('没有车间信息');
                    }
                }else{
                    vueThis.$message('获取车间信息失败');
                }
            }
            // 显示车间列表
            function showWorkshops(list) {
                if(list != null && list.length > 0) {
                    // var data = {
                    //     list: list
                    // };
                    // var html = template('workshop-item', data);
                    // $('#workshop-list').html(html);
                    //点击车间列表item，获取车间id，然后获取对应的机床列表

                    // $('li.workshop-item').click(
                      vueThis.fn2= function(index){
                      $("#dialog.el-dialog__wrapper").css("visibility","visible")                   
                        isClickedWorkshopList = true;
                        var workshopId =$('li.workshop-item').eq(index).attr('id');                        
                        selectedWorkshopId = workshopId;
                        idContainer.addOrRemoveId(workshopId, "id");
                        getWorkshopGroups(workshopId);
                        if(workshopId!=19){
                        $('#dialog').css("display",'block')                           
                        }
                                                                 
                    }
                    // )
                } else {
                    vueThis.$message('没有车间信息');
                }
            }

            function LocalStorageUtils() {
                this.set = function(name, value, expireSecs) {
                    if(window.localStorage) {
                        var obj = {
                            name: value,
                            expires: new Date().getTime() + expireSecs * 1000
                        };
                        window.localStorage.setItem(name, JSON.stringify(obj));
                    }
                }
                this.get = function(name) {
                    if(window.localStorage) {
                        var str = window.localStorage.getItem(name);
                        if(str != null) {
                            var obj = JSON.parse(str);
                            var time = new Date().getTime();
                            if(time > obj.expires) {
                                window.localStorage.removeItem(name);
                                return null;
                            }
                            return obj.name;
                        }
                    }
                    return null;
                }

                this.remove = function(name) {
                    if(window.localStorage) {
                        window.localStorage.removeItem(name);   
                    }
                }
            }
            //获取车间的分组
            function getWorkshopGroups(workshopId) {
                var url = requestBaseUrl + 'iot/companies/workshops/' + workshopId + '/groups';
                var response = localStorageUtils.get(url);                
                if(response != null) {
                    getWorkshopGroupsSucCallback(response, workshopId); 
                    return ;
                }
                // $.showPreloader('正在获取车间分组信息...');
                vueThis.$message({
                    message:'正在获取车间分组信息...',
                    duration:0
                })
                $.ajax({
                    type: 'GET',
                    url: url,
                    async: false,
                    headers: {
                        'Authorization': 'Bearer ' + getToken()
                    },
                    success: function(response) {
                        // $.hidePreloader();                       
                        // console.log('workshop groups: ' + formatJSON(JSON.stringify(response)));
                        localStorageUtils.set(url, response, dataExpireTime);
                        getWorkshopGroupsSucCallback(response, workshopId);
                         vueThis.$message.closeAll()
                    },
                    error: function(xhr) {
                        // $.hidePreloader();
                         vueThis.$message.closeAll()
                        console.log('获取车间的分组失败: ' + xhr.status);
                    }
                })
            }
            //获取车间分组成功的回调方法
            function getWorkshopGroupsSucCallback(response, workshopId) {
                if(response != null && response.status == 10001) {
                    var list = response.data.list;
                    if(list != null && list.length > 0) {
                        showMachinesByGroup(workshopId, list);  
                        // vueThis.dialogVisible=true 
                        // $('#dialog').css("display",'block')

                    } else {
                        //无分组，直接显示机器
                        checkMachinesLoaded(workshopId);    
                    }
                } else {
                    //无分组，直接显示机器
                    checkMachinesLoaded(workshopId);
                }
            }
            function showMachinesByGroup(workshopId, groupList) {
                if(groupList != null && groupList.length > 0) {
                    var str = "";
                    //有分组，显示分组
                    if(isClickedWorkshopList) {
                        $('#popup-title').text('车间列表'); 
                        str = "id-" + workshopId;
                    } else {
                        $('#popup-title').text('保养报警');
                        str = "alert-" + workshopId;
                    }
                    idContainer.popid = str;
                    idContainer.saveIds();
                    showPopupGroups(groupList);
                    // $.popup('.popup-group');
                    // vueThis.dialogVisible=true
                } else {
                    //无分组，直接显示机器    
                    checkMachinesLoaded(workshopId);
                }
            }
            //检查机器是否加载，没加载就加载，加载了就直接显示
            function checkMachinesLoaded(workshopId) {
                localStorageUtils.remove('popid');
                var machineNode;
                if(isClickedWorkshopList) {
                    machineNode = $('#machine-list-' + workshopId);
                } else {
                    machineNode = $('#alert-machine-list-' + workshopId);
                }
                if(machineNode.hasClass('loaded')) {
                    //已加载
                    if(machineNode.attr('hidden')) {
                        machineNode.removeAttr('hidden');
                        machineNode.show();
                        showStatus();
                    } else {
                        machineNode.attr('hidden', 'hidden');
                        machineNode.hide();
                    }
                } else {
                    getMachinesByWorkshopId(workshopId);
                }
            }
            //显示分组popup窗口
            function showPopupGroups(groups) {
                var len = groups.length;
                var html = '';
                //显示一行tab
                html += '<div class="tab-header-block"><div class="buttons-row">';
                for(var i = 0; i < len; i++) {
                    if(i == 0) {
                        html += '<a href="#tab' + i + '" class="tab-link active button">' + groups[i].name + '<span style="display: none;">' + groups[i].id + '</span></a>';
                    } else {
                        html += '<a href="#tab' + i + '" class="tab-link button">' + groups[i].name + '<span style="display: none;">' + groups[i].id + '</span></a>';   
                    }
                }
                html += '</div></div><div class="tabs"> ';               
                for(var j = 0; j <len; j++) {
                    if(j == 0) {
                        html += '<div id="tab' + j + '" class="tab"> <p class="tips">长按可选择是否关注该机器</p>\
                                  <div class="content-block row" id="content-block-' + groups[j].id + '" >\
                                  </div>\
                                </div>';                                                     
                    } else {
                        html += '<div id="tab' + j + '" class="tab"> <p class="tips">长按可选择是否关注该机器</p>\
                                  <div class="content-block row" id="content-block-' + groups[j].id + '">\
                                  </div>\
                                </div>';
                    }
                }
                html += '</div>';
                             
                $('#group-content').html(html);
                 // vueThis.dialogVisible=true;
                
                    // $('#dialog').css("display",'block')
                    $("#dialog").animate({'top':0},500);                 
                getMachinesByGroupId(groups[0].id);
                $("#tab0").addClass("active")
                $('.tab-link').click(function() {
                    $('.tab-link').removeClass('active');
                    $(this).addClass('active');
                    var groupId = $(this).children('span').html();
                    getMachinesByGroupId(groupId);
                });
               
            }
            //根据分组加载机器
            function getMachinesByGroupId(groupId) {
                var url = requestBaseUrl + 'iot/companies/workshops/' + selectedWorkshopId + '/machines?group_id=' + groupId;
                var response = localStorageUtils.get(url);
                if(response != null) {
                    getMachinesByGroupIdSucCallback(response, groupId);
                    return ;
                }
                // $.showPreloader('正在加载机床数据...');
                vueThis.$message({
                    message:'正在加载机床数据...',
                    duration:0
                })
                $.ajax({
                    type: 'GET',
                    url: url,
                    headers: {
                        'Authorization': 'Bearer ' + getToken()
                    },
                    success: function(response) {
                        // $.hidePreloader();                         
                        localStorageUtils.set(url, response, dataExpireTime);
                        getMachinesByGroupIdSucCallback(response, groupId);
                        vueThis.$message.closeAll()
                    },
                    error: function(xhr) {
                        // $.hidePreloader();
                        vueThis.$message.closeAll()
                       vueThis.$message('加载机床数据出错');
                    }
                })
            }
            function getMachinesByGroupIdSucCallback(response, groupId) {
                if(response != null && response.status == 10001) {
                    var list = response.data.list;
                    if(list != null && list.length > 0) {
                        groupMachineMap.put(groupId, list);
                        //显示分组中的机床
                        showGroupMachines(groupId, list);
                    } else {
                        vueThis.$message('没有机床数据');      
                    }
                } else {
                    vueThis.$message('加载机床数据出错');    
                }
            }
            //显示分组中的机器
            function showGroupMachines(groupId, list) {
                 var html='';
                if(isClickedWorkshopList) {   // 车间列表
                    // vueThis.list3=list                
                    for(var i=0;i<list.length;i++){
                         html+='<div class="col-50">'+
                                 '<div class="card"  id="'+list[i].workshop_id+'-'+list[i].id+'">'+
                                     '<div class="card-content">'+
                                         '<div class="card-content-inner">'+
                                             '<div class="list-block">'+
                                            '<li class="item-content">'+
                                                 '<div class="item-media"><img src="/static/images/ic_operated_punch.png" class="icon-operated"></div>'+
                                                 '<div class="item-inner">'+
                                                     '<div class="item-title machine-name">'+list[i].name+'</div>'+
                                                 '</div>'+
                                             '</li>'+
                                             '</div>'+
                                         '</div>'+
                                     '</div>'+
                                 '</div>'+
                             '</div>'
                    }                   
                    // var html = template('machine-item', list);
                    $('#content-block-' + groupId).html(html);                    
                    showStatus();
                    addCardCss();

                } else {  // 保养报警
                    // var html = template('alert-machine-item', list);
                    html=''
                    for(var i=0;i<list.length;i++){
                         html+='<div class="col-50">'+
                                 '<div class="card"  id="maintenance-item-'+list[i].workshop_id+'-'+list[i].id+'">'+
                                     '<div class="card-content">'+
                                         '<div class="card-content-inner">'+
                                             '<div class="list-block">'+
                                            '<li class="item-content">'+
                                                 '<div class="item-media"><img src="/static/images/ic_operated_punch.png" class="icon-operated"></div>'+
                                                 '<div class="item-inner">'+
                                                     '<div class="item-title alert-machine-name">'+list[i].name+'</div>'+
                                                 '</div>'+
                                             '</li>'+
                                             '</div>'+
                                         '</div>'+
                                     '</div>'+
                                 '</div>'+
                             '</div>'
                    }                 
                    $('#content-block-'+ groupId).html(html);
                    //加载分组中的机床保养状态
                    getMachinesMaintenanceListByGroupId(groupId);
                }
            }             
            //根据车间id获取机器
            function getMachinesByWorkshopId(workshopId) {
                var url = requestBaseUrl + 'iot/companies/workshops/' + workshopId + '/machines';
                var response = localStorageUtils.get(url);
                if(response != null) {
                    getMachinesByWorkshopIdSucCallback(response, workshopId);
                    return ;
                }
                   vueThis.$message({
                      showClose: true,
                      message: '正在加载机床信息...',
                      type: 'warning',
                      duration:0
                    });
                // $.showPreloader('正在加载机床信息...');
                $.ajax({
                    type: 'GET',
                    url: url,
                    headers: { 
                        'Authorization': 'Bearer ' + getToken()
                    },
                    success: function(response) {
                        // $.hidePreloader();
                        vueThis.$message.closeAll()
                        // console.log('get workshop machines: ' + formatJSON(JSON.stringify(response)));
                        localStorageUtils.set(url, response, dataExpireTime);
                        getMachinesByWorkshopIdSucCallback(response, workshopId);
                    },
                    error: function(xhr) {
                        // $.hidePreloader();
                         vueThis.$message.closeAll()
                       vueThis.$message('获取车间机器出错');
                    }
                })
            }
            function getMachinesByWorkshopIdSucCallback(response, workshopId) {
                if(response != null && response.status == 10001) {
                    workshopMachineMap.put(workshopId, response.data.list);
                    //显示车间中的机器
                    showMachinesWithoutGroup(workshopId, response.data.list);
                }
            }
            //不分组显示车间中的机器 
            function showMachinesWithoutGroup(workshopId, list) {
                var data = {
                    list: list
                };
                var html;
                var machineNode;
                if(isClickedWorkshopList) {
                    html='';
                    // html = template("machine-item", data);
                    for(var i=0;i<list.length;i++){
                         html+='<div class="col-50">'+
                                 '<div class=\"card\"  id=\"'+list[i].workshop_id+'-'+list[i].id+'\">'+
                                     '<div class="card-content">'+
                                         '<div class="card-content-inner">'+
                                             '<div class="list-block">'+
                                            '<li class="item-content">'+
                                                 '<div class="item-media"><img src="/static/images/ic_operated_punch.png" class="icon-operated"></div>'+
                                                 '<div class="item-inner">'+
                                                     '<div class="item-title machine-name">'+list[i].name+'</div>'+
                                                 '</div>'+
                                             '</li>'+
                                             '</div>'+
                                         '</div>'+
                                     '</div>'+
                                 '</div>'+
                             '</div>'
                    }   
                    machineNode = $('#machine-list-' + workshopId);
                } else {
                     html='';
                    // html = template("alert-machine-item", data);
                    for(var i=0;i<list.length;i++){
                         html+='<div class="col-50">'+
                                 '<div class=\"card\"  id=\"maintenance-item-'+list[i].workshop_id+'-'+list[i].id+'\">'+
                                     '<div class="card-content">'+
                                         '<div class="card-content-inner">'+
                                             '<div class="list-block">'+
                                            '<li class="item-content">'+
                                                 '<div class="item-media"><img src="/static/images/ic_operated_punch.png" class="icon-operated"></div>'+
                                                 '<div class="item-inner">'+
                                                     '<div class="item-title alert-machine-name">'+list[i].name+'</div>'+
                                                 '</div>'+
                                             '</li>'+
                                             '</div>'+
                                         '</div>'+
                                     '</div>'+
                                 '</div>'+
                             '</div>'
                    }  
                    machineNode = $('#alert-machine-list-' + workshopId);
                }
                machineNode.addClass('loaded');
                machineNode.removeAttr('hidden');
                machineNode.show();
                machineNode.html(html);
                if(isClickedWorkshopList) {
                    showStatus();
                    addCardCss();
                } else {
                    //获取机器的保养项目并显示保养状态
                    getMachinesMaintenanceListByWorkshop(workshopId);
                }
            }
            var gettingStatus = false;

            //获取所有机器当前的运行状态
            function getStatus() {
                if(gettingStatus) {
                    return ;
                }
                gettingStatus = true;
                console.log('get status...');
                $.ajax({
                    type: 'GET',
                    url: requestBaseUrl + 'iot/companies/machines/status',
                    data: {
                        workshop_id: 0
                    },
                    headers: {
                        'Authorization': 'Bearer ' + getToken()
                    },
                    success: function(response) {
                        gettingStatus = false;
                        console.log('get status: ' + formatJSON(JSON.stringify(response)));
                        if(response != null && response.status == 10001) {
                            statusData = response.data;
                            console.log('get status success');
                            showStatus();
                        }
                    },
                    error: function(xhr) {
                        gettingStatus = false;
                        console.log('get machine status error: ' + xhr.status);
                    }
                })
            }
            //显示某个车间中的机器的状态
            function showStatus() {
                if(workshopList == null) {
                    return ;
                }
                if(statusData == null) {
                    getStatus();
                    return ;
                }
                var workshopId;
                var workshopStatusObj;
                var workshopStatus;
                var machineStatusList;
                var machineStatusObj;
                for(var i = 0; i < workshopList.length; i++) {
                    workshopId = workshopList[i].id;                    //获取车间ID
                    workshopStatusObj = statusData['' + workshopId];          //获取该车间的状态信息
                    if(workshopStatusObj == undefined || workshopStatusObj == null) {
                        continue ;
                    }
                    workshopStatus = workshopStatusObj.status;
                    if(workshopStatus == 1) {
                        //车间正常
                        $('img[id="' + workshopId + '"]').attr('src', '/static/images/ic_light_green.png');
                    }else{
                        //车间报警
                        $('img[id="' + workshopId + '"]').attr('src', '/static/images/ic_light_red.png');
                    }
                    machineStatusList = workshopStatusObj.machine;      //某一个车间中的所有机器状态
                    var len = machineStatusList.length;
                    for(var k = 0; k < len; k++) {
                        machineStatusObj = machineStatusList[k];
                        var machine = $('div[id="' + machineStatusObj.workshop_id + '-' + machineStatusObj.machine_id + '"]');
                        machine.removeClass('status-red');
                        machine.removeClass('status-green');
                        machine.removeClass('status-yellow');
                        machine.removeClass('status-purple');
                        machine.removeClass('.module-status-power-off');
                        if(machineStatusObj.power == -1) { 
                            //模块断电，显示灰色，不再判断其他灯
                            machine.addClass('module-status-power-off');
                            continue ;
                        }
                        if(machineStatusObj.red == 2) {
                            machine.addClass('status-red');
                        }else if(machineStatusObj.yellow == 2) {
                            machine.addClass('status-yellow');
                        }else if(machineStatusObj.purple == 2) {
                            machine.addClass('status-purple');
                        }else if(machineStatusObj.green == 2) {
                            machine.addClass('status-green');
                        }
                    }
                }
            }
            // 传递取消关注的ID
            function lessen(ID){
                if(typeof(window.js_interface) == "undefined"){
                    console.log("window.js_interface is undefined")
                }else{
                    window.js_interface.saveMachineId(ID)
                }
            }
            // 传递关注的ID
            function add(ID){
                if(typeof(window.js_interface) == "undefined"){
                    console.log("window.js_interface is undefined")
                }else{
                    window.js_interface.deleteMachineId(ID)
                }
            }
            function addCardCss() {
                var delay="";
                var delay2="";

                // 获取修改的ID信息
                if(typeof(window.js_interface) == "undefined"){
                    console.log("window.js_interface is undefined")
                }else{
                    var getID=window.js_interface.getMachineId();
                    for(var i=0;i< getID.length;i++){
                        $("#"+getID[i].ID).append("<p class='cardCover'></p>")
                        $("#"+getID[i].ID).addClass("toggle")
                    }
                }   
                //菜单按下时改变背景透明度
                    $('.card').on('touchstart', function() {
                        $(this).css('opacity', '0.6'); 
                    })
                    // 菜单按下时改变关注状态
                        $(".card").parent().on('touchstart',function(){
                        var ID=$(this).attr("id")
                        var changeThis=$(this);
                        var thiIndex=$(this).index();
                        var str="<p class='cardCover'></p>"
                        // 取消关注机器
                        if(!changeThis.hasClass("toggle")){
                            delay=setTimeout(function(){
                            layer.open({
                               content:'是否取消关注该机器',
                               btn:["确认","取消"],
                               no:function(){
                                clearTimeout(delay)
                               },
                               yes:function(index){
                                    layer.close(index);
                                    changeThis.append(str)
                                    clearTimeout(delay)
                                    changeThis.addClass("toggle")
                                    lessen(ID)             
                               }
                              });
                            },800)
                        }else{  //关注机器
                            delay2=setTimeout(function(){
                            layer.open({
                               content:'是否关注该机器',
                               btn:["确认","取消"],
                               no:function(){
                                clearTimeout(delay2)
                               },
                               yes:function(index){
                                    layer.close(index);
                                    changeThis.find(".cardCover").remove()
                                    clearTimeout(delay2)
                                    changeThis.removeClass("toggle")
                                    add(ID)                    
                                   }            
                              });
                            },800)              
                        }
                    })
                // 菜单不被按下时清除定时器
                    $(".card").parent().on("touchend",function(){
                        clearTimeout(delay)
                        clearTimeout(delay2)
                    })                         
                //菜单不被按下时取消透明度
                $('.card').on('touchend', function() {
                    $(this).css('opacity', '');
                    clearTimeout(delay)         
                });
                //点击卡片跳转到机床详情
                $('.card').click(function() {
                    var idArray = $(this).attr('id').split('-');
                    var machineName = $(this).find('div.machine-name').text();

                    //machineName是中文的话，需要用encodeURIComponent编码一下，避免使用getUrlParam获取到的参数是乱码
                    window.location =  '#/machine_detail?workshopId=' + 
                        idArray[0] + '&machineId=' + idArray[1] + '&machineName=' + encodeURIComponent(machineName);
                });
            }
            //检查车间是否有保养报警
            function checkWorkshopAlert(workshopId) {
                $.ajax({
                    type: 'GET',
                    url: requestBaseUrl + 'iot/companies/workshops/' + workshopId + '/maintenance/status',
                    headers: {
                        'Authorization': 'Bearer ' + getToken()
                    },
                    success: function(response) {
                        console.log('get workshop alert status: ' + formatJSON(JSON.stringify(response)));
                        if(response != null && response.status == 10001) {
                            var ligthDOM = $('#alert-machine-img-' + workshopId);
                            var status = response.data.status;
                            if(status == -1) { //有报警
                                ligthDOM.attr('src','/static/images/ic_light_red.png');
                            } else {
                                ligthDOM.attr('src','/static/images/ic_light_green.png');
                            }
                        }
                    },
                    error: function(xhr) {
                        console.log('get workshop alert status error: ' + xhr.status);
                    }
                })
            }

            //显示保养报警车间列表
            function showAlertWorkshops(list) {
                if(list != null && list.length > 0) {
                //     var data = {
                //         list: list
                //     };
                    // var html = template('alert-workshop-item', data);
                    // $('#maintenance-alert-list').html(html);
                    // $('li.alert-workshop-item').click(
                     vueThis.fn=function(index) {
                        $("#dialog.el-dialog__wrapper").css("visibility","visible")
                        isClickedWorkshopList = false;
                        var workshopId = $('li.alert-workshop-item').eq(index).attr('id');
                        idContainer.addOrRemoveId(workshopId, "alert");
                        selectedWorkshopId = workshopId;
                        getWorkshopGroups(workshopId);
                    }
                    // );

                    if(workshopList != null) {
                        for(var i = 0; i < workshopList.length; i++) {
                            checkWorkshopAlert(workshopList[i].id);
                        }
                    }
                }
            }

            //根据车间ID获取机器的保养项目
            function getMachinesMaintenanceListByWorkshop(workshopId) {
                var machineList = workshopMachineMap.get(workshopId);
                var maintenanceList = workshopMaintenanceMap.get(workshopId);
                if(maintenanceList != null) {
                    showMaintenanceStatusByWorkshop(workshopId, maintenanceList, machineList);
                    return ;
                }
                if(machineList != null) {
                    var len = machineList.length;
                    var loadedCount = 0;
                    var maintenanceList = [];
                    for(var i = 0; i < len; i++) {
                        getBindedMaintenanaceList(machineList[i].id, workshopId, maintenanceList, function(){
                            loadedCount++;
                            if(loadedCount == len) {
                                workshopMaintenanceMap.put(workshopId, maintenanceList);
                                showMaintenanceStatusByWorkshop(workshopId, maintenanceList, machineList);
                            }
                        }, function() {
                            loadedCount++;
                            if(loadedCount == len) {
                                workshopMaintenanceMap.put(workshopId, maintenanceList);
                                showMaintenanceStatusByWorkshop(workshopId, maintenanceList, machineList);
                            }
                        });
                    }
                }
            }

            //根据分组获取保养
            function getMachinesMaintenanceListByGroupId(groupId) {
                var machineList = groupMachineMap.get(groupId);
                var maintenanceList = groupMaintenanceMap.get(groupId);
                if(maintenanceList != null) {
                    showMaintenanceStatusByGroup(groupId, maintenanceList, machineList);
                    return ;
                }
                if(machineList != null) {
                    var len = machineList.length;
                    var loadedCount = 0;
                    var maintenanceList = [];
                    for(var i = 0; i < len; i++) {
                        getBindedMaintenanaceList(machineList[i].id, selectedWorkshopId, maintenanceList, function(){
                            loadedCount++;
                            if(loadedCount == len) {
                                groupMaintenanceMap.put(groupId, maintenanceList);
                                showMaintenanceStatusByGroup(groupId, maintenanceList, machineList);
                            }
                        }, function() {
                            loadedCount++;
                            if(loadedCount == len) {
                                groupMaintenanceMap.put(groupId, maintenanceList);
                                showMaintenanceStatusByGroup(groupId, maintenanceList, machineList);
                            }
                        });
                    }
                }
            }

            //根据车间显示保养状态
            function showMaintenanceStatusByWorkshop(workshopId, maintenanceList, machineList) {
                if(machineList != null) {
                    var len = machineList.length;
                    for (var i = 0; i < machineList.length; i++) {
                        var machineItem = machineList[i];
                        var machineDom = $('div#maintenance-item-' + workshopId + '-' + machineItem.id);
                        machineDom.removeClass('status-red');
                        machineDom.removeClass('status-yellow');
                        var alertLevel = getAlertLevel(maintenanceList, machineItem.id);
                        if(alertLevel == 'red') {
                            //红色报警级别
                            machineDom.addClass('status-red');
                        } else if(alertLevel == 'yellow') {
                            //黄色报警级别
                            machineDom.addClass('status-yellow');
                        }
                        machineDom.click(function() {
                            //跳转到保养列表
                            var machineName = $(this).find('div.alert-machine-name').text();
                            var id = $(this).attr('id');
                            if(id != undefined && id != null) {
                                var arr = id.split('-');
                                if(arr != undefined && arr != null) {
                                    var machineId = arr.pop();
                                    window.location.href = '#/single_machine_maintenance_detail?machineId=' + 
                                                        machineId + '&machineName=' + encodeURIComponent(machineName);  
     
                                }
                            }
                        })
                    }
                }
            }

            //显示分组中的机床保养状态
            function showMaintenanceStatusByGroup(groupId, maintenanceList, machineList) {
                if(machineList != null) {
                    var len = machineList.length;
                    for (var i = 0; i < machineList.length; i++) {
                        var machineItem = machineList[i];
                        var machineDom = $('div#maintenance-item-' + selectedWorkshopId + '-' + machineItem.id);
                        machineDom.removeClass('status-red');
                        machineDom.removeClass('status-yellow');
                        var alertLevel = getAlertLevel(maintenanceList, machineItem.id);
                        if(alertLevel == 'red') {
                            //红色报警级别
                            machineDom.addClass('status-red');
                        } else if(alertLevel == 'yellow') {
                            //黄色报警级别
                            machineDom.addClass('status-yellow');
                        }
                        machineDom.click(function() {
                            //跳转到保养列表
                            var machineName = $(this).find('div.alert-machine-name').text();
                            var id = $(this).attr('id');
                            if(id != undefined && id != null) {
                                var arr = id.split('-');
                                if(arr != undefined && arr != null) {
                                    var machineId = arr.pop();
                                    window.location.href = '#/single_machine_maintenance_detail?machineId=' + 
                                                        machineId + '&machineName=' + encodeURIComponent(machineName); 
  
                                }
                            }
                        })
                    }
                }
            }

            //返回单台机器的报警级别，返回值red和yellow
            function getAlertLevel(maintenanceList, machineId) {
                var level = '';
                var obj;
                for(var i = 0; i < maintenanceList.length; i++) {
                    obj = maintenanceList[i];
                    if(obj.machine_id == machineId) {
                        if(level == 'red') {
                            return 'red';
                        }
                        if(obj.light == 'yellow' && level == '') {
                            level = 'yellow';
                        } 
                        if(obj.light == 'red') {
                            level = 'red';
                        }
                    }
                }
                return level;
            }

            //根据机器ID获取该机器已绑定的保养项目
            function getBindedMaintenanaceList(machineId, workshopId, maintenanceList, successCallback, errorCallback) {
                $.ajax({
                    type: 'GET',
                    url: requestBaseUrl + 'iot/companies/machines/' + machineId + '/maintenances',
                    headers: {
                        'Authorization': 'Bearer ' + getToken()
                    },
                    success: function(response) {
                        // console.log('获取已绑定的保养项：\n' + formatJSON(JSON.stringify(response)));
                        if (response != null) {
                            if (response.status == 10001) {
                                var size = response.data.total;
                                if (size > 0) {
                                    var list = response.data.list;
                                    for(var i = 0; i < size; i++) {
                                        var lastDate = list[i].last_date;
                                        var cycle = list[i].cycle;
                                        var now = parseInt(new Date().getTime() / 1000, 10);
                                        var nextTime = lastDate + cycle;
                                        var machineName = 'test';
                                        var maintenanceName = list[i].name;
                                        if(now >= nextTime) {
                                            //需要保养, 1:需要立即保养  0:接近保养日期
                                            maintenanceList.push({
                                                machine_id: machineId,
                                                workshop_id: workshopId,
                                                machine_name: machineName,
                                                maintenance_name: maintenanceName,
                                                maintenance_state: '需要立即保养',
                                                light: 'red',
                                            });
                                        } else if((7 * 24 * 60 * 60 + now) >= nextTime) {
                                            //接近保养日期
                                            maintenanceList.push({
                                                machine_id: machineId,
                                                workshop_id: workshopId,
                                                machine_name: machineName,
                                                maintenance_name: maintenanceName,
                                                maintenance_state: '接近保养日期',
                                                light: 'yellow',
                                            });
                                        }
                                    }
                                }
                            }
                        }
                        if(successCallback != undefined && typeof successCallback == 'function') {
                            successCallback();
                        }
                    },
                    error: function(xhr) {
                        console.log('获取已绑定的保养项出错：' + xhr.status);
                        if(errorCallback != undefined && typeof errorCallback == 'function') {
                            errorCallback();
                        }
                    }
                })
            }
           }
        }
    </script>
