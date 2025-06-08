// "use client";
// import React from "react";
// import { useForm } from "react-hook-form";
// import { Input } from "@/components/ui/input";
// import { useRouter } from "next/navigation";
// import { signinSchema } from "@/schemas/signinSchema";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";
// import { getSession, signIn } from "next-auth/react";
// import { toast } from "sonner";
// import { BackgroundBeams } from "@/components/ui/background-beams";

// function Page() {
//   const router = useRouter();
//   const form = useForm<z.infer<typeof signinSchema>>({
//     resolver: zodResolver(signinSchema),
//     defaultValues: {
//       identifier: "",
//       password: "",
//     },
//   });

//   const onSubmit = async (data: z.infer<typeof signinSchema>) => {
//     const result = await signIn("credentials", {
//       redirect: false,
//       identifier: data.identifier,
//       password: data.password,
//     });
//     if (result?.error) {
//       toast.error("incorrect details");
//     }
//     if (result?.ok) {
//     // Wait a moment for session to update, then fetch session
//     const sessionRes = await getSession();
//     const username = sessionRes?.user?.username;
//     const provider = sessionRes?.user?.provider ?? "credentials";

//     if (!username && provider !== "credentials") {
//       router.replace("/set-username");
//     } else {
//       router.replace("/dashboard");
//     }
//   }
//   };

//   return (
//     <div className="relative min-h-screen bg-gray-950">
//       <BackgroundBeams />
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="relative z-10 w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
//           <div className="text-center">
//             <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
//               Welcome Back to Truely NGL
//             </h1>
//             <p className="mb-4">
//               Sign in to continue reading your messages
//             </p>
//           </div>

//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//               <FormField
//                 name="identifier"
//                 control={form.control}
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Email/Username</FormLabel>
//                     <Input {...field} type="text" />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 name="password"
//                 control={form.control}
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Password</FormLabel>
//                     <Input {...field} type="password" />
//                   </FormItem>
//                 )}
//               />
//               <Button type="submit" className="w-full">
//                 Sign In
//               </Button>
//             </form>
//           </Form>
//           <div className="text-center mt-4">
//             <p>
//               Not a member yet?{" "}
//               <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
//                 Sign up
//               </Link>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Page;
"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import { toast } from "sonner";
import Link from "next/link";
import { Loader2 } from "lucide-react";

import { signinSchema } from "@/schemas/signinSchema";
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

function SignInPage() {
  const router = useRouter();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
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
  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signinSchema>) => {
    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    if (result?.error) {
      toast.error("Incorrect login details");
      return;
    }

    // Refresh the router to get updated session data
    router.refresh();

    const sessionRes = await getSession();
    const username = sessionRes?.user?.username;
    const provider = sessionRes?.user?.provider ?? "credentials";

    if (!username && provider !== "credentials") {
      router.replace("/set-username");
    } else {
      router.replace("/dashboard");
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-950">
      <BackgroundBeams />
      <div className="flex justify-center items-center min-h-screen">
        <div className="relative z-10 w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
              Welcome Back to Truely NGL
            </h1>
            <p className="mb-4">Sign in to continue reading your messages</p>
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
                name="identifier"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email / Username</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" />
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
              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>
          </Form>

          <div className="text-center mt-4">
            <p>
              Not a member yet?{" "}
              <Link
                href="/sign-up"
                className="text-blue-600 hover:text-blue-800"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignInPage;
