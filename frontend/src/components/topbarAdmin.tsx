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

const TopBarAdmin = () => {
    const navigationItems = [
        { name: "Tasks", href: "/admin/tasks" },
        { name: "User Accounts", href: "/admin/users" },
        { name: "Inventory", href: "/admin/inventory" },
        { name: "Reports", href: "/admin/reports" },
    ];

    return (
        <div className="w-full border-b border-gray-200 bg-white">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center space-x-8">
                        <div className="flex-shrink-0">
                            <a
                                href="/admin/dashboard"
                                className="flex items-center"
                            >
                                <div className="h-8 w-8 bg-blue-600 rounded-md flex items-center justify-center">
                                    <span className="text-white font-bold">
                                        M
                                    </span>
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

                    <div className="flex items-center">
                        <UserButton
                            appearance={{
                                elements: {
                                    userButtonAvatarBox: "w-8 h-8",
                                },
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopBarAdmin;
