import { useState } from "react";

export default function QrCodeFetcher() {
  const [name, setName] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  const handleSearch = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:3000/users/qrcode?name=${name}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      console.log( response);
      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setQrCodeUrl(imageUrl);
    } catch (error) {
      console.error("Error fetching QR code:", error);
    }
  };

  return (
    <div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter name"
      />
      <button onClick={handleSearch}>Search</button>
      {qrCodeUrl && <img src={qrCodeUrl} alt="User QR Code" />}
    </div>
  );
}
