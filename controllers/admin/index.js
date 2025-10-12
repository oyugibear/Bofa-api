const AbstractController = require("../AbstractController.js");
const AdminService = require("../../services/Admin/index.js");
const AppError = require("../../errors/app-error.js");

class AdminController extends AbstractController {
    constructor() {
        super();
    }

    // Get all admin settings
    static async getSettings(req, res) {
        try {
            const settings = await AdminService.getAdminSettings();
            AbstractController.successResponse(res, settings, 200, "Settings retrieved successfully");
        } catch (error) {
            console.log('Error in getSettings:', error);
            throw new AppError('Error retrieving settings', 500);
        }
    }

    // Update all admin settings
    static async updateSettings(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                throw new AppError('User ID required for updating settings', 401);
            }

            // Validate settings data
            const validationErrors = AdminService.validateSettingsData(req.body);
            if (validationErrors.length > 0) {
                throw new AppError(`Validation errors: ${validationErrors.join(', ')}`, 400);
            }

            const updatedSettings = await AdminService.updateAdminSettings(req.body, userId);
            AbstractController.successResponse(res, updatedSettings, 200, "Settings updated successfully");
        } catch (error) {
            console.log('Error in updateSettings:', error);
            throw new AppError('Error updating settings', 400);
        }
    }

    // Get general settings
    static async getGeneralSettings(req, res) {
        try {
            const settings = await AdminService.getSectionSettings('generalSettings');
            AbstractController.successResponse(res, settings, 200, "General settings retrieved successfully");
        } catch (error) {
            console.log('Error in getGeneralSettings:', error);
            throw new AppError('Error retrieving general settings', 500);
        }
    }

    // Update general settings
    static async updateGeneralSettings(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                throw new AppError('User ID required for updating settings', 401);
            }

            // Validate general settings data
            const validationErrors = AdminService.validateSettingsData({ generalSettings: req.body });
            if (validationErrors.length > 0) {
                throw new AppError(`Validation errors: ${validationErrors.join(', ')}`, 400);
            }

            const updatedSettings = await AdminService.updateSectionSettings('generalSettings', req.body, userId);
            AbstractController.successResponse(res, updatedSettings, 200, "General settings updated successfully");
        } catch (error) {
            console.log('Error in updateGeneralSettings:', error);
            throw new AppError('Error updating general settings', 400);
        }
    }

    // Get field settings
    static async getFieldSettings(req, res) {
        try {
            const settings = await AdminService.getSectionSettings('fieldSettings');
            AbstractController.successResponse(res, settings, 200, "Field settings retrieved successfully");
        } catch (error) {
            console.log('Error in getFieldSettings:', error);
            throw new AppError('Error retrieving field settings', 500);
        }
    }

    // Update field settings
    static async updateFieldSettings(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                throw new AppError('User ID required for updating settings', 401);
            }

            // Validate field settings data
            const validationErrors = AdminService.validateSettingsData({ fieldSettings: req.body });
            if (validationErrors.length > 0) {
                throw new AppError(`Validation errors: ${validationErrors.join(', ')}`, 400);
            }

            const updatedSettings = await AdminService.updateSectionSettings('fieldSettings', req.body, userId);
            AbstractController.successResponse(res, updatedSettings, 200, "Field settings updated successfully");
        } catch (error) {
            console.log('Error in updateFieldSettings:', error);
            throw new AppError('Error updating field settings', 400);
        }
    }

    // Get payment settings
    static async getPaymentSettings(req, res) {
        try {
            const settings = await AdminService.getSectionSettings('paymentSettings');
            AbstractController.successResponse(res, settings, 200, "Payment settings retrieved successfully");
        } catch (error) {
            console.log('Error in getPaymentSettings:', error);
            throw new AppError('Error retrieving payment settings', 500);
        }
    }

    // Update payment settings
    static async updatePaymentSettings(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                throw new AppError('User ID required for updating settings', 401);
            }

            // Validate payment settings data
            const validationErrors = AdminService.validateSettingsData({ paymentSettings: req.body });
            if (validationErrors.length > 0) {
                throw new AppError(`Validation errors: ${validationErrors.join(', ')}`, 400);
            }

            const updatedSettings = await AdminService.updateSectionSettings('paymentSettings', req.body, userId);
            AbstractController.successResponse(res, updatedSettings, 200, "Payment settings updated successfully");
        } catch (error) {
            console.log('Error in updatePaymentSettings:', error);
            throw new AppError('Error updating payment settings', 400);
        }
    }

    // Get notification settings
    static async getNotificationSettings(req, res) {
        try {
            const settings = await AdminService.getSectionSettings('notificationSettings');
            AbstractController.successResponse(res, settings, 200, "Notification settings retrieved successfully");
        } catch (error) {
            console.log('Error in getNotificationSettings:', error);
            throw new AppError('Error retrieving notification settings', 500);
        }
    }

    // Update notification settings
    static async updateNotificationSettings(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                throw new AppError('User ID required for updating settings', 401);
            }

            const updatedSettings = await AdminService.updateSectionSettings('notificationSettings', req.body, userId);
            AbstractController.successResponse(res, updatedSettings, 200, "Notification settings updated successfully");
        } catch (error) {
            console.log('Error in updateNotificationSettings:', error);
            throw new AppError('Error updating notification settings', 400);
        }
    }

    // Get security settings
    static async getSecuritySettings(req, res) {
        try {
            const settings = await AdminService.getSectionSettings('securitySettings');
            AbstractController.successResponse(res, settings, 200, "Security settings retrieved successfully");
        } catch (error) {
            console.log('Error in getSecuritySettings:', error);
            throw new AppError('Error retrieving security settings', 500);
        }
    }

    // Update security settings
    static async updateSecuritySettings(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                throw new AppError('User ID required for updating settings', 401);
            }

            // Validate security settings data
            const validationErrors = AdminService.validateSettingsData({ securitySettings: req.body });
            if (validationErrors.length > 0) {
                throw new AppError(`Validation errors: ${validationErrors.join(', ')}`, 400);
            }

            const updatedSettings = await AdminService.updateSectionSettings('securitySettings', req.body, userId);
            AbstractController.successResponse(res, updatedSettings, 200, "Security settings updated successfully");
        } catch (error) {
            console.log('Error in updateSecuritySettings:', error);
            throw new AppError('Error updating security settings', 400);
        }
    }

    // Reset all settings to defaults
    static async resetSettings(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                throw new AppError('User ID required for resetting settings', 401);
            }

            const defaultSettings = await AdminService.resetToDefaults(userId);
            AbstractController.successResponse(res, defaultSettings, 200, "Settings reset to defaults successfully");
        } catch (error) {
            console.log('Error in resetSettings:', error);
            throw new AppError('Error resetting settings', 500);
        }
    }

    // Initialize default settings (for setup)
    static async initializeSettings(req, res) {
        try {
            const settings = await AdminService.initializeDefaultSettings();
            AbstractController.successResponse(res, settings, 201, "Default settings initialized successfully");
        } catch (error) {
            console.log('Error in initializeSettings:', error);
            throw new AppError('Error initializing settings', 500);
        }
    }
}

module.exports = AdminController;
