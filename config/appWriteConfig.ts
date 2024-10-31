// appwriteConfig.js
import { Client } from 'appwrite';

const client = new Client();

client
  .setEndpoint('https://cloud.appwrite.io/v1') // Your Appwrite Endpoint
  .setProject('66f654140008e57331cd'); // Your project ID

export default client;
