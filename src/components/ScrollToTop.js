import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
    const { pathname } = useLocation(); // Dohvaća trenutnu rutu

    useEffect(() => {
        window.scrollTo(0, 0); // Resetira scroll na vrh pri promjeni rute
    }, [pathname]); // Pokreće se svaki put kad se ruta promijeni

    return null; // Ne renderira ništa, samo izvršava logiku
};

export default ScrollToTop;
