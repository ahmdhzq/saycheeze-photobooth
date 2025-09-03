'use client';

import { useState, useEffect, useRef } from 'react';
import { Camera, Upload, Check } from 'lucide-react';
import { createFilter } from 'cc-gram';

// ===================================
// Automatic Camera Session Mode
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
    const [flashEffect, setFlashEffect] = useState(false);

    // DIUBAH: Kita definisikan filter kita sendiri, tapi dengan nama yang cocok dengan cc-gram
    const filters = [
        { name: 'Normal', className: '', ccGramName: 'normal' },
        { name: 'Clarendon', className: 'contrast-125 saturate-125', ccGramName: 'clarendon' },
        { name: 'Gingham', className: 'brightness-105 hue-rotate-[-10deg]', ccGramName: 'gingham' },
        { name: 'Reyes', className: 'sepia-[25%] brightness-110 contrast-[85%]', ccGramName: 'reyes' },
        { name: 'Aden', className: 'hue-rotate-[-20deg] contrast-[90%] saturate-[85%] brightness-120', ccGramName: 'aden' },
        { name: 'Inkwell', className: 'grayscale contrast-110 brightness-110', ccGramName: 'inkwell' },
        { name: '1977', className: 'contrast-110 brightness-110 saturate-150', ccGramName: '1977' },
    ];
    
    const [selectedFilter, setSelectedFilter] = useState(filters[0]);
    
    // Kita tetap butuh instance cc-gram untuk memproses gambar final
    const ccGram = useRef(createFilter()).current;

    useEffect(() => {
        const videoElement = videoRef.current;
        let localStream = null;
        const startCamera = async () => {
            try {
                localStream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720, facingMode: 'user' }, audio: false });
                if (videoElement) videoElement.srcObject = localStream;
            } catch (err) { console.error("Error accessing camera:", err); }
        };
        startCamera();
        return () => { if (localStream) localStream.getTracks().forEach(track => track.stop()); };
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

    const takePicture = async () => {
        setFlashEffect(true);
        setTimeout(() => setFlashEffect(false), 200);

        if (videoRef.current && canvasRef.current && ccGram) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            
            context.translate(canvas.width, 0);
            context.scale(-1, 1);
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            const rawDataUrl = canvas.toDataURL('image/png');
            let finalDataUrl = rawDataUrl;

            if (selectedFilter.ccGramName !== 'normal') {
                const tempImage = new Image();
                tempImage.src = rawDataUrl;
                tempImage.dataset.filter = selectedFilter.ccGramName;
                await new Promise(resolve => tempImage.onload = resolve);
                finalDataUrl = await ccGram.getDataURL(tempImage, { type: 'image/jpeg', quality: 0.9 });
            }
            
            const newImages = [...images];
            newImages[currentPhotoIndex] = finalDataUrl;
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
        <div className="w-full grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 flex flex-col items-center gap-6">
                <div className="relative w-full max-w-xl mx-auto aspect-[4/3] rounded-2xl overflow-hidden bg-black shadow-lg border-4 border-white">
                    <video ref={videoRef} autoPlay playsInline muted className={`w-full h-full object-cover transform -scale-x-100 ${selectedFilter.className}`} />
                    <canvas ref={canvasRef} style={{ display: 'none' }} />
                    <div className={`absolute inset-0 bg-white transition-opacity duration-100 ${flashEffect ? 'opacity-80' : 'opacity-0'} pointer-events-none`}></div>
                    {countdown !== null && countdown > 0 && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                            <span className="text-9xl font-bold text-white animate-ping">{countdown}</span>
                        </div>
                    )}
                </div>
                {!isCapturing ? (
                    <div className="w-full max-w-md p-4 bg-white rounded-xl shadow-md flex flex-col items-center gap-4">
                        <div className="w-full">
                            <span className="font-semibold text-sm text-gray-600">Filter:</span>
                            <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
                                {filters.map(filter => (
                                    <button 
                                        key={filter.name} 
                                        onClick={() => setSelectedFilter(filter)} 
                                        className={`px-3 py-1.5 rounded-lg font-semibold text-sm whitespace-nowrap capitalize ${selectedFilter.name === filter.name ? 'bg-pink-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                                    >
                                        {filter.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center gap-2 w-full border-t border-gray-200 pt-4">
                            <span className="font-semibold">Timer:</span>
                            <div className="flex gap-2">
                                {[3, 5, 10].map(duration => (
                                    <button key={duration} onClick={() => setTimerDuration(duration)} className={`px-4 py-2 rounded-lg font-semibold ${timerDuration === duration ? 'bg-pink-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>{duration}s</button>
                                ))}
                            </div>
                        </div>
                        <button onClick={handleStartSession} className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-8 rounded-lg">Start Camera Session</button>
                    </div>
                ) : (
                    <p className="text-xl h-24 flex items-center animate-pulse text-gray-700">Taking photo {currentPhotoIndex + 1} of {grid.photoCount}...</p>
                )}
            </div>
            <div className="lg:col-span-1 bg-white rounded-2xl shadow-lg p-6 w-full">
                <h3 className="text-xl font-bold text-center mb-4">Photo Results</h3>
                <div className="space-y-4">
                    {images.map((img, index) => (
                        <div key={index} className={`relative aspect-video rounded-lg flex items-center justify-center transition-all duration-300 ${index === currentPhotoIndex && isCapturing ? 'border-4 border-pink-500' : 'border-2 border-gray-200'} ${img ? 'bg-green-50' : 'bg-gray-100'}`}>
                            {img ? (<img src={img} alt={`Capture ${index + 1}`} className="w-full h-full object-cover rounded-md" />) : (<span className="text-gray-400">Photo Slot #{index + 1}</span>)}
                            <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${img ? 'bg-green-500' : 'bg-gray-400'}`}>{img ? <Check size={14} /> : index + 1}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
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
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 1280;
                    const scaleSize = MAX_WIDTH / img.width;
                    canvas.width = MAX_WIDTH;
                    canvas.height = img.height * scaleSize;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
                    const newImages = [...images];
                    newImages[activeIndex] = dataUrl;
                    setImages(newImages);
                    setActiveIndex(null);
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
        event.target.value = null;
    };
    
    return (
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
             <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/png, image/jpeg" onChange={handleFileChange}/>
             <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Upload Your Photos ({grid.label})</h2>
             <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
                {images.map((img, index) => (
                    <div key={index} className="aspect-square">
                        {img ? (
                            <div className="relative w-full h-full group">
                                <img src={img} alt={`Upload ${index + 1}`} className="w-full h-full object-cover rounded-xl" />
                                <button onClick={() => handleUploadClick(index)} className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 rounded-xl flex items-center justify-center text-white transition-opacity"><Upload className="w-8 h-8"/></button>
                            </div>
                        ) : (
                            <button onClick={() => handleUploadClick(index)} className="w-full h-full bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-200"><Upload className="w-8 h-8 mb-2"/><span>Slot #{index + 1}</span></button>
                        )}
                    </div>
                ))}
            </div>
             <div className="mt-8 text-center">
                <button onClick={() => onComplete(images)} disabled={!isComplete} className="bg-pink-500 text-white font-bold py-4 px-10 rounded-xl disabled:bg-gray-300">{isComplete ? 'Continue to Preview' : 'Fill All Slots'}</button>
            </div>
        </div>
    );
}

export default function CameraView({ grid, onComplete, mode }) {
    if (mode === 'camera') {
        return <CameraSession grid={grid} onComplete={onComplete} />;
    }
    
    if (mode === 'upload') {
        return <UploadSession grid={grid} onComplete={onComplete} />;
    }

    return <div className="text-center">Loading mode...</div>;
}