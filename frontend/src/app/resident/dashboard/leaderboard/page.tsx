import React from "react";
import Leaderboard from "@/components/Leaderboard";
import TopBar from "@/components/topbar";

export default function LeaderboardPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <TopBar />
            <main className="flex-1 bg-gray-50">
                <Leaderboard />
            </main>
        </div>
    );
}
