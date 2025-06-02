import { createContext, FC, PropsWithChildren, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

type SocketCallback = (data: any) => void

type SocketContextProps = {
    factories: Array<string>;
    setFactories: (input: Array<string>) => void;
    callbacks: Map<string, SocketCallback>,
    addCallbacks: (name: string, callback: SocketCallback) => void
    removeCallbacks: (name: string) => void
};

const SOCKET_BASE_URL: string = import.meta.env.VITE_SOCKET_BASE_URL ?? "http://localhost:3000"
const VITE_SOCKET_PATH: string = import.meta.env.VITE_SOCKET_PATH ?? ""
const SOCKET_PREFIX: string = import.meta.env.VITE_SOCKET_PREFIX ?? "ocr-update"

const SocketContext = createContext<SocketContextProps>({
    factories: [],
    setFactories: () => { },
    callbacks: new Map<string, SocketCallback>(),
    addCallbacks: () => { },
    removeCallbacks: () => { },
});

export const useSocket = () => useContext(SocketContext)

export const SocketListener = () => {
    const { factories, callbacks } = useSocket()

    useEffect(() => {
        let _socket: Socket

        const start = async () => {
            _socket = io(SOCKET_BASE_URL, {
                transports: ['websocket'],     // ✅ บังคับใช้ websocket ไม่ใช้ polling
                withCredentials: true,         // ✅ ให้ส่ง credentials เช่น cookie ถ้ามี
                path: VITE_SOCKET_PATH || '/socket.io', // ✅ fallback path
                reconnectionDelayMax: 10000
            });

            factories.map((factory) => {
                _socket.on(`${SOCKET_PREFIX}-${factory}`, (data) => {
                    callbacks.forEach((callback) => callback(data))
                });
            })
        };
        start();
        return () => {
            _socket.close()
        }
    }, [factories, callbacks]);

    return null
}

export const SocketProvider: FC<PropsWithChildren> = ({ children }) => {
    const [factories, setFactories] = useState<Array<string>>([])
    const [callbacks, setCallbacks] = useState<Map<string, SocketCallback>>(new Map<string, SocketCallback>())

    const addCallbacks = (key: string, callback: SocketCallback) => {
        setCallbacks((pre) => {
            const entried = pre.entries();
            const mapped = new Map(entried)
            mapped.set(key, callback)
            return mapped
        })
    }

    const removeCallbacks = (key: string) => {
        setCallbacks((pre) => {
            const entried = pre.entries();
            const mapped = new Map(entried)
            mapped.delete(key)
            return mapped
        })
    }

    return <SocketContext.Provider value={
        {
            factories, setFactories,
            callbacks, addCallbacks, removeCallbacks
        }
    }> {children} </SocketContext.Provider>
}