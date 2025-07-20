import { Button } from "@heroui/react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { useEffect, useState } from "react";

// 假设蓝牙设备对象结构为 { id: string, name: string }
type Device = {
  id: string;
  name: string;
  is_connectable: boolean; // 是否可连接
  rssi?: number; // 信号强度
  service_count?: number; // 服务数量
};

async function connectBluetooth(id: string) {
  // 调用 Rust 后端连接设备
  await invoke("connect_device", { id });
}

export default () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(false);
  const [listeners, setListeners] = useState<any>(null);

  const handleScan = async () => {
    setLoading(true);
    let unlisten = await listen<string>("ble_scan_update", (event: any) => {
      console.log("Received BLE scan update:", event.payload);
      if (event.payload[0].name === null) {
        return;
      }
      setDevices((prevDevices) => {
        // const newDevice = JSON.parse(event.payload) as Device;
        const newDevice = event.payload[0];
        // 检查设备是否已存在，若存在则更新，否则添加新设备
        const existingIndex = prevDevices.findIndex((d) => d.id === newDevice.id);
        if (existingIndex >= 0) {
          const updatedDevices = [...prevDevices];
          updatedDevices[existingIndex] = newDevice;
          return updatedDevices;
        } else {
          return [...prevDevices, newDevice];
        }
      });
      setLoading(false);
    });
    await invoke<Device[]>("scan_devices");

    setListeners(unlisten);
  };

  const handleConnect = async (id: string) => {
    await connectBluetooth(id);
    // 可选：连接后刷新设备状态或提示
  };

  useEffect(() => {
    () => {
      listeners?.remove()
    }
  }, []);

  return (
    <div>
      <Button onPress={handleScan} isLoading={loading}>
        搜索蓝牙
      </Button>
      <div style={{ marginTop: 16 }}>
        {devices.length === 0 && <div>未发现蓝牙设备</div>}
        {devices.map((dev) => (
          <div
            key={dev.id}
            style={{ display: "flex", alignItems: "center", marginBottom: 8 }}
          >
            <span style={{ flex: 1 }}>{dev.name || "未知设备"}</span>
            <span style={{ flex: 1 }}>{dev.id}</span>
            <Button onPress={() => handleConnect(dev.id)}>连接</Button>
          </div>
        ))}
      </div>
    </div>
  );
};
