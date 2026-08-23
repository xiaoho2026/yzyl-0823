package com.jyc.yz_control.netty;

import java.util.List;

import io.netty.buffer.ByteBuf;
import io.netty.channel.ChannelHandlerContext;
import io.netty.handler.codec.ByteToMessageDecoder;

//解码器
public class DecoderHandler extends ByteToMessageDecoder {

    protected void decode(ChannelHandlerContext ctx, ByteBuf in, List<Object> out) throws Exception {
        in.markReaderIndex();
        int len = in.readInt();
        if(len > in.readableBytes()){
            in.resetReaderIndex();
            return;
        }
        byte[] data = new byte[len];
        //读取核心的数据
        in.readBytes(data);
        out.add(data);
    }
}
