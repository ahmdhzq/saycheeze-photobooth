'use client';

import { useRef, useEffect, useState } from 'react';

const stickerConfig = {
    '2x2': [
        { id: 'theme-1', name: 'theme-1', path: '/assets/stikers/2x2/stiker-1.svg' },
        { id: 'theme-2', name: 'theme-2', path: '/assets/stikers/2x2/stiker-2.svg' },
    ],
    '3x1': [
        { id: 'theme-1', name: 'theme-1', path: '/assets/stikers/3x1/stiker-1.svg' },
        { id: 'theme-2', name: 'theme-2', path: '/assets/stikers/3x1/stiker-2.svg' },
    ],
    '3x2': [
        { id: 'theme-1', name: 'theme-1', path: '/assets/stikers/3x2/stiker-1.svg' },
        { id: 'theme-2', name: 'theme-2', path: '/assets/stikers/3x2/stiker-2.svg' },,
    ]
};

const themeConfig = {
    '2x2': [
        { id: 'theme-1', name: 'Theme 1', path: '/assets/theme/2x2/theme-1.svg' },
        { id: 'theme-2', name: 'Theme 2', path: '/assets/theme/2x2/theme-2.svg' },
        { id: 'theme-3', name: 'Theme 3', path: '/assets/theme/2x2/theme-3.svg' },
        { id: 'theme-4', name: 'Theme 4', path: '/assets/theme/2x2/theme-4.svg' },
        { id: 'theme-5', name: 'Theme 5', path: '/assets/theme/2x2/theme-5.svg' },
    ],
    '3x1': [
        { id: 'theme-1', name: 'Theme 1', path: '/assets/theme/3x1/theme-1.svg' },
        { id: 'theme-2', name: 'Theme 2', path: '/assets/theme/3x1/theme-2.svg' },
        { id: 'theme-3', name: 'Theme 3', path: '/assets/theme/3x1/theme-3.svg' },
        { id: 'theme-4', name: 'Theme 4', path: '/assets/theme/3x1/theme-4.svg' },
        { id: 'theme-5', name: 'Theme 5', path: '/assets/theme/3x1/theme-5.svg' },
    ],
    '3x2': [
        { id: 'theme-1', name: 'Theme 1', path: '/assets/theme/3x2/theme-1.svg' },
        { id: 'theme-2', name: 'Theme 2', path: '/assets/theme/3x2/theme-2.svg' },
        { id: 'theme-3', name: 'Theme 3', path: '/assets/theme/3x2/theme-3.svg' },
        { id: 'theme-4', name: 'Theme 4', path: '/assets/theme/3x2/theme-4.svg' },
        { id: 'theme-5', name: 'Theme 5', path: '/assets/theme/3x2/theme-5.svg' },
    ]
};
const frameLayouts = {
    '2x2': {
        canvasSize: { width: 1000, height: 1100 },
        slots: [
            { x: 50, y: 70, width: 445, height: 420, borderRadius: 20 },
            { x: 505, y: 70, width: 445, height: 420, borderRadius: 20 },
            { x: 50, y: 500, width: 445, height: 420, borderRadius: 20 },
            { x: 505, y: 500, width: 445, height: 420, borderRadius: 20 },
        ],
        logo: { x: 380, y: 930, width: 250, height: 120 },
        timestamp: { x: 500, y: 1062, fontSize: 25 },
    },
    '3x1': {
        canvasSize: { width: 1000, height: 2000 },
        slots: [
            { x: 85, y: 70, width: 830, height: 540, borderRadius: 30 },
            { x: 85, y: 632, width: 830, height: 540, borderRadius: 30 },
            { x: 85, y: 1205, width: 830, height: 547, borderRadius: 30 },
        ],
        logo: { x: 390, y: 1760, width: 250, height: 120 },
        timestamp: { x: 510, y: 1910, fontSize: 25 },
    },
    '3x2': {
        canvasSize: { width: 1000, height: 1455 },
        slots: [
            { x: 40, y: 50, width: 450, height: 400, borderRadius: 25 },
            { x: 510, y: 50, width: 450, height: 400, borderRadius: 25 },
            { x: 40, y: 465, width: 450, height: 400, borderRadius: 25 },
            { x: 510, y: 465, width: 450, height: 400, borderRadius: 25 },
            { x: 40, y: 880, width: 450, height: 400, borderRadius: 25 },
            { x: 510, y: 878, width: 450, height: 400, borderRadius: 25 },
        ],
        logo: { x: 360, y: 1280, width: 250, height: 120 },
        timestamp: { x: 482, y: 1410, fontSize: 25 },
    }
};


export default function PreviewPage({ images, grid }) {
    const canvasRef = useRef(null);
    const [selectedTheme, setSelectedTheme] = useState(themeConfig[grid.id][0]);
    const [showTimestamp, setShowTimestamp] = useState(true);
    const [selectedSticker, setSelectedSticker] = useState(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const layout = frameLayouts[grid.id];
        if (!layout) return;

        canvas.width = layout.canvasSize.width;
        canvas.height = layout.canvasSize.height;

        const imageLoader = (src) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.crossOrigin = "Anonymous";
                img.src = src;
                img.onload = () => resolve(img);
                img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
            });
        };

        const sourcesToLoad = [
            imageLoader(selectedTheme.path),
            imageLoader('/assets/theme/logo.svg'),
            ...images.map(src => imageLoader(src))
        ];

        if (selectedSticker) {
            sourcesToLoad.push(imageLoader(selectedSticker.path));
        }

        Promise.all(sourcesToLoad)
            .then((loadedImages) => {
                const [backgroundImage, logoImage, ...userPhotos] = loadedImages;
                const stickerImage = selectedSticker ? loadedImages[loadedImages.length - 1] : null;

                ctx.clearRect(0, 0, canvas.width, canvas.height);
                const scale = 1;
                const newWidth = canvas.width * scale;
                const newHeight = canvas.height * scale;
                const offsetX = (canvas.width - newWidth) / 2;
                const offsetY = (canvas.height - newHeight) / 2;

                ctx.translate(offsetX, offsetY);
                ctx.scale(scale, scale);
                ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

                userPhotos.forEach((photo, index) => {
                    if (index < layout.slots.length) {
                        const slot = layout.slots[index];
                        ctx.save();
                        ctx.beginPath();
                        ctx.roundRect(slot.x, slot.y, slot.width, slot.height, [slot.borderRadius]);
                        ctx.clip();

                        const sWidth = photo.naturalWidth, sHeight = photo.naturalHeight;
                        const dWidth = slot.width, dHeight = slot.height;
                        const sRatio = sWidth / sHeight, dRatio = dWidth / dHeight;
                        let sx = 0, sy = 0, cropWidth = sWidth, cropHeight = sHeight;

                        if (sRatio > dRatio) {
                            cropWidth = sHeight * dRatio;
                            sx = (sWidth - cropWidth) / 2;
                        } else {
                            cropHeight = sWidth / dRatio;
                            sy = (sHeight - cropHeight) / 2;
                        }
                        ctx.drawImage(photo, sx, sy, cropWidth, cropHeight, slot.x, slot.y, dWidth, dHeight);
                        ctx.restore();
                    }
                });

                if (layout.logo) {
                    ctx.drawImage(logoImage, layout.logo.x, layout.logo.y, layout.logo.width, layout.logo.height);
                }

                if (stickerImage) {
                    ctx.drawImage(stickerImage, 0, 0, canvas.width, canvas.height);
                }

                if (showTimestamp && layout.timestamp) {
                    const now = new Date();
                    const dateStr = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
                    ctx.font = `500 ${layout.timestamp.fontSize}px Poppins, sans-serif`;
                    ctx.textAlign = 'center';
                    ctx.strokeStyle = '#374151';
                    ctx.lineWidth = 2;
                    ctx.lineJoin = 'round';
                    ctx.strokeText(dateStr, layout.timestamp.x, layout.timestamp.y);
                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillText(dateStr, layout.timestamp.x, layout.timestamp.y);
                }
            })
            .catch(error => { console.error("Error loading images for canvas:", error); });
    }, [images, grid, selectedTheme, showTimestamp, selectedSticker]);

    const handleDownload = () => {
        const canvas = canvasRef.current;
        const link = document.createElement('a');
        link.download = `say-cheeze-${grid.id}-${new Date().getTime()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    const availableThemes = themeConfig[grid.id];
    const availableStickers = stickerConfig[grid.id] || [];

    return (
        <div className="min-h-screen ">
            <div className="bg-white shadow-sm rounded-xl">
                <div className="max-w-4xl mx-auto px-6 py-6 text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Your Photos are Ready!</h1>
                    <p className="text-gray-600">Choose your favorite frame and download now.</p>
                </div>
            </div>
            <div className="max-w-6xl mx-auto py-8">
                <div className="grid lg:grid-cols-2 gap-8 items-start">
                    {/* Kolom Kiri: Canvas photo */}
                    <div className="flex justify-center items-center flex-col lg:col-span-1 space-y-4 border p-6 rounded-xl shadow-sm border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Photo</h3>
                        <div className="shadow-xl rounded-xl">
                            <canvas ref={canvasRef} className="w-full h-auto rounded-lg" />
                        </div>
                    </div>
                    {/* Kolom Kanan: Panel Kontrol */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-28">
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Theme</h3>
                                <div className="space-y-3">
                                    {availableThemes.map(theme => (
                                        <button
                                            key={theme.id}
                                            onClick={() => setSelectedTheme(theme)}
                                            className={`w-full p-3 rounded-lg transition-all duration-200 flex items-center gap-3 border-2 ${selectedTheme.id === theme.id ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-gray-300'}`}
                                        >
                                            <img src={theme.path} alt={theme.name} className="w-12 h-12 object-cover rounded-md border border-gray-200" />
                                            <div className="text-left flex-grow">
                                                <p className="font-medium text-gray-900">{theme.name}</p>
                                            </div>
                                            {selectedTheme.id === theme.id && (
                                                <div className="w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Sticker</h3>
                                <div className="space-y-3">
                                    <button
                                        onClick={() => setSelectedSticker(null)}
                                        className={`w-full p-3 rounded-lg transition-all duration-200 flex items-center gap-3 border-2 ${!selectedSticker ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-gray-300'}`}
                                    >
                                        <div className="text-left flex-grow">
                                            <p className="font-medium text-gray-900">No Sticker</p>
                                        </div>
                                    </button>
                                    {availableStickers.map(sticker => (
                                        <button
                                            key={sticker.id}
                                            onClick={() => setSelectedSticker(sticker)}
                                            className={`w-full p-3 rounded-lg transition-all duration-200 flex items-center gap-3 border-2 ${selectedSticker?.id === sticker.id ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-gray-300'}`}
                                        >
                                            <img src={sticker.path} alt={sticker.name} className="w-12 h-12 object-contain rounded-md" />
                                            <div className="text-left flex-grow">
                                                <p className="font-medium text-gray-900">{sticker.name}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Settings</h3>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <label className="flex items-center justify-between cursor-pointer">
                                        <span className="font-medium text-gray-900">Show Timestamp</span>
                                        <input type="checkbox" checked={showTimestamp} onChange={() => setShowTimestamp(!showTimestamp)} className="toggle toggle-primary" />
                                    </label>
                                </div>
                            </div>
                            <div>
                                <button onClick={handleDownload} className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-4 rounded-lg">
                                    Download Photo
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}