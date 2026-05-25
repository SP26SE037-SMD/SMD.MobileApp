import { create } from 'zustand';
import { Client, IMessage } from '@stomp/stompjs';
import { notificationService, AppNotification } from '../services/notificationService';

// Polyfill for TextEncoder/TextDecoder which is required by STOMP over WebSocket on React Native
const TextEncodingPolyfill = require('text-encoding');
Object.assign(global, {
    TextEncoder: global.TextEncoder || TextEncodingPolyfill.TextEncoder,
    TextDecoder: global.TextDecoder || TextEncodingPolyfill.TextDecoder,
});

interface NotificationState {
    notifications: AppNotification[];
    unreadCount: number;
    stompClient: Client | null;
    isConnected: boolean;
    page: number;
    totalPages: number;
    isLoading: boolean;

    // Actions
    connect: (accountId: string, token: string) => void;
    disconnect: () => void;
    fetchNotifications: (page?: number, isLoadMore?: boolean) => Promise<void>;
    fetchUnreadCount: () => Promise<void>;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
}

const getWsUrl = () => {
    const httpUrl = process.env.EXPO_PUBLIC_API_BASE_URL || "https://api.syllabus.io.vn/api";
    // Thay thế http:// hoặc https:// thành ws:// hoặc wss:// và loại bỏ /api
    const url = new URL(httpUrl);
    const protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
    
    // endpoint native websocket the doc "ws-native"
    return `${protocol}//${url.host}/ws-native`;
};

export const useNotificationStore = create<NotificationState>((set, get) => ({
    notifications: [],
    unreadCount: 0,
    stompClient: null,
    isConnected: false,
    page: 0,
    totalPages: 1,
    isLoading: false,

    connect: (accountId: string, token: string) => {
        // Disconnect existing client if any
        get().disconnect();

        const wsUrl = getWsUrl();
        console.log("[STOMP] Connecting to", wsUrl);

        const client = new Client({
            brokerURL: wsUrl,
            connectHeaders: {
                Authorization: `Bearer ${token}` // Provide token if API gateway accepts it
            },
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            reconnectDelay: 5000,
            // Configure STOMP on WebSocket without SockJS for React Native performance
            forceBinaryWSFrames: true,
            appendMissingNULLonIncoming: true,
            
            onConnect: () => {
                console.log("[STOMP] Connected");
                set({ isConnected: true });

                // Subscribe Account notifications
                client.subscribe(`/topic/notification/account/${accountId}`, (message: IMessage) => {
                    if (message.body) {
                        try {
                            const payload = JSON.parse(message.body);
                            console.log("[STOMP] New Message:", payload);
                            // Process realtime message
                            get().fetchUnreadCount(); // Refresh count
                            get().fetchNotifications(0, false); // Reload list (or could unshift locally)
                        } catch (e) {
                            console.error("[STOMP] Error parsing message", e);
                        }
                    }
                });

                // Subscribe Broadcast system
                client.subscribe(`/topic/notification/broadcast/system`, (message: IMessage) => {
                    if (message.body) {
                        console.log("[STOMP] Broadcast system:", message.body);
                        get().fetchUnreadCount();
                        get().fetchNotifications(0, false);
                    }
                });
            },
            onStompError: (frame) => {
                console.error("[STOMP] Broker reported error: " + frame.headers['message']);
                console.error("[STOMP] Additional details: " + frame.body);
            },
            onWebSocketClose: () => {
                console.log("[STOMP] WebSocket Closed");
                set({ isConnected: false });
            }
        });

        client.activate();
        set({ stompClient: client });
    },

    disconnect: () => {
        const { stompClient } = get();
        if (stompClient) {
            stompClient.deactivate();
            set({ stompClient: null, isConnected: false });
        }
    },

    fetchNotifications: async (page = 0, isLoadMore = false) => {
        set({ isLoading: !isLoadMore });
        try {
            const res = await notificationService.getMyNotifications(page, 15);
            if (res.status === 1000 && res.data) {
                const newItems = res.data.content || [];
                set(state => ({
                    notifications: isLoadMore ? [...state.notifications, ...newItems] : newItems,
                    page: res.data.page || 0,
                    totalPages: res.data.totalPages || 1,
                    isLoading: false
                }));
            }
        } catch (e) {
            console.error("[NotificationStore] Error fetching lists:", e);
            set({ isLoading: false });
        }
    },

    fetchUnreadCount: async () => {
        try {
            const res = await notificationService.getUnreadCount();
            if (res.status === 1000) {
                set({ unreadCount: res.data });
            }
        } catch (e) {
            console.error("[NotificationStore] Error fetching unread count:", e);
        }
    },

    markAsRead: async (id: string) => {
        try {
            await notificationService.markAsRead(id);
            // Cập nhật local
            set(state => ({
                notifications: state.notifications.map(n => 
                    n.notificationId === id ? { ...n, isRead: true } : n
                ),
                unreadCount: Math.max(0, state.unreadCount - 1)
            }));
        } catch (e) {
            console.error("[NotificationStore] Error mark as read:", e);
        }
    },

    markAllAsRead: async () => {
        try {
            await notificationService.markAllAsRead();
            set(state => ({
                notifications: state.notifications.map(n => ({ ...n, isRead: true })),
                unreadCount: 0
            }));
        } catch (e) {
            console.error("[NotificationStore] Error mark all as read:", e);
        }
    }
}));
