<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Offline - {{ config('app.name', 'Whisper Money') }}</title>
    <meta name="theme-color" content="#1b1b18">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #1b1b18;
            color: #f5f5f4;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100dvh;
            padding: 2rem;
            text-align: center;
        }
        .container { max-width: 400px; }
        .icon { font-size: 4rem; margin-bottom: 1.5rem; opacity: 0.6; }
        h1 { font-size: 1.5rem; font-weight: 600; margin-bottom: 0.75rem; }
        p { color: #a8a29e; line-height: 1.6; margin-bottom: 2rem; }
        .retry-btn {
            display: inline-block;
            padding: 0.75rem 2rem;
            background: #f5f5f4;
            color: #1b1b18;
            border: none;
            border-radius: 0.5rem;
            font-size: 0.875rem;
            font-weight: 500;
            cursor: pointer;
            text-decoration: none;
        }
        .retry-btn:hover { background: #e7e5e4; }
    </style>
</head>
<body>
    <div class="container">
        <div class="icon">&#9888;</div>
        <h1>You're offline</h1>
        <p>Connect to the internet to continue using Whisper Money. Your data is encrypted and stays safe.</p>
        <button class="retry-btn" onclick="window.location.reload()">Try again</button>
    </div>
</body>
</html>
