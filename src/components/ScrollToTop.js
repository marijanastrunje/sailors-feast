import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
    const { pathname } = useLocation(); // Dohvaća trenutnu rutu

    useEffect(() => {
        // Koristi glatki scroll za povratak na vrh
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth' // Ova opcija omogućava glatki scroll
        });
    }, [pathname]); // Pokreće se svaki put kad se ruta promijeni

    return null; // Ne renderira ništa, samo izvršava logiku
};

export default ScrollToTop;