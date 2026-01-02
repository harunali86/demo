import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Address {
    flatNo: string;      // Flat/House No
    building: string;    // Society/Building Name
    road: string;        // Road/Street
    area: string;        // Area/Locality (auto-detected)
    city: string;        // City
    pincode: string;     // Pincode
    landmark?: string;   // Near landmark (optional)
}

interface LocationState {
    location: string;           // Display string (short)
    pincode: string;
    fullAddress: Address | null; // Complete address
    isModalOpen: boolean;
    setLocation: (loc: string, pin: string) => void;
    setPincode: (pin: string) => void;
    setFullAddress: (address: Address) => void;
    setModalOpen: (isOpen: boolean) => void;
}

export const useLocationStore = create<LocationState>()(
    persist(
        (set) => ({
            location: 'Select Location',
            pincode: '',
            fullAddress: null,
            isModalOpen: false,
            setLocation: (loc, pin) => set({ location: loc, pincode: pin }),
            setPincode: (pin) => set({ pincode: pin }),
            setFullAddress: (address) => set({
                fullAddress: address,
                location: `${address.area}, ${address.city}`,
                pincode: address.pincode
            }),
            setModalOpen: (isOpen) => set({ isModalOpen: isOpen }),
        }),
        {
            name: 'location-storage',
        }
    )
);
