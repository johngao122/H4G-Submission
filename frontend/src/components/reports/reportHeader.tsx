"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Printer } from "lucide-react";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";

interface ReportHeaderProps {
    reportType: "audit" | "request";
    startDate: string;
    endDate: string;
    generatedAt: string;
}

export function ReportHeader({
    reportType,
    startDate,
    endDate,
    generatedAt,
}: ReportHeaderProps) {
    const handlePrint = () => {
        window.print();
    };

    const handleExport = () => {
        // TODO: Implement CSV export functionality
        console.log("Exporting report...");
    };

    return (
        <Card>
            <CardContent className="pt-6">
                <div className="flex flex-col space-y-6">
                    {/* Title and Actions */}
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold">
                            {reportType === "audit"
                                ? "Audit Log Report"
                                : "Product Request Report"}
                        </h1>
                        <div className="flex space-x-2 print:hidden">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handlePrint}
                            >
                                <Printer className="mr-2 h-4 w-4" />
                                Print
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleExport}
                            >
                                <FileText className="mr-2 h-4 w-4" />
                                Export CSV
                            </Button>
                        </div>
                    </div>

                    <Separator className="my-4" />

                    {/* Report Metadata */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Start Date
                            </p>
                            <p className="font-medium">
                                {format(new Date(startDate), "PPP")}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">
                                End Date
                            </p>
                            <p className="font-medium">
                                {format(new Date(endDate), "PPP")}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Generated At
                            </p>
                            <p className="font-medium">
                                {format(new Date(generatedAt), "PPP p")}
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
