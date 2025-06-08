import { Outlet, useLocation, useNavigate } from "react-router";
import SettingSvg from "../assets/setting.svg";
import SubSvg from "../assets/sub.svg";
import HomeSvg from "../assets/home.svg";
import LogoSvg from "../assets/logo.svg";
import { Button, ScrollShadow } from "@heroui/react";

const menuList = [
  {
    key: 1,
    title: "首页",
    icon: <HomeSvg />,
    path: "/",
  },
  {
    key: 2,
    title: "快捷",
    icon: <SubSvg />,
    path: "/setting",
  },
  {
    key: 22,
    title: "快捷",
    icon: <SubSvg />,
    path: "/setting",
  },
  {
    key: 3,
    title: "设置",
    icon: <SettingSvg />,
    path: "/setting",
  },
];

export default () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex overflow-hidden">
      <div className="w-[200px] h-[100vh] flex">
        <div className="h-full flex flex-col p-2.5">
          <div className="h-12 pl-4 flex items-center">
            <LogoSvg className="dark:fill-amber-50 fill-zinc-950 w-9 h-9" />
            <span className="font-bold text-xl mt-[-6px]">Tool Box</span>
          </div>
          <ScrollShadow hideScrollBar visibility="right" style={{ flex: 1, overflowY: "scroll" }}>
            {menuList.map((v: any) => (
              <div className="mb-2.5" key={v.key}>
                <Button
                  color={location.pathname === v.path ? "primary" : "default"}
                  variant={location.pathname === v.path ? "flat" : "light"}
                  className="flex w-40 h-14 pt-1 text-3xl"
                  onPress={() => navigate(v.path)}
                >
                  {v.icon}
                  <span className="flex-1 text-lg dark:text-white! text-black!">{v.title}</span>
                </Button>
              </div>
            ))}
          </ScrollShadow>
        </div>
      </div>
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};
