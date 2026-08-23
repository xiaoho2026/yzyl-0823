package com.jyc.yz_control.mqtt;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.os.Build;
import android.os.IBinder;

import androidx.core.app.NotificationCompat;

import com.jyc.yz_control.MainActivity;
import com.jyc.yz_control.R;
import com.jyc.yz_control.api.JsInteration;
import com.jyc.yz_control.mqtt.JycMqttClient;
import com.jyc.yz_control.utils.Constant;

import java.util.List;
import java.util.UUID;

public class JycService extends Service {

    public static Context context;

    @Override
    public IBinder onBind(Intent intent) {
        // TODO: Return the communication channel to the service.
        throw new UnsupportedOperationException("Not yet implemented");
    }

    @Override
    public void onCreate() {
        context = this;
        // 创建前台服务通知
        // 创建通知渠道（Android 8.0+ 必需）
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    "mqtt", "mqtt_Service",
                    NotificationManager.IMPORTANCE_LOW
            );
            getSystemService(NotificationManager.class).createNotificationChannel(channel);
        }

        // 构建通知（Android 12+ 需指定 PendingIntent.FLAG_IMMUTABLE）
        Intent notificationIntent = new Intent(this, MainActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(
                this, 0, notificationIntent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        Notification notification = new NotificationCompat.Builder(this, "mqtt")
                .setContentTitle("MQTT服务运行中")
                .setContentText("正在监听MQTT消息任务...")
                .setSmallIcon(R.drawable.service)
                .setContentIntent(pendingIntent)
                .build();

        // 启动前台服务（ID 不可为 0）
        startForeground(1, notification);
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Constant.MQTT_ID = UUID.randomUUID().toString();
        JycMqttClient jycMqttClient = new JycMqttClient();
        jycMqttClient.init();
        jycMqttClient.Mqtt_connect();
        return START_STICKY;
    }

    @Override
    public void onDestroy() {
        try {
            //断开mqtt
            if (JycMqttClient.client != null){
                JycMqttClient.client.unsubscribe(Constant.SUB_TOPIC);//取消订阅
                JycMqttClient.client.disconnect();//关闭连接
                JycMqttClient.client.close();//关闭客户端
                JycMqttClient.client = null;
                JsInteration.service = null;
                MainActivity.heartbeat = null;
            }
        } catch (Exception e) {}
        super.onDestroy();
    }

}