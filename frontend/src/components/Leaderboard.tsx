"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Crown, Medal, Trophy } from "lucide-react";

interface User {
    userId: string;
    name: string;
    voucherBal: number;
    role: string;
    status: string;
}

const Leaderboard = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API}/users`
                );
                const data = await response.json();

                const sortedResidents = data
                    .filter(
                        (user: User) =>
                            user.role === "RESIDENT" && user.status === "ACTIVE"
                    )
                    .sort((a: User, b: User) => b.voucherBal - a.voucherBal);

                setUsers(sortedResidents);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const getRankIcon = (index: number) => {
        switch (index) {
            case 0:
                return (
                    <Trophy className="h-8 w-8 text-yellow-500 animate-bounce" />
                );
            case 1:
                return (
                    <Medal className="h-8 w-8 text-gray-400 animate-pulse" />
                );
            case 2:
                return (
                    <Medal className="h-8 w-8 text-amber-600 animate-pulse" />
                );
            default:
                return <Crown className="h-6 w-6 text-blue-500 opacity-50" />;
        }
    };

    const getBackgroundColor = (index: number) => {
        switch (index) {
            case 0:
                return "bg-gradient-to-r from-yellow-50 to-yellow-100";
            case 1:
                return "bg-gradient-to-r from-gray-50 to-gray-100";
            case 2:
                return "bg-gradient-to-r from-amber-50 to-amber-100";
            default:
                return "bg-white hover:bg-gray-50";
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-8">
            <Card className="max-w-4xl mx-auto bg-white/80 backdrop-blur shadow-xl">
                <CardHeader className="text-center pb-8">
                    <CardTitle className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
                        Resident Leaderboard
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {users.map((user, index) => (
                        <div
                            key={user.userId}
                            className={`flex items-center p-6 rounded-xl transition-all duration-300 
                                transform hover:scale-105 hover:shadow-lg ${getBackgroundColor(
                                    index
                                )} 
                                ${index < 3 ? "shadow-md animate-fadeIn" : ""}
                                cursor-pointer`}
                            style={{
                                animationDelay: `${index * 150}ms`,
                                opacity: 0,
                                animation: "fadeIn 0.5s ease-out forwards",
                            }}
                        >
                            <div className="flex items-center space-x-6 flex-1">
                                <div className="flex-shrink-0 w-16 text-4xl font-bold text-gray-400">
                                    #{index + 1}
                                </div>
                                <div className="flex items-center space-x-4">
                                    <Avatar
                                        className={`h-16 w-16 border-2 ${
                                            index === 0
                                                ? "border-yellow-400 animate-pulse"
                                                : index === 1
                                                ? "border-gray-400"
                                                : index === 2
                                                ? "border-amber-400"
                                                : "border-blue-200"
                                        }`}
                                    >
                                        <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl">
                                            {user.name
                                                .slice(0, 2)
                                                .toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-bold text-xl text-gray-800">
                                            {user.name}
                                        </div>
                                        <div className="text-lg text-gray-600 font-medium">
                                            ${user.voucherBal.toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-shrink-0">
                                {getRankIcon(index)}
                            </div>
                        </div>
                    ))}

                    {users.length === 0 && (
                        <div className="text-center py-12 text-gray-500 text-xl animate-pulse">
                            No residents found
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Leaderboard;
