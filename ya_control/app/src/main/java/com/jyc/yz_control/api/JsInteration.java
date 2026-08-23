package com.jyc.yz_control.api;

import android.content.Intent;
import android.os.Handler;
import android.os.Looper;
import android.webkit.JavascriptInterface;

import com.alibaba.fastjson.JSONObject;
import com.jyc.yz_control.JycApplication;
import com.jyc.yz_control.MainActivity;
import com.jyc.yz_control.mqtt.JycMqttClient;
import com.jyc.yz_control.mqtt.JycService;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import cn.hutool.core.thread.ThreadUtil;
import cn.hutool.core.util.StrUtil;

public class JsInteration {

    public static boolean ready = false;

    public static List<String> jdqs = new ArrayList();

    public static Intent service = null;

    @JavascriptInterface
    public void relay(String id,boolean status) throws Exception {
        //控制继电器
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("id","judianRelayId-" + id);
        jsonObject.put("powerStatus",status);
        Intent intent = new Intent();
        intent.setAction("com.judian.broadcast.relay.control");
        intent.putExtra("relay", jsonObject.toJSONString());
        JycApplication.context.sendBroadcast(intent);
    }

    @JavascriptInterface
    public void sync(String data) throws InterruptedException {
        if (!ready){
            ready = true;
            //创建server
            service = new Intent(JycApplication.context, JycService.class);
            JycApplication.context.startService(service);
        }else {
            ThreadUtil.execute(() -> {
                JycMqttClient.send("/jyc/getData",new JSONObject().toJSONString());
            });
        }
        if(StrUtil.isNotBlank(data)){
            String[] split = data.split(",");
            jdqs = Arrays.asList(split);
        }

    }

    //希之望灯带
    @JavascriptInterface
    public void updateHopeLightBarColor(int id) {
        HopeJs hopeJs = new HopeJs();
        hopeJs.updateLightBarColor(id);
    }

    //mqtt发送控制
    @JavascriptInterface
    public void sendMqtt(String data) {
        JycMqttClient.send("/jyc/control",data);
    }


}
