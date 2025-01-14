import React from "react";
import TopBarAdmin from "@/components/topbarAdmin";
import TaskTableAdmin from "@/components/taskTable";

const AdminTasksPage = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <TopBarAdmin />
            <main className="pt-4">
                <TaskTableAdmin />
            </main>
        </div>
    );
};

export default AdminTasksPage;
