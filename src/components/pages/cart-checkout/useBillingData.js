import { useState, useEffect, useCallback } from "react";

const useBillingData = () => {
    const [token, setToken] = useState(localStorage.getItem("token"));
    
    const [billing, setBilling] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        number_of_guests: "",
        marina: "",
        charter: "",
        boat: "",
        gate: "",
        delivery_date: "",
        delivery_time: "",
        order_notes: ""
    });

    // Funkcija za dohvaćanje podataka o korisniku
    const fetchUserData = useCallback(() => {
        if (!token) return;

        fetch(`https://backend.sailorsfeast.com/wp-json/wp/v2/users/me?nocache=${Date.now()}`, {
            headers: { "Authorization": `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
            if (data.id) {
                setBilling(prev => ({
                    ...prev,
                    first_name: data.first_name || "",
                    last_name: data.last_name || "",
                    email: localStorage.getItem("user_email") || "",
                    phone: data.phone || "",
                    marina: data.marina || "",
                    charter: data.charter || "",
                    boat: data.boat || "",
                    gate: data.gate || ""
                }));
            }
        })
        .catch(err => console.error("Greška pri dohvaćanju podataka:", err));
    }, [token]);

    // Dohvati podatke pri prvom učitavanju
    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    // Listener koji ažurira token kad se promijeni u localStorage
    useEffect(() => {
        const handleStorageChange = () => {
            setToken(localStorage.getItem("token"));
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    return [billing, setBilling, fetchUserData]; // Vraćamo i funkciju za dohvaćanje
};

export default useBillingData;
