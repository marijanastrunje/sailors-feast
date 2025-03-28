const compressImage = (file, maxWidth = 800, quality = 0.7) => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      const reader = new FileReader();
  
      reader.onload = (event) => {
        image.src = event.target.result;
      };
  
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const scaleSize = maxWidth / image.width;
        canvas.width = maxWidth;
        canvas.height = image.height * scaleSize;
  
        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  
        canvas.toBlob(
          (blob) => {
            if (blob) {
              if (blob.size > 300 * 1024) {
                reject(new Error("Kompresirana slika je i dalje veća od 300kB."));
                return;
              }
  
              const compressedFile = new File([blob], file.name, {
                type: "image/jpeg",
                lastModified: Date.now(),
              });
  
              resolve(compressedFile);
            } else {
              reject(new Error("Greška pri kompresiji."));
            }
          },
          "image/jpeg",
          quality
        );
      };
  
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };
  
  export default compressImage;
  