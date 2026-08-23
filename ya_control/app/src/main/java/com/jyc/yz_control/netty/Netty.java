package com.jyc.yz_control.netty;

import android.util.Log;

import com.alibaba.fastjson.JSONObject;
import com.jyc.yz_control.JycApplication;
import com.jyc.yz_control.utils.APKVersionCodeUtils;
import com.jyc.yz_control.utils.Constant;
import com.jyc.yz_control.utils.UiUtil;
import java.net.DatagramPacket;
import java.net.InetAddress;
import java.net.MulticastSocket;
import java.nio.charset.StandardCharsets;
import java.util.Timer;
import java.util.TimerTask;
import java.util.concurrent.TimeUnit;
import cn.hutool.core.thread.ThreadUtil;
import io.netty.bootstrap.Bootstrap;
import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.Channel;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelOption;
import io.netty.channel.ChannelPipeline;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import io.netty.channel.socket.nio.NioSocketChannel;
import io.netty.handler.timeout.IdleStateHandler;

public class Netty {

    public static Channel channel = null;
    public static EventLoopGroup bossGroup = null;

    public void tcpServer() {
        ThreadUtil.execAsync(() ->{
            EventLoopGroup bossGroup=new NioEventLoopGroup();
            EventLoopGroup  workerGroup=new NioEventLoopGroup();
            try {
                ServerBootstrap serverBootstrap = new ServerBootstrap();
                serverBootstrap
                        .group(bossGroup,workerGroup)
                        .channel(NioServerSocketChannel.class)
                        .option(ChannelOption.SO_BACKLOG,1024)
                        .option(ChannelOption.SO_KEEPALIVE, true)  // 设置连接状态行为, 保持连接状态
                        .option(ChannelOption.TCP_NODELAY,true)
                        .option(ChannelOption.SO_RCVBUF,1024*1024)
                        .option(ChannelOption.SO_SNDBUF,1024*1024)
                        .childHandler(new ChannelInitializer() {
                            @Override
                            protected void initChannel(Channel channel) throws Exception {
                                ChannelPipeline pipeline = channel.pipeline();
                                pipeline.addLast("decode", new DecoderHandler());//解码器，接收消息时候用
                                pipeline.addLast(new NettyServerHandler());
                            }
                        });
                ChannelFuture channelFuture= serverBootstrap.bind(Constant.BIND_PORT).sync();
                channelFuture.channel().closeFuture().sync();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }finally {
                bossGroup.shutdownGracefully();
                workerGroup.shutdownGracefully();
            }
        });
    }

    public void udpClient() {
        ThreadUtil.execAsync(()->{
            while (true){
//                try {
//                    InetAddress inetAddress = InetAddress.getByName(Constant.UDP_ADDRESS);
//                    DatagramSocket datagramSocketSend = new DatagramSocket();
//                    JSONObject json = new JSONObject();
//                    json.put("type",0);//表示搜索
//                    json.put("name",Constant.DEVICE_NAME);
//                    json.put("ip", UiUtil.getIpAddress(JycApplication.context));
//                    json.put("sn",UiUtil.getDEVICE_ID(JycApplication.context));
//                    json.put("version", APKVersionCodeUtils.getVerName(JycApplication.context));
//                    json.put("date", Constant.PROJECT_DATE);
//                    byte[] data = json.toJSONString().getBytes(StandardCharsets.UTF_8);
//                    java.net.DatagramPacket datagramPacket = new DatagramPacket(data, data.length, inetAddress,Constant.UDP_PORT);
//                    datagramSocketSend.send(datagramPacket);
//                    // 发送设置为广播
//                    datagramSocketSend.setBroadcast(true);
//                    datagramSocketSend.close();
//                    Thread.sleep(3000);
//                } catch (Exception e) {
//                    e.printStackTrace();
//                }
                try {
                    //udp组播发送数据
                    MulticastSocket multicastSocket = new MulticastSocket(Constant.UDP_PORT);
                    InetAddress group = InetAddress.getByName(Constant.UDP_ADDRESS);
                    multicastSocket.joinGroup(group);
                    JSONObject json = new JSONObject();
                    json.put("type",0);//表示搜索
                    json.put("name",Constant.DEVICE_NAME);
                    json.put("ip", UiUtil.getIpAddress(JycApplication.context));
                    json.put("sn",UiUtil.getDEVICE_ID(JycApplication.context));
                    json.put("version", APKVersionCodeUtils.getVerName(JycApplication.context));
                    json.put("date", Constant.PROJECT_DATE);
                    byte[] data = json.toJSONString().getBytes(StandardCharsets.UTF_8);
                    DatagramPacket packet = new DatagramPacket(data, data.length, group, 55555);
                    multicastSocket.send(packet);
                    Thread.sleep(5000);
                } catch (Exception e) {
                    e.printStackTrace();
                }

            }
        });
    }

    public void nettyClient() {
        ThreadUtil.execAsync(()->{
            bossGroup = new NioEventLoopGroup();
            try {
                Bootstrap bootstrap = new Bootstrap();
                Thread.sleep(2500);
                bootstrap
                        .group(bossGroup)
                        .channel(NioSocketChannel.class)
                        .option(ChannelOption.SO_BACKLOG,1024)
                        .option(ChannelOption.SO_RCVBUF, 1024 * 1024)
                        .option(ChannelOption.SO_SNDBUF, 1024 * 1024)
                        .option(ChannelOption.SO_REUSEADDR, true)
                        .option(ChannelOption.TCP_NODELAY, true)
                        .handler(new ChannelInitializer<Channel>() {
                            @Override
                            protected void initChannel(Channel channel) throws Exception {
                                ChannelPipeline pipeline = channel.pipeline();
                                pipeline.addLast("decode", new DecoderHandler());//解码器，接收消息时候用
                                pipeline.addLast(new IdleStateHandler(10, 0, 0, TimeUnit.SECONDS));
                                pipeline.addLast(new NettyClientHandler());
                            }
                        });
                ChannelFuture channelFuture = bootstrap.connect(Constant.SERVER_IP, Constant.SERVER_PORT).sync();
                Log.e("Netty", "连接成功！");
                channelFuture.channel().closeFuture().sync();
            }catch (Exception e){
                Log.e("Netty", e.toString());
            }finally {
                Log.e("Netty", "重启NettyClient");
                bossGroup.shutdownGracefully();
                nettyClient();
            }
        });
    }

    //心跳
    public void sendHeartBeat(){
        //每2秒执行一次
        Timer timer = new Timer();
        TimerTask timerTask = new TimerTask() {
            @Override
            public void run() {
                NettyClientHandler.send("ping");
            }
        };
        timer.schedule(timerTask, 0, 2000);
    }


}
