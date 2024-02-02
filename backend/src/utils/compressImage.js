import sharp from "sharp"

export const uploadWithResize = async (imgString, path, name) => {
    const compressionQuality = 80; 
    const targetSize = 100;

    const imageBuffer = Buffer.from(imgString, 'base64');

    await sharp(imageBuffer)
    .resize(targetSize, targetSize) 
    .webp({ quality: compressionQuality }) 
    .toFile(`${path}/${name}.webp`, (err, info) => {
        if (err) {
        console.error(err);
        } else {
        console.log(info);
        console.log('Image converted and saved successfully!');
        }
    });

    return `${name}.webp`
}


