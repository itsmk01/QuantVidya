exports.forgotPasswordLink = (email, name, url) => {
	return `<!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="UTF-8">
        <title>Password Reset Request</title>
        <style>
            body {
                background-color: #f4f4f4;
                font-family: Arial, sans-serif;
                font-size: 16px;
                line-height: 1.6;
                color: #333333;
                margin: 0;
                padding: 0;
            }
    
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #ffffff;
            }
    
            .logo {
                max-width: 200px;
                margin-bottom: 20px;
                display: block;
                margin-left: auto;
                margin-right: auto;
            }
    
            .header {
                text-align: center;
                padding: 20px 0;
            }
    
            .message {
                font-size: 22px;
                font-weight: bold;
                margin-bottom: 20px;
                color: #2c3e50;
                text-align: center;
            }
    
            .body {
                font-size: 16px;
                margin-bottom: 20px;
                padding: 0 20px;
            }
    
            .body p {
                margin: 15px 0;
            }
    
            .cta-button {
                display: block;
                width: fit-content;
                margin: 30px auto;
                padding: 14px 40px;
                background-color: #3498db;
                color: #ffffff !important;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
                font-size: 16px;
                text-align: center;
            }
    
            .cta-button:hover {
                background-color: #2980b9;
            }
    
            .link-container {
                background-color: #f8f9fa;
                padding: 15px;
                border-radius: 5px;
                margin: 20px 0;
                word-break: break-all;
            }
    
            .link-text {
                font-size: 14px;
                color: #666666;
                text-align: center;
            }
    
            .warning {
                background-color: #fff3cd;
                border-left: 4px solid #ffc107;
                padding: 15px;
                margin: 20px 0;
                border-radius: 4px;
            }
    
            .warning p {
                margin: 5px 0;
                color: #856404;
                font-size: 14px;
            }
    
            .support {
                font-size: 14px;
                color: #999999;
                margin-top: 30px;
                text-align: center;
                padding-top: 20px;
                border-top: 1px solid #eeeeee;
            }
    
            .highlight {
                font-weight: bold;
                color: #2c3e50;
            }
    
            .expiry {
                text-align: center;
                color: #e74c3c;
                font-weight: bold;
                font-size: 14px;
                margin: 10px 0;
            }
        </style>
    
    </head>
    
    <body>
        <div class="container">
            <div class="header">
                <a href="http://localhost:3000/">
                    <img class="logo" src="https://i.ibb.co/7Xyj3PC/logo.png" alt="QuantVidya Logo">
                </a>
            </div>
            
            <div class="message">Password Reset Request</div>
            
            <div class="body">
                <p>Hello ${name || 'User'},</p>
                
                <p>We received a request to reset the password for your QuantVidya account associated with <span class="highlight">${email}</span>.</p>
                
                <p>Click the button below to reset your password:</p>
                
                <a href="${url}" class="cta-button">Reset Password</a>
                
                <p class="expiry">⏰ This link will expire in 5 minutes</p>
                
                <p class="link-text">Or copy and paste this link into your browser:</p>
                <div class="link-container">
                    <a href="${url}" style="color: #3498db; text-decoration: none; font-size: 13px;">${url}</a>
                </div>
                
                <div class="warning">
                    <p><strong>⚠️ Security Notice:</strong></p>
                    <p>• If you didn't request this password reset, please ignore this email.</p>
                    <p>• Never share this link with anyone.</p>
                    <p>• This link can only be used once.</p>
                </div>
                
                <p>After clicking the link, you'll be able to create a new password for your account.</p>
            </div>
            
            <div class="support">
                <p>If you have any questions or need assistance, please contact us at 
                    <a href="mailto:info@quantvidya.com" style="color: #3498db; text-decoration: none;">info@quantvidya.com</a>
                </p>
                <p style="margin-top: 10px; color: #999;">© 2024 QuantVidya. All rights reserved.</p>
            </div>
        </div>
    </body>
    
    </html>`;
};