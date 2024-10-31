import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

const HelpScreen = ({ navigation }: any) => {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>Help - Panduan Penggunaan Aplikasi</Text>

      {/* Section 1: Pemetaan Charging Station */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>Pemetaan Charging Station di Indonesia</Text>
        <Text style={styles.text}>
          Aplikasi ini menyediakan peta interaktif yang menampilkan lokasi Charging Station di berbagai
          kota di Indonesia. Anda dapat melihat stasiun pengisian daya terdekat, mendapatkan petunjuk
          arah, serta informasi detail seperti jenis konektor dan daya yang tersedia di setiap stasiun.
        </Text>
        <Text style={styles.boldText}>Cara Menggunakan:</Text>
        <Text style={styles.text}>
          Pada halaman utama, Anda dapat menelusuri peta dan mencari lokasi stasiun pengisian terdekat
          dengan menggulir atau menggunakan fitur pencarian lokasi.
        </Text>
      </View>

      {/* Section 2: Rekomendasi Charging Station */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>Rekomendasi Charging Station Berdasarkan Spesifikasi Mobil</Text>
        <Text style={styles.text}>
          Fitur ini memungkinkan Anda untuk memilih stasiun pengisian daya yang cocok berdasarkan
          spesifikasi kendaraan listrik Anda. Aplikasi akan memfilter stasiun pengisian daya sesuai dengan
          tipe konektor, daya maksimum, dan jenis arus yang sesuai dengan kendaraan Anda.
        </Text>
        <Text style={styles.boldText}>Cara Menggunakan:</Text>
        <Text style={styles.text}>
          Masukkan spesifikasi mobil Anda atau pilih dari daftar mobil yang tersedia untuk mendapatkan
          rekomendasi stasiun pengisian daya yang cocok.
        </Text>
      </View>

      {/* Section 3: Informasi Detail Charging Station */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>Informasi Detail Charging Station</Text>
        <Text style={styles.text}>
          Setiap stasiun pengisian dilengkapi dengan informasi seperti alamat, jenis konektor, daya yang
          tersedia, biaya penggunaan, dan status terkini.
        </Text>
        <Text style={styles.boldText}>Cara Mengakses:</Text>
        <Text style={styles.text}>
          Klik pada marker di peta atau nama stasiun untuk melihat informasi detail dan mendapatkan petunjuk
          arah ke lokasi tersebut.
        </Text>
      </View>

      {/* Section 4: FAQ */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>FAQ - Pertanyaan yang Sering Diajukan</Text>
        <Text style={styles.boldText}>Bagaimana cara mengetahui status stasiun pengisian?</Text>
        <Text style={styles.text}>
          Aplikasi memberikan informasi status terkini dari setiap stasiun, termasuk apakah stasiun tersebut
          aktif, sibuk, atau tidak tersedia.
        </Text>

        <Text style={styles.boldText}>Apakah aplikasi bekerja di seluruh Indonesia?</Text>
        <Text style={styles.text}>
          Ya, aplikasi mencakup data stasiun pengisian di seluruh wilayah Indonesia.
        </Text>

        <Text style={styles.boldText}>Bagaimana cara menambahkan kendaraan saya?</Text>
        <Text style={styles.text}>
          Anda dapat menambahkan spesifikasi kendaraan di fitur filter mobil untuk mendapatkan rekomendasi
          stasiun pengisian yang sesuai.
        </Text>

        <Text style={styles.boldText}>Apakah ada biaya untuk menggunakan stasiun pengisian?</Text>
        <Text style={styles.text}>
          Biaya penggunaan stasiun bervariasi. Beberapa stasiun mungkin gratis, sementara yang lain
          mengenakan biaya per kWh. Informasi biaya ditampilkan di halaman detail stasiun.
        </Text>
      </View>

      {/* Section 5: Kontak */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>Dukungan & Kontak</Text>
        <Text style={styles.text}>
          Jika Anda mengalami masalah atau memiliki pertanyaan lebih lanjut, silakan hubungi kami:
        </Text>
        <Text style={styles.text}>Email: support@evcharginglocator.id</Text>
        <Text style={styles.text}>Telepon: +62-21-1234-5678</Text>
      </View>

      {/* Button to return to home */}
      <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.button}>
        <Text style={styles.buttonText}>Kembali ke Beranda</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default HelpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#0a7ea4',
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#0a7ea4',
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  boldText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#0a7ea4',
  },
  button: {
    backgroundColor: '#0a7ea4',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});
