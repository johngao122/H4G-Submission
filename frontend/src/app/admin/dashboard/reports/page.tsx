"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import TopBarAdmin from "@/components/topbarAdmin";

export default function ReportsPage() {
    const router = useRouter();
    const [reportType, setReportType] = React.useState<string>("");
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: undefined,
        to: undefined,
    });

    const handleGenerateReport = () => {
        if (!reportType || !date?.from || !date?.to) {
            return;
        }

        const formattedStartDate = format(date.from, "yyyy-MM-dd");
        const formattedEndDate = format(date.to, "yyyy-MM-dd");

        router.push(
            `/admin/dashboard/reports/${reportType}/${[
                formattedStartDate,
                formattedEndDate,
            ].join("/")}`
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <TopBarAdmin />
            <div className="container mx-auto px-4 py-8 mt-16">
                {" "}
                {/* Added mt-16 for spacing below TopBar */}
                <Card>
                    <CardHeader>
                        <CardTitle>Generate Reports</CardTitle>
                        <CardDescription>
                            Select a report type and date range to generate a
                            report
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Report Type Selection */}
                        <div className="space-y-2">
                            <Label htmlFor="report-type">Report Type</Label>
                            <Select
                                value={reportType}
                                onValueChange={setReportType}
                            >
                                <SelectTrigger id="report-type">
                                    <SelectValue placeholder="Select a report type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="audit">
                                        Audit Log Report
                                    </SelectItem>
                                    <SelectItem value="request">
                                        Product Request Report
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Date Range Picker */}
                        <div className="space-y-2">
                            <Label>Date Range</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        id="date"
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !date && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {date?.from ? (
                                            date.to ? (
                                                <>
                                                    {format(
                                                        date.from,
                                                        "LLL dd, y"
                                                    )}{" "}
                                                    -{" "}
                                                    {format(
                                                        date.to,
                                                        "LLL dd, y"
                                                    )}
                                                </>
                                            ) : (
                                                format(date.from, "LLL dd, y")
                                            )
                                        ) : (
                                            <span>Pick a date range</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    className="w-auto p-0"
                                    align="start"
                                >
                                    <Calendar
                                        initialFocus
                                        mode="range"
                                        defaultMonth={date?.from}
                                        selected={date}
                                        onSelect={setDate}
                                        numberOfMonths={2}
                                        disabled={(date) => date > new Date()}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Generate Button */}
                        <Button
                            className="w-full"
                            onClick={handleGenerateReport}
                            disabled={!reportType || !date?.from || !date?.to}
                        >
                            Generate Report
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
