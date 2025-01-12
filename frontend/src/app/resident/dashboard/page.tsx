"use client";
import { useRoleCheck } from "@/hooks/useRoleCheck";
import TopBar from "@/components/topbar";

export default function ResidentDashboard() {
    /*
    const { isLoading } = useRoleCheck("resident");

    if (isLoading) {
        return <div>Loading...</div>;
    }
    */
    return (
        <div className="min-h-screen bg-gray-50">
            <TopBar />
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="space-y-6">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">
                            Welcome to MWH Minimart
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            View your vouchers, make purchases, and complete
                            tasks to earn more points.
                        </p>
                    </div>

                    {/* Dashboard content sections */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {/* Quick Actions Card */}
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <h2 className="text-lg font-medium text-gray-900">
                                    Quick Actions
                                </h2>
                                <div className="mt-4 space-y-2">
                                    {/* Add your quick action buttons/links here */}
                                </div>
                            </div>
                        </div>

                        {/* Voucher Balance Card */}
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <h2 className="text-lg font-medium text-gray-900">
                                    Voucher Balance
                                </h2>
                                <div className="mt-4">
                                    {/* Add voucher balance display here */}
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity Card */}
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <h2 className="text-lg font-medium text-gray-900">
                                    Recent Activity
                                </h2>
                                <div className="mt-4">
                                    {/* Add recent activity list here */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
