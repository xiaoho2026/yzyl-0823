package com.jyc.yz_control.utils;

import android.content.Context;
import android.content.pm.PackageManager;

public class APKVersionCodeUtils {
   /**
    * 获取当前本地apk的版本号
    *
    * @param mContext 上下文
    * @return 版本号
    */
   public static String getVersionCode(Context mContext) {
       String versionCode = "";
       try {
           versionCode = mContext.getPackageManager()
                   .getPackageInfo(mContext.getPackageName(), 0).versionCode +"";
       } catch (PackageManager.NameNotFoundException e) {
           e.printStackTrace();
       }
       return versionCode;
   }
   /**
    * 获取版本号名称
    *
    * @param context 上下文
    * @return 版本名称
    */
   public static String getVerName(Context context) {
       String verName = "";
       try {
           verName = context.getPackageManager()
                   .getPackageInfo(context.getPackageName(), 0).versionName;
       } catch (PackageManager.NameNotFoundException e) {
           e.printStackTrace();
       }
       return verName;
   }
}