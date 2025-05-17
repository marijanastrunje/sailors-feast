import { useState, useEffect, useCallback } from "react";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

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