const backendUrl = process.env.REACT_APP_BACKEND_URL;

export const handleGuestRegistration = async (billing, password, userType, orderId) => {
  if (!billing.email || !billing.first_name || !billing.last_name) {
    alert("Missing required user information.");
    return false;
  }

  try {
    // Prepare registration data
    const registerData = {
      username: billing.email,
      email: billing.email,
      password: password,
      first_name: billing.first_name,
      last_name: billing.last_name,
      meta: { user_type: userType }
    };

    // Send registration request
    const registerResponse = await fetch(`${backendUrl}/wp-json/simple-jwt-login/v1/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(registerData)
    });

    if (!registerResponse.ok) {
      const errorData = await registerResponse.json();
      throw new Error(errorData.message || "Failed to create account.");
    }

    console.log("User registration successful");

    // Login with new user credentials
    const loginResponse = await fetch(`${backendUrl}/wp-json/jwt-auth/v1/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: billing.email,
        password: password
      })
    });

    const loginData = await loginResponse.json();

    if (!loginData.token) {
      throw new Error("Failed to log in after registration.");
    }

    console.log("User login successful, token received");

    // Save token and user data in localStorage
    localStorage.setItem("token", loginData.token);
    localStorage.setItem("username", loginData.user_display_name);
    localStorage.setItem("user_email", billing.email);
    localStorage.setItem("user_type", userType);

    // Remove guest checkout flag
    sessionStorage.removeItem("guest_checkout");

    // Get user data to update userId in React state
    const userDataResponse = await fetch(`${backendUrl}/wp-json/wp/v2/users/me?no_cache=${Date.now()}`, {
      headers: { Authorization: `Bearer ${loginData.token}` }
    });
    
    if (!userDataResponse.ok) {
      console.error("Error fetching user data:", await userDataResponse.text());
      throw new Error("Failed to fetch user data after login.");
    }
    
    const userData = await userDataResponse.json();
    const userId = userData.id;

    console.log("User data retrieved, ID:", userId);

    // Emit event that user data has been updated
    window.dispatchEvent(new Event("userLogin"));

    // Associate order with user on backend
    if (orderId) {
      try {
        console.log("Associating order ID", orderId, "with user ID", userId);
        
        const associateResponse = await fetch(`${backendUrl}/wp-json/sailorsfeast/v1/associate-order`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${loginData.token}`
          },
          body: JSON.stringify({ orderId, userId })
        });
        
        if (!associateResponse.ok) {
          const associateError = await associateResponse.json();
          console.error("Order association failed with status:", associateResponse.status, associateError);
        } else {
          const associateResult = await associateResponse.json();
          console.log("Order association result:", associateResult);
        }
      } catch (associateError) {
        console.error("Exception during order association:", associateError);
        // Don't throw here - we want to complete registration even if association fails
      }
    }

    alert("Registration successful! Your account is now linked to the order.");
    return userId;
  } catch (error) {
    console.error("Registration error:", error);
    alert(error.message || "Failed to create account.");
    return false;
  }
};