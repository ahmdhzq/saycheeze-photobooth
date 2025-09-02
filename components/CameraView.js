// components/CameraView.js
'use client';

import { useState, useEffect, useRef } from 'react';
import { Camera, Upload, Check } from 'lucide-react';

// ===================================
// Bagian untuk MODE KAMERA OTOMATIS
// ===================================
function CameraSession({ grid, onComplete }) {
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
                const streamData = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720, facingMode: 'user' }, audio: false });
                if (videoRef.current) videoRef.current.srcObject = streamData;
            } catch (err) { console.error("Error accessing camera:", err); }
        };
        startCamera();
        return () => { if (videoRef.current && videoRef.current.srcObject) videoRef.current.srcObject.getTracks().forEach(track => track.stop()); };
    }, []);

    useEffect(() => {
        if (!isCapturing || currentPhotoIndex >= grid.photoCount) return;
        const initialPause = setTimeout(() => {
            setCountdown(timerDuration);
            const countdownInterval = setInterval(() => setCountdown(prev => (prev !== null ? prev - 1 : null)), 1000);
            const captureTimeout = setTimeout(() => {
                clearInterval(countdownInterval);
                setCountdown(null);
                takePicture();
            }, timerDuration * 1000);
            return () => { clearTimeout(captureTimeout); clearInterval(countdownInterval); };
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
        <div className="w-full flex flex-col items-center gap-6">
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-lg border-4 border-white">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform -scale-x-100" />
                <canvas ref={canvasRef} style={{ display: 'none' }} />
                {countdown !== null && countdown > 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                        <span className="text-9xl font-bold text-white animate-ping">{countdown}</span>
                    </div>
                )}
            </div>
            {!isCapturing ? (
                <div className="w-full max-w-md p-4 bg-white rounded-xl shadow-md flex flex-col items-center gap-4">
                    <div className="flex gap-2">
                        <span className="font-semibold">Timer:</span>
                        {[3, 5, 10].map(duration => (
                            <button key={duration} onClick={() => setTimerDuration(duration)} className={`px-4 py-2 rounded-lg font-semibold ${timerDuration === duration ? 'bg-pink-500 text-white' : 'bg-gray-100'}`}>{duration}s</button>
                        ))}
                    </div>
                    <button onClick={handleStartSession} className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-8 rounded-lg">Mulai Sesi Kamera</button>
                </div>
            ) : (
                <p className="text-xl animate-pulse text-gray-700">Mengambil foto {currentPhotoIndex + 1} dari {grid.photoCount}...</p>
            )}
        </div>
    );
}

// ===================================
// Bagian untuk MODE UPLOAD MANUAL
// ===================================
function UploadSession({ grid, onComplete }) {
    const [images, setImages] = useState(Array(grid.photoCount).fill(null));
    const fileInputRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(null);
    const isComplete = images.every(img => img !== null);

    const handleUploadClick = (index) => {
        setActiveIndex(index);
        fileInputRef.current?.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && activeIndex !== null) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const newImages = [...images];
                newImages[activeIndex] = e.target.result;
                setImages(newImages);
                setActiveIndex(null);
            };
            reader.readAsDataURL(file);
        }
        event.target.value = null; // Reset input file
    };
    
    return (
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
             <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/png, image/jpeg" onChange={handleFileChange}/>
             <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Upload Fotomu ({grid.label})</h2>
             <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
                {images.map((img, index) => (
                    <div key={index} className="aspect-square">
                        {img ? (
                            <div className="relative w-full h-full group">
                                <img src={img} alt={`Upload ${index + 1}`} className="w-full h-full object-cover rounded-xl" />
                                <button onClick={() => handleUploadClick(index)} className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 rounded-xl flex items-center justify-center text-white transition-opacity">
                                    <Upload className="w-8 h-8"/>
                                </button>
                            </div>
                        ) : (
                            <button onClick={() => handleUploadClick(index)} className="w-full h-full bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-200">
                                <Upload className="w-8 h-8 mb-2"/>
                                <span>Slot #{index + 1}</span>
                            </button>
                        )}
                    </div>
                ))}
            </div>
             <div className="mt-8 text-center">
                <button onClick={() => onComplete(images)} disabled={!isComplete} className="bg-pink-500 text-white font-bold py-4 px-10 rounded-xl disabled:bg-gray-300 disabled:cursor-not-allowed">
                    {isComplete ? 'Lanjut ke Pratinjau' : 'Isi Semua Slot'}
                </button>
            </div>
        </div>
    );
}

// ===================================
// Komponen Utama CameraView (Manajer)
// ===================================
export default function CameraView({ grid, onComplete, mode }) {
    if (mode === 'camera') {
        return <CameraSession grid={grid} onComplete={onComplete} />;
    }
    
    if (mode === 'upload') {
        return <UploadSession grid={grid} onComplete={onComplete} />;
    }

    return <div className="text-center">Memuat mode...</div>;
}