const fs = require('fs');
const https = require('https');
const path = require('path');

// Helper to download image
const downloadImage = (url, filepath) => {
    return new Promise((resolve, reject) => {
        const dir = path.dirname(filepath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        const file = fs.createWriteStream(filepath);
        https.get(url, (response) => {
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(filepath, () => { });
            reject(err);
        });
    });
};

const IMAGES = [
    // Categories
    { url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=400', path: 'public/categories/premium_tech.jpg' },
    { url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=400', path: 'public/categories/fashion.jpg' },
    { url: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=400', path: 'public/categories/watches.jpg' },
    { url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400', path: 'public/categories/sneakers.jpg' },
    { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400', path: 'public/categories/audio.jpg' },
    { url: 'https://images.unsplash.com/photo-1593305841991-05c29736560e?q=80&w=400', path: 'public/categories/gaming.jpg' },
    { url: 'https://images.unsplash.com/photo-1512418490979-59295d48651c?q=80&w=400', path: 'public/categories/lifestyle.jpg' },
    { url: 'https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?q=80&w=400', path: 'public/categories/accessories.jpg' },

    // Tech Products
    { url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?q=80&w=800', path: 'public/products/tech_1.jpg' },
    { url: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=800', path: 'public/products/tech_2.jpg' },
    { url: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?q=80&w=800', path: 'public/products/tech_3.jpg' },
    { url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=800', path: 'public/products/tech_4.jpg' },

    // Fashion Products
    { url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800', path: 'public/products/fashion_1.jpg' },
    { url: 'https://images.unsplash.com/photo-1550614000-4b9519e02a48?q=80&w=800', path: 'public/products/fashion_2.jpg' },
    { url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800', path: 'public/products/fashion_3.jpg' },
    { url: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=800', path: 'public/products/fashion_4.jpg' },

    // Watches Products
    { url: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=800', path: 'public/products/watch_1.jpg' },
    { url: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=800', path: 'public/products/watch_2.jpg' },
    { url: 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=800', path: 'public/products/watch_3.jpg' },
    { url: 'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?q=80&w=800', path: 'public/products/watch_4.jpg' },

    // Audio Products
    { url: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=800', path: 'public/products/audio_1.jpg' },
    { url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=800', path: 'public/products/audio_2.jpg' },
    { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800', path: 'public/products/audio_3.jpg' },
    { url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=800', path: 'public/products/audio_4.jpg' },

    // Sneakers Products
    { url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800', path: 'public/products/sneaker_1.jpg' },
    { url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=800', path: 'public/products/sneaker_2.jpg' },
    { url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=800', path: 'public/products/sneaker_3.jpg' },
    { url: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?q=80&w=800', path: 'public/products/sneaker_4.jpg' },
];

async function main() {
    console.log(`Downloading ${IMAGES.length} assets locally...`);

    // Running in chunks to avoid rate limits
    for (let i = 0; i < IMAGES.length; i++) {
        const img = IMAGES[i];
        const dest = path.join(__dirname, img.path);
        await downloadImage(img.url, dest).catch(e => console.error(`Failed ${img.path}:`, e.message));
        console.log(`[${i + 1}/${IMAGES.length}] Saved: ${img.path}`);
    }
}

main();
