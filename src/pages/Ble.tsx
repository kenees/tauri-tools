import { Button } from "@heroui/react";
import { invoke } from "@tauri-apps/api/core";
import { useEffect } from "react";

async function scanBluetooth() {
  const devices = await invoke<string[]>("scan_devices");
  console.log(devices);
}

export default () => {
  useEffect(() => {
    scanBluetooth()
  }, []);

  const onSearch = () => scanBluetooth()

  return <div>
    <Button onPress={onSearch}>搜索蓝牙</Button>
    <Button onPress={onSearch}>停止搜索</Button>
  </div>;
};
