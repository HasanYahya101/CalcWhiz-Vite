import { useTheme } from "@/components/theme-provider";
import { useEffect } from "react";
import { Smartphone } from "lucide-react";

const isDesktop = () => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isMobile = /mobile|android|iphone|ipad|tablet|touch|samsung|fridge/i.test(userAgent);
    const isSmallScreen = window.innerWidth <= 1024;
    return !isMobile && !isSmallScreen;
};

export default function Apology() {
    const { setTheme } = useTheme();
    const isDesktopDevice = isDesktop();

    useEffect(() => {
        if (isDesktopDevice === false) {
            setTheme("system");
        }
    }, []);

    return (
        <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background dark:bg-black px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-md text-center">
                <Smartphone className="mx-auto h-12 w-12 text-blue-700" size={12} />
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl dark:text-white">
                    Sorry, this website is only available for desktop
                </h1>
                <p className="mt-4 text-muted-foreground dark:text-gray-400">
                    We apologize for the inconvenience, but our website is currently optimized for desktop devices only. Please
                    try accessing this site from a computer or laptop.
                </p>
            </div>
        </div>
    )
}


/*function SmartphoneIcon(props: React.HTMLAttributes<SVGSVGElement> & { className?: string }) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="blue"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
            <path d="M12 18h.01" />
        </svg>
    )
}*/