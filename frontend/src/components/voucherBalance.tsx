import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { DollarSign } from "lucide-react";

const VoucherBalance = (balance: number) => {
    const balanceDisplay = "$" + balance.toFixed(2);
    return (
        <Card className="bg-white">
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500">
                            Available Balance
                        </p>
                        <h3 className="text-4xl font-bold mt-1">
                            {balanceDisplay}
                        </h3>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-full">
                        <DollarSign className="h-6 w-6 text-blue-600" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default VoucherBalance;
