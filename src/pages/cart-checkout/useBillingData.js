import { useState, useEffect, useCallback } from "react";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const useBillingData = () => {
    const [token, setToken] = useState(localStorage.getItem("token"));

    // Inicijaliziraj billing s podacima iz localStorage ako postoje
    const [billing, setBilling] = useState(() => {
        const savedBilling = localStorage.getItem("billingData");
        const defaultBilling = {
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
        };
        
        return savedBilling ? JSON.parse(savedBilling) : defaultBilling;
    });

    // Spremi billing podatke u localStorage kad se promijene
    useEffect(() => {
        localStorage.setItem("billingData", JSON.stringify(billing));
    }, [billing]);

    // Function to fetch user data
    const fetchUserData = useCallback(() => {
        if (!token) return;

        fetch(`${backendUrl}/wp-json/wp/v2/users/me?nocache=${Date.now()}`, {
            headers: { "Authorization": `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
            if (data.id) {
                setBilling(prev => ({
                    ...prev,
                    first_name: data.first_name || prev.first_name || "",
                    last_name: data.last_name || prev.last_name || "",
                    email: localStorage.getItem("user_email") || prev.email || "",
                    phone: data.phone || prev.phone || "",
                    marina: data.marina || prev.marina || "",
                    charter: data.charter || prev.charter || "",
                    boat: data.boat || prev.boat || "",
                    gate: data.gate || prev.gate || ""
                }));
            }
        })
        .catch(err => console.error("Error fetching user data:", err));
    }, [token]);

    // Fetch user data on first load
    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    // Listen for token changes in localStorage
    useEffect(() => {
        const handleStorageChange = () => {
            setToken(localStorage.getItem("token"));
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    return [billing, setBilling, fetchUserData];
};

export default useBillingData;