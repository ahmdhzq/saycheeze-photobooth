'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Camera } from 'lucide-react';
import GridSelector from '../components/GridSelector';

const CameraView = dynamic(() => import('../components/CameraView'), {
  ssr: false,
  loading: () => (
    <div className="text-center p-10 bg-gray-100 rounded-lg">
      <p className="animate-pulse">📷 Mempersiapkan kamera...</p>
    </div>
  )
});

const PreviewPage = dynamic(() => import('../components/PreviewPage'), {
  ssr: false,
  loading: () => (
    <div className="text-center p-10 bg-gray-100 rounded-lg">
      <p className="animate-pulse">✨ Memuat pratinjau...</p>
    </div>
  )
});

export default function Home() {
  const [currentStep, setCurrentStep] = useState('intro');
  const [selectedGrid, setSelectedGrid] = useState(null);
  const [capturedImages, setCapturedImages] = useState([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => { setIsClient(true); }, []);

  const handleGridSelect = (grid) => {
    setSelectedGrid(grid);
    setCurrentStep('camera');
  };

  const handleCaptureComplete = (images) => {
    setCapturedImages(images);
    setCurrentStep('preview');
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center 
                     bg-white text-gray-800 px-6 py-12 overflow-hidden">

      {/* Background efek lembut */}
      <div className="absolute inset-0 flex justify-center items-center">
        <div className="w-[500px] h-[500px] bg-pink-200/50 blur-3xl rounded-full"></div>
      </div>

      {/* Intro */}
      {currentStep === 'intro' && (
        <section className="relative z-10 text-center space-y-6">
          <div className="flex justify-center">
            <Camera className="w-16 h-16 text-pink-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
            Say Cheeze - Free Online Photobooth
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Abadikan momen seru bersama teman & keluarga langsung dari browser Anda.
            Pilih gaya, ambil foto, dan bagikan hasilnya dengan mudah 🎉
          </p>

          <button
            onClick={() => setCurrentStep('grid')}
            className="px-8 py-3 bg-pink-500 hover:bg-pink-600 text-white 
                       rounded-full font-semibold shadow-md transition"
          >
            Mulai Sekarang
          </button>
        </section>
      )}

      {/* Pilih grid */}
      {currentStep === 'grid' && (
        <div className="relative z-10 w-full max-w-4xl mt-6">
          <GridSelector onGridSelect={handleGridSelect} />
        </div>
      )}

      {/* Kamera */}
      {isClient && currentStep === 'camera' && (
        <div className="relative z-10 w-full max-w-4xl mt-6">
          <CameraView
            grid={selectedGrid}
            onComplete={handleCaptureComplete}
          />
        </div>
      )}

      {/* Preview */}
      {isClient && currentStep === 'preview' && (
        <div className="relative z-10 w-full max-w-4xl mt-6">
          <PreviewPage
            images={capturedImages}
            grid={selectedGrid}
          />
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 mt-16 text-sm text-gray-500">
        © {new Date().getFullYear()} Online Photobooth — Capture Your Moment
      </footer>
    </main>
  );
}
