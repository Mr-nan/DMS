package com.dms.custom.bluetooths;

import android.annotation.SuppressLint;
import android.util.Log;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 * Created by thinkpad on 2016/7/14.
 */
public class Transformation {


    //DATA_LIST中的数据是[-1, 36, 41, 0, 0, 0, 0, 2, 0, 0, 0, 0, 6, 1, 14, 48, 0, -30, 0, 100, 63, 23, 11, -17, 49, 104, 120, 79, -68, -30, 0, 52, 20, 1, 29, 1, 1, 104, 120, 79, -68, 80, -90, -1, 36, 41, 0, 0, 0, 0, 2, 0, 0, 0, 0, 6, 1, 14, 48, 0, -30, 0, 100, 63, 23, 11, -17, 49, 104, 120, 79, -68, -30, 0, 52, 20, 1, 29, 1, 1, 104, 120, 79]
    private static CopyOnWriteArrayList<Byte> DATA_LIST;
    private static int[] crcTable = new int[]{0, 4129, 8258, 12387, 16516, 20645, 24774, 28903, '脈', '鄩', 'ꅊ', '녫', '소', '톭', '\ue1ce', '\uf1ef'};

    static class Message {
        byte[] data;
        int writeIndex;
        int readIndex;

        Message() {
            this(256);
        }

        Message(int size) {
            this.data = new byte[size];
            this.writeIndex = 2;
        }

        void setu8(int val) {
            this.data[this.writeIndex++] = (byte) (val & 255);
        }

        void setu16(int val) {
            this.data[this.writeIndex++] = (byte) (val >> 8 & 255);
            this.data[this.writeIndex++] = (byte) (val >> 0 & 255);
        }

        void setu32(int val) {
            this.data[this.writeIndex++] = (byte) (val >> 24 & 255);
            this.data[this.writeIndex++] = (byte) (val >> 16 & 255);
            this.data[this.writeIndex++] = (byte) (val >> 8 & 255);
            this.data[this.writeIndex++] = (byte) (val >> 0 & 255);
        }

        void setbytes(byte[] array) {
            if (array != null) {
                this.setbytes(array, 0, array.length);
            }

        }

        void setbytes(byte[] array, int start, int length) {
            System.arraycopy(array, start, this.data, this.writeIndex, length);
            this.writeIndex += length;
        }

        int getu8() {
            return this.getu8at(this.readIndex++);
        }

        int getu16() {
            int val = this.getu16at(this.readIndex);
            this.readIndex += 2;
            return val;
        }

        int getu24() {
            int val = this.getu24at(this.readIndex);
            this.readIndex += 3;
            return val;
        }

        int getu32() {
            int val = this.getu32at(this.readIndex);
            this.readIndex += 4;
            return val;
        }

        void getbytes(byte[] destination, int length) {
            System.arraycopy(this.data, this.readIndex, destination, 0, length);
            this.readIndex += length;
        }

        int getu8at(int offset) {
            return this.data[offset] & 255;
        }

        int getu16at(int offset) {
            return (this.data[offset] & 255) << 8 | (this.data[offset + 1] & 255) << 0;
        }

        int getu24at(int offset) {
            return (this.data[offset] & 255) << 16 | (this.data[offset + 1] & 255) << 8 | (this.data[offset + 0] & 255) << 0;
        }

        int getu32at(int offset) {
            return (this.data[offset] & 255) << 24 | (this.data[offset + 1] & 255) << 16 | (this.data[offset + 2] & 255) << 8 | (this.data[offset + 3] & 255) << 0;
        }
    }

    public String parseData(CopyOnWriteArrayList<Byte> DATA_LISTS) {
        DATA_LIST = DATA_LISTS;
        int sofPosition = 0;
        boolean sofFound = false;
        Message m = new Message();
        int index = DATA_LIST.indexOf(Byte.valueOf((byte) -1));
        if (index == -1 && DATA_LIST.size() > 0) {
            Log.e("cccccccccccc", "index == -1 && DATA_LIST.size() > 0");
            DATA_LIST.clear();
            return "";
        } else {
            for (int data = 0; data < index; ++data) {
                DATA_LIST.remove(0);
            }

            if (DATA_LIST.size() < 7) {
                return "";
            } else {
                byte[] var15 = CollectionTobyteArray(DATA_LIST);
                System.arraycopy(var15, 0, m.data, 0, 7);
                int len;
                if ((byte) (m.data[0] & 255) != -1) {
                    for (len = 1; len < 6; ++len) {
                        if (m.data[len] == -1) {
                            sofPosition = len;
                            sofFound = true;
                            System.arraycopy(m.data, len, m.data, 0, 7 - len);
                            break;
                        }
                    }
                } else {
                    sofFound = true;
                }

                if (!sofFound) {
                    DATA_LIST.clear();
                    return "";
                } else {
                    len = m.data[1] & 255;
                    int destLen = 7 + sofPosition + len;
                    if (DATA_LIST.size() < destLen) {
                        return "";
                    } else {
                        byte[] _data = CollectionTobyteArray(DATA_LIST);
                        System.arraycopy(_data, 7 + sofPosition, m.data, 7, len);

                        for (int crc = 0; crc < 7 + sofPosition + len; ++crc) {
                            DATA_LIST.remove(0);
                        }

                        short var16 = calcCrc(m.data, 1, len + 4);
                        if ((byte) (m.data[len + 5] & 255) == (byte) (var16 >> 8 & 255) && (byte) (m.data[len + 6] & 255) == (byte) (var16 & 255)) {
                            int status = m.getu16at(3);
                            if ((status & 32512) == 32512) {
                                int var17 = m.getu32at(5);
                                System.out.println(String.format("Reader assert 0x%x at %s:%d", new Object[]{Integer.valueOf(status), new String(m.data, 9, m.writeIndex - 9), Integer.valueOf(var17)}));
                                return "";
                            } else {
                                m.writeIndex = 5 + (m.data[1] & 255);
                                m.readIndex = 5;
                                SLBDataCmdReturn rdcr = new SLBDataCmdReturn();
                                rdcr.GetData(m.data);

                                try {
                                    SLBTagsInvenInfo e = new SLBTagsInvenInfo(rdcr.Data());
                                    String rfid = this.bytes_Hexstr(e.ReadData());
                                    System.out.println(rfid);
                                    return rfid;
                                } catch (Exception var14) {
                                    var14.printStackTrace();
                                    return "";
                                }
                            }
                        } else {
                            System.out.println(String.format("Reader failed crc check.  Message crc %x %x data crc %x %x", new Object[]{Byte.valueOf(m.data[len + 5]), Byte.valueOf(m.data[len + 6]), Integer.valueOf(var16 >> 8 & 255), Integer.valueOf(var16 & 255)}));
                            return "";
                        }
                    }
                }
            }
        }
    }

    private class SLBTagMeta {
        public byte[] tagreadcountbyte;
        public byte rssi;
        public byte antennaid;
        public byte[] frequencybyte;
        public byte[] timebyte;
        public byte[] rfubyte;
        public byte[] probyte;
        public byte[] emdbyte;

        public SLBTagMeta() {
        }

        public SLBTagMeta(byte[] fre, byte[] tag, byte rsi, byte ant) {
            this.frequencybyte = fre;
            this.tagreadcountbyte = tag;
            this.rssi = rsi;
            this.antennaid = ant;
        }
    }

    private int ReverseToInt(byte[] data) throws Exception {
        if (data.length != 4) {
            throw new Exception("ReverseToInt");
        } else {
            return (data[3] & 255) << 24 | (data[2] & 255) << 16 | (data[1] & 255) << 8 | data[0];
        }
    }


    public class SLBTaginfo {
        byte[] tagcrcbyte;
        byte[] pcbyte;
        int tagidlength;
        byte[] tagidbyte;
        SLBTagMeta slbtm;

        public byte[] EMD() {
            return this.slbtm.emdbyte != null ? this.slbtm.emdbyte : new byte[0];
        }

        public short CRC() {
            return this.tagcrcbyte != null ? (short) ((this.tagcrcbyte[0] & 255) << 8 | this.tagcrcbyte[1]) : 0;
        }

        public short PC() {
            return this.pcbyte != null ? (short) ((this.pcbyte[0] & 255) << 8 | this.pcbyte[1]) : 0;
        }

        public int Frequency() throws Exception {
            return this.slbtm.frequencybyte != null ? ReverseToInt(this.slbtm.frequencybyte) : 0;
        }

        public int AntennaId() {
            return this.slbtm.antennaid;
        }

        public int Rssi() {
            return this.slbtm.rssi;
        }

        public int EPCLength() {
            return this.tagidlength;
        }

        public byte[] EPC() {
            return this.tagidbyte;
        }

        public int TagReadCount() {
            return this.slbtm.tagreadcountbyte != null ? this.slbtm.tagreadcountbyte[0] : 0;
        }

        public SLBTaginfo(byte[] epc, int pepclength) {
            this.slbtm = new SLBTagMeta();
            this.tagidlength = pepclength - 4;
            this.pcbyte = new byte[2];
            System.arraycopy(epc, 0, this.pcbyte, 0, 2);
            this.tagidbyte = new byte[this.tagidlength];
            System.arraycopy(epc, 2, this.tagidbyte, 0, this.tagidlength);
            this.tagcrcbyte = new byte[2];
            System.arraycopy(epc, this.tagidlength + 2, this.tagcrcbyte, 0, 2);
        }

        public SLBTaginfo(byte[] epc, int pepclength, byte[] metadata, SLBMetadataFlag metasign) throws Exception {
            this.slbtm = new SLBTagMeta();
            this.tagidlength = pepclength - 4;
            this.pcbyte = new byte[2];
            System.arraycopy(epc, 0, this.pcbyte, 0, 2);
            this.tagidbyte = new byte[this.tagidlength];
            System.arraycopy(epc, 2, this.tagidbyte, 0, this.tagidlength);
            this.tagcrcbyte = new byte[2];
            System.arraycopy(epc, this.tagidlength + 2, this.tagcrcbyte, 0, 2);
            int posion = 0;
            if (metasign.TagReadDataCount()) {
                this.slbtm.tagreadcountbyte = new byte[1];
                System.arraycopy(metadata, posion, this.slbtm.tagreadcountbyte, 0, 1);
                ++posion;
            }

            if (metasign.Rssi()) {
                this.slbtm.rssi = metadata[posion];
                ++posion;
            }

            if (metasign.AntennaID()) {
                this.slbtm.antennaid = metadata[posion];
                ++posion;
            }

            if (metasign.Frequency()) {
                this.slbtm.frequencybyte = new byte[3];
                System.arraycopy(metadata, posion, this.slbtm.frequencybyte, 0, 3);
                posion += 3;
            }

            if (metasign.Time()) {
                this.slbtm.timebyte = new byte[4];
                System.arraycopy(metadata, posion, this.slbtm.timebyte, 0, 4);
                posion += 4;
            }

            if (metasign.RFU()) {
                this.slbtm.rfubyte = new byte[2];
                System.arraycopy(metadata, posion, this.slbtm.rfubyte, 0, 2);
                posion += 2;
            }

            if (metasign.PRO()) {
                this.slbtm.probyte = new byte[1];
                this.slbtm.probyte[0] = metadata[posion];
                ++posion;
            }

            if (metasign.EMD()) {
                byte[] emlb = new byte[2];
                System.arraycopy(metadata, posion, emlb, 0, 2);
                int l = ReverseToShort(emlb) / 8;
                posion += 2;
                if (l > 0) {
                    this.slbtm.emdbyte = new byte[l];
                    System.arraycopy(metadata, posion, this.slbtm.emdbyte, 0, l);
                }
            }

        }
    }

    private class SLBMetadataFlag {
        int metadataflag;
        boolean tagreadcount;
        boolean rssi;
        boolean antenaid;
        boolean frequency;
        boolean time;
        boolean rfu;
        boolean pro;
        boolean emd;
        int metadatalength;

        public int MetaDataLenth() {
            return this.metadatalength;
        }

        public boolean TagReadDataCount() {
            return this.tagreadcount;
        }

        public boolean Rssi() {
            return this.rssi;
        }

        public boolean AntennaID() {
            return this.antenaid;
        }

        public boolean Frequency() {
            return this.frequency;
        }

        public boolean Time() {
            return this.time;
        }

        public boolean RFU() {
            return this.rfu;
        }

        public boolean PRO() {
            return this.pro;
        }

        public boolean EMD() {
            return this.emd;
        }

        private void Sign_MetaH() {
            byte hbit = 1;
            this.metadatalength = 0;

            for (int i = 0; i < 8; ++i) {
                int bit = hbit << i;
                int sign = this.metadataflag & bit;
                switch (i) {
                    case 0:
                        if (sign > 0) {
                            this.tagreadcount = true;
                            ++this.metadatalength;
                        } else {
                            this.tagreadcount = false;
                        }
                        break;
                    case 1:
                        if (sign > 0) {
                            this.rssi = true;
                            ++this.metadatalength;
                        } else {
                            this.rssi = false;
                        }
                        break;
                    case 2:
                        if (sign > 0) {
                            this.antenaid = true;
                            ++this.metadatalength;
                        } else {
                            this.antenaid = false;
                        }
                        break;
                    case 3:
                        if (sign > 0) {
                            this.frequency = true;
                            this.metadatalength += 3;
                        } else {
                            this.frequency = false;
                        }
                        break;
                    case 4:
                        if (sign > 0) {
                            this.time = true;
                            this.metadatalength += 4;
                        } else {
                            this.time = false;
                        }
                        break;
                    case 5:
                        if (sign > 0) {
                            this.rfu = true;
                            this.metadatalength += 2;
                        } else {
                            this.rfu = false;
                        }
                        break;
                    case 6:
                        if (sign > 0) {
                            this.pro = true;
                            ++this.metadatalength;
                        } else {
                            this.pro = false;
                        }
                        break;
                    case 7:
                        if (sign > 0) {
                            this.emd = true;
                            this.metadatalength += 2;
                        } else {
                            this.emd = false;
                        }
                }
            }

        }

        public SLBMetadataFlag(int mflag) {
            this.metadataflag = mflag;
            this.Sign_MetaH();
        }

        public SLBMetadataFlag(byte[] mflagbyte) throws Exception {
            this.metadataflag = ReverseToShort(mflagbyte);
            this.Sign_MetaH();
        }

        public byte[] To_CmdData() {
            byte[] mflagcmdata = new byte[]{(byte) ((this.metadataflag & '\uff00') >> 8), (byte) (this.metadataflag & 255)};
            return mflagcmdata;
        }

        public Byte[] To_CmdData_Byte() {
            byte[] tempb = this.To_CmdData();
            Byte[] backb = new Byte[tempb.length];

            for (int i = 0; i < tempb.length; ++i) {
                backb[i] = Byte.valueOf(tempb[i]);
            }

            return backb;
        }
    }

    private short ReverseToShort(byte[] data) throws Exception {
        if (data.length != 2) {
            throw new Exception("ReverseToShort");
        } else {
            return (short) ((data[0] & 255) << 8 | data[1] & 255);
        }
    }


    public class SLBTagsInvenInfo {
        SLBTaginfo[] stag;
        boolean sendlast;
        SLBMetadataFlag slbmf;
        int readoption;
        int readaddress;
        int readlen;
        byte[] readpc;
        byte[] readepc;
        byte[] readdata;

        public int ReadOption() {
            return this.readoption;
        }

        public byte[] ReadPc() {
            return this.readpc;
        }

        public byte[] ReadEpc() {
            return this.readepc;
        }

        public byte[] ReadData() {
            return this.readdata;
        }

        public int Count() {
            return this.stag.length;
        }

        public SLBTaginfo getTag(int index) {
            return index > this.stag.length ? null : this.stag[index];
        }

        public SLBTagsInvenInfo(byte[] data) throws Exception {
            try {
                byte[] ex = new byte[2];
                System.arraycopy(data, 0, ex, 0, 2);
                this.slbmf = new SLBMetadataFlag(ex);
                this.readoption = data[2];
                int datapos;
                int postion;
                if (this.readoption == 0) {
                    this.stag = new SLBTaginfo[data[3]];
                    if (this.stag.length > 0) {
                        datapos = 0;

                        for (postion = 4; datapos < this.stag.length; ++datapos) {
                            short metadata = 0;
                            byte[] epclength;
                            if (this.slbmf.emd) {
                                epclength = new byte[2];
                                System.arraycopy(data, postion + this.slbmf.metadatalength - 2, epclength, 0, 2);
                                metadata = ReverseToShort(epclength);
                            }

                            epclength = new byte[this.slbmf.MetaDataLenth() + metadata / 8];
                            System.arraycopy(data, postion, epclength, 0, epclength.length);
                            postion += epclength.length;
                            byte[] epclength1 = new byte[2];
                            System.arraycopy(data, postion, epclength1, 0, 2);
                            postion += 2;
                            byte[] epc = new byte[(ReverseToShort(epclength1) - 32) / 8 + 4];
                            System.arraycopy(data, postion, epc, 0, epc.length);
                            this.stag[datapos] = new SLBTaginfo(epc, epc.length, epclength, this.slbmf);
                            postion += epc.length;
                        }
                    }
                } else {
                    byte var11 = 3;
                    this.readaddress = BytesToInt(data, 3);
                    datapos = var11 + 4;
                    this.readlen = data[datapos];
                    ++datapos;
                    this.stag = new SLBTaginfo[data[datapos++]];
                    if (this.stag.length > 0) {
                        byte[] var12 = new byte[slbmf.MetaDataLenth()];
                        System.arraycopy(data, datapos, var12, 0, var12.length);
                        postion = datapos + var12.length;
                        byte var13 = data[postion];
                        ++postion;
                        this.readpc = new byte[2];
                        this.readepc = new byte[var13 - 2];
                        System.arraycopy(data, postion, this.readpc, 0, 2);
                        postion += 2;
                        System.arraycopy(data, postion, this.readepc, 0, this.readepc.length);
                        postion += this.readepc.length;
                        this.readdata = new byte[this.readlen * 2];
                        System.arraycopy(data, postion, this.readdata, 0, this.readlen * 2);
                    }
                }

            } catch (Exception var10) {
                throw var10;
            }
        }
    }

    private int BytesToInt(byte[] data) throws Exception {
        if (data.length != 4) {
            throw new Exception("BytesToInt");
        } else {
            return (data[0] & 255) << 24 | (data[1] & 255) << 16 | (data[2] & 255) << 8 | data[3];
        }
    }

    private int BytesToInt(byte[] data, int offset) throws Exception {
        if (data.length < 4 + offset) {
            throw new Exception("BytesToInt");
        } else {
            return (data[offset] & 255) << 24 | (data[offset + 1] & 255) << 16 | (data[offset + 2] & 255) << 8 | data[offset + 3];
        }
    }

    public static enum ADDRESS {
        APP_SIGN(1024),
        WORK_MODE(1025),
        TIMEOUT(1026),
        SELECT_OPTION(1027),
        SELECT_ADDRESS(1028),
        SELECT_LENGTH(1029),
        SELECT_FILTER_DATA(1030),
        RFU(1038),
        POWER(1040),
        REGION(1041),
        RFU2(1042),
        FREQUENCY(1043),
        HIGH_RSSI(1093),
        SESSION(1094),
        TARGET(1095),
        SENDTIME(1096),
        Q_VALUE(1097),
        READ_BANK(1098),
        READ_ADDRESS(1099),
        READ_LENGTH(1100),
        READ_PASSWORD(1101),
        READ_MODE(1104);

        int p_v;

        private ADDRESS(int v) {
            this.p_v = v;
        }

        public int value() {
            return this.p_v;
        }

        public static ADDRESS valueOf(int value) {
            switch (value) {
                case 1024:
                    return APP_SIGN;
                case 1025:
                    return WORK_MODE;
                case 1026:
                    return TIMEOUT;
                case 1027:
                    return SELECT_OPTION;
                case 1028:
                    return SELECT_ADDRESS;
                case 1029:
                    return SELECT_LENGTH;
                case 1030:
                    return SELECT_FILTER_DATA;
                case 1038:
                    return RFU;
                case 1040:
                    return POWER;
                case 1041:
                    return REGION;
                case 1042:
                    return RFU2;
                case 1043:
                    return FREQUENCY;
                case 1093:
                    return HIGH_RSSI;
                case 1094:
                    return SESSION;
                case 1095:
                    return TARGET;
                case 1096:
                    return SENDTIME;
                case 1097:
                    return Q_VALUE;
                case 1098:
                    return READ_BANK;
                case 1099:
                    return READ_ADDRESS;
                case 1100:
                    return READ_LENGTH;
                case 1101:
                    return READ_PASSWORD;
                default:
                    return null;
            }
        }
    }

    public class SLBDataCmdReturn {
        private int headercode;
        private int datalength;
        private int status = -1;
        private int command;
        private byte[] cmdcrc;
        private byte[] data;

        public int Status() {
            return this.status;
        }

        public int DataLength() {
            return this.datalength;
        }

        public byte[] Data() {
            return this.data;
        }

        public Object GetValue() throws Exception {
            if (this.status != 0) {
                return null;
            } else {
                int address = this.data[12] << 8 | this.data[13];
                ADDRESS AR = ADDRESS.valueOf(address);
                int re;
//                switch ($SWITCH_TABLE$com$widget$bluetooth$BluetoothLeReader$ADDRESS()[AR.ordinal()]) {
//                    case 7:
//                        int count = (this.data.length - 12) / 6;
//                        ArrayList lb = new ArrayList();
//
//                        for (int by = 1; by <= count; ++by) {
//                            lb.add(Byte.valueOf(this.data[14 + 6 * (by - 1)]));
//                            lb.add(Byte.valueOf(this.data[15 + 6 * (by - 1)]));
//                            lb.add(Byte.valueOf(this.data[16 + 6 * (by - 1)]));
//                            lb.add(Byte.valueOf(this.data[17 + 6 * (by - 1)]));
//                        }
//
//                        Byte[] var12 = new Byte[lb.size()];
//                        byte[] by2 = new byte[lb.size()];
//                        lb.toArray(var12);
//
//                        for (re = 0; re < by2.length; ++re) {
//                            by2[re] = var12[re].byteValue();
//                        }
//
//                        return bytes_Hexstr(by2);
//                    case 12:
//                        ArrayList li = new ArrayList();
//
//                        for (int its = 1; its <= 50; ++its) {
//                            if ((this.data[14 + 6 * (its - 1)] & 255) == 165) {
//                                li.add(Integer.valueOf(this.data[15 + 6 * (its - 1)] << 16 | this.data[16 + 6 * (its - 1)] << 8 | this.data[17 + 6 * (its - 1)] & 255));
//                            }
//                        }
//
//                        Integer[] var11 = new Integer[li.size()];
//                        li.toArray(var11);
//                        return var11;
//                    case 15:
//                        int valuei = this.data[14] << 24 | this.data[15] << 16 | this.data[16] << 8 | this.data[17];
//                        byte var13;
//                        if ((valuei & 65536) != 0) {
//                            if ((valuei & 1) != 0) {
//                                var13 = 1;
//                            } else {
//                                var13 = 0;
//                            }
//                        } else if ((valuei & 1) != 0) {
//                            var13 = 3;
//                        } else {
//                            var13 = 2;
//                        }
//
//                        return Integer.valueOf(var13);
//                    case 17:
//                        re = this.data[14] << 24 | this.data[15] << 16 | this.data[16] << 8 | this.data[17];
//                        if (re == 0) {
//                            re = -1;
//                        } else {
//                            re &= 255;
//                        }
//
//                        return Integer.valueOf(re);
//                    default:
//                        return Integer.valueOf(this.data[14] << 24 | this.data[15] << 16 | this.data[16] << 8 | this.data[17]);
//                }
            }
            return null;
        }

        public SLBDataCmdReturn() {
        }

        void AddData(byte[] adda) {
            ArrayList lbs = new ArrayList();
            int i;
            if (this.data != null) {
                for (i = 0; i < this.data.length; ++i) {
                    lbs.add(Byte.valueOf(this.data[i]));
                }
            }

            if (adda != null) {
                for (i = 0; i < adda.length; ++i) {
                    lbs.add(Byte.valueOf(adda[i]));
                }
            }

            this.data = new byte[lbs.size()];

            for (i = 0; i < lbs.size(); ++i) {
                this.data[i] = ((Byte) lbs.get(i)).byteValue();
            }

        }

        public void GetData(byte[] cmddata) {
            this.cmdcrc = new byte[2];
            this.headercode = cmddata[0];
            this.datalength = cmddata[1] & 255;
            this.command = cmddata[2];
            this.status = cmddata[3] << 8 | cmddata[4];
            this.data = new byte[this.datalength];
            System.arraycopy(cmddata, 5, this.data, 0, this.datalength);
            this.cmdcrc[0] = cmddata[cmddata.length - 2];
            this.cmdcrc[1] = cmddata[cmddata.length - 1];
        }

        public void GetData_mt100(byte[] cmddata) {
            this.cmdcrc = new byte[2];
            this.headercode = cmddata[0];
            this.datalength = cmddata[1] & 255;
            this.command = cmddata[2];
            this.status = cmddata[3];
            this.data = new byte[this.datalength];
            System.arraycopy(cmddata, 4, this.data, 0, this.datalength);
            this.cmdcrc[0] = cmddata[cmddata.length - 2];
            this.cmdcrc[1] = cmddata[cmddata.length - 1];
        }
    }


    private static short calcCrc(byte[] message, int offset, int length) {
        int crc = '\uffff';

        for (int i = offset; i < offset + length; ++i) {
            crc = (crc << 4 | message[i] >> 4 & 15) ^ crcTable[crc >> 12];
            crc &= '\uffff';
            crc = (crc << 4 | message[i] >> 0 & 15) ^ crcTable[crc >> 12];
            crc &= '\uffff';
        }

        return (short) crc;
    }

    @SuppressLint({"DefaultLocale"})
    public final String bytes_Hexstr(byte[] bArray) {
        StringBuffer sb = new StringBuffer(bArray.length);

        for (int i = 0; i < bArray.length; ++i) {
            String sTemp = Integer.toHexString(255 & bArray[i]);
            if (sTemp.length() < 2) {
                sb.append(0);
            }

            sb.append(sTemp.toUpperCase());
        }

        return sb.toString();
    }

    public static byte[] CollectionTobyteArray(List list) {
        Iterator itor = list.iterator();
        byte[] backdata = new byte[list.size()];

        for (int i = 0; itor.hasNext(); backdata[i++] = ((Byte) itor.next()).byteValue()) {
            ;
        }

        return backdata;
    }
}
