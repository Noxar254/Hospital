# 📧 Email Confirmation Setup Guide

## 🎯 Overview
Your homecare booking system now sends automatic confirmation emails to clients using EmailJS - a free email service that works directly from your website.

## 🚀 Quick Setup (5 minutes)

### Step 1: Create EmailJS Account
1. Go to: **https://www.emailjs.com/**
2. Click **"Sign Up"** 
3. Use your Gmail or create a new account
4. Verify your email address

### Step 2: Add Email Service
1. In EmailJS dashboard, click **"Email Services"**
2. Click **"Add New Service"**
3. Choose **"Gmail"** (recommended)
4. Connect your Gmail account
5. Copy the **Service ID** (e.g., `service_abc123`)

### Step 3: Create Email Template
1. Click **"Email Templates"**
2. Click **"Create New Template"**
3. Use this template content:

```html
Subject: ✅ Your Home Care Service is Scheduled - Hopewell Hospital

Dear {{to_name}},

Thank you for choosing Hopewell Hospital's Home Care Services! 

🏠 **BOOKING CONFIRMED**
Service Type: {{service_type}}
Date: {{service_date}}
Time: {{service_time}}
Booking ID: {{booking_id}}

📞 **What's Next?**
• Our team will call you within 2 hours to confirm details
• We'll verify your address and service requirements  
• You'll receive final confirmation with your assigned healthcare professional
• We'll send reminder notifications via SMS

🆘 **Need Help?**
Phone: +254 796 780 345
Email: info@hopewellhospital.com

Thank you for trusting us with your healthcare needs.

Best regards,
The Hopewell Hospital Team
```

4. Copy the **Template ID** (e.g., `template_xyz789`)

### Step 4: Get Public Key
1. Go to **"Account"** → **"General"**
2. Copy your **Public Key** (e.g., `abc123xyz`)

### Step 5: Update Your Website
Open `homecare.html` and replace these placeholder values:

```javascript
// Find these lines around line 35-40 and replace:
emailjs.init("YOUR_PUBLIC_KEY"); // Replace with your actual public key
"YOUR_SERVICE_ID", // Replace with your service ID  
"YOUR_TEMPLATE_ID", // Replace with your template ID
```

**Example:**
```javascript
emailjs.init("abc123xyz");
"service_gmail123", 
"template_homecare456",
```

## 🧪 Test Email System

1. Open your homecare page
2. Fill out and submit the form
3. Check the browser console (F12) for:
   - `✅ Confirmation email sent successfully`
   - OR `❌ Error sending confirmation email`

## 📱 Email Features Included

✅ **Automatic confirmation emails**
✅ **Professional HTML formatting** 
✅ **Booking ID tracking**
✅ **Service details included**
✅ **Next steps clearly outlined**
✅ **Hospital contact information**

## 🔧 Troubleshooting

**Email not sending?**
- Check your EmailJS service is connected
- Verify Gmail permissions are granted
- Ensure template variables match exactly
- Check browser console for specific errors

**Gmail security issues?**
- Enable "Less secure app access" in Gmail settings
- Or use Gmail App Password instead

**Template not working?**
- Verify variable names: `{{to_name}}`, `{{service_type}}`, etc.
- Check template is published and active
- Test template in EmailJS dashboard first

## 🎉 Benefits for Your Clients

- **Instant confirmation** of their booking
- **Professional communication** builds trust
- **Clear next steps** reduce anxiety
- **Booking reference** for their records
- **Contact information** readily available

## 📊 Free Plan Limits

EmailJS free plan includes:
- **200 emails/month** (perfect for small hospitals)
- **2 email services**
- **3 email templates** 
- **Basic analytics**

Upgrade only when you need more volume!

---

💡 **Pro Tip:** Test the email system with your own email first to ensure everything works perfectly before going live.
