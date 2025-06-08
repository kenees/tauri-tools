import { RadioGroup, Radio, Switch } from "@heroui/react";
import {useTheme} from "next-themes";

export default () => {
  const { theme, setTheme } = useTheme()

  console.log(theme)

  return (
    <div className="w-full h-[100vh] flex flex-col">
      <div className="h-18 text-2xl items-center p-5 flex box-border">
        设置
      </div>
      <div className="flex-1 w-full h-full grid xl:grid-cols-2 sm:grid-cols-1 gap-2 p-2 bg-background1">
        <div className="inline-block rounded-md p-4 bg-background2">
          <div className="text-lg font-bold">系统设置</div>
          {/* <div className="flex flex-row items-center justify-between h-15">
            <div>语言设置</div>
            <Select className="w-32">
              <SelectItem key="cn">中文</SelectItem>
              <SelectItem key="en">English</SelectItem>
            </Select>
          </div> */}
          <div className="flex flex-row items-center justify-between h-15">
            <div>主题模式</div>
            <RadioGroup orientation="horizontal" defaultValue={theme} onChange={e => setTheme(e.target.value)}>
                <Radio value="light">浅色</Radio>
                <Radio value="dark">深色</Radio>
                <Radio value="auto">系统</Radio>
            </RadioGroup>
          </div>
          <div className="flex flex-row items-center justify-between h-15">
            <div>开机自启</div>
            <Switch />
          </div>
        </div>
        {/* <div className="inline-block rounded-md p-4 bg-background2">ddf</div> */}
      </div>
    </div>
  );
};
