"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { ApiResponse } from "@/types/ApiResponse";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

export default function SetUsernamePage() {
    const { update } = useSession();
    const router = useRouter();
    const form = useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit = async (data: any) => {
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
                        <p className="text-gray-500">Choose a unique username</p>
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
                                            <Input {...field} placeholder="Choose a username" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={ isSubmitting}
                            >
                                {isSubmitting ? "Saving Username..." : "Save Username"}
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
}
