package com.jyc.yz_control.utils;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Handler;
import android.os.Looper;
import com.jyc.yz_control.MainActivity;
import com.jyc.yz_control.netty.NettyClientHandler;

public class SwitchReceiver extends BroadcastReceiver {

    /*
    * S10带旋钮：
    * judian.intent.action.key1   //旋钮按下true,抬起flase
    * judian.intent.action.key2   //旋钮上方按键按下true,抬起flase
    * judian.intent.action.key3   //旋钮下方按键按下true,抬起flase
    * judian.intent.action.key4   //旋钮开始旋转true,结束旋转false
    *
    * M10不带旋钮，三个按键：
    * judian.intent.action.key1   //最上面按键1触发
    * judian.intent.action.key2   //中间按键2触发
    * judian.intent.action.key3   //最下面按键3触发
    * */
    @Override
    public void onReceive(Context context, Intent intent) {
        final String key = intent.getAction();
        final boolean pressed = intent.getBooleanExtra("down", false);
        if (!pressed){
            if(key.equals("judian.intent.action.key1")){
                //第一个按键，场景1
                //回调接口
                new Handler(Looper.getMainLooper()).post(new Runnable() {
                    @Override
                    public void run() {
                        //向前端页面发送数据
                        MainActivity.wb.evaluateJavascript("javascript:control_jdq('1')", null);
                    }
                });
            } else if(key.equals("judian.intent.action.key2")){
                //第二个按键
                new Handler(Looper.getMainLooper()).post(new Runnable() {
                    @Override
                    public void run() {
                        //向前端页面发送数据
                        MainActivity.wb.evaluateJavascript("javascript:control_jdq('2')", null);
                    }
                });
            } else if(key.equals("judian.intent.action.key3")){
                //第三个按键
                NettyClientHandler.send("opendoor");
            }

        }

    }
}