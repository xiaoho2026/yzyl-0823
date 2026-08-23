package com.jyc.yz_control.utils;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import com.jyc.yz_control.MainActivity;

//开机自启动广播接受
public class Self extends BroadcastReceiver {
    static final String action_boot ="android.intent.action.BOOT_COMPLETED";

    @Override
    public void onReceive(Context context, Intent intent) {
        if (intent.getAction().equals(action_boot)){
            Intent sayHelloIntent=new Intent(context, MainActivity.class);
            sayHelloIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            context.startActivity(sayHelloIntent);
        }
    }

}
