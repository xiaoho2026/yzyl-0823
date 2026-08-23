package com.jyc.yz_control;

import android.app.Application;
import android.content.Context;
import android.os.yx.YxDeviceManager;

import com.jyc.yz_control.netty.Netty;
import com.jyc.yz_control.utils.Ini4jUtil;
import com.jyc.yz_control.utils.UiUtil;

public class JycApplication extends Application {

    public static Context context;
    public static YxDeviceManager yx;

    @Override
    public void onCreate() {
        super.onCreate();

        context = this;

        yx = YxDeviceManager.getInstance(this);
        //读取ini配置文件
        Ini4jUtil.initIni4j();

        //udp,tcp服务器
        Netty netty = new Netty();
        netty.tcpServer(); //tcp传输文件，配置参数
        netty.udpClient(); //udp发送ip信息
        netty.nettyClient(); //门牌连接
        netty.sendHeartBeat();//门牌心跳

    }

}