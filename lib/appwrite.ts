import * as Linking from "expo-linking";
import { openAuthSessionAsync } from "expo-web-browser";
import {
  Account,
  Avatars,
  Client,
  Databases,
  OAuthProvider,
  Storage
} from "react-native-appwrite";

export const config = {
  platform: "com.jsm.restate",
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  // databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
  // galleriesCollectionId:
  //   process.env.EXPO_PUBLIC_APPWRITE_GALLERIES_COLLECTION_ID,
  // reviewsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_REVIEWS_COLLECTION_ID,
  // agentsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_AGENTS_COLLECTION_ID,
  // propertiesCollectionId:
  //   process.env.EXPO_PUBLIC_APPWRITE_PROPERTIES_COLLECTION_ID,
  // bucketId: process.env.EXPO_PUBLIC_APPWRITE_BUCKET_ID,
};

export const client = new Client();
client
  .setEndpoint(config.endpoint!)
  .setProject(config.projectId!)
  .setPlatform(config.platform!);

export const avatar = new Avatars(client);
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export async function login() {
  try {
    const redirectUri = Linking.createURL("/");

    const response = await account.createOAuth2Token(
      OAuthProvider.Google,
      redirectUri
    );
    if (!response) throw new Error("Create OAuth2 token failed");

    const browserResult = await openAuthSessionAsync(
      response.toString(),
      redirectUri
    );
    if (browserResult.type !== "success")
      throw new Error("OAuth flow failed");

    const url = new URL(browserResult.url);
    const secret = url.searchParams.get("secret")?.toString();
    const userId = url.searchParams.get("userId")?.toString();
    if (!secret || !userId) throw new Error("OAuth parameters missing");

    // Check if session was already created by OAuth flow
    try {
      const session = await account.getSession("current");
      // Verify we can actually get the user
      const user = await account.get();
      if (user) {
        return true;
      }
    } catch (sessionCheckError) {
      // If no session exists, create one (this should rarely happen)
      const session = await account.createSession(userId, secret);
      if (!session) throw new Error("Failed to create session");
      return true;
    }
    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function logout() {
  try {
    const result = await account.deleteSession("current");
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function getCurrentUser() {
  try {
    const result = await account.get();
    if (result && result.$id) {
      // Log the user data to see what's available
      console.log('Appwrite user data:', JSON.stringify(result, null, 2));

      // Check if user has a real profile picture (from Google OAuth)
      let avatarUrl = '';

      // Try different possible locations for the profile picture
      if (result.prefs && typeof result.prefs === 'object') {
        avatarUrl = (result.prefs as any).avatarUrl || (result.prefs as any).picture || '';
      }

      // Check if there's a direct avatar property
      if (!avatarUrl && (result as any).avatar) {
        avatarUrl = (result as any).avatar;
      }

      // If no real avatar from Google, try Gravatar first (for Gmail users)
      if (!avatarUrl && result.email) {
        try {
          // Create MD5 hash of the email for Gravatar
          const emailHash = require('crypto').createHash('md5').update(result.email.trim().toLowerCase()).digest('hex');
          avatarUrl = `https://www.gravatar.com/avatar/${emailHash}?d=404&size=200`;

          // Test if Gravatar exists
          try {
            const response = await fetch(avatarUrl, { method: 'HEAD' });
            if (response.ok) {
              console.log('Using Gravatar for:', result.email);
            } else {
              // Fall back to generated avatar
              avatarUrl = `https://avatar.vercel.sh/${encodeURIComponent(result.name)}?size=200`;
              console.log('Gravatar not found, using generated avatar for:', result.name);
            }
          } catch (error) {
            // If fetch fails, use generated avatar
            avatarUrl = `https://avatar.vercel.sh/${encodeURIComponent(result.name)}?size=200`;
            console.log('Error checking Gravatar, using generated avatar:', result.name);
          }
        } catch (hashError) {
          // If hashing fails, use generated avatar
          avatarUrl = `https://avatar.vercel.sh/${encodeURIComponent(result.name)}?size=200`;
          console.log('Hash error, using generated avatar for:', result.name);
        }
      }

      // If still no avatar (shouldn't happen), use generated one
      if (!avatarUrl) {
        avatarUrl = `https://avatar.vercel.sh/${encodeURIComponent(result.name)}?size=200`;
        console.log('Using generated avatar for:', result.name);
      } else {
        console.log('Using avatar:', avatarUrl);
      }

      return {
        ...result,
        avatar: avatarUrl,
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

// export async function getLatestProperties() {
//   try {
//     const result = await databases.listDocuments(
//       config.databaseId!,
//       config.propertiesCollectionId!,
//       [Query.orderAsc("$createdAt"), Query.limit(5)]
//     );

//     return result.documents;
//   } catch (error) {
//     console.error(error);
//     return [];
//   }
// }

// export async function getProperties({
//   filter,
//   query,
//   limit,
// }: {
//   filter: string;
//   query: string;
//   limit?: number;
// }) {
//   try {
//     const buildQuery = [Query.orderDesc("$createdAt")];

//     if (filter && filter !== "All")
//       buildQuery.push(Query.equal("type", filter));

//     if (query)
//       buildQuery.push(
//         Query.or([
//           Query.search("name", query),
//           Query.search("address", query),
//           Query.search("type", query),
//         ])
//       );

//     if (limit) buildQuery.push(Query.limit(limit));

//     const result = await databases.listDocuments(
//       config.databaseId!,
//       config.propertiesCollectionId!,
//       buildQuery
//     );

//     return result.documents;
//   } catch (error) {
//     console.error(error);
//     return [];
//   }
// }

// // write function to get property by id
// export async function getPropertyById({ id }: { id: string }) {
//   try {
//     const result = await databases.getDocument(
//       config.databaseId!,
//       config.propertiesCollectionId!,
//       id
//     );
//     return result;
//   } catch (error) {
//     console.error(error);
//     return null;
//   }
// }