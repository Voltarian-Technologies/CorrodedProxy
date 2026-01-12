function createUrlBlocker(config = {}) {
    const defaultBlockedDomains = [
        // YouTube
        'youtube.com',
        'www.youtube.com',
        'm.youtube.com',
        'youtu.be',
        
        // Search engines
        'google.com',
        'www.google.com',
        'bing.com',
        'www.bing.com',
        'duckduckgo.com',
        'www.duckduckgo.com',
        'yahoo.com',
        'search.yahoo.com',
        'baidu.com',
        'www.baidu.com',
        'yandex.com',
        'www.yandex.com',
        
        // Social media
        'facebook.com',
        'www.facebook.com',
        'm.facebook.com',
        'twitter.com',
        'www.twitter.com',
        'x.com',
        'www.x.com',
        'instagram.com',
        'www.instagram.com',
        'linkedin.com',
        'www.linkedin.com',
        'tiktok.com',
        'www.tiktok.com',
        'reddit.com',
        'www.reddit.com',
        'pinterest.com',
        'www.pinterest.com',
        'snapchat.com',
        'www.snapchat.com',
        'whatsapp.com',
        'www.whatsapp.com',
        
        // CAPTCHA services
        'recaptcha.net',
        'www.recaptcha.net',
        'google.com/recaptcha',
        'hcaptcha.com',
        'www.hcaptcha.com',
        'turnstile.cloudflarecdn.com',
        'challenges.cloudflare.com',
        'api.cloudflare.com',
        'captcha.com',
        'www.captcha.com',
        
        // Additional common blocked sites
        'netflix.com',
        'www.netflix.com',
        'twitch.tv',
        'www.twitch.tv',
        'discord.com',
        'www.discord.com',
        'spotify.com',
        'www.spotify.com'
    ];

    const blockedDomains = config.blockedDomains || defaultBlockedDomains;
    const statusCode = config.statusCode || 403;

    return function urlBlocker(requestContext) {
        const hostname = requestContext.url.hostname;
        
        // Check if the hostname is in the blocked list
        if (blockedDomains.includes(hostname)) {
            requestContext.clientResponse.writeHead(statusCode, { 
                'Content-Type': 'text/html; charset=utf-8'
            });
            requestContext.clientResponse.end(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width,initial-scale=1">
                    <title>VoltaTECH - Corroded Proxy Blocked</title>
                    <link rel="preconnect" href="https://fonts.gstatic.com">
                    <link rel="icon" type="image/webp" href="/img/favicon.webp" />
                    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
                    <style>
                        :root {
                            --bg: #0f1113;
                            --card: #131516;
                            --muted: #9aa5ad;
                            --accent: linear-gradient(135deg, #2ACFD3, #1D52B2);
                            --glass: rgba(255, 255, 255, 0.03);
                            --danger: #e74c3c;
                        }

                        * {
                            box-sizing: border-box
                        }

                        html,
                        body {
                            height: 100%
                        }

                        body {
                            margin: 0;
                            font-family: Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
                            background-color: #1D212E;
                            background-image: url("/img/background.png");
                            background-size: cover;
                            background-position: center;
                            background-repeat: no-repeat;
                            backdrop-filter: blur(20px);
                            color: #e6eef1;
                            -webkit-font-smoothing: antialiased;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            padding: 32px;
                        }

                        .container {
                            width: 100%;
                            max-width: 620px;
                            background: linear-gradient(180deg, rgba(135, 150, 160, 0.2), rgba(135, 150, 180, 0.1));
                            border: 1px solid rgba(255, 255, 255, 0.04);
                            border-radius: 14px;
                            padding: 36px;
                            box-shadow: 0 8px 30px rgba(2, 6, 10, 0.6);
                            backdrop-filter: blur(50px) saturate(180%);
                            -webkit-backdrop-filter: blur(50px) saturate(180%);
                            text-align: center;
                        }

                        header {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            gap: 16px;
                            padding: 16px;
                            margin-bottom: 24px;
                        }

                        .logo-expanded {
                            width: 128px;
                            height: 56px;
                            border-radius: 10px;
                            padding: 8px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            overflow: hidden;
                        }

                        .logo-expanded img {
                            width: 100%;
                            height: 100%;
                            object-fit: contain;
                            display: block;
                            border-radius: inherit;
                        }

                        .blocked-icon {
                            width: 64px;
                            height: 64px;
                            margin: 0 auto 24px;
                            background: linear-gradient(135deg, #e74c3c, #c0392b);
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            box-shadow: 0 6px 18px rgba(231, 76, 60, 0.12);
                        }

                        .blocked-icon svg {
                            width: 32px;
                            height: 32px;
                            fill: white;
                        }

                        h1 {
                            font-size: 24px;
                            margin: 0 0 16px;
                            font-weight: 600;
                            color: #e74c3c;
                        }

                        p {
                            margin: 0 0 20px;
                            color: var(--muted);
                            font-size: 15px;
                            line-height: 1.6;
                        }

                        .url-container {
                            background: var(--glass);
                            border: 1px solid rgba(255, 255, 255, 0.04);
                            border-radius: 10px;
                            padding: 16px;
                            margin: 24px 0;
                            word-break: break-all;
                        }

                        .url-label {
                            font-size: 12px;
                            color: var(--muted);
                            text-transform: uppercase;
                            letter-spacing: 1px;
                            margin-bottom: 8px;
                            font-weight: 600;
                        }

                        .url {
                            font-family: 'Courier New', monospace;
                            font-size: 13px;
                            color: #e6eef1;
                            background: rgba(0, 0, 0, 0.2);
                            padding: 12px;
                            border-radius: 6px;
                            border: 1px solid rgba(231, 76, 60, 0.2);
                        }

                        .back-btn {
                            display: inline-block;
                            padding: 12px 24px;
                            border-radius: 10px;
                            border: none;
                            background: linear-gradient(135deg, #2ACFD3, #1D52B2);
                            color: #042018;
                            font-weight: 700;
                            cursor: pointer;
                            box-shadow: 0 8px 20px rgba(42, 207, 211, 0.12);
                            transition: transform .12s ease, box-shadow .12s ease, opacity .12s ease;
                            text-decoration: none;
                            margin-top: 8px;
                        }

                        .back-btn:hover {
                            opacity: .95;
                            transform: translateY(-1px);
                        }

                        .back-btn:active {
                            transform: translateY(1px);
                        }

                        @media (max-width: 560px) {
                            .container {
                                padding: 20px;
                                margin: 16px;
                            }
                            
                            h1 {
                                font-size: 20px;
                            }
                            
                            .url {
                                font-size: 12px;
                            }
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <header>
                            <div class="logo-expanded">
                                <img alt="" src="/img/logo-expanded.webp" />
                            </div>
                        </header>
                        <div class="blocked-icon">
                            <svg fill="currentColor" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                <title>blocked</title>
                                <path d="M16 29c-7.179 0-13-5.82-13-13s5.821-13 13-13c7.18 0 13 5.82 13 13s-5.82 13-13 13zM16 26c2.211 0 4.249-0.727 5.905-1.941l-13.963-13.962c-1.216 1.655-1.942 3.692-1.942 5.903 0 5.522 4.477 10 10 10zM16 6c-2.228 0-4.279 0.737-5.941 1.97l13.971 13.972c1.232-1.663 1.97-3.713 1.97-5.942 0-5.523-4.477-10-10-10z"></path>
                            </svg>
                        </div>
                        <h1>Access Blocked</h1>
\                        <div class="url-container">
                            <div class="url-label">Blocked URL</div>
                            <div class="url">${requestContext.url.href}</div>
                        </div>
                        <p>This site has been blocked by the administrators of VoltaTECH's Corroded Proxy for security and productivity reasons.</p>
                        <a href="/" class="back-btn">Return to Corroded Proxy</a>
                    </div>
                </body>
                </html>
            `);
            return;
        }
    };
};

module.exports = createUrlBlocker;
