"use client";
import React from "react";
import {
    Card,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { X } from "lucide-react";
import { Message } from "@/model/User";
import dayjs from "dayjs";
import { Button } from "./ui/button";

type MessageCardProp = {
    message: Message;
    onMessageDelete: (messageId: string) => void;
};

function MessageCard({ message, onMessageDelete }: MessageCardProp) {
    const handleDeleteConfirm = async () => {
        onMessageDelete(message._id as string);
    };
    return (
        <Card className="bg-white rounded-md shadow-md border border-gray-200">
            <CardHeader className="flex items-center justify-between">
                <CardTitle className="text-xl font-medium text-gray-800">
                    {message.content}
                </CardTitle>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="hover:bg-red-600">
                            <X className="h-5 w-5" />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-white p-6 rounded-md">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="font-bold text-lg">
                                Are you sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-sm text-gray-600">
                                This action cannot be undone. This will permanently delete your
                                message and remove your data from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="mt-4 flex justify-end">
                            <AlertDialogCancel className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100">
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleDeleteConfirm}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 ml-2"
                            >
                                Continue
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardHeader>
            <CardFooter>
                <div className="text-sm text-gray-500">
                    {dayjs(message.createdAt).format("MMM D, YYYY h:mm A")}
                </div>
            </CardFooter>
        </Card>
    );
}

export default MessageCard;
