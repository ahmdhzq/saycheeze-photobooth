'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Camera, Upload, Film, ArrowLeft } from 'lucide-react';

import Navbar from '../components/Navbar';
import LandingPage from '../components/LandingPage';
import GridSelector from '../components/GridSelector';

const CameraView = dynamic(() => import('../components/CameraView'), {
  ssr: false, 
  loading: () => <p className="animate-pulse">📷 Preparing...</p>
});

const PreviewPage = dynamic(() => import('../components/PreviewPage'), {
  ssr: false,
  loading: () => <p className="animate-pulse">✨ Loading preview...</p>
});

export default function Home() {
  const [currentStep, setCurrentStep] = useState('intro');
  const [selectedGrid, setSelectedGrid] = useState(null);
  const [captureMode, setCaptureMode] = useState(null);
  const [capturedImages, setCapturedImages] = useState([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => { setIsClient(true); }, []);
  
  const handleReset = () => {
      setCurrentStep('intro');
      setSelectedGrid(null);
      setCaptureMode(null);
      setCapturedImages([]);
  };

  const handleBack = () => {
    if (currentStep === 'preview') return; 
    if (currentStep === 'capture') setCurrentStep('mode-selection');
    if (currentStep === 'mode-selection') setCurrentStep('grid');
    if (currentStep === 'grid') setCurrentStep('intro');
  };

  const handleGridSelect = (grid) => {
    setSelectedGrid(grid);
    setCurrentStep('mode-selection');
  };

  const handleModeSelect = (mode) => {
    setCaptureMode(mode);
    setCurrentStep('capture');
  };

  const handleCaptureComplete = (images) => {
    setCapturedImages(images);
    setCurrentStep('preview');
  };
  
  return (
    <div>
        <Navbar onReset={handleReset} />

        <main className="relative flex min-h-screen flex-col items-center justify-center 
                         text-gray-800 px-4 md:px-6 pb-12">

          <div className="absolute inset-0 flex justify-center items-center overflow-hidden -z-10">
            <div className="w-[500px] h-[500px] bg-pink-200/50 blur-3xl rounded-full"></div>
          </div>

          <div className="relative z-10 w-full max-w-6xl">
            {currentStep === 'intro' && (
              <LandingPage onStart={() => setCurrentStep('grid')} />
            )}

            {currentStep === 'grid' && (
              <GridSelector onGridSelect={handleGridSelect} onBack={handleBack} />
            )}
            
            {currentStep === 'mode-selection' && (
                <div className="w-full max-w-2xl mx-auto">
                    <button onClick={handleBack} className="flex items-center gap-2 font-semibold text-gray-600 hover:text-gray-900 transition-colors mb-4">
                        <ArrowLeft size={18} />
                        Back
                    </button>
                    <section className="text-center space-y-6 flex flex-col items-center bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
                        <div className="flex justify-center p-4 bg-pink-100/50 rounded-full">
                            <Film className="w-12 h-12 text-pink-500" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
                            Choose How to Add Your Photos
                        </h1>
                        <p className="text-lg text-gray-600 max-w-xl mx-auto">
                            You will be filling {selectedGrid.photoCount} photo slots.
                        </p>
                        <div className="grid md:grid-cols-2 gap-6 pt-4 w-full">
                            <button onClick={() => handleModeSelect('camera')} className="p-6 bg-white border-2 border-gray-200 rounded-2xl text-left hover:border-pink-500 hover:bg-pink-50 transition-all group">
                                <Camera className="w-8 h-8 text-pink-500 mb-3" />
                                <h3 className="text-lg font-bold text-gray-800">Use Camera</h3>
                                <p className="text-gray-600">Take new photos in sequence.</p>
                            </button>
                            <button onClick={() => handleModeSelect('upload')} className="p-6 bg-white border-2 border-gray-200 rounded-2xl text-left hover:border-indigo-500 hover:bg-indigo-50 transition-all group">
                                <Upload className="w-8 h-8 text-indigo-500 mb-3" />
                                <h3 className="text-lg font-bold text-gray-800">Upload from Gallery</h3>
                                <p className="text-gray-600">Select photos one by one from your device.</p>
                            </button>
                        </div>
                    </section>
                </div>
            )}

            {isClient && currentStep === 'capture' && (
              <CameraView
                grid={selectedGrid}
                mode={captureMode}
                onComplete={handleCaptureComplete}
                onBack={handleBack}
              />
            )}

            {isClient && currentStep === 'preview' && (
              <PreviewPage
                images={capturedImages}
                grid={selectedGrid}
              />
            )}
          </div>
          <footer className="relative z-10 mt-16 text-sm text-center text-gray-500 space-y-1">
            <p>© {new Date().getFullYear()} Say Cheeze — Capture Your Moment</p>
            <p>
              Crafted by{' '}
              <a
                href="https://ahmdhzq-portfolio.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-gray-600 hover:text-pink-600 transition-colors"
              >
                Ahmad Haziq
              </a>
            </p>
          </footer>
        </main>
    </div>
  );
}