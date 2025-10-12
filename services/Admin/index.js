const AbstractService = require("../AbstractService.js");
const adminModel = require("../../models/adminModel.js");
const AppError = require("../../errors/app-error.js");

class AdminService extends AbstractService {
    constructor() {
        super();
    }

    // Get admin settings (create if doesn't exist)
    static async getAdminSettings() {
        try {
            let settings = await adminModel.findOne();
            
            // If no settings exist, create default ones
            if (!settings) {
                settings = await this.initializeDefaultSettings();
            }
            
            return settings;
        } catch (error) {
            console.log('Error getting admin settings:', error);
            throw new AppError('Error retrieving admin settings', 500);
        }
    }

    // Update admin settings
    static async updateAdminSettings(updateData, userId) {
        try {
            // Get existing settings or create new
            let settings = await adminModel.findOne();
            
            if (!settings) {
                settings = await this.initializeDefaultSettings();
            }

            // Update lastUpdatedBy
            updateData.lastUpdatedBy = userId;

            // Update settings
            const updatedSettings = await adminModel.findByIdAndUpdate(
                settings._id,
                updateData,
                { new: true, runValidators: true }
            );

            if (!updatedSettings) {
                throw new AppError("Could not update admin settings", 400);
            }

            return updatedSettings;
        } catch (error) {
            console.log('Error updating admin settings:', error);
            throw new AppError('Error updating admin settings', 400);
        }
    }

    // Get specific section settings
    static async getSectionSettings(section) {
        try {
            const settings = await this.getAdminSettings();
            
            if (!settings[section]) {
                throw new AppError(`Invalid settings section: ${section}`, 400);
            }

            return {
                [section]: settings[section],
                lastUpdatedBy: settings.lastUpdatedBy,
                updatedAt: settings.updatedAt
            };
        } catch (error) {
            console.log(`Error getting ${section} settings:`, error);
            throw new AppError(`Error retrieving ${section} settings`, 500);
        }
    }

    // Update specific section settings
    static async updateSectionSettings(section, sectionData, userId) {
        try {
            const updateData = {
                [section]: sectionData,
                lastUpdatedBy: userId
            };

            return await this.updateAdminSettings(updateData, userId);
        } catch (error) {
            console.log(`Error updating ${section} settings:`, error);
            throw new AppError(`Error updating ${section} settings`, 400);
        }
    }

    // Initialize default settings
    static async initializeDefaultSettings() {
        try {
            // Check if settings already exist
            const existingSettings = await adminModel.findOne();
            if (existingSettings) {
                return existingSettings;
            }

            // Create new settings with defaults
            const defaultSettings = new adminModel({});
            const savedSettings = await defaultSettings.save();
            
            if (!savedSettings) {
                throw new AppError("Could not initialize default settings", 500);
            }

            return savedSettings;
        } catch (error) {
            console.log('Error initializing default settings:', error);
            throw new AppError('Error initializing admin settings', 500);
        }
    }

    // Reset settings to defaults
    static async resetToDefaults(userId) {
        try {
            // Delete existing settings
            await adminModel.deleteMany({});
            
            // Create new default settings
            const defaultSettings = await this.initializeDefaultSettings();
            
            // Update with user info
            defaultSettings.lastUpdatedBy = userId;
            await defaultSettings.save();
            
            return defaultSettings;
        } catch (error) {
            console.log('Error resetting settings to defaults:', error);
            throw new AppError('Error resetting settings to defaults', 500);
        }
    }

    // Validate settings data
    static validateSettingsData(data) {
        const errors = [];

        // Validate general settings
        if (data.generalSettings) {
            const { facilityName, contactEmail, phoneNumber } = data.generalSettings;
            
            if (facilityName && typeof facilityName !== 'string') {
                errors.push('Facility name must be a string');
            }
            
            if (contactEmail && !/\S+@\S+\.\S+/.test(contactEmail)) {
                errors.push('Invalid email format');
            }
            
            if (phoneNumber && typeof phoneNumber !== 'string') {
                errors.push('Phone number must be a string');
            }
        }

        // Validate field settings
        if (data.fieldSettings) {
            const { defaultBookingDuration, maxAdvanceBookingDays, minAdvanceBookingHours } = data.fieldSettings;
            
            if (defaultBookingDuration && (typeof defaultBookingDuration !== 'number' || defaultBookingDuration <= 0)) {
                errors.push('Default booking duration must be a positive number');
            }
            
            if (maxAdvanceBookingDays && (typeof maxAdvanceBookingDays !== 'number' || maxAdvanceBookingDays <= 0)) {
                errors.push('Max advance booking days must be a positive number');
            }
            
            if (minAdvanceBookingHours && (typeof minAdvanceBookingHours !== 'number' || minAdvanceBookingHours < 0)) {
                errors.push('Min advance booking hours must be a non-negative number');
            }
        }

        // Validate payment settings
        if (data.paymentSettings) {
            const { taxRate, paymentTimeout } = data.paymentSettings;
            
            if (taxRate && (typeof taxRate !== 'number' || taxRate < 0 || taxRate > 100)) {
                errors.push('Tax rate must be a number between 0 and 100');
            }
            
            if (paymentTimeout && (typeof paymentTimeout !== 'number' || paymentTimeout <= 0)) {
                errors.push('Payment timeout must be a positive number');
            }
        }

        // Validate security settings
        if (data.securitySettings) {
            const { passwordMinLength, autoLogoutMinutes } = data.securitySettings;
            
            if (passwordMinLength && (typeof passwordMinLength !== 'number' || passwordMinLength < 4)) {
                errors.push('Password minimum length must be at least 4 characters');
            }
            
            if (autoLogoutMinutes && (typeof autoLogoutMinutes !== 'number' || autoLogoutMinutes <= 0)) {
                errors.push('Auto logout minutes must be a positive number');
            }
        }

        return errors;
    }
}

module.exports = AdminService;
