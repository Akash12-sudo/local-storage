// This file is pretty much similar to Controller file used while building express backend

'use server';

import { ID, Query } from 'node-appwrite';
import { createAdminClient, createSessionClient } from '../appwrite';
import { appwriteConfig } from '../appwrite/config';
import { parseStringify } from '../utils';
import { cookies } from 'next/headers';
import { avatarPlaceholderUrl } from '@/constants';
import { redirect } from 'next/navigation';

// Helper function for error handling
const handleError = (error: unknown, message: string) => {
  console.log(error, message);
  throw error;
};

const getUserByEmail = async (email: string) => {
  const { database } = await createAdminClient();
  const result = await database.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.usersCollectionId,
    [Query.equal('email', [email])],
  );

  return result.total > 0 ? result.documents[0] : null;
};

export const sendEmailOTP = async ({ email }: { email: string }) => {
  const { account } = await createAdminClient();

  try {
    const session = await account.createEmailToken(ID.unique(), email);

    return session.userId;
  } catch (error) {
    handleError(error, 'Failed to send email OTP');
  }
};

export const createAccount = async ({
  fullName,
  email,
}: {
  fullName: string;
  email: string;
}) => {
  const existingUser = await getUserByEmail(email);

  const accountId = await sendEmailOTP({ email });
  if (!accountId) throw new Error('Failed to send an OTP');

  if (!existingUser) {
    const { database } = await createAdminClient();

    await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      ID.unique(),
      {
        fullName,
        email,
        avatar: avatarPlaceholderUrl,
        accountId,
      },
    );
  }
  return parseStringify({ accountId });
};

export const verifySecret = async ({
  accountId,
  password,
}: {
  accountId: string;
  password: string;
}) => {
  try {
    const { account } = await createAdminClient();

    const session = await account.createSession(accountId, password);
    console.log('Retrieved session:', session);

    const cookiesUtility = (await cookies()).set(
      'appwrite-session',
      session.secret,
      {
        path: '/',
        httpOnly: true, // false: For debugging purpose
        sameSite: 'strict', // 'lax': For debugging purpose
        secure: true,
      },
    );

    // Only for Debugging Purpose
    console.log('Cookies after setting session: ', cookiesUtility.getAll());
    return parseStringify({ sessionId: session.$id });
  } catch (error) {
    handleError(error, 'Failed to verify OTP');
  }
};

export const fetchCurrentUser = async () => {
  const { database, account } = await createSessionClient();

  const result = await account.get();

  // For debugging purpose...
  console.log('accountId', result.$id);

  const user = await database.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.usersCollectionId,
    [Query.equal('accountId', result.$id)],
  );

  if (user.total < 0) return null;

  // For debugging purpose...
  console.log('Fetched User Details', user);

  return parseStringify(user.documents[0]);
};

export const signOutUser = async () => {
  const { account } = await createSessionClient();

  try {
    // Log out the user from the current session
    await account.deleteSession('current');
    (await cookies()).delete('appwrite-session');
  } catch (error) {
    handleError(error, 'Failed to sign out user');
  } finally {
    redirect('/sign-in');
  }
};

export const signInUser = async ({ email }: { email: string }) => {
  try {
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      await sendEmailOTP({ email });
      return parseStringify({ accountId: existingUser.accountId });
    }

    return parseStringify({ acccountId: null, error: 'User not found' });
  } catch (error) {
    handleError(error, 'Failed to sign in user');
  }
};
