
const tb = require('react-icons/tb');

const allIcons = [
    // Extracted from grep results
    'TbSparkles', 'TbDownload', 'TbStar', 'TbEye', 'TbVideo', 'TbPhoto', 'TbFileDescription', 'TbShoppingCart', 'TbCopy', 'TbCheck', 'TbFlame', 'TbCertificate', // MarketplacePromptCard
    'TbSearch', // PromptsFilters
    'TbTag', // PromptsTagsCloud (assumed)
    'TbX', 'TbCookie', 'TbSettings', // CookieBanner
    'TbBrandTelegram', 'TbBrandYoutube', 'TbArrowRight', 'TbUsers', // SocialSidebarWidget
    'TbBrandInstagram', 'TbBrandTiktok', 'TbBrandFacebook', // SocialFooterBanner
    'TbPlus', // SocialFloatingButton
    'TbLockOpen', 'TbLoader2', 'TbUnlock', // PromptUnlocker
    'TbBrandTwitter', 'TbBrandLinkedin', 'TbLink', 'TbShare', // ShareButtons
    'TbList', 'TbChevronRight', 'TbChevronLeft', 'TbLock', 'TbClock', 'TbUser', 'TbCalendar', // Typography / Encyclopedia etc
    'TbHome', // Breadcrumbs
    'TbTrophy', 'TbRefresh', // ArticleQuiz
    'TbThumbUp', 'TbThumbUpFilled', 'TbBookmark', 'TbBookmarkFilled', // ArticleActions
    'TbBook', // Library pages
    'TbArrowLeft', // slug page
    'TbCircleCheck', 'TbGift', 'TbChartBar', 'TbBulb', 'TbRocket', // Landing pages
    'TbTools', 'TbCash', 'TbScale', 'TbBriefcase', 'TbAutomation', // Landing pages
    'TbAlertTriangle', // error.tsx
    'TbBolt', // lessons
    'TbClipboardCheck', 'TbDeviceDesktop', // readiness
    'TbActivity', 'TbSeeding', 'TbSchool' // health
];

console.log('Checking ALL imports...');
allIcons.forEach(icon => {
    if (!tb[icon]) {
        console.log(`❌ ${icon} is UNDEFINED`);
    }
});
console.log('Done.');
