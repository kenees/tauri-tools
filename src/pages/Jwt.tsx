import { useEffect, useMemo, useState } from "react";
import JSONViewer from "react-json-view";
import { addToast, Button, Textarea, Modal, ModalContent } from "@heroui/react";
// import { invoke } from "@tauri-apps/api/core";
import {
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
} from "@heroicons/react/24/solid";

function base64UrlDecode(str: string) {
  // Base64Url 转 Base64
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  // 补全 Base64 长度（添加 = 填充）
  while (base64.length % 4) {
    base64 += "=";
  }
  // 解码
  return JSON.parse(atob(base64));
}

function getStringBitsUtf8(str: any) {
  console.log("getStringBitsUtf8", str);
  let totalBits = 0;
  for (let i = 0; i < str.length; i++) {
    const code = str.codePointAt(i);
    if (code <= 0x7f) {
      totalBits += 8;
    } else if (code <= 0x7ff) {
      totalBits += 16;
    } else if (code <= 0xffff) {
      totalBits += 24;
    } else {
      totalBits += 32;
      i++; // 跳过代理对的高位
    }
  }
  return totalBits;
}

async function encodeJWT(payload: any, secret: any, algorithm = "HS256") {
  // 1. 准备 Header 和 Payload
  const header = {
    alg: algorithm,
    typ: "JWT",
  };

  // 2. Base64Url 编码 Header 和 Payload
  const base64UrlEncode = (str: string) => {
    return btoa(JSON.stringify(str))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  };

  const headerBase64 = base64UrlEncode(header);
  const payloadBase64 = base64UrlEncode(payload);

  // 3. 准备签名数据
  const data = `${headerBase64}.${payloadBase64}`;

  // 4. 使用 Web Crypto API 生成签名
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));

  // 5. 将签名转为 Base64Url
  const signatureBase64 = btoa(
    String.fromCharCode(...new Uint8Array(signature))
  )
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  // 6. 组合成完整 JWT
  return `${headerBase64}.${payloadBase64}.${signatureBase64}`;
}

const copyToClipboard = (text: string) => {
  navigator.clipboard
    .writeText(text)
    .then(() =>
      addToast({
        title: "提示",
        description: "已复制到剪贴板!",
        color: "success",
      })
    )
    .catch((err) =>
      addToast({
        title: "提示",
        description: `复制失败: ${err}!`,
        color: "warning",
      })
    );
};

export default () => {
  const [index, setIndex] = useState(0);

  return (
    <div className="w-full h-[100vh] flex flex-col">
      <div className="h-18 text-2xl items-center p-5 flex box-border">JWT</div>
      <div className="flex flex-1 h-full overflow-hidden w-full flex-col xl:grid-cols-2 sm:grid-cols-1 gap-2 p-2 bg-background1">
        <div className="flex flex-row p-3 box-border">
          <div
            className={`inline-flex mr-5 text-2xl ${
              index ? "text-gray-400!" : "black"
            } cursor-pointer`}
            onClick={() => setIndex(0)}
          >
            JWT Decoder
          </div>
          <div
            className={`inline-flex text-2xl ${
              !index ? "text-gray-400!" : "black"
            } cursor-pointer`}
            onClick={() => setIndex(1)}
          >
            JWT Encoder
          </div>
        </div>
        <div
          className="flex-1 bg-background2 overflow-y-scroll flex"
          hidden={!!index}
        >
          <Decoder />
        </div>
        <div
          className="flex-1 bg-background2 overflow-y-scroll flex"
          hidden={!index}
        >
          <Encoder />
        </div>
      </div>
    </div>
  );
};

function Decoder() {
  const [token, setToken] = useState<string | null>(null);
  const [tips1, setTips1] = useState("Valid JWT");
  const [tips2, setTips2] = useState<string | null>(null);
  const [tips3, setTips3] = useState<string | null>(null);

  // Decode state
  const [decodeSecret, setDecodeSecret] = useState("");
  const [header, setHeader] = useState(null);
  const [payload, setPayload] = useState<null | string>(null);

  useEffect(() => {
    if (!payload || !decodeSecret || !token) return;
    console.log("======", payload, decodeSecret, token);
    // 解码
    encodeJWT(
      {
        ...(payload ?? {}),
      },
      decodeSecret
    )
      .then((t: string) => {
        console.log("sssss", t);
        if (token === t) {
          setTips2(null);
          setTips3(null);
        } else {
          setTips2("Invalid Signature");
          setTips3("signature verification failed");
        }
      })
      .catch(() => {
        setTips2("Invalid Signature");
      });
  }, [token, payload, decodeSecret]);

  const handleDecode = async (token: string, payload: any) => {
    try {
      setToken(token);
      const [headerBase64, payloadBase64, signature] = token.split(".");
      setHeader(base64UrlDecode(headerBase64));
      setPayload(base64UrlDecode(payloadBase64));
      console.log(signature);
      setDecodeSecret("a-string-secret-at-least-256-bits-long");
      console.log();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex-1 p-3 box-border">
      <div className="w-full h-4">
        Paste a JWT below that you'd like to decode, validate, and verify.
      </div>
      <div className="grid xl:grid-cols-2 sm:grid-cols-1 gap-3 h-full">
        <div className="xl:row-span-3">
          <div className="text-sm py-3">ENCODE VALUE</div>
          <div className="border-[1px] h-[90%] rounded-lg border-stone-300 flex flex-col">
            <div className="flex justify-between box-border">
              <div className="p-3">JSON WEB TOKEN (JWT)</div>
              <div className="gap-2 flex">
                <Button
                  disabled={!token}
                  onPress={() => copyToClipboard(token ?? "")}
                >
                  COPY
                </Button>
                <Button
                  onPress={() => {
                    console.log(129898);
                    setToken(null);
                  }}
                >
                  CLEAR
                </Button>
              </div>
            </div>
            <div className="border-t-[1px] border-t-stone-300 h-full pb-2 flex flex-col">
              {!tips2 ? (
                <div className={`bg-green-100  p-3 text-green-500`}>
                  Signature Verified
                </div>
              ) : (
                <div className={`bg-red-100 text-red-500 p-3`}>{tips2}</div>
              )}
              <Textarea
                value={token ?? ""}
                size="lg"
                variant="flat"
                className="w-full rounded-none! flex-1 h-full!"
                onChange={(e) => handleDecode(e.target.value, payload)}
              />
            </div>
          </div>
        </div>

        <div className="xl:row-span-1">
          <div className="text-sm py-3">DECODED HEADER</div>
          <div className="rounded-lg">
            <TableModal data={header} />
          </div>
        </div>

        <div className="xl:row-span-1">
          <div className="text-sm pb-3">DECODED PAYLOAD</div>
          <div className="rounded-lg">
            <TableModal data={payload} />
          </div>
        </div>

        <div className="xl:row-span-1">
          <div className="text-sm pb-3">JWT SIGNATURE VERIFICATION</div>
          <div>Enter the secret used to sign the JWT below:</div>
          <div className="border-[1px] h-[80%] rounded-lg border-stone-300 flex flex-col">
            <div className="flex justify-between box-border">
              <div className="p-3">SECRET</div>
              <div className="gap-2 flex">
                <Button
                  disabled={!decodeSecret}
                  onPress={() => copyToClipboard(decodeSecret)}
                >
                  COPY
                </Button>
                <Button onPress={() => setDecodeSecret("")}>CLEAR</Button>
              </div>
            </div>
            <div className="border-t-[1px] border-t-stone-300 h-full pb-2 flex flex-col">
              {!tips3 ? (
                <div className={`bg-green-100 text-green-500  p-3`}>Valid secret</div>
              ) : (
                <div className={`bg-red-100 text-red-500 p-3`}>{tips3}</div>
              )}
              <Textarea
                className="border-0! h-full! w-full rounded-none! flex-1"
                value={decodeSecret}
                onChange={(e) => setDecodeSecret(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Encoder() {
  // Encode state
  const [token, setToken] = useState<null | string>("");

  const [headerError, setHeaderError] = useState<null | string>(null);
  const [payloadError, setPayloadError] = useState<null | string>(null);
  const [secretError, setSecretError] = useState<null | string>(null);

  const [header, setHeader] = useState(`{
    "alg": "HS256",
    "typ": "JWT"
  }`);

  const [payload, setPayload] = useState(`{
    "sub": "",
    "name": "",
    "admin": true,
    "iat": 0
  }`);

  const [secret, setSecret] = useState(
    "a-string-secret-at-least-256-bits-long"
  );

  const onHeaderEdit = (e: any) => {
    try {
      setHeader(e);
      JSON.parse(e.replace("/\n/g", "").replace(`/"/g`, ""));
      setHeaderError(null);
    } catch (error) {
      if (error instanceof SyntaxError) {
        setHeaderError(error.message);
      }
    }
  };

  const onPayloadEdit = (e: string) => {
    try {
      setPayload(e);
      JSON.parse(e.replace("/\n/g", "").replace(`/"/g`, ""));
      setPayloadError(null);
    } catch (error) {
      if (error instanceof SyntaxError) {
        setPayloadError(error.message);
      }
    }
  };

  const onSecretEdit = (e: string) => {
    setSecret(e);
    const l = getStringBitsUtf8(e);
    if (l < 256) {
      setSecretError(
        "A key of 256 bits or larger MUST be used with HS256 as specified"
      );
    } else {
      setSecretError(null);
    }
  };

  useEffect(() => {
    if (
      header &&
      payload &&
      secret &&
      !headerError &&
      !payloadError &&
      !secretError
    ) {
      const _payload =
        JSON.parse(payload.replace("/\n/g", "").replace(`/"/g`, "")) ?? {};
      encodeJWT(
        {
          ..._payload,
        },
        secret
      )
        .then((token: string) => setToken(token))
        .catch(() => setToken(null));
    }
  }, [header, payload, secret, headerError, payloadError, secretError]);

  return (
    <div className="flex-1 p-3 box-border">
      <div className="w-full h-4 mb-5">
        Fill in the fields below to generate a signed JWT.
      </div>
      <div className="grid xl:grid-cols-2 sm:grid-cols-1 gap-3 h-full">
        <div className="xl:row-span-1">
          <div className="border-[1px] h-[100%] rounded-lg border-stone-300 flex flex-col">
            <div className="flex justify-between box-border">
              <div className="p-3">HEADER: ALGORITHM & TOKEN TYPE</div>
              <div className="gap-2 flex">
                <Button>CLEAR</Button>
              </div>
            </div>
            <div className="border-t-[1px] border-t-stone-300 h-full flex flex-col">
              {headerError ? (
                <div className={`bg-red-100 text-red-500 p-3`}>
                  {headerError}
                </div>
              ) : (
                <div className={`bg-green-100 text-green-500  p-3`}>Valid header</div>
              )}
              <Textarea
                value={header}
                className="border-0! h-full! w-full rounded-none! flex-1"
                onChange={(e) => onHeaderEdit(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="xl:row-span-3">
          <div className="border-[1px] h-[94%] rounded-lg border-stone-300 flex flex-col">
            <div className="flex justify-between box-border">
              <div className="p-3">JSON WEB TOKEN (JWT)</div>
              <div className="gap-2 flex">
                <Button
                  disabled={!token}
                  onPress={() => copyToClipboard(token ?? "")}
                >
                  COPY
                </Button>
              </div>
            </div>
            <div className="border-t-[1px] border-t-stone-300 h-full pb-2 flex flex-col">
              <Textarea
                value={token ?? ""}
                className="border-0! h-full! w-full rounded-none! flex-1 text-black!"
                disabled
              />
            </div>
          </div>
        </div>
        <div className="xl:row-span-1">
          <div className="border-[1px] h-[100%] rounded-lg border-stone-300 flex flex-col">
            <div className="flex justify-between box-border">
              <div className="p-3">PAYLOAD: DATA</div>
              <div className="gap-2 flex">
                <Button>CLEAR</Button>
              </div>
            </div>
            <div className="border-t-[1px] border-t-stone-300 h-full pb-2 flex flex-col">
              {payloadError ? (
                <div className={`bg-red-100 text-red-500 p-3`}>
                  {payloadError}
                </div>
              ) : (
                <div className={`bg-green-100 text-green-500 p-3`}>Valid Payload</div>
              )}
              <Textarea
                className="border-0! h-full! w-full rounded-none! flex-1"
                value={payload}
                onChange={(e) => onPayloadEdit(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="xl:row-span-1">
          <div className="border-[1px] h-[80%] rounded-lg border-stone-300 flex flex-col">
            <div className="flex justify-between box-border">
              <div className="p-3">SIGN JWT: SECRET (UTF-8)</div>
              <div className="gap-2 flex">
                <Button>CLEAR</Button>
              </div>
            </div>
            <div className="border-t-[1px] border-t-stone-300 h-full pb-2 flex flex-col">
              {secretError ? (
                <div className={`bg-red-100 text-red-500 p-3`}>
                  {secretError}
                </div>
              ) : (
                <div className={`bg-green-100 text-green-500 p-3`}>Valid Secret</div>
              )}
              <Textarea
                className="border-0! h-full! w-full rounded-none! flex-1"
                value={secret}
                onChange={(e) => onSecretEdit(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TableModal({ data }: any) {
  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);

  const dom = useMemo(() => {
    return (
      <div className="rounded-xl border-[1px] relative border-stone-300">
        {/* tab */}
        <div className="flex flex-row gap-4 cursor-pointer items-center  h-full">
          <div
            className={`${!index ? "text-blue-400 border-b-2" : ""}  p-3`}
            onClick={() => setIndex(0)}
          >
            JSON
          </div>
          <div
            className={`${index ? "text-blue-400 border-b-2" : ""} p-3`}
            onClick={() => setIndex(1)}
          >
            CLATMS TABLE
          </div>
        </div>
        <div className="absolute right-6 top-2 flex items-center">
          {/* <Button className="mr-4 text-sm">SHOW DETAILS</Button> */}
          {/* arrows-pointing-in, out */}
          <Button onPress={() => setVisible(!visible)}>
            {visible ? (
              <ArrowsPointingInIcon className="size-6 cursor-pointer" />
            ) : (
              <ArrowsPointingOutIcon className="size-6 cursor-pointer" />
            )}
          </Button>
        </div>
        <div className="w-full h-[1px] bg-stone-300"></div>
        <div className="top-0 w-full min-h-10 " hidden={!!index}>
          <JSONViewer
            name={false}
            collapsed={false}
            indentWidth={4}
            iconStyle="triangle"
            src={data}
            theme="grayscale:inverted"
            displayObjectSize={false}
            displayDataTypes={false}
            enableClipboard={false}
          />
        </div>
        <div className="w-full min-h-10" hidden={!index}></div>
      </div>
    );
  }, [index, data, visible]);

  return (
    <>
      {dom}
      <Modal isOpen={visible} closeButton={<></>}>
        <ModalContent>{dom}</ModalContent>
      </Modal>
    </>
  );
}
