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

function Page() {
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
      setValue("isAccepting", response?.data.isAcceptingMessages ?? false);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data?.message || "Error fetching accepting state"
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
    try {
      const response = await axios.delete(`/api/delete-message/${messageId}`);
      if (response.data.success) {
        setMessages((prev) => prev.filter((message) => message._id !== messageId));
        toast.success("Message deleted successfully");
      } else {
        toast.error(response.data.message || "Error while deleting message");
      }
    } catch (error) {
      const errorAxios = error as AxiosError;
      toast.error(
        (errorAxios.response?.data as any)?.message || "Error while deleting message"
      );
    }
  };

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post(`/api/accept-messages`, {
        isAcceptingMessages: !isAccepting,
      });
      setValue("isAccepting", !isAccepting);
      toast.success(response.data.message || "User updated");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data?.message || "Error switching states"
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-2">
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 sm:p-8 flex flex-col items-center w-full max-w-xs sm:max-w-md">
          <svg
        className="animate-spin h-8 w-8 text-blue-400 mb-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
          >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        ></path>
          </svg>
          <h2 className="text-lg sm:text-xl font-semibold mb-2 text-gray-100 text-center">
        Loading your session...
          </h2>
          <p className="text-gray-400 text-center text-sm sm:text-base">
        Please wait while we fetch your last session.
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 overflow-x-hidden relative">
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
      <div className="my-4 mx-2 md:mx-8 lg:mx-auto p-2 sm:p-4 md:p-6 bg-gray-800 rounded shadow-lg w-full max-w-6xl">
      <h1 className="text-2xl md:text-4xl font-bold mb-4 text-center md:text-left break-words">User Dashboard</h1>

      {profileUrl && (
        <div className="mb-6">
        <h2 className="text-lg md:text-xl font-semibold mb-2">Copy Your Unique Link</h2>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <input
          type="text"
          value={profileUrl}
          disabled
          className="input input-bordered w-full p-3 bg-gray-700 border-gray-600 text-gray-200 rounded break-all"
          style={{ minWidth: 0 }}
          />
          <Button
          className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
          onClick={copyToClipBoard}
          >
          Copy
          </Button>
        </div>
        </div>
      )}

      <div className="mb-6 flex flex-col sm:flex-row items-center gap-2">
        <Switch
        {...register("isAccepting")}
        disabled={isSwitchLoading}
        checked={isAccepting}
        onCheckedChange={handleSwitchChange}
        className="mr-0 sm:mr-2"
        />
        <span className="text-base md:text-lg">
        Accept Messages:{" "}
        <span className={isAccepting ? "text-green-400" : "text-red-400"}>
          {isAccepting ? "On" : "Off"}
        </span>
        </span>
        {isSwitchLoading && (
        <Loader2 className="h-4 w-4 animate-spin ml-0 sm:ml-2" />
        )}
      </div>

      <Separator className="border-gray-700" />

      <div className="mt-4 flex justify-end">
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

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {messages.length > 0 ? (
        messages.map((message, index) => (
          <div key={index} className="min-w-0 break-words">
          <MessageCard
            message={message}
            onMessageDelete={handleDeleteMessages}
          />
          </div>
        ))
        ) : (
        <p className="text-center col-span-1 sm:col-span-2 md:col-span-3">No messages to display.</p>
        )}
      </div>
      </div>
    </div>
  );
}

export default Page;
