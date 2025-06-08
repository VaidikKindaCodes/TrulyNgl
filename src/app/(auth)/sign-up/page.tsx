"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { signIn, getSession } from "next-auth/react";

import { signupSchema } from "@/schemas/signupSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { BackgroundBeams } from "@/components/ui/background-beams";

function SignUpPage() {
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const watchedUsername = form.watch("username");

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
      } catch {
        setUsernameMessage("Error checking username.");
      } finally {
        setIsCheckingUsername(false);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [watchedUsername]);

  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", data);
      toast.success(response.data.message);
      router.replace(`/verify/${data.username}`);
    } catch {
      toast.error("Signup failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
  const result = await signIn("google", { redirect: false });

  if (result?.error) {
    toast.error("Google sign-in failed.");
    setIsGoogleLoading(false);
    return;
  }

  setTimeout(async () => {
    let session = await getSession();

    // Retry once if username is missing (optional)
    if (!session?.user?.username) {
      session = await getSession();
    }

    const username = session?.user?.username;
    const provider = session?.user?.provider ?? "credentials";

    if (!username && provider !== "credentials") {
      router.replace("/set-username");
    } else {
      router.replace("/dashboard");
    }

    setIsGoogleLoading(false);
  }, 1000);
  };

  return (
    <div className="relative min-h-screen bg-gray-950">
      <BackgroundBeams />
      <div className="flex justify-center items-center min-h-screen">
        <div className="z-10 w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
              Welcome to Truely NGL
            </h1>
            <p className="mb-4">
              Create an account to start receiving your messages
            </p>
          </div>

          <Button
            onClick={handleGoogleSignIn}
            variant="outline"
            className="w-full"
            disabled={isGoogleLoading}
          >
            {isGoogleLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin w-4 h-4" />
                Signing in with Google...
              </span>
            ) : (
              "Continue with Google"
            )}
          </Button>

          <div className="flex items-center gap-4 my-4">
            <div className="flex-grow h-px bg-gray-300" />
            <span className="text-gray-500 text-sm">or</span>
            <div className="flex-grow h-px bg-gray-300" />
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
                      <Input {...field} type="text" />
                    </FormControl>
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
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin h-4 w-4" />
                    Signing up...
                  </span>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </form>
          </Form>

          <div className="text-center mt-4">
            <p>
              Already a member?{" "}
              <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
