package com.jyc.yz_control.netty;

import android.content.ComponentName;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;

import androidx.core.content.FileProvider;

import com.alibaba.fastjson.JSONObject;
import com.jyc.yz_control.JycApplication;
import com.jyc.yz_control.MainActivity;
import com.jyc.yz_control.utils.Constant;
import com.jyc.yz_control.utils.UiUtil;

import java.io.File;
import java.nio.ByteBuffer;
import java.nio.charset.Charset;

import cn.hutool.core.date.DateUtil;
import cn.hutool.core.io.FileUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.core.util.ZipUtil;
import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import io.netty.channel.Channel;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelInboundHandlerAdapter;
import io.netty.util.CharsetUtil;

public class NettyServerHandler extends ChannelInboundHandlerAdapter {

    //连接建立的完成
    @Override
    public void channelActive(ChannelHandlerContext ctx) throws Exception {
        super.channelActive(ctx);
    }

    //接收数据
    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
        byte[] bytes = (byte[]) msg;
        ByteBuf buf = Unpooled.copiedBuffer(bytes);
        int type = buf.readInt();
        if (type == 1){
            String str = buf.toString(CharsetUtil.UTF_8);
            //参数读取,设置
            if(str.equals("getConfig")){
                JSONObject json = new JSONObject();
                json.put("mqtt_host", Constant.MQTT_HOST);
                json.put("mqtt_username", Constant.MQTT_USERNAME);
                json.put("mqtt_password", Constant.MQTT_PASSWORD);
                json.put("server_ip", Constant.SERVER_IP);
                json.put("server_port", Constant.SERVER_PORT);
                json.put("web", Constant.WEB);
                json.put("device_name", Constant.DEVICE_NAME);
                send(json.toJSONString(),ctx.channel());
            }
        }
        if (type == 2){
            //工程下发
            FileUtil.writeBytes(buf.array(), new File(Constant.PROJECT + "/project.zip"),4,buf.array().length - 4,false);
            //解压
            ZipUtil.unzip(Constant.PROJECT + "/project.zip", Constant.PROJECT + "/html/",Charset.forName("GBK"));
            MainActivity.handler.sendEmptyMessage(200);
            //修改工程下载时间
            Constant.PROJECT_DATE = DateUtil.now();
            MainActivity.handler.sendEmptyMessage(13);
        }
        if (type == 3){
            //软件更新
            FileUtil.writeBytes(buf.array(), new File(Constant.PROJECT + "/update.apk"),4,buf.array().length - 4,false);
            String cpuTemperature = JycApplication.yx.getCPUTemperature();
            if (StrUtil.isNotEmpty(cpuTemperature)){
                //10寸智绘源，自动更新
                JycApplication.yx.silentInstallApk(Constant.PROJECT + "/update.apk", true);
            }else {
                String jdq = UiUtil.readFile("/sys/xfocus/xpower/relay1");
                String did = UiUtil.getDid();
                if (StrUtil.isNotEmpty(jdq)){
                    //声必可4寸
                    Intent intent = new Intent();
                    intent.setAction("JD.intent.action.INSTALL_PACKAGE");
                    intent.putExtra("APK_FILE", Constant.PROJECT + "/update.apk");
                    ComponentName componentName = new ComponentName("com.android.packageinstaller", "com.android.packageinstaller.JDSlienceInstallService");
                    intent.setComponent(componentName);
                    JycApplication.context.startService(intent);
                }else if (StrUtil.isNotEmpty(did) && !did.equals("UNKONW")){
                    //4寸智慧园
                    Intent intent=new Intent();
                    intent.setAction("ACTION_UPDATE_START");
                    intent.putExtra("path", Constant.PROJECT + "/update.apk");
                    MainActivity.context.sendBroadcast(intent,null);
                }else{
                    //其他
                    File apk = new File(Constant.PROJECT + "/update.apk");
                    Intent intent = new Intent(Intent.ACTION_VIEW);
                    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.N){
                        intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                        Uri uri = FileProvider.getUriForFile(JycApplication.context, "com.jyc.yz_control.fileprovider", apk);
                        intent.setDataAndType(uri, "application/vnd.android.package-archive");
                    }else{
                        intent.setDataAndType(Uri.fromFile(apk),"application/vnd.android.package-archive");
                    }
                    JycApplication.context.startActivity(intent);
                }

            }

        }
        if (type == 4){
            String str = buf.toString(CharsetUtil.UTF_8);
            //配置更新
            JSONObject config = JSONObject.parseObject(str);
            Constant.MQTT_HOST = config.containsKey("mqtt_host") ? config.getString("mqtt_host") : Constant.MQTT_HOST;
            Constant.MQTT_USERNAME = config.containsKey("mqtt_username") ? config.getString("mqtt_username") : Constant.MQTT_USERNAME;
            Constant.MQTT_PASSWORD = config.containsKey("mqtt_password") ? config.getString("mqtt_password") : Constant.MQTT_PASSWORD;
            Constant.SERVER_IP = config.containsKey("server_ip") ? config.getString("server_ip") : Constant.SERVER_IP;
            Constant.SERVER_PORT = config.containsKey("server_port") ? config.getIntValue("server_port") : Constant.SERVER_PORT;
            Constant.WEB = config.containsKey("web") ? config.getString("web") : Constant.WEB;
            Constant.DEVICE_NAME = config.containsKey("device_name") ? config.getString("device_name") : Constant.DEVICE_NAME;
            MainActivity.handler.sendEmptyMessage(13);
        }

    }

    //异常
    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) throws Exception {
        cause.printStackTrace();
    }

    //断开连接
    @Override
    public void channelInactive(ChannelHandlerContext ctx) throws Exception {
        super.channelInactive(ctx);
    }

    //发送信息
    public static void send(String data, Channel ctx) {
        //加密
        byte[] msg = data.getBytes();
        int length = msg.length;
        ByteBuffer Bb = ByteBuffer.allocate(length + 4);
        Bb.putInt(length);          //添加消息字节长度的长度到缓存
        Bb.put(msg);                //添加信息数据
        Bb.flip();                  //进行读写位置翻转
        ctx.writeAndFlush(Unpooled.copiedBuffer(Bb));
    }


}
