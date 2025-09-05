'use client';

import { Loader2 } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';

const stickerConfig = {
    '2x2': [
        { id: 'stiker-1', name: 'Nailong', path: '/assets/stikers/2x2/stiker/stiker-1.svg', iconPath: '/assets/stikers/2x2/icons/icons-1.png' },
        { id: 'stiker-2', name: 'Stars', path: '/assets/stikers/2x2/stiker/stiker-2.svg', iconPath: '/assets/stikers/2x2/icons/icons-2.png' },
        { id: 'stiker-3', name: 'Abe', path: '/assets/stikers/2x2/stiker/stiker-3.svg', iconPath: '/assets/stikers/2x2/icons/icons-3.png' },
        { id: 'stiker-4', name: 'Pentol', path: '/assets/stikers/2x2/stiker/stiker-4.svg', iconPath: '/assets/stikers/2x2/icons/icons-4.png' },
        { id: 'stiker-5', name: 'Capybara', path: '/assets/stikers/2x2/stiker/stiker-4.svg', iconPath: '/assets/stikers/2x2/icons/icons-5.svg' },
    ],
    '3x1': [
        { id: 'stiker-1', name: 'Nailong', path: '/assets/stikers/3x1/stiker/stiker-1.svg', iconPath: '/assets/stikers/3x1/icons/icons-1.png' },
        { id: 'stiker-2', name: 'Stars', path: '/assets/stikers/3x1/stiker/stiker-2.svg', iconPath: '/assets/stikers/3x1/icons/icons-2.png' },
        { id: 'stiker-3', name: 'Abe', path: '/assets/stikers/3x1/stiker/stiker-3.svg', iconPath: '/assets/stikers/3x1/icons/icons-3.png' },
        { id: 'stiker-4', name: 'Pentol', path: '/assets/stikers/3x1/stiker/stiker-4.svg', iconPath: '/assets/stikers/3x1/icons/icons-4.png' },
        { id: 'stiker-5', name: 'Capybara', path: '/assets/stikers/3x1/stiker/stiker-4.svg', iconPath: '/assets/stikers/3x1/icons/icons-5.svg' },
    ],
    '3x2': [
        { id: 'stiker-1', name: 'Nailong', path: '/assets/stikers/3x2/stiker/stiker-1.svg', iconPath: '/assets/stikers/3x2/icons/icons-1.png' },
        { id: 'stiker-2', name: 'Stars', path: '/assets/stikers/3x2/stiker/stiker-2.svg', iconPath: '/assets/stikers/3x2/icons/icons-2.png' },
        { id: 'stiker-3', name: 'Abe', path: '/assets/stikers/3x2/stiker/stiker-3.svg', iconPath: '/assets/stikers/3x2/icons/icons-3.png' },
        { id: 'stiker-4', name: 'Pentol', path: '/assets/stikers/3x2/stiker/stiker-4.svg', iconPath: '/assets/stikers/3x2/icons/icons-4.png' },
        { id: 'stiker-5', name: 'Capybara', path: '/assets/stikers/3x2/stiker/stiker-4.svg', iconPath: '/assets/stikers/3x2/icons/icons-5.svg' },
    ]
};

const themeConfig = {
    '2x2': [
        { id: 'theme-1', name: 'Theme 1', path: '/assets/theme/2x2/theme-1.svg' },
        { id: 'theme-2', name: 'Theme 2', path: '/assets/theme/2x2/theme-2.svg' },
        { id: 'theme-3', name: 'Theme 3', path: '/assets/theme/2x2/theme-3.svg' },
        { id: 'theme-4', name: 'Theme 4', path: '/assets/theme/2x2/theme-4.svg' },
        { id: 'theme-5', name: 'Theme 5', path: '/assets/theme/2x2/theme-5.jpg' },
    ],
    '3x1': [
        { id: 'theme-1', name: 'Theme 1', path: '/assets/theme/3x1/theme-1.svg' },
        { id: 'theme-2', name: 'Theme 2', path: '/assets/theme/3x1/theme-2.svg' },
        { id: 'theme-3', name: 'Theme 3', path: '/assets/theme/3x1/theme-3.svg' },
        { id: 'theme-4', name: 'Theme 4', path: '/assets/theme/3x1/theme-4.svg' },
        { id: 'theme-5', name: 'Theme 5', path: '/assets/theme/3x1/theme-5.jpg' },
    ],
    '3x2': [
        { id: 'theme-1', name: 'Theme 1', path: '/assets/theme/3x2/theme-1.svg' },
        { id: 'theme-2', name: 'Theme 2', path: '/assets/theme/3x2/theme-2.svg' },
        { id: 'theme-3', name: 'Theme 3', path: '/assets/theme/3x2/theme-3.svg' },
        { id: 'theme-4', name: 'Theme 4', path: '/assets/theme/3x2/theme-4.svg' },
        { id: 'theme-5', name: 'Theme 5', path: '/assets/theme/3x2/theme-5.jpg' },
    ]
};
const frameLayouts = {
    '2x2': {
        canvasSize: { width: 1000, height: 1100 },
        slots: [
            { x: 50, y: 75, width: 445, height: 420, borderRadius: 20 },
            { x: 505, y: 75, width: 445, height: 420, borderRadius: 20 },
            { x: 50, y: 507, width: 445, height: 420, borderRadius: 20 },
            { x: 505, y: 507, width: 445, height: 420, borderRadius: 20 },
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
        logo: { x: 390, y: 1770, width: 250, height: 120 },
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

const imageLoader = (src) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    });
};

export default function PreviewPage({ images, grid }) {
    const canvasRef = useRef(null);
    const [selectedTheme, setSelectedTheme] = useState(themeConfig[grid.id][0]);
    const [showTimestamp, setShowTimestamp] = useState(true);
    const [selectedSticker, setSelectedSticker] = useState(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [loadedAssetCache, setLoadedAssetCache] = useState({}); // Cache untuk gambar yang sudah dimuat

    useEffect(() => {
        const loadInitialAssets = async () => {
            try {
                const [logoImage, ...userPhotos] = await Promise.all([
                    imageLoader('/assets/theme/logo.svg'),
                    ...images.map(src => imageLoader(src))
                ]);
                setLoadedAssetCache(prevCache => ({
                    ...prevCache,
                    '/assets/theme/logo.svg': logoImage,
                    ...Object.fromEntries(images.map((src, i) => [src, userPhotos[i]]))
                }));
            } catch (error) {
                console.error("Failed to load initial assets:", error);
            }
        };
        loadInitialAssets();
    }, [images]);

    useEffect(() => {
        const drawCanvas = async () => {
            const canvas = canvasRef.current;
            if (!canvas || !grid) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            const layout = frameLayouts[grid.id];
            if (!layout) return;
            if (!loadedAssetCache['/assets/theme/logo.svg'] || !loadedAssetCache[images[0]]) {
                return;
            }

            setIsDrawing(true);

            try {
                if (!loadedAssetCache[selectedTheme.path]) {
                    const themeImage = await imageLoader(selectedTheme.path);
                    setLoadedAssetCache(prevCache => ({ ...prevCache, [selectedTheme.path]: themeImage }));
                }
                if (selectedSticker && !loadedAssetCache[selectedSticker.path]) {
                    const stickerImage = await imageLoader(selectedSticker.path);
                    setLoadedAssetCache(prevCache => ({ ...prevCache, [selectedSticker.path]: stickerImage }));
                }

                const backgroundImage = loadedAssetCache[selectedTheme.path];
                const logoImage = loadedAssetCache['/assets/theme/logo.svg'];
                const userPhotos = images.map(src => loadedAssetCache[src]);
                const stickerImage = selectedSticker ? loadedAssetCache[selectedSticker.path] : null;

                if (!backgroundImage || !logoImage || userPhotos.some(p => !p) || (selectedSticker && !stickerImage)) {
                    setIsDrawing(false);
                    return;
                }

                canvas.width = layout.canvasSize.width;
                canvas.height = layout.canvasSize.height;
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

                userPhotos.forEach((photo, index) => {
                    if (photo && index < layout.slots.length) {
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
                    const dateStr = now.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
                    ctx.font = `500 ${layout.timestamp.fontSize}px Poppins, sans-serif`;
                    ctx.textAlign = 'center';
                    ctx.strokeStyle = '#374151';
                    ctx.lineWidth = 4;
                    ctx.lineJoin = 'round';
                    ctx.strokeText(dateStr, layout.timestamp.x, layout.timestamp.y);
                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillText(dateStr, layout.timestamp.x, layout.timestamp.y);
                }

            } catch (error) {
                console.error("Failed during canvas draw:", error);
            } finally {
                setIsDrawing(false);
            }
        };

        drawCanvas();
    }, [images, grid, selectedTheme, showTimestamp, selectedSticker, loadedAssetCache]);

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
            <div className="max-w-7xl mx-auto py-8 px-4">
                <div className="grid lg:grid-cols-2 gap-8 items-start">

                    <div className="w-full lg:col-span-1">
                        <div className="flex flex-col items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-900">Your Preview</h3>
                            <div className="relative w-full max-w-lg shadow-xl rounded-xl">
                                <canvas
                                    ref={canvasRef}
                                    className="w-full h-auto rounded-lg"
                                    // Beri tahu browser aspect ratio canvas agar tidak gepeng
                                    style={{ aspectRatio: `${frameLayouts[grid.id].canvasSize.width} / ${frameLayouts[grid.id].canvasSize.height}` }}
                                />
                                {isDrawing && (
                                    <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg">
                                        <Loader2 className="w-10 h-10 text-pink-600 animate-spin" />
                                        <p className="mt-4 text-lg font-semibold text-gray-700">Processing...</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* Kolom Kanan: Panel Kontrol */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-28">
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Theme</h3>
                                <div className="flex flex-row flex-wrap gap-4">
                                    {availableThemes.map(theme => (
                                        <button
                                            key={theme.id}
                                            onClick={() => setSelectedTheme(theme)}
                                            className={`p-2 rounded-lg transition-all duration-200 flex items-center gap-3 border-2 ${selectedTheme.id === theme.id ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-gray-300'}`}
                                        >
                                            <img src={theme.path} alt={theme.name} className="w-12 h-12 object-cover rounded-md border border-gray-200" />
                                            
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Sticker</h3>
                                <div className="flex flex-row flex-wrap gap-4">
                                    <button
                                        onClick={() => setSelectedSticker(null)}
                                        className={`w-18 p-2 rounded-lg transition-all duration-200 flex items-center gap-3 border-2 ${!selectedSticker ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-gray-300'}`}
                                    >
                                        <div className="text-left flex-grow">
                                            <p className="font-medium text-center text-gray-900">None</p>
                                        </div>
                                    </button>
                                    {availableStickers.map(sticker => (
                                        <button
                                            key={sticker.id}
                                            onClick={() => setSelectedSticker(sticker)}
                                            className={`p-2 rounded-lg transition-all duration-200 flex items-center gap-3 border-2 ${selectedSticker?.id === sticker.id ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-gray-300'}`}
                                        >
                                            <img src={sticker.iconPath} alt={sticker.name} className="w-14 h-14 object-contain rounded-md" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Settings</h3>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <label className="flex items-center justify-between cursor-pointer">
                                        <span className="font-medium text-gray-900">Show Date</span>
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