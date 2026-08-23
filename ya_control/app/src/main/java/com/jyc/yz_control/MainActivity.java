package com.jyc.yz_control;

import android.content.Context;
import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.util.Log;
import android.view.KeyEvent;
import android.view.MotionEvent;
import android.view.View;
import android.view.WindowManager;
import android.webkit.JsResult;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.core.view.WindowCompat;
import com.bumptech.glide.Glide;
import com.hjq.permissions.OnPermissionCallback;
import com.hjq.permissions.XXPermissions;
import com.judian.jdmusicsdk.presenter.JdPlayPresenter;
import com.jyc.yz_control.api.JsInteration;
import com.jyc.yz_control.mqtt.JycMqttClient;
import com.jyc.yz_control.mqtt.JycService;
import com.jyc.yz_control.netty.Netty;
import com.jyc.yz_control.utils.APKVersionCodeUtils;
import com.jyc.yz_control.utils.AdbUtil;
import com.jyc.yz_control.utils.Constant;
import com.jyc.yz_control.utils.Ini4jUtil;
import com.jyc.yz_control.utils.UiUtil;

import java.util.Date;
import java.util.List;

import cn.hutool.core.date.DateUnit;
import cn.hutool.core.date.DateUtil;
import cn.hutool.cron.CronUtil;
import cn.hutool.cron.task.Task;
import cn.hutool.http.HttpStatus;

public class MainActivity extends AppCompatActivity {

    private static JdPlayPresenter mPresenter;

    public static ConstraintLayout webpanel;
    //浏览器组件
    public static WebView wb;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
    //状态组件
    public static ConstraintLayout panel;
    public static ImageView loading;
    public static ImageView wifi;
    //心跳时间
    public static Date heartbeat;
//20212432
    //网络状态
    public static boolean network_status = false;

    public String[] permissions = {
        "android.permission.READ_MEDIA_IMAGES",
        "android.permission.READ_MEDIA_VIDEO",
        "android.permission.READ_MEDIA_AUDIO"
    };

    public static Context context;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        context = this;
        //全屏
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,WindowManager.LayoutParams.FLAG_FULLSCREEN);
        //隐藏导航条
        UiUtil.hideBottomUIMenu(this);
        //强制横屏
        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_SENSOR_LANDSCAPE);
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);

        //控件初始化
        wifi = findViewById(R.id.wifi);
        wifi.setZ(100.0f);
        wifi.setImageResource(R.drawable.nowifi);

        //
        panel = findViewById(R.id.panel);
        webpanel = findViewById(R.id.webpanel);
        wb = findViewById(R.id.web);

        //设置,右上角
        ImageButton setting = findViewById(R.id.setting);
        setting.setZ(100);
        setting.setOnLongClickListener(new View.OnLongClickListener() {
            @Override
            public boolean onLongClick(View v) {
//                wb.loadUrl(Constant.SETTING);
                return false;
            }
        });

        TextView version = findViewById(R.id.version);
        version.setZ(200);
        version.setText("v" + APKVersionCodeUtils.getVerName(this));

        //显示loading
        loading = findViewById(R.id.gif);
        Glide.with(this)
                .load("android.resource://"+getPackageName()+"/drawable/error")
                .into(loading);

        //申请读写权限
        XXPermissions.with(this)
        .permission(permissions)
        .request(new OnPermissionCallback() {
            @Override
            public void onGranted(@NonNull List<String> permissions, boolean allGranted) {
                if (!allGranted) {
                    System.out.println("获取部分权限成功，但部分权限未正常授予");
                    return;
                }
                Log.d("main","获取权限成功！");
                network_status = false;

                wb = findViewById(R.id.web);
                wb.setWebViewClient(new WebViewClient());
                wb.setWebChromeClient(new WebChromeClient(){
                    @Override
                    public boolean onJsAlert(WebView view, String url, String message, JsResult result) {
                        return super.onJsAlert(view, url, message, result);
                    }
                });

                // 设置允许访问文件数据
                wb.getSettings().setAllowFileAccess(true);
                wb.getSettings().setAllowContentAccess(true);
                wb.getSettings().setDomStorageEnabled(true);
                wb.getSettings().setDatabaseEnabled(true);
                wb.getSettings().setJavaScriptEnabled(true);//设置可以响应JS
                wb.addJavascriptInterface(new JsInteration(),"android");
                wb.loadUrl("file://" + Constant.PROJECT + "/html/" + Constant.WEB);
            }

            @Override
            public void onDenied(@NonNull List<String> permissions, boolean doNotAskAgain) {
                if (doNotAskAgain) {
                    System.out.println("被永久拒绝授权，请手动授予权限");
                } else {
                    System.out.println("获取权限失败");
                    android.os.Process.killProcess(android.os.Process.myPid());
                }
            }
        });

        //注册sdk
        mPresenter = JdPlayPresenter.getInstance();
        mPresenter.init(this);

        //心跳任务 10秒发送一次心跳
        CronUtil.schedule("*/10 * * * * *", new Task() {
            @Override
            public void execute() {
                JycMqttClient.send("/jyc/heartbeat", DateUtil.current() + "");
            }
        });

        //每天0点，12点重启设备
        CronUtil.schedule("0 0 0,8,12,18 * * ?", new Task() {
            @Override
            public void execute() {
                Intent intent = new Intent();
                intent.setAction("ACTION_RK_REBOOT");
                sendBroadcast(intent,null);
            }
        });

        //检测任务
        CronUtil.schedule("*/30 * * * * *", new Task() {
            @Override
            public void execute() {
                //全屏
                getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,WindowManager.LayoutParams.FLAG_FULLSCREEN);
                //隐藏导航条
                UiUtil.hideBottomUIMenu(MainActivity.this);
                if (MainActivity.heartbeat != null){
                    long second = DateUtil.between(heartbeat, new Date(), DateUnit.SECOND);
                    //大于5分钟
                    if (second > 300){
                        restartService();
                    }
                }else {
                    restartService();
                }
            }
        });


        // 支持秒级别定时任务
        CronUtil.setMatchSecond(true);
        CronUtil.start();

    }

    public void restartService(){
        if(JsInteration.service != null){
            JycApplication.context.stopService(JsInteration.service);
            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
            //重启service
            JsInteration.service = new Intent(JycApplication.context, JycService.class);
            JycApplication.context.startService(JsInteration.service);
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        //全屏
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,WindowManager.LayoutParams.FLAG_FULLSCREEN);
        //隐藏导航条
        UiUtil.hideBottomUIMenu(this);
    }

    @Override
    public void onDestroy() {
        //断开mqtt
        if(JsInteration.service != null){
            JycApplication.context.stopService(JsInteration.service);
        }
        System.exit(0);
        super.onDestroy();
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK && event.getRepeatCount() == 0) {
            return false;
        }
        return super.onKeyDown(keyCode, event);
    }

    //获取消息ui更新
    public static Handler handler = new Handler()
    {
        @Override
        public void handleMessage(Message msg) {
            super.handleMessage(msg);
            switch (msg.what)
            {
                case 11:
                    //网络恢复
                    network_status = true;
                    wifi.setImageResource(R.drawable.wifi);
                    wb.reload();
                    //
                    handler.postDelayed(()->{
                        webpanel.setZ(50.0f);
                        panel.setZ(40.0f);
                    },500);
                    break;
                case 12:
                    //网络异常
                    network_status = false;
                    wifi.setImageResource(R.drawable.nowifi);
                    //显示loading
                    panel.setZ(50.0f);
                    webpanel.setZ(40.0f);
                    break;
                case 13:
                    //刷新配置
                    Ini4jUtil.saveIni4j();
                    //断开门牌
                    Netty.bossGroup.shutdownGracefully();
                    //断开mqtt
                    if (JsInteration.service != null){
                        JycApplication.context.stopService(JsInteration.service);
                    }
                    JsInteration.ready = false;
                    //刷新
                    wb.loadUrl("file://" + Constant.PROJECT + "/html/" + Constant.WEB);
                    break;
                case 666:
                    network_status = true;
                    wifi.setImageResource(R.drawable.wifi);
                    webpanel.setZ(50.0f);
                    panel.setZ(40.0f);
                    break;
                case -1:
                    AdbUtil.adbcommand("reboot");
                    break;
                case 200:
                    wb.loadUrl("file://" + Constant.PROJECT + "/html/" + Constant.WEB);
                    break;
                default:
                    break;
            }
        }
    };


}