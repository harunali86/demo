// Email Notification Service
// Uses Supabase Edge Functions or external email service

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
    text?: string;
}

interface OrderDetails {
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    items: Array<{
        name: string;
        quantity: number;
        price: number;
    }>;
    total: number;
    shippingAddress: string;
}

// Email Templates
const templates = {
    orderConfirmation: (order: OrderDetails) => ({
        subject: `Order Confirmed - #${order.orderNumber}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px; }
                    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; }
                    .header { background: linear-gradient(135deg, #FF6B35, #FF3366); padding: 30px; text-align: center; }
                    .header h1 { color: white; margin: 0; }
                    .content { padding: 30px; }
                    .order-info { background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0; }
                    .item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
                    .total { font-size: 20px; font-weight: bold; text-align: right; margin-top: 20px; }
                    .footer { background: #111; color: #888; padding: 20px; text-align: center; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🛍️ Harun Store</h1>
                    </div>
                    <div class="content">
                        <h2>Thank you for your order!</h2>
                        <p>Hi ${order.customerName},</p>
                        <p>Your order has been confirmed and is being processed.</p>
                        
                        <div class="order-info">
                            <strong>Order Number:</strong> #${order.orderNumber}<br>
                            <strong>Date:</strong> ${new Date().toLocaleDateString('en-IN')}
                        </div>
                        
                        <h3>Order Details:</h3>
                        ${order.items.map(item => `
                            <div class="item">
                                <span>${item.name} x ${item.quantity}</span>
                                <span>₹${(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                        `).join('')}
                        
                        <div class="total">
                            Total: ₹${order.total.toLocaleString()}
                        </div>
                        
                        <h3>Shipping Address:</h3>
                        <p>${order.shippingAddress}</p>
                        
                        <p>We'll send you a shipping confirmation when your order is on its way.</p>
                        
                        <p>Thank you for shopping with us!</p>
                    </div>
                    <div class="footer">
                        <p>© ${new Date().getFullYear()} Harun Store. All rights reserved.</p>
                        <p>If you have any questions, reply to this email or contact support@harunstore.com</p>
                    </div>
                </div>
            </body>
            </html>
        `
    }),

    orderShipped: (order: { orderNumber: string; customerName: string; trackingNumber: string; trackingUrl: string }) => ({
        subject: `Your Order #${order.orderNumber} has been shipped!`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px; }
                    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; }
                    .header { background: linear-gradient(135deg, #10B981, #059669); padding: 30px; text-align: center; }
                    .header h1 { color: white; margin: 0; }
                    .content { padding: 30px; }
                    .tracking-box { background: #f5f5f5; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
                    .track-btn { display: inline-block; background: #FF6B35; color: white; padding: 15px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; }
                    .footer { background: #111; color: #888; padding: 20px; text-align: center; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>📦 Your Order is on its way!</h1>
                    </div>
                    <div class="content">
                        <p>Hi ${order.customerName},</p>
                        <p>Great news! Your order #${order.orderNumber} has been shipped.</p>
                        
                        <div class="tracking-box">
                            <p><strong>Tracking Number:</strong></p>
                            <h2>${order.trackingNumber}</h2>
                            <a href="${order.trackingUrl}" class="track-btn">Track Your Order</a>
                        </div>
                        
                        <p>Your package should arrive within 3-5 business days.</p>
                    </div>
                    <div class="footer">
                        <p>© ${new Date().getFullYear()} Harun Store. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    }),

    passwordReset: (data: { name: string; resetLink: string }) => ({
        subject: 'Reset Your Password - Harun Store',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px; }
                    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; }
                    .header { background: linear-gradient(135deg, #FF6B35, #FF3366); padding: 30px; text-align: center; }
                    .header h1 { color: white; margin: 0; }
                    .content { padding: 30px; text-align: center; }
                    .reset-btn { display: inline-block; background: #FF6B35; color: white; padding: 15px 40px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 20px 0; }
                    .footer { background: #111; color: #888; padding: 20px; text-align: center; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🔐 Password Reset</h1>
                    </div>
                    <div class="content">
                        <p>Hi ${data.name},</p>
                        <p>We received a request to reset your password. Click the button below to create a new password:</p>
                        
                        <a href="${data.resetLink}" class="reset-btn">Reset Password</a>
                        
                        <p style="color: #888; font-size: 14px;">This link will expire in 1 hour.</p>
                        <p style="color: #888; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
                    </div>
                    <div class="footer">
                        <p>© ${new Date().getFullYear()} Harun Store. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    }),

    welcome: (data: { name: string }) => ({
        subject: 'Welcome to Harun Store! 🎉',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px; }
                    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; }
                    .header { background: linear-gradient(135deg, #FF6B35, #FF3366); padding: 40px; text-align: center; }
                    .header h1 { color: white; margin: 0; font-size: 28px; }
                    .content { padding: 30px; }
                    .features { display: grid; gap: 15px; margin: 20px 0; }
                    .feature { background: #f5f5f5; padding: 15px; border-radius: 8px; }
                    .shop-btn { display: inline-block; background: #FF6B35; color: white; padding: 15px 40px; border-radius: 8px; text-decoration: none; font-weight: bold; }
                    .footer { background: #111; color: #888; padding: 20px; text-align: center; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Welcome to Harun Store!</h1>
                    </div>
                    <div class="content">
                        <h2>Hi ${data.name}! 👋</h2>
                        <p>Thank you for joining Harun Store. We're excited to have you!</p>
                        
                        <div class="features">
                            <div class="feature">🚚 <strong>Free Delivery</strong> on orders over ₹499</div>
                            <div class="feature">🔒 <strong>Secure Payment</strong> with multiple options</div>
                            <div class="feature">↩️ <strong>Easy Returns</strong> within 7 days</div>
                            <div class="feature">💬 <strong>24/7 Support</strong> to help you anytime</div>
                        </div>
                        
                        <p style="text-align: center;">
                            <a href="https://harunstore.com" class="shop-btn">Start Shopping</a>
                        </p>
                    </div>
                    <div class="footer">
                        <p>© ${new Date().getFullYear()} Harun Store. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    })
};

// Send Email Function (integrate with your email service)
export async function sendEmail(options: EmailOptions): Promise<boolean> {
    try {
        // Option 1: Use Supabase Edge Function
        // const { error } = await supabase.functions.invoke('send-email', {
        //     body: options
        // });

        // Option 2: Use external API (e.g., Resend, SendGrid)
        // const response = await fetch('https://api.resend.com/emails', {
        //     method: 'POST',
        //     headers: {
        //         'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({
        //         from: 'Harun Store <orders@harunstore.com>',
        //         to: options.to,
        //         subject: options.subject,
        //         html: options.html
        //     })
        // });

        console.log('Email would be sent:', options.subject, 'to', options.to);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
}

// Helper functions
export async function sendOrderConfirmation(order: OrderDetails) {
    const template = templates.orderConfirmation(order);
    return sendEmail({
        to: order.customerEmail,
        subject: template.subject,
        html: template.html
    });
}

export async function sendShippingNotification(data: {
    email: string;
    orderNumber: string;
    customerName: string;
    trackingNumber: string;
    trackingUrl: string;
}) {
    const template = templates.orderShipped({
        orderNumber: data.orderNumber,
        customerName: data.customerName,
        trackingNumber: data.trackingNumber,
        trackingUrl: data.trackingUrl
    });
    return sendEmail({
        to: data.email,
        subject: template.subject,
        html: template.html
    });
}

export async function sendPasswordResetEmail(email: string, name: string, resetLink: string) {
    const template = templates.passwordReset({ name, resetLink });
    return sendEmail({
        to: email,
        subject: template.subject,
        html: template.html
    });
}

export async function sendWelcomeEmail(email: string, name: string) {
    const template = templates.welcome({ name });
    return sendEmail({
        to: email,
        subject: template.subject,
        html: template.html
    });
}

export { templates };
