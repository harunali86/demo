import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/admin/',
                    '/api/',
                    '/cart',
                    '/checkout',
                    '/profile',
                    '/orders',
                ],
            },
            {
                userAgent: 'Googlebot',
                allow: '/',
                disallow: ['/admin/', '/api/'],
            },
        ],
        sitemap: 'https://harunstore.com/sitemap.xml',
    };
}
