const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  // GENERAL SETTINGS
  generalSettings: {
    facilityName: { type: String, default: "Arena 03 Kilifi" },
    contactEmail: { type: String, default: "info@arena03kilifi.com" },
    phoneNumber: { type: String, default: "+254 712 345 678" },
    operatingHours: { type: String, default: "6:00 AM - 10:00 PM" },
    address: { type: String, default: "Kilifi Sports Complex, Coast Province, Kenya" },
    timezone: { type: String, default: "Africa/Nairobi" },
    language: { type: String, default: "en" }
  },

  // FIELD MANAGEMENT SETTINGS  
  fieldSettings: {
    defaultBookingDuration: { type: Number, default: 1 }, // hours
    maxAdvanceBookingDays: { type: Number, default: 30 },
    minAdvanceBookingHours: { type: Number, default: 2 },
    allowOverbooking: { type: Boolean, default: false },
    maintenanceMode: { type: Boolean, default: false },
    defaultFieldStatus: { type: String, enum: ['active', 'maintenance', 'inactive'], default: 'active' }
  },

  // PAYMENT SETTINGS
  paymentSettings: {
    currency: { type: String, default: "KES" },
    taxRate: { type: Number, default: 16 }, // percentage
    paymentMethods: {
      mpesa: { type: Boolean, default: true },
      cards: { type: Boolean, default: true },
      cash: { type: Boolean, default: true },
      bankTransfer: { type: Boolean, default: false }
    },
    autoPaymentConfirmation: { type: Boolean, default: true },
    paymentTimeout: { type: Number, default: 30 } // minutes
  },

  // NOTIFICATION SETTINGS
  notificationSettings: {
    emailNotifications: {
      newBookings: { type: Boolean, default: true },
      paymentConfirmations: { type: Boolean, default: true },
      bookingCancellations: { type: Boolean, default: false },
      dailyReports: { type: Boolean, default: true }
    },
    smsNotifications: {
      bookingReminders: { type: Boolean, default: true },
      paymentAlerts: { type: Boolean, default: false }
    },
    notificationEmail: { type: String, default: "admin@arena03kilifi.com" }
  },

  // SECURITY SETTINGS
  securitySettings: {
    twoFactorAuth: { type: Boolean, default: true },
    loginNotifications: { type: Boolean, default: true },
    autoLogout: { type: Boolean, default: false },
    autoLogoutMinutes: { type: Number, default: 60 },
    passwordMinLength: { type: Number, default: 8 },
    requirePasswordChange: { type: Boolean, default: false }
  },

  // SYSTEM METADATA
  isActive: { type: Boolean, default: true },
  version: { type: String, default: "1.0.0" },
  lastUpdatedBy: { type: mongoose.Types.ObjectId, ref: "User" },
}, { timestamps: true });

// Ensure only one admin settings document exists (singleton pattern)
adminSchema.index({}, { unique: true });

module.exports = mongoose.model('Admin', adminSchema);
