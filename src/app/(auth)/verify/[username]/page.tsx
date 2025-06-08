"use client";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { verifySchema } from "@/schemas/verifyCode";
import axios, { AxiosError } from "axios";
import { z } from "zod";
import { ApiResponse } from "@/types/ApiResponse";
import {
  Form,
  FormItem,
  FormControl,
  FormLabel,
  FormField,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BackgroundBeams } from "@/components/ui/background-beams";

type VerifyInput = z.infer<typeof verifySchema>;

function page() {
  const router = useRouter();
  const params = useParams<{ username: string }>();

  const form = useForm<VerifyInput>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (data: VerifyInput) => {
    try {
      const response = await axios.post(`/api/verify-code`, {
        username: params.username,
        verifyCode: data.code,
      });
      toast.success(`${response.data.message}`);
      router.replace("/sign-in");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast.error(errorMessage || "Something went wrong");
    }
  };

  return (
    <>
      <div className="relative min-h-screen bg-gray-950">
        <BackgroundBeams />
        <div className="flex justify-center items-center min-h-screen">
          <div className="z-10 w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                Verify Your Account
              </h1>
              <p className="mb-4">
                Enter the verification code sent to your email
              </p>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Verification Code</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="align-middle">
                  Submit
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}

export default page;
