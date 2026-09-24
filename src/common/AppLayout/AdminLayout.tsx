import { useState } from "react";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { Outlet } from "react-router-dom";

interface Props {
    activePage: string;
}

export default function AdminLayoutWrapper({ activePage }: Props) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="font-sans h-screen w-full bg-canvas text-ink flex overflow-hidden antialiased">
            {/* Mobile overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            {/* Main content */}
            <main className="flex-1 h-screen overflow-y-auto custom-scrollbar flex flex-col relative w-full bg-canvas">
                <Navbar
                    title={activePage}
                    onMenuToggle={() => setIsSidebarOpen(true)}
                />
                <div className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto flex flex-col gap-6 flex-1">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
