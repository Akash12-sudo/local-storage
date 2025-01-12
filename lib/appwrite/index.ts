//node-appwrite
'use server';

import { Account, Avatars, Client, Databases, Storage } from 'node-appwrite';
import { appwriteConfig } from './config';
import { cookies } from 'next/headers';

export const createSessionClient = async () => {
  const client = new Client()
    .setEndpoint(appwriteConfig.endpointUrl)
    .setProject(appwriteConfig.projectId);

  const cookiesUtility = await cookies();
  console.log('All cookies:', cookiesUtility.getAll());

  const session = cookiesUtility.get('appwrite-session');
  console.log('Retrieved session:', session);

  if (!session || !session.value) {
    console.error('No session');
    throw new Error('No session');
  }

  client.setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },
    get database() {
      return new Databases(client);
    },
  };
};

export const createAdminClient = async () => {
  const client = new Client()
    .setEndpoint(appwriteConfig.endpointUrl)
    .setProject(appwriteConfig.projectId)
    .setKey(appwriteConfig.secretKey);

  return {
    get account() {
      return new Account(client);
    },
    get database() {
      return new Databases(client);
    },
    get storage() {
      return new Storage(client);
    },
    get avatars() {
      return new Avatars(client);
    },
  };
};
