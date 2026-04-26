const fs = require('fs');
const path = require('path');

const files = [
  path.join(__dirname, 'frontend', 'src', 'app', 'pages', 'Booking.tsx'),
  path.join(__dirname, 'frontend', 'src', 'app', 'pages', 'Services.tsx'),
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace Green with Orange
  content = content.replace(/#75A29E/g, '#E84C3D'); // Main Red-Orange (similar to the image)
  content = content.replace(/#5C8581/g, '#C0392B'); // Hover Red-Orange
  content = content.replace(/#EBF3F2/g, '#FDEBD0'); // Light Red-Orange
  
  // Fix timeStr parsing in Booking.tsx
  if (file.includes('Booking.tsx')) {
    content = content.replace(
      /{typeof timeStr === 'string' && timeStr.includes\('T'\) \? new Date\(timeStr\).toLocaleTimeString\(\[\], {timeStyle: 'short', timeZone: 'UTC'}\) \: typeof timeStr === 'string' \? timeStr \: new Date\(timeStr\).toLocaleTimeString\(\[\], {timeStyle: 'short', timeZone: 'UTC'}\)}/g,
      `{timeStr.includes('T') ? new Date(timeStr).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'UTC' }) : timeStr}`
    );
  }

  // Also fix the time in Services.tsx duration if needed? No, duration is just "45 mins".

  fs.writeFileSync(file, content);
});

// Fix backend .env mapping
const envPath = path.join(__dirname, 'backend', '.env');
let envContent = fs.readFileSync(envPath, 'utf8');
if (!envContent.includes('SMTP_HOST')) {
  envContent = envContent.replace(
    /SMTP_USER="kosmicalign2@gmail.com"/,
    'SMTP_HOST="smtp.gmail.com"\nSMTP_PORT="465"\nSMTP_USER="kosmicalign2@gmail.com"'
  );
  fs.writeFileSync(envPath, envContent);
}

console.log('Fixed colors, booking time, and .env mapping.');
