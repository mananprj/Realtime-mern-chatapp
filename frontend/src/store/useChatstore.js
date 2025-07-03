import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set,get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUserLoading: false,
  isMessagesLoading: false,

  getusers: async () => {
    set({ isUserLoading: true });
    try {
        const res = await axiosInstance.get("/message/users");
        set({ users: res.data });
    } catch (error) {
        console.log(error);
        toast.error("Failed to fetch users");
    }finally{
        set({ isUserLoading: false });
    }
    },

    getmessages: async (userid) => {
    set({ isMessagesLoading: true });
    try {
        const res = await axiosInstance.get(`/message/${userid}`);
        set({ messages: res.data });
    } catch (error) {
        console.log(error);
    }finally{
        set({ isMessagesLoading: false });
    }
    },

    setselecteduser: (selectedUser) => {
    set({ selectedUser });
    },

    sendmessage: async (data) => {
        const { selectedUser, messages } = get();
    try {
        const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, data)
        set({ messages: [...messages, res.data] });
    } catch (error) {
        console.log(error);
        toast.error("Failed to send message");
    }
    },

    subscribeToMessages: () => {
        const {selectedUser} = get();
        if(!selectedUser) return;

        const socket = useAuthStore.getState().socket;

        socket.on("newmessage", (newmessage) => {
            if(newmessage.senderId !== selectedUser._id) return;
            set({messages: [...get().messages, newmessage]});
        });
    },

    unsubscribeToMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newmessage");
    }

}));