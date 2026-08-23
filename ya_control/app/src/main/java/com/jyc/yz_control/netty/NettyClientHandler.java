package com.jyc.yz_control.netty;

import android.util.Log;
import com.jyc.yz_control.MainActivity;
import java.nio.ByteBuffer;
import io.netty.buffer.Unpooled;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelInboundHandlerAdapter;
import io.netty.handler.timeout.IdleState;
import io.netty.handler.timeout.IdleStateEvent;

//和门牌通讯
public class NettyClientHandler extends ChannelInboundHandlerAdapter {

    /**
     * 连接建立的完成
     * @param ctx
     * @throws Exception
     */
    @Override
    public void channelActive(ChannelHandlerContext ctx) throws Exception {
        Netty.channel = ctx.channel();
    }

    /**
     * 读取数据
     * @param ctx
     * @param msg
     * @throws Exception
     */
    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
        byte[] bytes = (byte[]) msg;
        String str = new String(bytes);
        if (str.equals("pong")){
            return;
        }
    }


    /**
     * 异常
     * @param ctx
     * @param cause
     * @throws Exception
     */
    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) throws Exception {
        cause.printStackTrace();
    }

    @Override
    public void channelInactive(ChannelHandlerContext ctx) throws Exception {
        Log.e("NettyClientHandler", "连接断开！");
        Netty.channel = null;
        super.channelInactive(ctx);
    }

    //心跳超时
    @Override
    public void userEventTriggered(ChannelHandlerContext ctx, Object evt) throws Exception {
        super.userEventTriggered(ctx, evt);
        if (evt instanceof IdleStateEvent) {
            IdleState state = ((IdleStateEvent) evt).state();
            if (state == IdleState.READER_IDLE && MainActivity.network_status) {
                Log.e("NettyClientHandler", "心跳超时！");
                ctx.close();
            }
        } else {
            super.userEventTriggered(ctx, evt);
        }
    }

    public static void send(String data){
        if (Netty.channel == null){
            return;
        }
        byte[] msg = data.getBytes();
        int length = msg.length;
        ByteBuffer Bb = ByteBuffer.allocate(length + 4);
        Bb.putInt(length);          //添加消息字节长度的长度到缓存
        Bb.put(msg);                //添加信息数据
        Bb.flip();                  //进行读写位置翻转
        Netty.channel.writeAndFlush(Unpooled.copiedBuffer(Bb));
    }



}
