const url = require('url');

const RISK_KEYWORDS = ['login', 'verify', 'update', 'account', 'security', 'banking', 'paypal', 'apple', 'google', 'signin', 'confirm'];
const SUSPICIOUS_DOMAINS = ['example-security.com', 'secure-login.net']; // Examples
const URL_SHORTENERS = ['bit.ly', 'goo.gl', 'tinyurl.com', 't.co', 'is.gd'];

function calculateRisk(input) {
    let score = 0;
    let reasons = [];
    let isUrl = false;
    let hostname = '';

    try {
        const parsed = new URL(input.startsWith('http') ? input : 'http://' + input);
        hostname = parsed.hostname;
        isUrl = true;
    } catch (e) {
        // Not a URL -> treat as text, but if it looks like a domain, treat as potential domain
        if (input.includes('.') && !input.includes(' ')) {
             hostname = input;
             isUrl = true;
        }
    }

    if (isUrl) {
        // 1. Check Shorteners
        if (URL_SHORTENERS.some(d => hostname.includes(d))) {
            score += 40;
            reasons.push("Uses a URL shortener (often used to hide malicious links)");
        }

        // 2. Check Suspicious Keywords in URL
        const foundKeywords = RISK_KEYWORDS.filter(k => input.toLowerCase().includes(k));
        if (foundKeywords.length > 0) {
            score += 30;
            reasons.push(`Contains sensitive keywords: ${foundKeywords.join(', ')}`);
        }

        // 3. Lengthy or complex URLs
        if (input.length > 70) {
            score += 15;
            reasons.push("URL is unusually long");
        }
        
        // 4. Multiple subdomains (e.g., google.com.secure.badsite.com)
        const parts = hostname.split('.');
        if (parts.length > 3) {
            score += 20;
            reasons.push("Excessive subdomains detected");
        }

        // 5. Lookalike / IP address
        if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname)) {
            score += 50;
            reasons.push("Host is an IP address");
        }

        if (input.includes('%') || input.includes('=')) {
           // Not necessarily bad, but combined with others...
           if (score > 10) score += 10;
        }

    } else {
        // Text analysis
         const foundKeywords = RISK_KEYWORDS.filter(k => input.toLowerCase().includes(k));
         if (foundKeywords.length > 0) {
            score += 20;
            reasons.push(`Text contains sensitive keywords: ${foundKeywords.join(', ')}`);
         }
    }

    // Cap score
    score = Math.min(score, 100);

    let level = "Safe";
    if (score > 75) level = "Dangerous";
    else if (score > 30) level = "Suspicious";

    const phishing = level !== "Safe";

    let message = reasons.length > 0 ? reasons.join(". ") : "No significant threats detected.";

    return {
        score,
        level,
        phishing,
        message
    };
}

module.exports = { calculateRisk };
