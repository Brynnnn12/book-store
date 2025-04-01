require("dotenv").config();

const mongoose = require("mongoose");
const User = require("../models/User"); // Pastikan path sesuai dengan struktur proyek Anda
const { v4: uuidv4 } = require("uuid");
const db = require("../config/db"); // Menggunakan konfigurasi database dari folder config

const seedUsers = async () => {
  try {
    await db(); // Menggunakan koneksi database dari config

    // Hapus data user yang sudah ada (opsional)
    await User.deleteMany();

    const adminUser = {
      _id: uuidv4(),
      name: "Admin User",
      email: "admin@example.com",
      password: "admin123",
      role: "admin",
    };

    await User.create(adminUser);
    console.log("Admin user seeding berhasil!");

    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding admin user:", error);
    mongoose.connection.close();
  }
};

seedUsers();
