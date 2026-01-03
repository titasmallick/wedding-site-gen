#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper for prompting
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function main() {
  console.log("Welcome to the Wedding Website Generator v3.0! 💍");
  console.log("This tool will help you scaffold a personalized wedding website.\n");

  const config = {};
  config.groomName = await question("Groom's First Name (e.g., Titas): ") || "Titas";
  config.groomFullName = await question(`Groom's Full Name (default: ${config.groomName} Mallick): `) || `${config.groomName} Mallick`;
  
  config.brideName = await question("Bride's First Name (e.g., Sukanya): ") || "Sukanya";
  config.brideFullName = await question(`Bride's Full Name (default: ${config.brideName} Saha): `) || `${config.brideName} Saha`;

  config.weddingDate = await question("Wedding Date (e.g., January 23, 2026): ") || "January 23, 2026";
  config.weddingDateISO = await question("Wedding Date ISO (YYYY-MM-DD): ") || "2026-01-23";
  
  config.adminEmail = await question("Admin Email (for management): ") || "admin@wedding.com";
  config.upiId = await question("UPI ID for gifts (e.g., name@upi): ") || "gifts@upi";
  config.siteUrl = await question("Website URL (e.g., https://ourwedding.com): ") || "https://ourwedding.com";
  config.hashtag = await question("Wedding Hashtag (e.g., #TitasWedsSukanya): ") || `#${config.groomName}Weds${config.brideName}`;

  console.log("\nChoose a Visual Theme:");
  console.log("1. Classic Pink & Gold (Traditional & Romantic)");
  console.log("2. Royal Blue & Gold (Elegant & Regal)");
  console.log("3. Forest Green & Cream (Nature-inspired & Modern)");
  console.log("4. Deep Red & Champagne (Passionate & Classic)");
  
  const themeChoice = await question("Select Theme (1-4) [default: 1]: ") || "1";

  const themes = {
    "1": { // Pink & Gold
      pink500: "#ec4899",
      gold400: "#d99e43",
    },
    "2": { // Royal Blue & Gold
      pink500: "#1e40af", // Replacing pink with blue
      gold400: "#fbbf24",
    },
    "3": { // Forest Green & Cream
      pink500: "#065f46", // Replacing pink with green
      gold400: "#92400e", // More earthy gold
    },
    "4": { // Deep Red & Champagne
      pink500: "#991b1b", // Replacing pink with red
      gold400: "#d4af37",
    }
  };

  const selectedTheme = themes[themeChoice] || themes["1"];
  const targetDir = await question("Target directory name: ") || "my-wedding-website";

  rl.close();

  console.log(`\nGenerating website in ${targetDir}...`);

  const sourceDir = __dirname;
  const absoluteTargetDir = path.resolve(process.cwd(), targetDir);

  await fs.mkdir(absoluteTargetDir, { recursive: true });

  const ignoreList = [
    '.git',
    '.next',
    'node_modules',
    'cli.mjs',
    'dist',
    '.env.local',
    '.recover',
    'package-lock.json',
  ];

  const replacements = [
    { search: /Groom & Bride/g, replace: `${config.groomName} & ${config.brideName}` },
    { search: /Groom and Bride/g, replace: `${config.groomName} and ${config.brideName}` },
    { search: /Groom Name/g, replace: config.groomFullName },
    { search: /Bride Name/g, replace: config.brideFullName },
    { search: /the couple/g, replace: `${config.groomName} and ${config.brideName}` },
    { search: /the groom/g, replace: config.groomName },
    { search: /#TitasWedsSukanya/g, replace: config.hashtag },
    { search: /your-wedding-site.com/g, replace: config.siteUrl.replace(/^https?:\/\//, '') },
    { search: /January 23, 2026/g, replace: config.weddingDate },
    { search: /2026-01-23/g, replace: config.weddingDateISO },
    { search: /admin@example.com/g, replace: config.adminEmail },
    { search: /your-upi-id@upi/g, replace: config.upiId },
    { search: /https:\/\/www.titas-sukanya-for.life/g, replace: config.siteUrl },
    { search: /your-wedding-site.com/g, replace: config.siteUrl.replace(/^https?:\/\//, '') },
    { search: /Wedding Invitation \| Groom & Bride/g, replace: `Wedding Invitation | ${config.groomName} & ${config.brideName}` },
    { search: /celebrate the wedding of the couple/g, replace: `celebrate the wedding of ${config.groomName} and ${config.brideName}` },
    { search: /Titas and Sukanya Wedding/g, replace: `${config.groomName} and ${config.brideName} Wedding` },
    { search: /Titas & Sukanya Wedding/g, replace: `${config.groomName} & ${config.brideName} Wedding` },
    // Code-level replacements for exported components/functions
    { search: /TitasLayout/g, replace: `${config.groomName}Layout` },
    { search: /SukanyaLayout/g, replace: `${config.brideName}Layout` },
    { search: /TitasPage/g, replace: `${config.groomName}Page` },
    { search: /SukanyaPage/g, replace: `${config.brideName}Page` },
  ];

  async function copyDir(src, dest) {
    const entries = await fs.readdir(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (ignoreList.includes(entry.name)) continue;

      if (entry.isDirectory()) {
        await fs.mkdir(destPath, { recursive: true });
        await copyDir(srcPath, destPath);
      } else {
        // Special case for secrets
        if (entry.name === 'firebase-admin.js') {
            const adminTemplate = `
const adminCred = {
  type: "service_account",
  project_id: process.env.FIREBASE_ADMIN_PROJECT_ID,
  private_key_id: process.env.FIREBASE_ADMIN_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_ADMIN_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.FIREBASE_ADMIN_CLIENT_X509_CERT_URL,
  universe_domain: "googleapis.com",
};
export default adminCred;
            `.trim();
            await fs.writeFile(destPath, adminTemplate, 'utf8');
            continue;
        }

        // Only process text files for replacements
        const ext = path.extname(srcPath).toLowerCase();
        const textExtensions = ['.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.css', '.html', '.rules'];
        
        if (textExtensions.includes(ext)) {
          let content = await fs.readFile(srcPath, 'utf8');
          for (const r of replacements) {
            content = content.replace(r.search, r.replace);
          }
          
          if (entry.name === 'package.json') {
            const pkg = JSON.parse(content);
            pkg.name = targetDir;
            delete pkg.bin; // Remove the CLI bin from the generated project
            content = JSON.stringify(pkg, null, 2);
          }

          if (entry.name === 'tailwind.config.js') {
            // Replace the primary colors in the tailwind config
            content = content.replace(/pink:\s*{\s*[^}]*500:\s*'#[a-fA-F0-9]{6}'/g, (match) => {
                return match.replace(/'#[a-fA-F0-9]{6}'/, `'${selectedTheme.pink500}'`);
            });
            content = content.replace(/gold:\s*{\s*[^}]*400:\s*'#[a-fA-F0-9]{6}'/g, (match) => {
                return match.replace(/'#[a-fA-F0-9]{6}'/, `'${selectedTheme.gold400}'`);
            });
          }

          await fs.writeFile(destPath, content, 'utf8');
        } else {
          await fs.copyFile(srcPath, destPath);
        }
      }
    }
  }

  try {
    await copyDir(sourceDir, absoluteTargetDir);
    
    // Create a basic .env.local template
    const envContent = `
# Firebase Client Config
NEXT_PUBLIC_APIKEY=
NEXT_PUBLIC_AUTHDOMAIN=
NEXT_PUBLIC_PROJECTID=
NEXT_PUBLIC_STORAGEBUCKET=
NEXT_PUBLIC_SENDERID=
NEXT_PUBLIC_APPID=
NEXT_PUBLIC_MEASUREMENTID=
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=

# Firebase Admin Config (Keep these secret!)
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_PRIVATE_KEY_ID=
FIREBASE_ADMIN_PRIVATE_KEY=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_CLIENT_ID=
FIREBASE_ADMIN_CLIENT_X509_CERT_URL=

# Admin Controls
NEXT_PUBLIC_ADMIN_EMAIL=${config.adminEmail}

# Google Gemini AI
NEXT_PUBLIC_GEMINI_API_KEY=

# Cloudinary Config (for guestbook uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=wedding

# Resend API (for email reminders)
RESEND_API_KEY=

# Cron Security (for reminders endpoint)
CRON_SECRET=
    `.trim();

    await fs.writeFile(path.join(absoluteTargetDir, '.env.local'), envContent);

    // Handle folder renaming for titas/sukanya
    const appDir = path.join(absoluteTargetDir, 'app');
    
    const groomFolderName = config.groomName.toLowerCase().replace(/[^a-z0-9]/g, '');
    let brideFolderName = config.brideName.toLowerCase().replace(/[^a-z0-9]/g, '');

    // Avoid collision if names are identical
    if (groomFolderName === brideFolderName) {
      brideFolderName = brideFolderName + "_partner";
    }

    const groomDir = path.join(appDir, groomFolderName);
    const brideDir = path.join(appDir, brideFolderName);

    // Helper for robust rename (Windows fix)
    async function safeRename(oldPath, newPath) {
        if (await fs.stat(oldPath).catch(() => null)) {
            // Check if destination exists
            if (await fs.stat(newPath).catch(() => null)) {
                await fs.rm(newPath, { recursive: true, force: true });
            }
            // Small delay to let OS release handles
            await new Promise(r => setTimeout(r, 100));
            await fs.rename(oldPath, newPath);
        }
    }

    await safeRename(path.join(appDir, 'titas'), groomDir);
    await safeRename(path.join(appDir, 'sukanya'), brideDir);

    console.log(`\nSuccess! Your wedding website is ready in ${targetDir}.`);
    console.log("\nNext steps:");
    console.log(`1. cd ${targetDir}`);
    console.log("2. npm install");
    console.log("3. Fill in your secrets in .env.local");
    console.log("4. npm run dev");
    
  } catch (err) {
    console.error("Error generating website:", err);
  }
}

main();
