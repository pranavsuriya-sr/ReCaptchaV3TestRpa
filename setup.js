#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔐 Secure Authentication Setup');
console.log('==============================\n');

async function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setup() {
  try {
    // Check if .env already exists
    const envPath = path.join(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const overwrite = await question('.env file already exists. Overwrite? (y/N): ');
      if (overwrite.toLowerCase() !== 'y') {
        console.log('Setup cancelled.');
        rl.close();
        return;
      }
    }

    console.log('📋 Please provide the following information:\n');

    // Supabase Configuration
    const supabaseUrl = await question('Supabase Project URL: ');
    const supabaseAnonKey = await question('Supabase Anon Key: ');

    // reCAPTCHA Configuration
    console.log('\n🔑 reCAPTCHA Configuration:');
    console.log('Note: You can get these from https://www.google.com/recaptcha/admin');
    const recaptchaSiteKey = await question('reCAPTCHA Site Key: ');
    const recaptchaSecretKey = await question('reCAPTCHA Secret Key: ');

    // Create .env file
    const envContent = `# Supabase Configuration
VITE_SUPABASE_URL=${supabaseUrl}
VITE_SUPABASE_ANON_KEY=${supabaseAnonKey}

# reCAPTCHA Configuration
# Note: The secret key is used in the backend function, not in the frontend
# RECAPTCHA_SECRET_KEY=${recaptchaSecretKey}
`;

    fs.writeFileSync(envPath, envContent);

    // Update index.html
    const indexPath = path.join(process.cwd(), 'index.html');
    let indexContent = fs.readFileSync(indexPath, 'utf8');
    indexContent = indexContent.replace(
      /src="https:\/\/www\.google\.com\/recaptcha\/api\.js\?render=[^"]*"/,
      `src="https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}"`
    );
    fs.writeFileSync(indexPath, indexContent);

    // Update useRecaptcha.ts
    const recaptchaHookPath = path.join(process.cwd(), 'src', 'hooks', 'useRecaptcha.ts');
    let hookContent = fs.readFileSync(recaptchaHookPath, 'utf8');
    hookContent = hookContent.replace(
      /const RECAPTCHA_SITE_KEY = '[^']*';/,
      `const RECAPTCHA_SITE_KEY = '${recaptchaSiteKey}';`
    );
    fs.writeFileSync(recaptchaHookPath, hookContent);

    console.log('\n✅ Setup completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Deploy the Supabase edge function:');
    console.log('   npm install -g supabase');
    console.log('   supabase login');
    console.log('   supabase link --project-ref YOUR_PROJECT_REF');
    console.log(`   supabase secrets set RECAPTCHA_SECRET_KEY=${recaptchaSecretKey}`);
    console.log('   supabase functions deploy verify-recaptcha');
    console.log('\n2. Start the development server:');
    console.log('   npm run dev');
    console.log('\n3. Test the reCAPTCHA functionality!');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  } finally {
    rl.close();
  }
}

setup(); 