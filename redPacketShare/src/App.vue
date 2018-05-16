<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: "App",
    methods:{
    fonts(){
       if (typeof(WeixinJSBridge) == "undefined") {  
        document.addEventListener("WeixinJSBridgeReady", function (e) {  
            setTimeout(function(){  
                WeixinJSBridge.invoke('setFontSizeCallback',{"fontSize":0}, function(res) {  
                    // alert(JSON.stringify(res));  
                });  
            },0);  
        });  
    } else {  
        setTimeout(function(){  
            WeixinJSBridge.invoke('setFontSizeCallback',{"fontSize":0}, function(res) {  
                // alert(JSON.stringify(res));  
            });  
        },0);  
    }  
    }
  },
  mounted(){
    this.fonts();
  }
};
</script>

<style>
body{
/* IOS禁止微信内置浏览器调整字体大小 */
  -webkit-text-size-adjust: 100% !important;
  text-size-adjust: 100% !important;
  -moz-text-size-adjust: 100% !important;
}
</style>
