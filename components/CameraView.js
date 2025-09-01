// components/CameraView.js
'use client';

import { useState, useEffect, useRef } from 'react';

export default function CameraView({ grid, onComplete }) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [stream, setStream] = useState(null);

    const [images, setImages] = useState(Array(grid.photoCount).fill(null));
    const [timerDuration, setTimerDuration] = useState(3);
    const [countdown, setCountdown] = useState(null);
    const [isCapturing, setIsCapturing] = useState(false);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

    useEffect(() => {
        const startCamera = async () => {
            try {
                const streamData = await navigator.mediaDevices.getUserMedia({
                    video: { width: 1280, height: 720, facingMode: 'user' },
                    audio: false,
                });
                setStream(streamData);
                if (videoRef.current) {
                    videoRef.current.srcObject = streamData;
                }
            } catch (err) {
                console.error("Error accessing camera:", err);
            }
        };
        startCamera();
        return () => {
            if (stream) stream.getTracks().forEach(track => track.stop());
        };
    }, []);

    useEffect(() => {
        if (!isCapturing || currentPhotoIndex >= grid.photoCount) {
            return;
        }

        const initialPause = setTimeout(() => {
            setCountdown(timerDuration);
            const countdownInterval = setInterval(() => {
                setCountdown(prev => (prev !== null ? prev - 1 : null));
            }, 1000);

            const captureTimeout = setTimeout(() => {
                clearInterval(countdownInterval);
                setCountdown(null);
                takePicture();
            }, timerDuration * 1000);
            
            return () => {
                clearTimeout(captureTimeout);
                clearInterval(countdownInterval);
            };
        }, currentPhotoIndex === 0 ? 0 : 2000);

        return () => clearTimeout(initialPause);
    }, [isCapturing, currentPhotoIndex, grid.photoCount, timerDuration]);

    const takePicture = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            context.translate(canvas.width, 0);
            context.scale(-1, 1);
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/png');

            const newImages = [...images];
            newImages[currentPhotoIndex] = dataUrl;
            setImages(newImages);

            if (currentPhotoIndex >= grid.photoCount - 1) {
                setIsCapturing(false);
                onComplete(newImages);
            } else {
                setCurrentPhotoIndex(prev => prev + 1);
            }
        }
    };
    
    const handleStartSession = () => {
        setCurrentPhotoIndex(0);
        setImages(Array(grid.photoCount).fill(null));
        setIsCapturing(true);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-6xl mx-auto px-4 md:px-6 py-6">
                    <div className="text-center">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                            Siap Foto? Ayo Mulai!
                        </h1>
                        <p className="text-gray-600 text-sm md:text-base">
                            Layout: <span className="font-semibold text-pink-600">{grid.label}</span> • Total: <span className="font-semibold text-pink-600">{grid.photoCount} foto</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto p-4 md:p-6">
                
                {/* Camera Section */}
                <div className="mb-6 md:mb-8">
                    <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-200 p-3 md:p-6">
                        <div className="relative aspect-video rounded-lg md:rounded-xl overflow-hidden bg-black shadow-sm">
                            <video 
                                ref={videoRef} 
                                autoPlay 
                                playsInline 
                                muted 
                                className="w-full h-full object-cover transform -scale-x-100" 
                            />
                            <canvas ref={canvasRef} style={{ display: 'none' }} />
                            
                            {countdown !== null && countdown > 0 && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                                    <div className="text-center">
                                        <div className="text-8xl md:text-9xl font-bold text-white mb-4 animate-pulse">
                                            {countdown}
                                        </div>
                                        <div className="text-xl md:text-2xl font-semibold text-pink-400">
                                            Siap-siap... Smile!
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            <div className="absolute top-2 left-2 md:top-4 md:left-4 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                <span className="text-white text-xs md:text-sm font-medium">LIVE</span>
                            </div>

                            {isCapturing && (
                                <div className="absolute top-2 right-2 md:top-4 md:right-4 bg-black/60 backdrop-blur-sm rounded-xl px-3 py-1.5">
                                    <span className="text-white font-semibold">
                                        {currentPhotoIndex + 1} / {grid.photoCount}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Control Panel */}
                {!isCapturing ? (
                    <div className="mb-6 md:mb-8">
                        <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-200 p-4 md:p-6">
                            <div className="flex flex-col items-center gap-4">
                                
                                <div className="text-center md:text-left">
                                    <span className="text-lg font-semibold text-gray-900">Timer Countdown</span>
                                </div>
                                
                                <div className="flex gap-3">
                                    {[3, 5, 10].map(duration => (
                                        <button 
                                            key={duration} 
                                            onClick={() => setTimerDuration(duration)}
                                            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 text-base ${
                                                timerDuration === duration 
                                                    ? 'bg-pink-600 text-white shadow-sm' 
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                        >
                                            {duration}s
                                        </button>
                                    ))}
                                </div>

                                <button 
                                    onClick={handleStartSession} 
                                    className="w-full md:w-auto bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-3 mt-4"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M19 10a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Mulai Sesi Foto!
                                </button>

                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="mb-6 md:mb-8">
                        <div className="bg-pink-50 border border-pink-200 rounded-xl md:rounded-2xl p-4 md:p-6">
                            <div className="text-center">
                                <p className="text-base md:text-lg text-gray-700 mb-2">
                                    Mengambil foto <span className="font-bold text-pink-600">{currentPhotoIndex + 1}</span> dari <span className="font-bold text-pink-600">{grid.photoCount}</span>... Siapkan pose terbaikmu!
                                </p>
                                
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                        className="bg-pink-500 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${((currentPhotoIndex + 1) / grid.photoCount) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Photo Gallery Preview */}
                <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-200 p-4 md:p-6">
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Preview Galeri Foto</h3>
                    
                    <div className="grid gap-2 md:gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                        {images.map((img, index) => (
                            <div key={index} 
                                 className={`group relative aspect-video bg-gray-100 rounded-lg md:rounded-xl flex items-center justify-center overflow-hidden border-2 transition-all duration-300 ${
                                     img ? 'border-green-400 bg-green-50' : 
                                     index === currentPhotoIndex && isCapturing ? 'border-pink-400 bg-pink-50 animate-pulse' :
                                     'border-gray-200'
                                 }`}>
                                {img ? (
                                    <>
                                        <img src={img} alt={`Capture ${index + 1}`} className="w-full h-full object-cover" />
                                        <div className="absolute top-1.5 right-1.5 md:top-2 md:right-2 bg-green-500 text-white rounded-full p-1">
                                            <svg className="w-2 h-2 md:w-3 md:h-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center p-2">
                                        <span className={`text-xs md:text-sm font-medium ${
                                            index === currentPhotoIndex && isCapturing ? 'text-pink-600' : 'text-gray-500'
                                        }`}>
                                            {index === currentPhotoIndex && isCapturing ? 'Berikutnya' : `Foto ${index + 1}`}
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}