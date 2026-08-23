package com.jyc.yz_control.api;

import static com.jyc.yz_control.utils.AdbUtil.adbcommand;

//希之望门牌 对webview提供api
public class HopeJs {

    public void updateLightBarColor(int id){
        switch (id){
            case 0:
                adbcommand("echo w 0x00 > ./sys/devices/platform/led_con_h/zigbee_reset");
                break;
            case 1:
                adbcommand("echo w 0x01 > ./sys/devices/platform/led_con_h/zigbee_reset");
                break;
            case 2:
                adbcommand("echo w 0x02 > ./sys/devices/platform/led_con_h/zigbee_reset");
                break;
            case 3:
                adbcommand("echo w 0x03 > ./sys/devices/platform/led_con_h/zigbee_reset");
                break;
            case 4:
                adbcommand("echo w 0x04 > ./sys/devices/platform/led_con_h/zigbee_reset");
                break;
            case 5:
                adbcommand("echo w 0x05 > ./sys/devices/platform/led_con_h/zigbee_reset");
                break;
            case 6:
                adbcommand("echo w 0x06 > ./sys/devices/platform/led_con_h/zigbee_reset");
                break;
            case 7:
                adbcommand("echo w 0x07 > ./sys/devices/platform/led_con_h/zigbee_reset");
                break;
            case 8:
                adbcommand("echo w 0x08 > ./sys/devices/platform/led_con_h/zigbee_reset");
                break;
            case 9:
                adbcommand("echo w 0x09 > ./sys/devices/platform/led_con_h/zigbee_reset");
                break;
            case 10:
                adbcommand("echo w 0x0a > ./sys/devices/platform/led_con_h/zigbee_reset");
                break;
            case 11:
                adbcommand("echo w 0x0b > ./sys/devices/platform/led_con_h/zigbee_reset");
                break;
            case 12:
                adbcommand("echo w 0x0c > ./sys/devices/platform/led_con_h/zigbee_reset");
                break;
            case 13:
                adbcommand("echo w 0x0d > ./sys/devices/platform/led_con_h/zigbee_reset");
                break;
            case 14:
                adbcommand("echo w 0x0e > ./sys/devices/platform/led_con_h/zigbee_reset");
                break;
            case 15:
                adbcommand("echo w 0x0f > ./sys/devices/platform/led_con_h/zigbee_reset");
                break;
            case 16:
                adbcommand("echo w 0x10 > ./sys/devices/platform/led_con_h/zigbee_reset");
                break;
            case 17:
                adbcommand("echo w 0x11 > ./sys/devices/platform/led_con_h/zigbee_reset");
                break;
            case 18:
                adbcommand("echo w 0x12 > ./sys/devices/platform/led_con_h/zigbee_reset");
                break;
            case 19:
                adbcommand("echo w 0x13 > ./sys/devices/platform/led_con_h/zigbee_reset");
                break;
            case 20:
                adbcommand("echo w 0x14 > ./sys/devices/platform/led_con_h/zigbee_reset");
                break;
            case 21:
                adbcommand("echo w 0x15 > ./sys/devices/platform/led_con_h/zigbee_reset");
                break;
            case 22:
                adbcommand("echo w 0x16 > ./sys/devices/platform/led_con_h/zigbee_reset");
                break;
            case 23:
                adbcommand("echo w 0x17 > ./sys/devices/platform/led_con_h/zigbee_reset");
                break;
            default:
                break;
        }

    }
}
