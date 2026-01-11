/**
 * One-time script to create an admin user via Neon Auth API
 *
 * Usage:
 *   1. Edit ADMIN_EMAIL and ADMIN_PASSWORD below
 *   2. Run: npx tsx scripts/create-admin.ts
 */

import { neon } from '@neondatabase/serverless';

// ============================================
// CONFIGURE THESE VALUES
// ============================================
const ADMIN_EMAIL = 'admin@pizzasinplaces.com';
const ADMIN_PASSWORD = 'SecurePassword123!'; // Change this!
const ADMIN_NAME = 'Admin';
// ============================================

const NEON_AUTH_URL = process.env.NEXT_PUBLIC_NEON_AUTH_URL || 'https://ep-green-poetry-abz09srx.neonauth.eu-west-2.aws.neon.tech/neondb/auth';

async function createAdmin() {
  console.log('Creating admin user via Neon Auth...\n');

  // Step 1: Sign up via Neon Auth API (creates user + hashed password)
  console.log('1. Creating user account...');

  const signUpResponse = await fetch(`${NEON_AUTH_URL}/sign-up/email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    }),
  });

  if (!signUpResponse.ok) {
    const error = await signUpResponse.text();
    if (error.includes('already exists') || error.includes('duplicate')) {
      console.log('   User already exists, skipping creation.');
    } else {
      console.error('   Failed to create user:', error);
      process.exit(1);
    }
  } else {
    console.log('   User created successfully.');
  }

  // Step 2: Set admin role directly in database
  console.log('2. Setting admin role...');

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('\n   DATABASE_URL not set. Please set it and run again to set admin role.');
    console.log('   Or run this SQL manually:');
    console.log(`   UPDATE neon_auth."user" SET role = 'admin' WHERE email = '${ADMIN_EMAIL}';`);
    process.exit(0);
  }

  const sql = neon(databaseUrl);

  await sql`
    UPDATE neon_auth."user"
    SET role = 'admin', "updatedAt" = NOW()
    WHERE email = ${ADMIN_EMAIL}
  `;

  console.log('   Admin role set.');

  console.log('\n✅ Admin user ready!\n');
  console.log('Login at /admin with:');
  console.log(`   Email: ${ADMIN_EMAIL}`);
  console.log(`   Password: ${ADMIN_PASSWORD}`);
  console.log('\n⚠️  Change the password in this script before running!');
}

createAdmin().catch(console.error);
