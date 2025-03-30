import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

const QRCode = ({ formData, cart }) => {
    if (!cart || cart.length === 0) return <p>No items in the cart.</p>;

    // Izračunaj ukupnu cijenu narudžbe
    const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);

    // Generiraj podatke za QR kod na temelju narudžbe
    const paymentInfo = `HRVHUB30\nEUR\n${totalPrice}\n` +
        `${formData.name}\n${formData.address}\n${formData.city}\n` +
        "Aida Knezičić\nFancevljev prilaz 9\n10000 ZAGREB\n" +
        "HR6123400093201038319\nHR01\n7336-57068423066-00001\nCOST\nPlaćanje narudžbe\n";

    return (
        <div className="text-center p-5">
            <h3>Scan to Pay</h3>
            <QRCodeSVG value={paymentInfo} size={256} />
        </div>
    );
};

export default QRCode;
