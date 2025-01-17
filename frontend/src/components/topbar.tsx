import React from "react";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import { logo } from "@/resources";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";

const TopBar = () => {
    const navigationItems = [
        { name: "Shop", href: "/resident/dashboard/shop" },
        { name: "Quests", href: "/resident/dashboard/tasks" },
        { name: "Transaction History", href: "/resident/dashboard/history" },
        { name: "Leaderboards", href: "/resident/dashboard/leaderboard" },
        { name: "Request Items", href: "/resident/dashboard/request" },
    ];

    return (
        <div className="w-full border-b border-gray-200 bg-white">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center space-x-8">
                        <div className="flex-shrink-0">
                            <a
                                href="/resident/dashboard"
                                className="flex items-center"
                            >
                                <div className="h-8 w-8 rounded-md flex items-center justify-center">
                                    <Image src={logo} alt="logo" />
                                </div>
                                <span className="ml-2 text-lg font-semibold text-gray-900">
                                    MWH Minimart
                                </span>
                            </a>
                        </div>

                        <NavigationMenu className="hidden md:flex">
                            <NavigationMenuList>
                                {navigationItems.map((item) => (
                                    <NavigationMenuItem key={item.name}>
                                        <NavigationMenuLink
                                            href={item.href}
                                            className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                                        >
                                            {item.name}
                                        </NavigationMenuLink>
                                    </NavigationMenuItem>
                                ))}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>

                    <div className="flex items-center space-x-4">
                        <UserButton
                            appearance={{
                                elements: {
                                    userButtonAvatarBox: "w-8 h-8",
                                },
                            }}
                        />

                        <div className="md:hidden">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <Menu className="h-6 w-6" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="right">
                                    <SheetHeader>
                                        <SheetTitle>MWH Minimart</SheetTitle>
                                    </SheetHeader>
                                    <div className="flex flex-col space-y-4 mt-6">
                                        {navigationItems.map((item) => (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                className="text-lg font-medium text-gray-700 hover:text-gray-900 py-2"
                                            >
                                                {item.name}
                                            </Link>
                                        ))}
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopBar;
