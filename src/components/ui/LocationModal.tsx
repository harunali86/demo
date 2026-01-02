'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, X, Navigation, Search, Loader2, CheckCircle, MapPinned, Home, Building } from 'lucide-react';
import { useLocationStore, Address } from '@/store/location';
import { toast } from 'sonner';

// Popular cities for quick selection
const POPULAR_CITIES = [
    { name: 'Mumbai', pincode: '400001' },
    { name: 'Delhi', pincode: '110001' },
    { name: 'Bangalore', pincode: '560001' },
    { name: 'Hyderabad', pincode: '500001' },
    { name: 'Chennai', pincode: '600001' },
    { name: 'Pune', pincode: '411001' },
];

interface SearchResult {
    display_name: string;
    address: {
        city?: string;
        town?: string;
        village?: string;
        suburb?: string;
        postcode?: string;
        road?: string;
        state?: string;
    };
}

export default function LocationModal() {
    const { isModalOpen, setModalOpen, setLocation, setFullAddress, location, fullAddress } = useLocationStore();
    const [mounted, setMounted] = useState(false);
    const [detecting, setDetecting] = useState(false);
    const [searching, setSearching] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [accuracy, setAccuracy] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [activeTab, setActiveTab] = useState<'detect' | 'address'>('address');

    // Address form fields
    const [addressForm, setAddressForm] = useState<Address>({
        flatNo: fullAddress?.flatNo || '',
        building: fullAddress?.building || '',
        road: fullAddress?.road || '',
        area: fullAddress?.area || '',
        city: fullAddress?.city || '',
        pincode: fullAddress?.pincode || '',
        landmark: fullAddress?.landmark || '',
    });

    useEffect(() => {
        setMounted(true);
    }, []);

    // Debounced search for area
    useEffect(() => {
        if (searchQuery.length < 3) {
            setSearchResults([]);
            return;
        }

        const timer = setTimeout(async () => {
            setSearching(true);
            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&countrycodes=in&addressdetails=1&limit=5`,
                    { headers: { 'Accept-Language': 'en' } }
                );
                const data = await response.json();
                setSearchResults(data);
            } catch (error) {
                console.error('Search failed:', error);
            } finally {
                setSearching(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Auto-open modal if no location set
    useEffect(() => {
        if (!mounted) return;
        if (location === 'Select Location') {
            const timer = setTimeout(() => setModalOpen(true), 2000);
            return () => clearTimeout(timer);
        }
    }, [location, setModalOpen, mounted]);

    if (!mounted) return null;

    const handleSaveAddress = () => {
        if (addressForm.flatNo && addressForm.area && addressForm.city && addressForm.pincode) {
            setFullAddress(addressForm);
            setModalOpen(false);
        }
    };

    const handleSelectSearchResult = (result: SearchResult) => {
        const city = result.address.city || result.address.town || result.address.village || '';
        const area = result.address.suburb || result.address.road || '';
        const pincode = result.address.postcode || '';

        setAddressForm(prev => ({
            ...prev,
            area: area,
            city: city,
            pincode: pincode,
            road: result.address.road || '',
        }));
        setSearchQuery('');
        setSearchResults([]);
    };

    const detectLocation = () => {
        setDetecting(true);
        setErrorMsg('');
        setAccuracy(null);

        if (!navigator.geolocation) {
            setErrorMsg('Geolocation not supported by browser.');
            setDetecting(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude, accuracy } = position.coords;
                    setAccuracy(Math.round(accuracy));

                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
                        { headers: { 'Accept-Language': 'en' } }
                    );

                    if (!response.ok) throw new Error('Address lookup failed');

                    const data = await response.json();

                    if (!data.address) throw new Error('No address found');

                    const address = data.address;
                    const road = address.road || address.street || address.path || address.lane || '';
                    const area = address.suburb || address.neighbourhood || address.residential || address.commercial || address.industrial || address.hamlet || road;
                    const city = address.city || address.town || address.village || address.municipality || address.city_district || address.county || address.state_district || '';
                    const pincode = address.postcode || '';

                    setAddressForm(prev => ({
                        ...prev,
                        road: road,
                        area: area,
                        city: city,
                        pincode: pincode,
                    }));

                    toast.success('Location detected successfully!', {
                        description: `${area}, ${city}`,
                        icon: <CheckCircle className="w-5 h-5 text-green-500" />,
                    });

                    setActiveTab('address'); // Switch to address tab to complete
                    setDetecting(false);
                } catch (error) {
                    console.error('GPS Processing Error:', error);
                    toast.error('Could not fetch address details', { description: 'Please enter manually' });
                    setErrorMsg('Failed to fetch address details. Please enter manually.');
                    setDetecting(false);
                }
            },
            (err) => {
                console.warn('Geolocation Error:', err);
                let msg = 'Location access denied.';
                if (err.code === 2) msg = 'Location unavailable / GPS disabled.';
                if (err.code === 3) msg = 'Location request timed out.';

                toast.error(msg, { description: 'Please enter address manually' });
                setErrorMsg(msg + ' Enter address manually.');
                setDetecting(false);
            },
            { enableHighAccuracy: false, timeout: 10000, maximumAge: 0 }
        );
    };

    const isFormValid = addressForm.flatNo && addressForm.area && addressForm.city && addressForm.pincode;

    return (
        <AnimatePresence>
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setModalOpen(false)}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-lg bg-[#111] border border-white/10 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
                    >
                        {/* Header */}
                        <div className="sticky top-0 bg-[#111] z-10 p-6 pb-4 border-b border-white/10">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <MapPin className="text-primary" />
                                    Delivery Address
                                </h2>
                                <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>

                            {/* Tabs */}
                            <div className="flex gap-2 mt-4">
                                <button
                                    onClick={() => setActiveTab('address')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === 'address' ? 'bg-primary text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                        }`}
                                >
                                    <Home className="w-4 h-4" />
                                    Enter Address
                                </button>
                                <button
                                    onClick={() => { detectLocation(); setActiveTab('detect'); }}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === 'detect' ? 'bg-primary text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                        }`}
                                >
                                    <Navigation className="w-4 h-4" />
                                    {detecting ? 'Detecting...' : 'Use GPS'}
                                </button>
                            </div>
                        </div>

                        <div className="p-6 pt-4">
                            {/* GPS Detection Status */}
                            {activeTab === 'detect' && detecting && (
                                <div className="flex items-center justify-center gap-3 py-8">
                                    <Loader2 className="w-6 h-6 text-primary animate-spin" />
                                    <span className="text-gray-400">Detecting your location...</span>
                                </div>
                            )}

                            {activeTab === 'detect' && !detecting && accuracy && (
                                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-4">
                                    <div className="flex items-center gap-2 text-green-400">
                                        <CheckCircle className="w-5 h-5" />
                                        <span className="font-medium">Area detected! Complete address below.</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Accuracy: ~{accuracy}m</p>
                                </div>
                            )}

                            {errorMsg && (
                                <p className="text-red-400 text-sm mb-4 bg-red-500/10 border border-red-500/30 rounded-xl p-3">{errorMsg}</p>
                            )}

                            {/* Address Form */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-medium text-white">Complete Address Details</h3>
                                    {accuracy && (
                                        <span className="text-[10px] bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full border border-green-500/20 flex items-center gap-1">
                                            <Navigation className="w-3 h-3" />
                                            GPS Detected
                                        </span>
                                    )}
                                </div>
                                {/* Search Area */}
                                <div className="relative">
                                    <label className="block text-xs font-medium text-gray-400 mb-1">Search Area/Locality</label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Type area name to search..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-primary"
                                        />
                                        {searching && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin" />}
                                    </div>

                                    {/* Search Results Dropdown */}
                                    {searchResults.length > 0 && (
                                        <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a1a] border border-white/10 rounded-xl z-20 max-h-48 overflow-y-auto">
                                            {searchResults.map((result, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => handleSelectSearchResult(result)}
                                                    className="w-full text-left p-3 hover:bg-white/10 transition-colors text-sm border-b border-white/5 last:border-0"
                                                >
                                                    <p className="line-clamp-1">{result.display_name}</p>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Quick City Select */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-2">Or select city</label>
                                    <div className="flex flex-wrap gap-2">
                                        {POPULAR_CITIES.map((city) => (
                                            <button
                                                key={city.name}
                                                onClick={() => setAddressForm(prev => ({ ...prev, city: city.name, pincode: city.pincode }))}
                                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${addressForm.city === city.name
                                                    ? 'bg-primary text-white'
                                                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                                    }`}
                                            >
                                                {city.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="h-px bg-white/10" />

                                {/* Flat/House No */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1">
                                        Flat / House No / Floor <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. 401, A Wing"
                                        value={addressForm.flatNo}
                                        onChange={(e) => setAddressForm(prev => ({ ...prev, flatNo: e.target.value }))}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-primary"
                                    />
                                </div>

                                {/* Building/Society */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1">Society / Building Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Sunshine Apartments"
                                        value={addressForm.building}
                                        onChange={(e) => setAddressForm(prev => ({ ...prev, building: e.target.value }))}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-primary"
                                    />
                                </div>

                                {/* Road/Street */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1">Road / Street</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. MG Road"
                                        value={addressForm.road}
                                        onChange={(e) => setAddressForm(prev => ({ ...prev, road: e.target.value }))}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-primary"
                                    />
                                </div>

                                {/* Area/Locality */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1">
                                        Area / Locality <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Bandra West"
                                        value={addressForm.area}
                                        onChange={(e) => setAddressForm(prev => ({ ...prev, area: e.target.value }))}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-primary"
                                    />
                                </div>

                                {/* City & Pincode in row */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-400 mb-1">
                                            City <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Mumbai"
                                            value={addressForm.city}
                                            onChange={(e) => setAddressForm(prev => ({ ...prev, city: e.target.value }))}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-400 mb-1">
                                            Pincode <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g. 400050"
                                            value={addressForm.pincode}
                                            onChange={(e) => setAddressForm(prev => ({ ...prev, pincode: e.target.value }))}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-primary"
                                        />
                                    </div>
                                </div>

                                {/* Landmark */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1">Landmark (optional)</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Near City Mall"
                                        value={addressForm.landmark}
                                        onChange={(e) => setAddressForm(prev => ({ ...prev, landmark: e.target.value }))}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-primary"
                                    />
                                </div>

                                {/* Save Button */}
                                <button
                                    onClick={handleSaveAddress}
                                    disabled={!isFormValid}
                                    className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                                >
                                    Save Address
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
