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

type ReportType = "audit" | "request" | "preorder" | "transaction";

const REPORT_TYPES = [
    {
        value: "audit",
        label: "Audit Log Report",
        description: "View all product-related actions and changes",
    },
    {
        value: "request",
        label: "Product Request Report",
        description: "View all product requests from residents",
    },
    {
        value: "preorder",
        label: "Preorder Report",
        description: "View all product preorders and their status",
    },
    {
        value: "transaction",
        label: "Transaction Report",
        description: "View all product transactions and revenue",
    },
] as const;

export default function ReportsPage() {
    const router = useRouter();
    const [reportType, setReportType] = React.useState<ReportType | "">("");
    const [dateState, setDateState] = React.useState<Range[]>([
        {
            startDate: new Date(),
            endDate: addDays(new Date(), 7),
            key: "selection",
        },
    ]);
    const [isMobile, setIsMobile] = React.useState(false);

    React.useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

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
                        <div className="space-y-2">
                            <Label htmlFor="report-type">Report Type</Label>
                            <Select
                                value={reportType}
                                onValueChange={(value) =>
                                    setReportType(value as ReportType)
                                }
                            >
                                <SelectTrigger id="report-type">
                                    <SelectValue placeholder="Select a report type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {REPORT_TYPES.map((type) => (
                                        <SelectItem
                                            key={type.value}
                                            value={type.value}
                                            className="space-y-1.5"
                                        >
                                            <div className="font-medium">
                                                {type.label}
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                {type.description}
                                            </p>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

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
                                    align="center"
                                >
                                    <div
                                        className={cn(
                                            "p-3 flex justify-center",
                                            isMobile && "overflow-x-auto"
                                        )}
                                    >
                                        <DateRange
                                            onChange={(item) =>
                                                setDateState([item.selection])
                                            }
                                            ranges={dateState}
                                            months={isMobile ? 1 : 2}
                                            direction={
                                                isMobile
                                                    ? "vertical"
                                                    : "horizontal"
                                            }
                                            rangeColors={["#0073C5"]}
                                            maxDate={new Date()}
                                            showDateDisplay={false}
                                            className={cn(
                                                "border-none shadow-none",
                                                isMobile && "max-w-full"
                                            )}
                                            monthDisplayFormat="MMMM yyyy"
                                            weekdayDisplayFormat="EEEEE"
                                        />
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>

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
