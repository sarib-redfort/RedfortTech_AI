/**
 * User seed.
 *
 * Creates (or resets) the admin and content-writer accounts. Passwords come
 * from the environment and are never written into this file: the repository is
 * public, and a hard-coded password here is a published admin login for every
 * environment seeded from it.
 *
 *   SEED_ADMIN_PASSWORD=...  SEED_WRITER_PASSWORD=...  npm run prisma:seed
 *
 * Re-running with new values rotates the passwords of the existing accounts.
 */
import { PrismaClient, Role, Status } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const MIN_LENGTH = 12;
// bcrypt ignores input beyond 72 bytes, so a longer value would be silently
// truncated rather than fully checked at login.
const MAX_LENGTH = 72;

interface SeedAccount {
  label: string;
  name: string;
  email: string;
  role: Role;
  passwordVar: string;
}

const ACCOUNTS: SeedAccount[] = [
  {
    label: 'admin',
    name: 'Admin User',
    email: process.env.SEED_ADMIN_EMAIL ?? 'admin@redforai.com',
    role: Role.Admin,
    passwordVar: 'SEED_ADMIN_PASSWORD',
  },
  {
    label: 'content writer',
    name: 'Content Writer',
    email: process.env.SEED_WRITER_EMAIL ?? 'writer@redforai.com',
    role: Role.ContentWriter,
    passwordVar: 'SEED_WRITER_PASSWORD',
  },
];

function readPassword(variable: string): string {
  const value = process.env[variable];

  if (!value) {
    throw new Error(
      `${variable} is not set. Pass a password in the environment rather than ` +
        'relying on a default — for example:\n' +
        `  ${variable}="$(openssl rand -base64 18)" npm run prisma:seed`,
    );
  }
  if (value.length < MIN_LENGTH || value.length > MAX_LENGTH) {
    throw new Error(
      `${variable} must be between ${MIN_LENGTH} and ${MAX_LENGTH} characters.`,
    );
  }
  return value;
}

async function main() {
  // Read every password before touching the database, so a missing variable
  // fails the whole run instead of leaving one account half-rotated.
  const passwords = new Map(
    ACCOUNTS.map((account) => [account.passwordVar, readPassword(account.passwordVar)]),
  );

  for (const account of ACCOUNTS) {
    const hash = await bcrypt.hash(passwords.get(account.passwordVar)!, 10);

    const user = await prisma.user.upsert({
      where: { email: account.email },
      // Updating the hash on an existing row is what makes a re-run rotate the
      // password. The previous seed used `update: {}`, so a password once set
      // could never be changed by seeding again.
      update: { password: hash, status: Status.Active },
      create: {
        name: account.name,
        email: account.email,
        password: hash,
        role: account.role,
        status: Status.Active,
      },
    });

    console.log(`Seeded ${account.label}: ${user.email}`);
  }

  console.log('User seeding completed.');
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
