package com.jyc.yz_control.utils;

import android.os.Environment;

import com.jyc.yz_control.JycApplication;

import java.util.UUID;

public class Constant {

    //门牌ip
    public static String SERVER_IP = "172.16.50.27";
    //门牌端口
    public static int SERVER_PORT = 13580;
    //mqtt连接地址
    public static String MQTT_HOST = "tcp://172.168.30.101:39201";
    //mqtt账户
    public static String MQTT_USERNAME = "";
    //mqtt密码
    public static String MQTT_PASSWORD = "";
    //web页面
    public static String WEB = "file:///android_asset/html/index_android.html";
    //终端名称
    public static String DEVICE_NAME = "";
    //工程时间
    public static String PROJECT_DATE = "";

    //不可修改数据
    //广播地址
    public final static String UDP_ADDRESS = "225.0.0.20";
    //广播端口
    public final static int UDP_PORT = 55555;
    //TCP监听端口
    public final static int BIND_PORT = 8888;
    //项目根路径
    public final static String PROJECT = JycApplication.context.getExternalFilesDir(null).getPath();
    //配置页面
    public final static String SETTING = "file:///android_asset/html/index_android.html";
    //mqtt订阅
    public final static String[] SUB_TOPIC = {"/jyc/control","/jyc/relay","/jyc/feedback","/jyc/heartbeatback","/jyc/reboot"};

    public final static int[] SUB_QOS = {2,2,2,2,2};
    public static String MQTT_ID;


}
