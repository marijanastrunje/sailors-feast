export const checkDeliveryDateWarning = (deliveryDate) => {
    if (!deliveryDate) return false;
    
    const today = new Date();
    const delivery = new Date(deliveryDate);
    const differenceInTime = delivery.getTime() - today.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    
    return differenceInDays < 7;
  };
  
  export const validateStep = (step, billing, showDeliveryWarning) => {
    const errors = {};
    
    if (step === 1) {
      if (!billing.first_name) errors.first_name = "First name is required";
      if (!billing.last_name) errors.last_name = "Last name is required";
      if (!billing.email) errors.email = "Email is required";
      if (!billing.phone) errors.phone = "Phone is required";
    }
    
    // Validate delivery details if delivery date is less than 7 days away
    if (step === 2 && showDeliveryWarning) {
      if (!billing.marina) errors.marina = "Marina is required";
      if (!billing.charter) errors.charter = "Charter is required";
      if (!billing.boat) errors.boat = "Boat is required";
      if (!billing.gate) errors.gate = "Gate/pier is required";
    }
    
    return { errors, isValid: Object.keys(errors).length === 0 };
  };