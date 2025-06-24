import { Fragment, useEffect, useRef, useState } from "react";
import {
  ArrowPathIcon,
  BarsArrowDownIcon,
  DevicePhoneMobileIcon,
  FunnelIcon,
  PauseIcon,
  PlusIcon,
  StarIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import {
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";
import { useNavigate } from "react-router";
import { useVirtualizer } from "@tanstack/react-virtual";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
// type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

interface Devices {
  key?: string;
  serial: string;
  model: string;
  android_version: string;
  sdk_version: string;
}

export default () => {
  return (
    <div className="w-full h-[100vh] flex flex-col">
      <div className="h-18 text-2xl items-center p-5 flex box-border">
        Logcat
      </div>
      <div className="flex-1 w-full h-full flex flex-col gap-2 p-2 bg-background1">
        <Tabs />
      </div>
    </div>
  );
};

function Tabs() {
  const navigation = useNavigate();
  const [list, setList] = useState<Array<any>>(["Logcat"]);
  const [active, setActive] = useState<any>("Logcat");

  useEffect(() => {
    // adb devices
  }, []);

  const onClose = (
    i: number,
    e: React.MouseEvent<SVGSVGElement, MouseEvent>
  ) => {
    e.stopPropagation();
    list.splice(i, 1);
    console.log(list.at(-1));
    setActive(list.at(i) || list.at(-1));
    setList([...list]);

    if (list.length <= 0) {
      navigation(-1);
    }
  };

  const onCreate = () => {
    for (let j = 2; j <= list.length + 1; j++) {
      if (list.find((v) => v === `Logcat(${j})`)) {
        //
      } else {
        setList((v: any) => [...v, `Logcat(${j})`]);
        return;
      }
    }
  };

  return (
    <Fragment>
      <div className="w-full h-10 bg-background2 flex-row flex items-center">
        {list.map((v: any, i: number) => (
          <div
            key={v}
            className={`
                    max-w-32 flex flex-row items-center p-3 cursor-pointe
                    ${
                      active === v
                        ? "bg-background1 border-b-2 border-b-blue-400"
                        : ""
                    }
                `}
            onClick={() => setActive(v)}
          >
            <span className="text-sm">{v}</span>
            <XMarkIcon className="size-5 mx-2" onClick={(e) => onClose(i, e)} />
          </div>
        ))}
        <PlusIcon className="size-5 mx-2" onClick={onCreate} />
      </div>
      {list.map((v: any) => (
        <Children key={v} id={v} active={active} />
      ))}
    </Fragment>
  );
}

function Children({ value, active, id }: any) {
  const [filter, setFilter] = useState("");
  const [devices, setDevices] = useState<Array<Devices>>([]);
  const [activeDevice, setActiveDevice] = useState<string | undefined>(
    undefined
  );
  const [logs, setLogs] = useState<Array<string>>([]);

  const getDevices = async () => {
    const d: Array<Devices> = await invoke("list_devices");
    setDevices(d.map((v: any) => ({ ...v, key: v.serial })));
    // if (d.length > 0) {
    //   setActiveDevice(d[0].serial);
    // }
  };

  useEffect(() => {
    getDevices();
    return () => {};
  }, []);

  useEffect(() => {
    let unlisten: any;
    if (activeDevice) {
      invoke("start_logcat", { serial: activeDevice });
      setLogs([])
      unlisten = listen<string>("logcat-line", (event: any) => {
        setLogs((prev) => [...prev.slice(-5000), event.payload]);
      });
    }
    return () => {
      if (unlisten) {
        unlisten?.then((off: any) => off());
      }
    };
  }, [activeDevice]);

  return (
    <div
      key={value}
      className={`flex flex-col h-full ${active === id ? "" : "hidden"}`}
    >
      <HeaderTools
        filter={filter}
        setFilter={setFilter}
        devices={devices}
        activeDevice={activeDevice}
        setActiveDevice={setActiveDevice}
      />
      <div className="flex flex-row h-full">
        <LeftTools />
        <div className="flex-1 w-full h-full overflow-hidden relative">
          <div className="absolute overflow-scroll w-full h-full">
            {/* <pre className="w-[6000px]">{logs.join("\n")}</pre> */}
            <VirtalLogViewer logs={logs} />
          </div>
        </div>
      </div>
    </div>
  );
}

interface HeaderToolsProps {
  filter: string;
  setFilter: Function;
  devices: Array<Devices>;
  activeDevice?: string;
  setActiveDevice?: Function;
}

function HeaderTools({
  filter,
  setFilter,
  devices,
  activeDevice,
  setActiveDevice,
}: HeaderToolsProps) {
  return (
    <div className="flex flex-row gap-2">
      <Select
        placeholder="No Connected devices"
        value={activeDevice}
        items={devices}
        aria-label="select"
        onChange={(e) => setActiveDevice?.(e.target.value)}
        renderValue={(items) => {
          return items.map((item) => (
            <div className="flex flex-row items-center whitespace-normal" key={item.key}>
              <DevicePhoneMobileIcon className="size-4" />
              <span className="text-xs mr-2">
                {item.data?.model} ({item.data?.serial})
              </span>
              <span className="text-xs text-zinc-500">
                Android {item.data?.android_version}, API
                {item.data?.sdk_version}
              </span>
            </div>
          ));
        }}
      >
        {(device) => (
          <SelectItem key={device.key} textValue={device.serial}>
            <div className="flex flex-row items-center">
              <DevicePhoneMobileIcon className="size-4" />
              <span className="text-xs">
                {device.model} ({device.serial})
              </span>
              <span className="text-xs text-zinc-500">
                {" "}
                Android {device.android_version}, API{device.sdk_version}
              </span>
            </div>
          </SelectItem>
        )}
      </Select>
      <Input
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        startContent={
          <Dropdown>
            <DropdownTrigger>
              <FunnelIcon className="size-4" />
            </DropdownTrigger>
            <DropdownMenu
              aria-label="drop down menu"
              className="max-h-72 overflow-y-scroll"
              onAction={(e) => console.log(e)}
            >
              <DropdownItem key="new">New file</DropdownItem>
              <DropdownItem key="copy">Copy link</DropdownItem>
              <DropdownItem key="edit">Edit file</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        }
        endContent={
          <div className="flex flex-row w-20 justify-center items-center">
            <XMarkIcon
              className={`size-3 cursor-pointer ${filter ? "" : "hidden"}`}
              onClick={() => {
                setFilter("");
              }}
            />
            <Divider orientation="vertical" className="mx-2" />
            <div className="cursor-pointer text-sm">Cc</div>
            <Divider orientation="vertical" className="mx-2 py-2" />
            <StarIcon className="size-3 cursor-pointer" />
          </div>
        }
      />
    </div>
  );
}

function LeftTools() {
  return (
    <div className="w-9 h-full flex flex-col p-2 bg-background1 gap-2 items-center">
      <TrashIcon />
      <PauseIcon />
      <ArrowPathIcon />
      <BarsArrowDownIcon />
    </div>
  );
}

interface ViewerProps {
  logs: string[];
}

function VirtalLogViewer({ logs }: ViewerProps) {
  const parentRef = useRef<HTMLDivElement | null>(null);
  const [query] = useState("");

  const filteredLogs = query
    ? logs.filter((line) =>
        line.toLowerCase().includes(query.toLocaleLowerCase())
      )
    : logs;

  const rowVirtualizer = useVirtualizer({
    count: filteredLogs.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 20,
    overscan: 10,
  });

  // 自动滚动到底部
  useEffect(() => {
    if (parentRef.current) {
      // parentRef.current.scrollTop = parentRef.current.scrollHeight;
    }
  }, [filteredLogs.length]);

  const highlight = (text: string, keyword: string) => {
    if (!keyword) return <div dangerouslySetInnerHTML={{__html: text}}></div>;
    const parts = text.split(new RegExp(`(${keyword})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === keyword.toLowerCase() ? (
        <span key={i} style={{ background: "yellow", color: "black" }}>
          {part}
        </span>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  return (
    <div style={{ fontFamily: "monospace", padding: 8 }}>
      {/* 搜索框 */}
      {/* <input
        type="text"
        placeholder="搜索关键词..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          marginBottom: 8,
          width: "100%",
          padding: "6px 10px",
          fontSize: 14,
          borderRadius: 6,
          border: "1px solid #ccc",
        }}
      /> */}

      {/* 日志容器 */}
      <div
        ref={parentRef}
        style={{
          height: 'calc(100vh - 210px)',
          overflowY: "auto",
          overflowX: "auto",
          background: "#111",
          color: "#eee",
          fontSize: 12,
          borderRadius: 6,
        }}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            position: "relative",
            width: '3000px'
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const log = filteredLogs[virtualRow.index];
            return (
              <div
                key={virtualRow.key}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  transform: `translateY(${virtualRow.start}px)`,
                  padding: "2px 8px",
                  whiteSpace: "nowrap", // ✅ 单行显示
                }}
              >
                {highlight(log, query)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
