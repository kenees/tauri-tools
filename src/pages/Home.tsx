import { useNavigate } from "react-router";
import { useStores } from "@/store";

import icon1 from "@/assets/jwt.png";
import logcat from "@/assets/logcat.png";
import iter from '@/assets/iter.png'

const list = [
  {
    id: 1,
    path: "/jwt",
    icon: icon1,
    title: "JWT",
    padding: 'p-[4px]'
  },
  {
    id: 2,
    path: "/logcat",
    icon: logcat,
    title: "Logcat",
    padding: ''
  },
  {
    id: 3,
    path: '/termainal',
    icon: iter,
    title: 'Terminal',
    padding: 'p-[5px]'
  }
];

export default () => {
  const navigate = useNavigate();

  const { state } = useStores();

  console.log(state);
  return (
    <div className="w-full h-[100vh] flex flex-col">
      <div className="h-18 text-2xl items-center p-5 flex box-border">首页</div>
      <div className="flex-1 bg-background1 p-4 h-full overflow-y-scroll">
        {list.map((v: any) => (
          <div className="float-left m-4" onClick={() => navigate(v.path)}>
            <img src={v.icon} className={`w-30 h-30 ${v.padding}`} />
            <p className="text-[14px] text-center">{v.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
