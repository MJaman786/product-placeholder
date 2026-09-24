import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';

export default function Unauthorized() {
    // Safely handles browser history navigation back one step
    const handleGoBack = () => {
        if (typeof window !== 'undefined') {
            window.history.back();
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-50/50 p-4">
            {/* Main Error Card */}
            <div className="w-full max-w-md bg-white border border-slate-100 rounded-2xl p-8 shadow-sm text-center">
                
                {/* Security Warning Icon */}
                <div className="flex justify-center mb-5">
                    <div className="p-4 bg-red-50 text-red-600 rounded-2xl shadow-inner">
                        <ShieldAlert className="w-10 h-10" />
                    </div>
                </div>

                {/* HTTP Status Code & Heading */}
                <h1 className="text-6xl font-black text-slate-200 tracking-tighter mb-1 select-none">
                    403
                </h1>
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
                    Access Denied
                </h2>
                
                {/* Informative Context Message */}
                <p className="text-sm text-slate-500 mt-3 leading-relaxed max-w-sm mx-auto">
                    You do not have permission to view this page. It looks like your account doesn't possess the clearance required to access this resource.
                </p>

                {/* Fully Mobile Responsive Action Buttons Block */}
                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={handleGoBack}
                        type="button"
                        className="w-full sm:flex-1 py-3 px-4 inline-flex items-center justify-center gap-2 text-sm font-medium bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl transition-all duration-200 active:scale-[0.98] outline-none focus:ring-2 focus:ring-slate-100"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Go Back
                    </button>
                    
                    <a
                        href="/"
                        className="w-full sm:flex-1 py-3 px-4 inline-flex items-center justify-center gap-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-100 transition-all duration-200 active:scale-[0.98] outline-none focus:ring-2 focus:ring-indigo-100"
                    >
                        <Home className="w-4 h-4" />
                        Return Home
                    </a>
                </div>

                {/* System Admin Helper Note */}
                <p className="text-xs text-slate-400 mt-8">
                    If you believe this is an error, please reach out to your administrator.
                </p>
            </div>
        </div>
    );
}