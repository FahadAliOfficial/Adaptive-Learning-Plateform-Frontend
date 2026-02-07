import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-200 via-white to-blue-200 px-6 overflow-hidden relative">
        <style>{`
            @keyframes moveCircle {
                0%, 100% { background-position: 0% 0%; }
                50% { background-position: 100% 100%; }
            }
            .animate-circle {
                animation: moveCircle 8s ease-in-out infinite;
                background-size: 200% 200%;
            }
        `}</style>
        
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-200 via-white to-blue-200 animate-circle opacity-40"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-indigo-200 via-white to-purple-200 animate-circle opacity-40"></div>

        <div className="w-full max-w-2xl text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-400 bg-white/90 backdrop-blur">
                <span className="text-xs font-bold text-slate-700">404</span>
                <span className="text-xs text-slate-600">NOT FOUND</span>
            </div>

            <h1 className="mt-8 text-5xl md:text-7xl font-black text-slate-950 leading-tight">
                Page not found
            </h1>
            
            <p className="mt-4 text-lg text-slate-700 max-w-md mx-auto">
                The page you're looking for doesn't exist. Let us help you get back on track.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild className="h-12 px-8 font-semibold bg-slate-900 text-white hover:bg-slate-800 rounded-lg">
                    <Link href="/">Go Home</Link>
                </Button>
                <Button asChild variant="outline" className="h-12 px-8 font-semibold rounded-lg">
                    <Link href="/dashboard">Dashboard</Link>
                </Button>
            </div>
        </div>
    </div>
  )
}
