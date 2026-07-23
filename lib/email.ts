import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

export async function sendBookingConfirmation({
  to,
  customerName,
  businessName,
  serviceName,
  date,
  startTime,
  endTime,
  price,
  bookingId,
  staffName,
}: {
  to: string
  customerName: string
  businessName: string
  serviceName: string
  date: string
  startTime: string
  endTime: string
  price: number
  bookingId: string
  staffName?: string
}) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; background: #f9f9f9; margin: 0; padding: 0; }
        .container { max-width: 560px; margin: 40px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
        .header { background: linear-gradient(135deg, #1e40af, #0891b2); padding: 32px; text-align: center; }
        .header h1 { color: white; margin: 0; font-size: 24px; }
        .header p { color: rgba(255,255,255,0.8); margin: 8px 0 0; }
        .body { padding: 32px; }
        .greeting { font-size: 18px; color: #111; margin-bottom: 16px; }
        .detail-card { background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e0f2fe; }
        .detail-row:last-child { border-bottom: none; font-weight: bold; }
        .label { color: #475569; font-size: 14px; }
        .value { color: #0f172a; font-size: 14px; font-weight: 500; }
        .badge { background: #22c55e; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
        .footer { background: #f8fafc; padding: 24px; text-align: center; color: #94a3b8; font-size: 13px; }
        .btn { display: inline-block; background: #2563eb; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Booking Confirmed!</h1>
          <p>${businessName}</p>
        </div>
        <div class="body">
          <p class="greeting">Hi ${customerName},</p>
          <p>Your booking has been confirmed! Here are your details:</p>
          <div class="detail-card">
            <div class="detail-row">
              <span class="label">Booking ID</span>
              <span class="value">#${bookingId.slice(-8).toUpperCase()}</span>
            </div>
            <div class="detail-row">
              <span class="label">Service</span>
              <span class="value">${serviceName}</span>
            </div>
            <div class="detail-row">
              <span class="label">Date</span>
              <span class="value">${new Date(date).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div class="detail-row">
              <span class="label">Time</span>
              <span class="value">${startTime} – ${endTime}</span>
            </div>
            ${staffName ? `<div class="detail-row"><span class="label">With</span><span class="value">${staffName}</span></div>` : ''}
            <div class="detail-row">
              <span class="label">Total Paid</span>
              <span class="value">$${price.toFixed(2)} <span class="badge">Paid</span></span>
            </div>
          </div>
          <p style="color: #64748b; font-size: 14px;">Need to reschedule or cancel? Log in to your account to manage your bookings.</p>
          <p style="color: #64748b; font-size: 14px;">See you soon! 😊</p>
        </div>
        <div class="footer">
          <p>${businessName} · Booking System</p>
          <p>This is an automated confirmation. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `

  await transporter.sendMail({
    from: `"${businessName}" <${process.env.EMAIL_FROM}>`,
    to,
    subject: `Booking Confirmed — ${serviceName} on ${new Date(date).toLocaleDateString('en-GB')}`,
    html,
  })
}

export async function sendCancellationEmail({
  to,
  customerName,
  businessName,
  serviceName,
  date,
  startTime,
}: {
  to: string
  customerName: string
  businessName: string
  serviceName: string
  date: string
  startTime: string
}) {
  await transporter.sendMail({
    from: `"${businessName}" <${process.env.EMAIL_FROM}>`,
    to,
    subject: `Booking Cancelled — ${serviceName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 40px auto; padding: 32px; background: #fff; border-radius: 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.08);">
        <h2 style="color: #dc2626;">Booking Cancelled</h2>
        <p>Hi ${customerName},</p>
        <p>Your booking for <strong>${serviceName}</strong> on <strong>${new Date(date).toLocaleDateString('en-GB')}</strong> at <strong>${startTime}</strong> has been cancelled.</p>
        <p>If you'd like to rebook, visit our website.</p>
        <p>— The ${businessName} Team</p>
      </div>
    `,
  })
}
