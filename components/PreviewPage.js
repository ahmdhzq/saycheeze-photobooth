// components/PreviewPage.js
'use client';

import { useRef, useEffect, useState } from 'react';

// Konfigurasi Tema dan Layout (tidak berubah)
const themeConfig = {
    '2x2': [
        { id: 'theme-1', name: 'Theme 1', path: '/assets/theme/2x2/theme-1.svg' },
        { id: 'theme-2', name: 'Theme 2', path: '/assets/theme/2x2/theme-2.svg' },
        { id: 'theme-3', name: 'Theme 3', path: '/assets/theme/2x2/theme-3.svg' },
        { id: 'theme-4', name: 'Theme 4', path: '/assets/theme/2x2/theme-4.svg' },
    ],
    '3x1': [
        { id: 'theme-1', name: 'Theme 1', path: '/assets/theme/3x1/theme-1.svg' },
        { id: 'theme-2', name: 'Theme 2', path: '/assets/theme/3x1/theme-2.svg' },
        { id: 'theme-3', name: 'Theme 3', path: '/assets/theme/3x1/theme-3.svg' },
        { id: 'theme-4', name: 'Theme 4', path: '/assets/theme/3x1/theme-4.svg' },
    ],
    '3x2': [
        { id: 'theme-1', name: 'Theme 1', path: '/assets/theme/3x2/theme-1.svg' },
        { id: 'theme-2', name: 'Theme 2', path: '/assets/theme/3x2/theme-2.svg' },
        { id: 'theme-3', name: 'Theme 3', path: '/assets/theme/3x2/theme-3.svg' },
        { id: 'theme-4', name: 'Theme 4', path: '/assets/theme/3x2/theme-4.svg' },
    ]
};
const frameLayouts = {
  '2x2': {
    canvasSize: { width: 1000, height: 1100 },
    slots: [
      { x: 100, y: 80, width: 380, height: 400, borderRadius: 20 },
      { x: 520, y: 80, width: 380, height: 400, borderRadius: 20 },
      { x: 100, y: 520, width: 380, height: 400, borderRadius: 20 },
      { x: 520, y: 520, width: 380, height: 400, borderRadius: 20 },
    ],
    logo: { x: 425, y: 950, width: 150, height: 35 },
    timestamp: { x: 500, y: 1010, fontSize: 28 },
  },
  '3x1': {
    canvasSize: { width: 1000, height: 2000 },
    slots: [
      { x: 130, y: 120, width: 740, height: 480, borderRadius: 30 },
      { x: 130, y: 650, width: 740, height: 480, borderRadius: 30 },
      { x: 130, y: 1180, width: 740, height: 480, borderRadius: 30 },
    ],
    logo: { x: 425, y: 1780, width: 150, height: 35 },
    timestamp: { x: 500, y: 1840, fontSize: 30 },
  },
  '3x2': {
    canvasSize: { width: 1000, height: 1455 },
    slots: [
      { x: 90, y: 75, width: 400, height: 360, borderRadius: 25 },
      { x: 510, y: 75, width: 400, height: 360, borderRadius: 25 },
      { x: 90, y: 465, width: 400, height: 360, borderRadius: 25 },
      { x: 510, y: 465, width: 400, height: 360, borderRadius: 25 },
      { x: 90, y: 855, width: 400, height: 360, borderRadius: 25 },
      { x: 510, y: 855, width: 400, height: 360, borderRadius: 25 },
    ],
    logo: { x: 425, y: 1280, width: 150, height: 35 },
    timestamp: { x: 500, y: 1340, fontSize: 30 },
  }
};

export default function PreviewPage({ images, grid }) {
    const canvasRef = useRef(null);
    const [selectedTheme, setSelectedTheme] = useState(themeConfig[grid.id][0]);
    const [showTimestamp, setShowTimestamp] = useState(true);
    const [showLogo, setShowLogo] = useState(true); 

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

        Promise.all(sourcesToLoad)
            .then(([backgroundImage, logoImage, ...userPhotos]) => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

                layout.slots.forEach((slot, index) => {
                    if (userPhotos[index]) {
                        ctx.save();
                        ctx.beginPath();
                        ctx.roundRect(slot.x, slot.y, slot.width, slot.height, [slot.borderRadius]);
                        ctx.clip();
                        
                        const sWidth = userPhotos[index].naturalWidth;
                        const sHeight = userPhotos[index].naturalHeight;
                        const dWidth = slot.width;
                        const dHeight = slot.height;
                        const sRatio = sWidth / sHeight;
                        const dRatio = dWidth / dHeight;
                        let sx = 0, sy = 0, cropWidth = sWidth, cropHeight = sHeight;

                        if (sRatio > dRatio) {
                            cropWidth = sHeight * dRatio;
                            sx = (sWidth - cropWidth) / 2;
                        } else {
                            cropHeight = sWidth / dRatio;
                            sy = (sHeight - cropHeight) / 2;
                        }
                        ctx.drawImage(userPhotos[index], sx, sy, cropWidth, cropHeight, slot.x, slot.y, dWidth, dHeight);
                        ctx.restore();
                    }
                });
                
                if (showLogo && layout.logo) {
                    ctx.drawImage(logoImage, layout.logo.x, layout.logo.y, layout.logo.width, layout.logo.height);
                }
                
                if (showTimestamp && layout.timestamp) {
                    ctx.fillStyle = '#374151';
                    ctx.font = `bold ${layout.timestamp.fontSize}px Poppins, sans-serif`;
                    ctx.textAlign = 'center';
                    const now = new Date();
                    const dateStr = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
                    ctx.fillText(dateStr, layout.timestamp.x, layout.timestamp.y);
                }
            })
            // BARU: Penanganan error agar kanvas tidak kosong jika ada masalah
            .catch(error => {
                console.error("Error loading images for canvas:", error);
                // Opsional: Tampilkan pesan error di kanvas
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = 'red';
                ctx.font = '24px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('Gagal memuat gambar.', canvas.width / 2, canvas.height / 2);
            });
    }, [images, grid, selectedTheme, showTimestamp, showLogo]);

    const handleDownload = () => {
        const canvas = canvasRef.current;
        const link = document.createElement('a');
        link.download = `say-cheeze-${grid.id}-${new Date().getTime()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    const availableThemes = themeConfig[grid.id];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white shadow-sm border-b border-gray-200">
                 <div className="max-w-7xl mx-auto px-6 py-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Foto sudah siap!</h1>
                    <p className="text-gray-600 max-w-md mx-auto">Pilih tema frame favoritmu dan unduh sekarang.</p>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <canvas ref={canvasRef} className="w-full h-auto rounded-lg shadow-sm border border-gray-100"/>
                        </div>
                    </div>
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
                            {/* DIUBAH: Pilihan Tema dengan Pratinjau Gambar */}
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Pilih Tema</h3>
                                <div className="space-y-3">
                                    {availableThemes.map(theme => (
                                        <button
                                            key={theme.id}
                                            onClick={() => setSelectedTheme(theme)}
                                            className={`w-full p-3 rounded-lg transition-all duration-200 flex items-center gap-4 border-2 ${selectedTheme.id === theme.id ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-gray-300'}`}
                                        >
                                            <img src={theme.path} alt={theme.name} className="w-16 h-16 object-cover rounded-md border border-gray-200" />
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
                            
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Pengaturan</h3>
                                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                                    <label className="flex items-center justify-between cursor-pointer">
                                        <span className="font-medium text-gray-900">Tampilkan Logo</span>
                                        <input type="checkbox" checked={showLogo} onChange={() => setShowLogo(!showLogo)} className="toggle toggle-primary" />
                                    </label>
                                    <label className="flex items-center justify-between cursor-pointer">
                                        <span className="font-medium text-gray-900">Tampilkan Tanggal</span>
                                        <input type="checkbox" checked={showTimestamp} onChange={() => setShowTimestamp(!showTimestamp)} className="toggle toggle-primary" />
                                    </label>
                                </div>
                            </div>
                            
                            <div>
                                <button onClick={handleDownload} className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-4 rounded-lg">
                                    Download Foto
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}