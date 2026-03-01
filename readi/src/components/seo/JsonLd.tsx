"use client";

export function JsonLd() {
    const schema = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "READI.FR",
        "image": "https://readi.fr/og-image.jpg",
        "@id": "https://readi.fr",
        "url": "https://readi.fr",
        "telephone": "+33000000000",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "N/A",
            "addressLocality": "France",
            "postalCode": "N/A",
            "addressCountry": "FR"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": 46.2276,
            "longitude": 2.2137
        },
        "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday"
            ],
            "opens": "09:00",
            "closes": "18:00"
        },
        "sameAs": [
            "https://www.facebook.com/readi",
            "https://www.linkedin.com/company/readi"
        ],
        "priceRange": "$$"
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
