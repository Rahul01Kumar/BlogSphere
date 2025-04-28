const https = require('https');
const fs = require('fs');
const path = require('path');

const images = {
    featured: [
        { name: 'featured-1.jpg', url: 'https://picsum.photos/id/1/800/600' },
        { name: 'featured-2.jpg', url: 'https://picsum.photos/id/2/800/600' },
        { name: 'featured-3.jpg', url: 'https://picsum.photos/id/3/800/600' }
    ],
    trending: [
        { name: 'trending_1.jpg', url: 'https://picsum.photos/id/4/400/300' },
        { name: 'trending_2.jpg', url: 'https://picsum.photos/id/5/400/300' },
        { name: 'trending_3.jpg', url: 'https://picsum.photos/id/6/400/300' },
        { name: 'trending_4.jpg', url: 'https://picsum.photos/id/7/400/300' },
        { name: 'trending_5.jpg', url: 'https://picsum.photos/id/8/400/300' }
    ],
    quick_read: [
        { name: 'quick_read_1.jpg', url: 'https://picsum.photos/id/9/400/300' },
        { name: 'quick_read_2.jpg', url: 'https://picsum.photos/id/10/400/300' },
        { name: 'quick_read_3.jpg', url: 'https://picsum.photos/id/11/400/300' },
        { name: 'quick_read_4.jpg', url: 'https://picsum.photos/id/12/400/300' },
        { name: 'quick_read_5.jpg', url: 'https://picsum.photos/id/13/400/300' },
        { name: 'quick_read_6.jpg', url: 'https://picsum.photos/id/14/400/300' }
    ],
    older_posts: [
        { name: 'older_posts_1.jpg', url: 'https://picsum.photos/id/15/400/300' },
        { name: 'older_posts_2.jpg', url: 'https://picsum.photos/id/16/400/300' },
        { name: 'older_posts_3.jpg', url: 'https://picsum.photos/id/17/400/300' },
        { name: 'older_posts_4.jpg', url: 'https://picsum.photos/id/18/400/300' },
        { name: 'older_posts_5.jpg', url: 'https://picsum.photos/id/19/400/300' },
        { name: 'older_posts_6.jpg', url: 'https://picsum.photos/id/20/400/300' }
    ],
    tags: [
        { name: 'travel-tag.jpg', url: 'https://picsum.photos/id/21/400/300' },
        { name: 'food-tag.jpg', url: 'https://picsum.photos/id/22/400/300' },
        { name: 'technology-tag.jpg', url: 'https://picsum.photos/id/23/400/300' },
        { name: 'health-tag.jpg', url: 'https://picsum.photos/id/24/400/300' },
        { name: 'nature-tag.jpg', url: 'https://picsum.photos/id/25/400/300' },
        { name: 'fitness-tag.jpg', url: 'https://picsum.photos/id/26/400/300' }
    ]
};

function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download image: ${response.statusCode}`));
                return;
            }

            const file = fs.createWriteStream(filepath);
            response.pipe(file);

            file.on('finish', () => {
                file.close();
                resolve();
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}

async function downloadAllImages() {
    for (const [category, imageList] of Object.entries(images)) {
        const dir = path.join('Frontend', 'assets', 'images', category);
        
        // Create directory if it doesn't exist
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        for (const image of imageList) {
            const filepath = path.join(dir, image.name);
            try {
                console.log(`Downloading ${image.name}...`);
                await downloadImage(image.url, filepath);
                console.log(`Downloaded ${image.name}`);
            } catch (err) {
                console.error(`Error downloading ${image.name}:`, err);
            }
        }
    }
}

downloadAllImages().then(() => {
    console.log('All images downloaded successfully!');
}).catch(err => {
    console.error('Error downloading images:', err);
}); 