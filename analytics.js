// Project Enra Analytics
// This file loads Google Analytics 4 and Microsoft Clarity
// Update tracking IDs here to apply changes across all pages

(function() {
    // Google Analytics 4
    var GA_MEASUREMENT_ID = 'G-0PYG53CV8F';
    
    var gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID;
    document.head.appendChild(gaScript);
    
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID);
    
    // Make gtag available globally
    window.gtag = gtag;
    
    // Microsoft Clarity
    var CLARITY_PROJECT_ID = 'uwfhlc9vvw';
    
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", CLARITY_PROJECT_ID);
})();
