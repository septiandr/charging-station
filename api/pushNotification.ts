import axios from "axios";
export const sendPushNotification = async (token: any) => {
  const message = {
    to: token, // Token perangkat
    sound: 'default',
    title: 'Hello!',
    body: 'This is a test notification.',
    data: { someData: 'goes here' }, // Data tambahan jika diperlukan
  };

  try {
    const response = await axios.post(
      'https://fcm.googleapis.com/fcm/send',
      message,
      {
        headers: {
          'Authorization': `key=`, // Ganti dengan Server Key Anda
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('Notification sent:', response.data);
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};
