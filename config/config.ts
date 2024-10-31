export const endPoint ='https://671583f6b6d5d53a2c0e.appwrite.global'

export const api = {
  login: '/login',
  getCharging:'/list-charging',
  register:'/register',
  listCars:'/list-cars',
  addCar:'add-car',
  deleteCar:'/delete-car',
  addUserCar:'/add-user-car',
  listUserCars:'/list-user-cars',
  deleteUsercar:'/delete-user-car',
  addFavorite:'/add-favorite',
  listFavoriteById:'/get-favorite',
  deleteFavorite:'/delete-user-favorite'
}

export const config = {
  statusType: {
    50: 'Operational',
    150: 'Planet For Future',
  },
  operator: {
    3664: 'PLN',
    3669: 'Starvo (Indonesia)',
    3665: 'Hyundai',
    3666: 'Shell Recharge Indonesia',
    3668: 'Voltron (Indonesia)',
    1: 'Unknown',
  },
  usageType: {
    1: 'Public',
    4: 'Public - Membership Required',
    6: 'Private - For Staff, Visitors or Customers',
  },
  connectionType: {
    32: 'CCS (Type 1)',
    25: 'Type 2 (Socket Only)',
    2: 'CHAdeMO',
    33: 'CCS (Type 2)',
    1036: 'Type 2 (Tethered Connector)',
    0: 'Unknown',
  },
  currentType: {
    30: 'DC',
    20: 'AC (Three-Phase)',
    10: 'AC (Single-Phase)',
  }
};