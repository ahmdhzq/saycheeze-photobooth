// components/Navbar.js
'use client';

import { Camera } from 'lucide-react';

export default function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full p-4">
            <div className="max-w-3xl mx-auto flex items-center justify-between p-3
                      bg-white/80 backdrop-blur-lg rounded-full shadow-sm border border-gray-200">

                {/* Bagian Kiri: Logo & Nama Brand */}
                <a href="/" className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-pink-100 flex items-center justify-center rounded-full">
                        <Camera className="w-6 h-6 text-pink-600" />
                    </div>
                    <span className="font-bold text-xl text-gray-800 hidden sm:block">
                        Say Cheeze
                    </span>
                </a>

                {/* Bagian Kanan: Tombol Aksi */}
                <a href="/"
                    className="px-5 py-2 bg-gray-800 hover:bg-gray-900 text-white 
                      rounded-lg font-semibold text-sm transition-colors"
                >
                    Kita Mulai dari Awal yaa!
                </a>
            </div>
        </header>
    );
}