
const tb = require('react-icons/tb');
const iconsToCheck = [
    'TbSparkles', 'TbVideo', 'TbPhoto', 'TbFileDescription', 'TbArrowRight', // from page.tsx
    'TbDownload', 'TbStar', 'TbEye', 'TbShoppingCart', 'TbCopy', 'TbCheck', 'TbFlame', 'TbCertificate', // from MarketplacePromptCard.tsx
    'TbSearch', // from PromptsFilters.tsx
    'TbBrandTiktok', 'TbBrandTikTok' // checking specific ones
];

console.log('Checking icons...');
iconsToCheck.forEach(icon => {
    if (!tb[icon]) {
        console.log(`❌ ${icon} is UNDEFINED`);
    } else {
        console.log(`✅ ${icon} is defined`);
    }
});
