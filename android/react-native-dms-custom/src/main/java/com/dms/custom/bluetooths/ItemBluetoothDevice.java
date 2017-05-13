package com.dms.custom.bluetooths;

import java.io.Serializable;

public class ItemBluetoothDevice implements Serializable {
	private static final long serialVersionUID = 1L;

	private String name;
	private String rssi;
	private String address;

	public ItemBluetoothDevice() {
	}

	public ItemBluetoothDevice(String name, String rssi, String address) {
		this.name = name;
		this.rssi = rssi;
		this.address = address;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getRssi() {
		return rssi;
	}

	public void setRssi(String rssi) {
		this.rssi = rssi;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

}
