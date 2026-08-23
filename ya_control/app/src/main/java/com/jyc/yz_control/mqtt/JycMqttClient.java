package com.jyc.yz_control.mqtt;

import android.content.Intent;
import android.os.Handler;
import android.os.Looper;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.jyc.yz_control.JycApplication;
import com.jyc.yz_control.MainActivity;
import com.jyc.yz_control.api.JsInteration;
import com.jyc.yz_control.utils.AdbUtil;
import com.jyc.yz_control.utils.Constant;
import com.jyc.yz_control.utils.UiUtil;

import org.eclipse.paho.android.service.MqttAndroidClient;
import org.eclipse.paho.client.mqttv3.IMqttActionListener;
import org.eclipse.paho.client.mqttv3.IMqttDeliveryToken;
import org.eclipse.paho.client.mqttv3.IMqttToken;
import org.eclipse.paho.client.mqttv3.MqttCallbackExtended;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;

import java.util.Date;

import cn.hutool.core.thread.ThreadUtil;

public class JycMqttClient {
    public static MqttAndroidClient client;
    private MqttConnectOptions options;

    public void init() {
        try {
            //host为主机名，test为clientid即连接MQTT的客户端ID，一般以客户端唯一标识符表示，MemoryPersistence设置clientid的保存形式，默认为以内存保存
            client = new MqttAndroidClient(JycService.context ,Constant.MQTT_HOST, Constant.MQTT_ID);
            //MQTT的连接设置
            options = new MqttConnectOptions();
            //设置是否清空session,这里如果设置为false表示服务器会保留客户端的连接记录，这里设置为true表示每次连接到服务器都以新的身份连接
            options.setCleanSession(true);
            //设置连接的用户名
            options.setUserName(Constant.MQTT_USERNAME);
            //设置连接的密码
            options.setPassword(Constant.MQTT_PASSWORD.toCharArray());
            // 设置超时时间 单位为秒
            options.setConnectionTimeout(10);
            // 设置会话心跳时间 单位为秒
            options.setKeepAliveInterval(20);
            //自动重连
            options.setAutomaticReconnect(true);
            //设置回调
            client.setCallback(new MqttCallbackExtended() {
                @Override
                public void connectComplete(boolean reconnect, String serverURI) {
                    //重新订阅
                    try {
                        client.subscribe(Constant.SUB_TOPIC,Constant.SUB_QOS);
                    } catch (MqttException e) {
                        throw new RuntimeException(e);
                    }
                    //订阅后，恢复正常UI
                    MainActivity.handler.sendEmptyMessage(11);
                }

                @Override
                public void connectionLost(Throwable cause) {
                    //连接丢失后，一般在这里面进行重连
                    MainActivity.handler.sendEmptyMessage(12);
                }

                @Override
                public void deliveryComplete(IMqttDeliveryToken token) {
                    //publish后会执行到这里
//                    System.out.println("deliveryComplete---------" + token.isComplete());
                }

                @Override
                public void messageArrived(String topicName, MqttMessage message) throws Exception {
                    //subscribe后得到的消息会执行到这里面
                    if (topicName.equals("/jyc/control") || topicName.equals("/jyc/feedback")) {
                        String msg = message.toString();
                        //推送js
                        new Handler(Looper.getMainLooper()).post(new Runnable() {
                            @Override
                            public void run() {
                                //向前端页面发送数据
                                MainActivity.wb.evaluateJavascript("javascript:setData('"+ msg +"')", null);
                            }
                        });
                    }
                    if (topicName.equals("/jyc/relay")) {
                        //执行继电器
                        String msg = message.toString();
                        JSONArray msgarr = JSONArray.parseArray(msg);
                        for (Object o : msgarr) {
                            JSONObject msgjson = JSONObject.parseObject(o.toString());
                            String sn = msgjson.getString("sn");
                            if(JsInteration.jdqs.contains(sn)){
                                JSONObject jsonObject = new JSONObject();
                                jsonObject.put("id","judianRelayId-" + msgjson.getString("id"));
                                jsonObject.put("powerStatus",msgjson.getBooleanValue("status"));
                                Intent intent = new Intent();
                                intent.setAction("com.judian.broadcast.relay.control");
                                intent.putExtra("relay", jsonObject.toJSONString());
                                JycApplication.context.sendBroadcast(intent);
                            }
                        }
                    }

                    if (topicName.equals("/jyc/heartbeatback")) {
                        //心跳返回
                        MainActivity.heartbeat = new Date();
                    }
                    if (topicName.equals("/jyc/reboot")) {
                        //重启
                        Intent intent = new Intent();
                        intent.setAction("ACTION_RK_REBOOT");
                        MainActivity.context.sendBroadcast(intent,null);
                    }
                }
            });
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void Mqtt_connect() {
        try {
            if (!client.isConnected()){
                client.connect(options);
            }
        }catch (Exception e){
            e.printStackTrace();
        }
    }

    public static void send(String topic,String mes) {
        if (client == null || !client.isConnected()) {
            return;
        }
        MqttMessage message = new MqttMessage();
        message.setPayload(mes.getBytes());
        try {
            client.publish(topic,message);
        } catch (MqttException e) {
            e.printStackTrace();
        }

    }





}
