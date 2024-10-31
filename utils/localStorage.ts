import Storage from 'expo-storage';

// Fungsi untuk menyimpan item ke dalam storage
export const saveItem = async (key: string, value: any) => {
  try {
    await Storage.setItem({
      key: key,
      value: JSON.stringify(value),
    });
    console.log(`Item with key ${key} saved successfully!`);
  } catch (error) {
    console.error(`Error saving item with key ${key}: `, error);
  }
};

// Fungsi untuk mengambil item dari storage
export const getItem = async (key: string) => {
  try {
    const item = await Storage.getItem({ key: key });
    if (item !== null) {
      return JSON.parse(item);
    }
    console.log(`Item with key ${key} not found.`);
    return null;
  } catch (error) {
    console.error(`Error retrieving item with key ${key}: `, error);
    return null;
  }
};

// Fungsi untuk menghapus item dari storage berdasarkan key
export const removeItem = async (key: string) => {
  try {
    await Storage.removeItem({ key: key });
    console.log(`Item with key ${key} removed successfully!`);
  } catch (error) {
    console.error(`Error removing item with key ${key}: `, error);
  }
};

// Fungsi untuk mengambil semua kunci yang ada di storage
export const getAllKeys = async () => {
  try {
    const keys = await Storage.getAllKeys();
    console.log("Keys in storage: ", keys);
    return keys;
  } catch (error) {
    console.error("Error retrieving all keys: ", error);
    return [];
  }
};
