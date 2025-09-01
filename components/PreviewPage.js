// components/PreviewPage.js
'use client';

import { useRef, useEffect, useState } from 'react';

export default function PreviewPage({ images, grid }) {
    const canvasRef = useRef(null);
    const [selectedBg, setSelectedBg] = useState('/assets/frame/Frame 2.svg');
    const [showTimestamp, setShowTimestamp] = useState(true);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const canvasWidth = 1000;
        const canvasHeight = 1500;
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        const background = new Image();
        background.src = selectedBg;
        background.crossOrigin = "Anonymous";

        background.onload = () => {
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            ctx.drawImage(background, 0, 0, canvasWidth, canvasHeight);

            const [rows, cols] = grid.id.split('x').map(Number);

            // === PENYESUAIAN UKURAN DAN JARAK ADA DI SINI ===

            // DIUBAH: Ukuran area konten dikecilkan lagi agar polaroid tidak terlalu besar
            const contentAreaWidth = canvasWidth * 0.75; // Dari 80% menjadi 75%
            const contentAreaHeight = canvasHeight * 0.6; // Dari 65% menjadi 60%

            // DIUBAH: Jarak antar foto diperlebar lagi
            const padding = contentAreaWidth * 0.08 / (cols > 1 ? cols - 1 : 1); // Dari 6% menjadi 8%

            // Kalkulasi lainnya akan menyesuaikan secara otomatis
            const photoWidth = (contentAreaWidth - (padding * (cols - 1))) / cols;
            const photoHeight = (contentAreaHeight - (padding * (rows - 1))) / rows;
            const startX = (canvasWidth - contentAreaWidth) / 2;
            const startY = canvasHeight * 0.15;

            // === AKHIR DARI PENYESUAIAN ===

            const userPhotos = images.map(src => {
                const img = new Image();
                img.crossOrigin = "Anonymous";
                img.src = src;
                return img;
            });

            Promise.all(userPhotos.map(img => new Promise(resolve => img.onload = resolve)))
                .then(() => {
                    let photoIndex = 0;
                    for (let i = 0; i < rows; i++) {
                        for (let j = 0; j < cols; j++) {
                            if (photoIndex < userPhotos.length) {
                                const x = startX + j * (photoWidth + padding);
                                const y = startY + i * (photoHeight + padding);
                                ctx.save();
                                ctx.beginPath();
                                ctx.roundRect(x, y, photoWidth, photoHeight, [20]);
                                ctx.clip();
                                ctx.drawImage(userPhotos[photoIndex], x, y, photoWidth, photoHeight);
                                ctx.restore();
                                photoIndex++;
                            }
                        }
                    }

                    const textYPosition = startY + contentAreaHeight + 100;

                    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
                    ctx.shadowBlur = 5;
                    ctx.shadowOffsetY = 2;
                    ctx.fillStyle = '#FFFFFF';
                    ctx.font = 'bold 42px "Arial", sans-serif';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText("Say Cheeze Photobooth", canvasWidth / 2, textYPosition);

                    if (showTimestamp) {
                        ctx.fillStyle = '#FFFFFF';
                        ctx.font = '30px "Courier New", monospace';
                        const now = new Date();
                        const dateStr = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
                        ctx.fillText(dateStr, canvasWidth / 2, textYPosition + 60);
                    }
                    ctx.shadowColor = 'transparent';
                    ctx.shadowBlur = 0;
                    ctx.shadowOffsetY = 0;
                });
        };
    }, [images, grid, showTimestamp, selectedBg]);

    const handleDownload = () => {
        const canvas = canvasRef.current;
        const link = document.createElement('a');
        link.download = `say-cheeze-photobooth-${new Date().getTime()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 rounded-full mb-4">
                            <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Foto sudah siap!
                        </h1>
                        <p className="text-gray-600 max-w-md mx-auto">
                            Pilih frame dan unduh sekarang
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid lg:grid-cols-3 gap-8">

                    {/* Canvas Preview Section */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <canvas
                                ref={canvasRef}
                                className="w-full h-auto rounded-lg shadow-sm border border-gray-100"
                            />
                        </div>
                    </div>

                    {/* Control Panel Section */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">

                            {/* Frame Selection */}
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Pilih Frame
                                </h3>
                                <div className="space-y-3">
                                    <button
                                        onClick={() => setSelectedBg('/assets/frame/Frame 2.svg')}
                                        className={`w-full p-4 rounded-lg transition-all duration-200 flex items-center gap-3 border-2 ${
                                            selectedBg.includes('Frame 2')
                                                ? 'border-pink-500 bg-pink-50'
                                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                        }`}
                                    >
                                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <img src="/assets/frame/Frame 2.svg" alt="Classic Frame" className="w-6 h-6 object-contain" />
                                        </div>
                                        <div className="text-left flex-grow">
                                            <p className="font-medium text-gray-900">Classic Frame</p>
                                            <p className="text-sm text-gray-500">Frame klasik dan elegan</p>
                                        </div>
                                        {selectedBg.includes('Frame 2') && (
                                            <div className="w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        )}
                                    </button>

                                    <button
                                        onClick={() => setSelectedBg('/assets/frame/Frame 3.svg')}
                                        className={`w-full p-4 rounded-lg transition-all duration-200 flex items-center gap-3 border-2 ${
                                            selectedBg.includes('Frame 3')
                                                ? 'border-pink-500 bg-pink-50'
                                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                        }`}
                                    >
                                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <img src="/assets/frame/Frame 3.svg" alt="Modern Frame" className="w-6 h-6 object-contain" />
                                        </div>
                                        <div className="text-left flex-grow">
                                            <p className="font-medium text-gray-900">Modern Frame</p>
                                            <p className="text-sm text-gray-500">Frame modern dan stylish</p>
                                        </div>
                                        {selectedBg.includes('Frame 3') && (
                                            <div className="w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Settings */}
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Pengaturan
                                </h3>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <label className="flex items-center justify-between cursor-pointer">
                                        <div>
                                            <span className="font-medium text-gray-900">Tampilkan Tanggal</span>
                                            <p className="text-sm text-gray-500">Tambahkan timestamp pada foto</p>
                                        </div>
                                        <div className="relative ml-4">
                                            <input
                                                type="checkbox"
                                                checked={showTimestamp}
                                                onChange={() => setShowTimestamp(!showTimestamp)}
                                                className="sr-only"
                                            />
                                            <div className={`w-11 h-6 rounded-full transition-colors duration-200 ease-in-out ${
                                                showTimestamp ? 'bg-pink-500' : 'bg-gray-300'
                                            }`}>
                                                <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ease-in-out ${
                                                    showTimestamp ? 'translate-x-5' : 'translate-x-0'
                                                } mt-0.5 ml-0.5`}></div>
                                            </div>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {/* Download Section */}
                            <div>
                                <button
                                    onClick={handleDownload}
                                    className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                                    </svg>
                                    Download Foto
                                </button>
                                <p className="text-center text-gray-500 text-sm mt-2">
                                    File PNG berkualitas tinggi
                                </p>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}