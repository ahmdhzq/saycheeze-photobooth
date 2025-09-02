// components/LandingPage.js
'use client';

import { Camera } from 'lucide-react';

export default function LandingPage({ onStart }) {
  return (
    <section className="relative z-10 text-center space-y-6 flex flex-col items-center">
      <div className="flex justify-center p-4 bg-pink-100/50 rounded-full">
        <Camera className="w-12 h-12 text-pink-500" />
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
        Say Cheeze - Free Online Photobooth
      </h1>
      <p className="text-lg text-gray-600 max-w-xl mx-auto">
        Abadikan momen seru bersama teman & keluarga langsung dari browser Anda.
        Pilih gaya, ambil foto, dan bagikan hasilnya dengan mudah 🎉
      </p>

      <button
        onClick={onStart}
        className="px-8 py-3 bg-pink-500 hover:bg-pink-600 text-white 
                   rounded-full font-semibold shadow-lg transition-transform transform hover:scale-105"
      >
        Mulai Sekarang
      </button>
    </section>
  );
}