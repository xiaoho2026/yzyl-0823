package com.jyc.yz_control.utils;

import org.ini4j.Wini;

import java.io.File;
import java.io.IOException;

public class Ini4jUtil {

    private static Wini read(String fileName){
        File file = new File(fileName);
        if(!file.exists()) {
            //bucz
            return null;
        }else {
            Wini ini = null;
            try {
                ini = new Wini(file);
            } catch (IOException e) {
                e.printStackTrace();
            }
            return ini;
        }
    }

    private static Wini write(String fileName){
        File file = new File(fileName);
        if(!file.exists()) {
            try {
                file.createNewFile();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        Wini ini = null;
        try {
            ini = new Wini(file);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return ini;
    }

    public static void initIni4j(){
        try{
            Wini read = read(Constant.PROJECT + "/conf.ini");
            if(read!=null){
                Constant.SERVER_IP = read.get("系统配置", "server_ip");
                Constant.SERVER_PORT = Integer.parseInt(read.get("系统配置", "server_port"));
                Constant.MQTT_HOST = read.get("系统配置", "mqtt_host");
                Constant.MQTT_USERNAME = read.get("系统配置", "mqtt_username");
                Constant.MQTT_PASSWORD = read.get("系统配置", "mqtt_password");
                Constant.WEB = read.get("系统配置", "web");
                Constant.DEVICE_NAME = read.get("系统配置", "device_name");
                Constant.PROJECT_DATE = read.get("系统配置", "project_date");
            }
        }catch (Exception e){}
    }

    public static void saveIni4j(){
        try{
            Wini write = write(Constant.PROJECT + "/conf.ini");
            if(write!=null){
                write.add("系统配置","server_ip",Constant.SERVER_IP);
                write.add("系统配置","server_port",Constant.SERVER_PORT);
                write.add("系统配置","mqtt_host",Constant.MQTT_HOST);
                write.add("系统配置","mqtt_username",Constant.MQTT_USERNAME);
                write.add("系统配置","mqtt_password",Constant.MQTT_PASSWORD);
                write.add("系统配置","web",Constant.WEB);
                write.add("系统配置","device_name",Constant.DEVICE_NAME);
                write.add("系统配置","project_date",Constant.PROJECT_DATE);
                write.store();
            }
        }catch (Exception e){}
    }

}
