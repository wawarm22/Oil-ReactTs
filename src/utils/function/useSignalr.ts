import { HubConnectionBuilder, HubConnection, HttpTransportType } from "@microsoft/signalr";
import { useEffect, useRef } from "react";

export function useSignalR(onMessage: (data: any) => void) {
    const connectionRef = useRef<HubConnection | null>(null);

    useEffect(() => {
        let isMounted = true;

        const setupSignalR = async () => {
            try {
                const response = await fetch("https://oil-revenue.azurewebsites.net/api/negotiate-ocr", {
                    method: "POST",
                });

                const data = await response.json(); // { url, accessToken }

                const conn = new HubConnectionBuilder()
                    .withUrl(data.url, {
                        accessTokenFactory: () => data.accessToken,
                        transport: HttpTransportType.LongPolling,
                    })
                    .withAutomaticReconnect()
                    .build();

                conn.on("ocrGroupDone", (message) => {
                    console.log("📩 OCR Message Received:", message);
                    onMessage(message);
                });

                await conn.start();
                if (isMounted) {
                    console.log("✅ SignalR connected using LongPolling");
                    connectionRef.current = conn;
                }
            } catch (err) {
                console.error("❌ SignalR setup failed", err);
            }
        };

        setupSignalR();

        return () => {
            isMounted = false;
            if (connectionRef.current) {
                connectionRef.current.stop();
            }
        };
    }, [onMessage]);

    return null;
}
