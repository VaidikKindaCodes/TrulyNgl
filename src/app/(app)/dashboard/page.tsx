"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Message } from "@/model/User";
import { acceptingSchema } from "@/schemas/acceptingMessageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, RefreshCcw } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { ApiResponse } from "@/types/ApiResponse";
import { User } from "next-auth";
import { Spotlight } from "@/components/ui/spotlight-new";
import MessageCard from "@/components/MessageCard";

function page() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptingSchema),
    defaultValues: {
      isAccepting: false,
    },
  });
  const { register, watch, setValue } = form;
  const isAccepting = watch("isAccepting");

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get(`/api/accept-messages`);
      setValue("isAccepting", response?.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message || "error switching states"
      );
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = async (refresh: boolean = false) => {
    setIsLoading(true);
    try {
      const response = await axios.get<ApiResponse>(`/api/get-messages`, {
        withCredentials: true,
      });
      setMessages(response.data.messages as Message[]);

      if (refresh) {
        toast.success("Messages refreshed successfully");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message || "Error fetching messages"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!session?.user) return;
    fetchMessages();
    fetchAcceptMessages();
  }, [session, fetchAcceptMessages]);

  const handleDeleteMessages = async (messageId: string) => {
    setMessages((prev) => prev.filter((message) => message._id !== messageId));
    try {
      const response = await axios.delete(`/api/delete-message/${messageId}`);
      if (response) {
        toast.success("Message deleted successfully");
      }
    } catch (error) {
      const errorAxios = error as AxiosError;
      toast.error(
        (errorAxios.response?.data as string) || "Error while deleting message"
      );
    }
  };

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post(`/api/accept-messages`, {
        isAcceptingMessages: !isAccepting,
      });
      setValue("isAccepting", !isAccepting);
      toast.success(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message || "Error switching states"
      );
    }
  };

  const [profileUrl, setProfileUrl] = useState("");

  useEffect(() => {
    if (session?.user) {
      const { username } = session.user as unknown as User;
      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      setProfileUrl(`${baseUrl}/u/${username}`);
    }
  }, [session]);

  const copyToClipBoard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success("Link copied to clipboard");
  };

  if (!session)
    return (
      <div className="p-4 bg-gray-900 text-gray-100 min-h-screen">
        Please login to see your dashboard
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Spotlight
        gradientFirst="radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(210, 100%, 85%, .08) 0, hsla(210, 100%, 55%, .02) 50%, hsla(210, 100%, 45%, 0) 80%)"
        gradientSecond="radial-gradient(50% 50% at 50% 50%, hsla(210, 100%, 85%, .06) 0, hsla(210, 100%, 55%, .02) 80%, transparent 100%)"
        gradientThird="radial-gradient(50% 50% at 50% 50%, hsla(210, 100%, 85%, .04) 0, hsla(210, 100%, 45%, .02) 80%, transparent 100%)"
        translateY={-350}
        width={560}
        height={1380}
        smallWidth={240}
        duration={7}
        xOffset={100}
      />
      <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-gray-800 rounded shadow-lg w-full max-w-6xl">
        <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

        {profileUrl && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Copy Your Unique Link</h2>
            <div className="flex items-center">
              <input
                type="text"
                value={profileUrl}
                disabled
                className="input input-bordered w-full p-3 mr-2 bg-gray-700 border-gray-600 text-gray-200 rounded"
              />
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={copyToClipBoard}
              >
                Copy
              </Button>
            </div>
          </div>
        )}

        <div className="mb-6 flex items-center">
          <Switch
            {...register("isAccepting")}
            checked={isAccepting}
            onCheckedChange={handleSwitchChange}
            className="mr-2"
          />
          <span className="text-lg">
            Accept Messages:{" "}
            <span className={isAccepting ? "text-green-400" : "text-red-400"}>
              {isAccepting ? "On" : "Off"}
            </span>
          </span>
        </div>

        <Separator className="border-gray-700" />

        <div className="mt-4">
          <Button
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              fetchMessages(true);
            }}
            className="border border-gray-600 hover:border-gray-400 text-gray-200"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {messages.length > 0 ? (
            messages.map((message, index) => (
              <MessageCard
                message={message}
                onMessageDelete={handleDeleteMessages}
                key={index}
              />
            ))
          ) : (
            <p className="text-center col-span-3">No messages to display.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default page;
