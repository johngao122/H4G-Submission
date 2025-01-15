"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { format, addDays } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange, Range } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
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
import { Label } from "@/components/ui/label";
import TopBarAdmin from "@/components/topbarAdmin";

export default function ReportsPage() {
    const router = useRouter();
    const [reportType, setReportType] = React.useState<string>("");
    const [dateState, setDateState] = React.useState<Range[]>([
        {
            startDate: new Date(),
            endDate: addDays(new Date(), 7),
            key: "selection",
        },
    ]);

    const handleGenerateReport = () => {
        if (!reportType || !dateState[0].startDate || !dateState[0].endDate) {
            return;
        }

        const formattedStartDate = format(dateState[0].startDate, "yyyy-MM-dd");
        const formattedEndDate = format(dateState[0].endDate, "yyyy-MM-dd");

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
                                            !dateState &&
                                                "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {dateState[0].startDate &&
                                        dateState[0].endDate ? (
                                            <>
                                                {format(
                                                    dateState[0].startDate,
                                                    "LLL dd, y"
                                                )}{" "}
                                                -{" "}
                                                {format(
                                                    dateState[0].endDate,
                                                    "LLL dd, y"
                                                )}
                                            </>
                                        ) : (
                                            <span>Pick a date range</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    className="w-auto p-0"
                                    align="start"
                                >
                                    <div className="p-3">
                                        <DateRange
                                            onChange={(item) =>
                                                setDateState([item.selection])
                                            }
                                            ranges={dateState}
                                            months={2}
                                            direction="horizontal"
                                            rangeColors={["#0073C5"]}
                                            maxDate={new Date()}
                                            showDateDisplay={false}
                                            className="border-none shadow-none"
                                        />
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Generate Button */}
                        <Button
                            className="w-full"
                            onClick={handleGenerateReport}
                            disabled={
                                !reportType ||
                                !dateState[0].startDate ||
                                !dateState[0].endDate
                            }
                        >
                            Generate Report
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}