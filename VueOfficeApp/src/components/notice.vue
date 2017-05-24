<template>
	<div id="app">
		<div class="content">
	        <h3 class="col-xs-12 text-center"></h3>
	        <p class="col-xs-12" style="text-indent:2em;"></p>
	    </div>
	</div>
</template>
<script type="text/javascript">
	 export default {
            data(){
              return {}
          },
          mounted:function(){
          	var id = this.$parent.ID;
	        $.ajax({
	            type: 'GET',
	            url: requestBaseUrl + 'companies/notices/' + id,
	            headers: {
	                'Authorization': 'Bearer '+ getToken()
	            },
	            success: function(response) {
	                if(response.status == 10001) {
	                    $('h3').text(response.data.title);
	                    $('p').text(response.data.content);
	                }else{
	                    $.toast('加载公告信息失败');    
	                }
	            },
	            error: function(jqXHR, textStatus, errorThrown) {
	                $.toast('加载公告信息失败');
	            }
	        })
          }
      }
</script>