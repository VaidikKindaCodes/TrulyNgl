"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { ApiResponse } from "@/types/ApiResponse";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BackgroundBeams } from "@/components/ui/background-beams";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { setUsernameSchema } from "@/schemas/setUsernameSchema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

export default function SetUsernamePage() {
  const { update } = useSession();
  const router = useRouter();
  const form = useForm<z.infer<typeof setUsernameSchema>>({
    resolver: zodResolver(setUsernameSchema),
    defaultValues: {
      username: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameMessage, setUsernameMessage] = useState("");

  const { watch } = form;
  const watchedUsername = watch("username");

  useEffect(() => {
    const handler = setTimeout(async () => {
      if (!watchedUsername) return;

      setIsCheckingUsername(true);
      setUsernameMessage("");

      try {
        const result = await axios.get(
          `/api/check-username-unique?username=${watchedUsername}`
        );
        setUsernameMessage(result.data.message);
      } catch(error) {
        const axiosError = error as AxiosError<ApiResponse>
        setUsernameMessage(axiosError.response?.data.message as string)
      } finally {
        setIsCheckingUsername(false);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [watchedUsername]);

  const onSubmit = async (data: z.infer<typeof setUsernameSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/set-username", {
        username: data.username,
      });

      if (response.data.success) {
        await update();
        toast.success(response.data.message);
        router.replace("/dashboard");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      const errorAxios = error as AxiosError<ApiResponse>;
      toast.error(errorAxios.response?.data.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-950">
      <BackgroundBeams />
      <div className="flex justify-center items-center min-h-screen">
        <div className="relative z-10 w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
              Set Your Username
            </h1>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                name="username"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Choose a username"
                        className="mt-2"
                      />
                    </FormControl>

                    {/* Availability status message moved outside FormControl */}
                    {isCheckingUsername && (
                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                        <Loader2 className="animate-spin w-4 h-4" />
                        Checking availability...
                      </div>
                    )}
                    {usernameMessage && !isCheckingUsername && (
                      <p
                        className={`text-sm mt-1 ${
                          usernameMessage.toLowerCase().includes("available")
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {usernameMessage}
                      </p>
                    )}

                    <FormDescription>
                      Choose a username to be included in your link
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Saving Username..." : "Save Username"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
