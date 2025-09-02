'use client';

import { Camera } from 'lucide-react';
import Link from 'next/link';

export default function Navbar({ onReset }) {
    return (
        <header className="sticky top-0 z-50 w-full p-2 sm:p-4">
            <div className="max-w-3xl mx-auto flex items-center justify-between p-2 sm:p-3
                      bg-white/80 backdrop-blur-lg rounded-full shadow-md border border-gray-200">

                <Link href="/" className="flex items-center gap-2 sm:gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-pink-100 flex items-center justify-center rounded-full">
                        <Camera className="w-5 h-5 sm:w-6 sm:h-6 text-pink-600" />
                    </div>
                    <span className="font-bold text-lg sm:text-xl text-gray-800 hidden sm:block">
                        Say Cheeze
                    </span>
                </Link>

                <button 
                    onClick={onReset}
                    className="px-4 py-2 sm:px-5 sm:py-2 bg-gray-800 hover:bg-gray-900 text-white 
                               rounded-full sm:rounded-xl font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
                >
                    Kita mulai dari awal yaa!
                </button>
            </div>
        </header>
    );
}