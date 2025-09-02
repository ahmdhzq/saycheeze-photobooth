'use client';

export default function GridSelector({ onGridSelect }) {
    const grids = [
        { id: '3x1', label: '3x1', photoCount: 3 },
        { id: '2x2', label: '2x2', photoCount: 4 },
        { id: '3x2', label: '3x2', photoCount: 6 },
    ];

    return (
        <div className="min-h-screen my-10 flex items-center justify-center px-6">
            <div className="w-full max-w-6xl">
                
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-pink-100 rounded-full mb-6">
                        <svg className="w-10 h-10 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Say Cheeze Photobooth
                    </h1>
                    <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
                        Pilih layout favoritmu dan mulai membuat kenangan!
                    </p>
                    <div className="bg-white rounded-full px-6 py-3 inline-block shadow-sm border border-gray-200">
                        <p className="text-pink-600 font-medium">
                            Siap untuk sesi foto yang tak terlupakan? Mari kita mulai!
                        </p>
                    </div>
                </div>

                {/* Grid Selection Cards */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                            Pilih Layout Polaroid Anda
                        </h2>
                        <p className="text-lg text-gray-600">
                            Setiap layout punya keunikan tersendiri. Mana yang paling cocok dengan gayamu?
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        {grids.map((grid, index) => (
                            <div key={grid.id} className="relative">
                                <button
                                    onClick={() => onGridSelect(grid)}
                                    className="group w-full bg-white border-2 border-gray-200 hover:border-pink-300 rounded-xl p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-pink-500/20 focus:border-pink-500"
                                >
                                    {/* Card Header */}
                                    <div className="mb-6">
                                        <div className="w-12 h-12 bg-pink-100 group-hover:bg-pink-200 rounded-xl flex items-center justify-center mx-auto mb-4 transition-colors duration-300">
                                            <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{grid.label}</h3>
                                        <div className="bg-pink-50 rounded-full px-3 py-1 inline-block">
                                            <span className="text-pink-600 font-semibold text-sm">{grid.photoCount} Foto</span>
                                        </div>
                                    </div>

                                    {/* Visual Grid Representation */}
                                    <div className="mb-6">
                                        {grid.id === '3x1' && (
                                            <div className="flex gap-1.5 justify-center">
                                                {[1,2,3].map(i => (
                                                    <div key={i} className="w-8 h-6 bg-gray-200 group-hover:bg-pink-200 rounded transition-colors duration-300"></div>
                                                ))}
                                            </div>
                                        )}
                                        {grid.id === '2x2' && (
                                            <div className="grid grid-cols-2 gap-1.5 w-20 mx-auto">
                                                {[1,2,3,4].map(i => (
                                                    <div key={i} className="w-8 h-6 bg-gray-200 group-hover:bg-pink-200 rounded transition-colors duration-300"></div>
                                                ))}
                                            </div>
                                        )}
                                        {grid.id === '3x2' && (
                                            <div className="grid grid-cols-3 gap-1.5 w-28 mx-auto">
                                                {[1,2,3,4,5,6].map(i => (
                                                    <div key={i} className="w-8 h-5 bg-gray-200 group-hover:bg-pink-200 rounded transition-colors duration-300"></div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Description */}
                                    <div className="text-gray-600 text-sm leading-relaxed mb-4">
                                        {grid.id === '3x1' && "Perfect untuk cerita berurutan atau progress shots"}
                                        {grid.id === '2x2' && "Layout klasik yang seimbang dan simetris"}
                                        {grid.id === '3x2' && "Paling banyak foto untuk koleksi momen lengkap"}
                                    </div>

                                    {/* Hover Arrow */}
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="flex items-center justify-center gap-2 text-pink-600">
                                            <span className="font-semibold text-sm">Pilih Layout Ini</span>
                                            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </div>
                                    </div>
                                </button>

                                {/* Popular Badge for middle option */}
                                {index === 1 && (
                                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-pink-600 text-white px-4 py-1 rounded-full text-sm font-medium shadow-sm">
                                        Populer
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Bottom Tips */}
                    <div className="text-center mt-10 pt-8 border-t border-gray-200">
                        <p className="text-gray-600 mb-4">
                            <span className="font-semibold">Tips:</span> Pilih layout berdasarkan jumlah orang dan jenis foto yang ingin kamu buat
                        </p>
                        <div className="flex flex-wrap justify-center gap-3 text-sm">
                            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">Solo atau duo → 3x1</span>
                            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">Keluarga kecil → 2x2</span>
                            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">Grup besar → 3x2</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-8">
                    <p className="text-gray-500">
                        Semua layout menghasilkan foto berkualitas tinggi yang siap diunduh dan dibagikan!
                    </p>
                </div>

            </div>
        </div>
    );
}