// @ts-ignore
import midtransClient from "midtrans-client";

export function getSnap() {
  const serverKey = process.env.MIDTRANS_SERVER_KEY || "dummy_server_key_sandbox";
  const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";
  if (serverKey.startsWith("dummy")) return null; // fallback mock
  return new midtransClient.Snap({
    isProduction,
    serverKey,
    clientKey: process.env.MIDTRANS_CLIENT_KEY || "",
  });
}

export function isMockMode() {
  return (process.env.MIDTRANS_SERVER_KEY || "").startsWith("dummy") || !process.env.MIDTRANS_SERVER_KEY;
}
