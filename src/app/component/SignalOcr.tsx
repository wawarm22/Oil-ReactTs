import { useEffect } from "react";
import { WebPubSubClient } from "@azure/web-pubsub-client";

export default function SignalOcr() {
    useEffect(() => {
        const connect = async () => {
            const res = await fetch("https://oil-revenue.azurewebsites.net/api/negotiate-ocr", {
                method: "POST",
            });

            const { url, accessToken } = await res.json();
            const clientAccessUrl = `${url}?access_token=${encodeURIComponent(accessToken)}`;

            console.log("clientAccessUrl", clientAccessUrl);
            
            const client = new WebPubSubClient("ws://localhost:5173/client/hubs/ocrHub");

            client.on("connected", () => {
                console.log("✅ Connected to Web PubSub");
            });

            client.on("server-message", (event) => {
                const raw = event.message.data;

                if (typeof raw === "string") {
                    try {
                        const parsed = JSON.parse(raw);
                        if (parsed?.type === "ocrGroupDone") {
                            console.log("📩 OCR Done:", parsed.payload);
                            alert("OCR เสร็จสำหรับกลุ่ม: " + parsed.payload?.documentGroup);
                        }
                    } catch (err) {
                        console.error("❌ Error parsing JSON from server-message", err);
                    }
                } else {
                    console.warn("📦 Received non-string message:", raw);
                }
            });

            await client.start();
        };

        connect();
    }, []);

    return <div>📡 กำลังรอฟัง OCR Message...</div>;
}
