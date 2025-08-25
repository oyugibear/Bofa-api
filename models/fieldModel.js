const mongoose = require('mongoose');

const fieldSchema = new mongoose.Schema({
    // Basic Information
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500
    },
    
    // Pricing
    price_per_hour: {
        type: Number,
        required: true,
        min: 0
    },
    peak_hour_price: {
        type: Number,
        default: function() { return this.price_per_hour * 1.2; }
    },
    weekend_price: {
        type: Number,
        default: function() { return this.price_per_hour * 1.3; }
    },
    
    // Availability and Status
    status: {
        type: String,
        enum: ['active', 'maintenance', 'inactive', 'under_construction'],
        default: 'active'
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    
    // Operating Hours
    operatingHours: {
        monday: {
            open: { type: String, default: "06:00" },
            close: { type: String, default: "22:00" },
            closed: { type: Boolean, default: false }
        },
        tuesday: {
            open: { type: String, default: "06:00" },
            close: { type: String, default: "22:00" },
            closed: { type: Boolean, default: false }
        },
        wednesday: {
            open: { type: String, default: "06:00" },
            close: { type: String, default: "22:00" },
            closed: { type: Boolean, default: false }
        },
        thursday: {
            open: { type: String, default: "06:00" },
            close: { type: String, default: "22:00" },
            closed: { type: Boolean, default: false }
        },
        friday: {
            open: { type: String, default: "06:00" },
            close: { type: String, default: "22:00" },
            closed: { type: Boolean, default: false }
        },
        saturday: {
            open: { type: String, default: "06:00" },
            close: { type: String, default: "22:00" },
            closed: { type: Boolean, default: false }
        },
        sunday: {
            open: { type: String, default: "06:00" },
            close: { type: String, default: "22:00" },
            closed: { type: Boolean, default: false }
        }
    },
    
    // Capacity and Rules
    // maxCapacity: {
    //     players: {
    //         type: Number,
    //         required: true,
    //         min: 1
    //     },
    //     spectators: {
    //         type: Number,
    //         default: 0
    //     }
    // },
    
    // Booking Rules
    bookingRules: {
        minBookingDuration: {
            type: Number,
            default: 1, // hours
            min: 0.5
        },
        maxBookingDuration: {
            type: Number,
            default: 4, // hours
            min: 1
        },
        advanceBookingDays: {
            type: Number,
            default: 30, // days in advance
            min: 1
        },
        cancellationHours: {
            type: Number,
            default: 24, // hours before cancellation allowed
            min: 1
        },
        requiresDeposit: {
            type: Boolean,
            default: false
        },
        depositPercentage: {
            type: Number,
            default: 20,
            min: 0,
            max: 100
        }
    },
    
    
    // Maintenance and History
    lastMaintenance: {
        type: Date
    },
    nextMaintenance: {
        type: Date
    },
    maintenanceNotes: [{
        date: {
            type: Date,
            default: Date.now
        },
        description: {
            type: String,
            required: true
        },
        cost: {
            type: Number,
            min: 0
        },
        performedBy: {
            type: String
        }
    }],
    
    // Statistics
    statistics: {
        totalBookings: {
            type: Number,
            default: 0
        },
        totalRevenue: {
            type: Number,
            default: 0
        },
        averageRating: {
            type: Number,
            min: 1,
            max: 5,
            default: 5
        },
        utilizationRate: {
            type: Number,
            min: 0,
            max: 100,
            default: 0
        }
    },
    
    // Management
    postedBy: { 
        type: mongoose.Types.ObjectId, 
        ref: "User",
    },
    managedBy: [{ 
        type: mongoose.Types.ObjectId, 
        ref: "User"
    }],
    
    // Additional Settings
    settings: {
        allowOnlineBooking: {
            type: Boolean,
            default: true
        },
        requireApproval: {
            type: Boolean,
            default: false
        },
        sendConfirmationEmail: {
            type: Boolean,
            default: true
        },
        sendReminderEmail: {
            type: Boolean,
            default: true
        },
        reminderHours: {
            type: Number,
            default: 24
        }
    }
},
{ 
    timestamps: true,
})


module.exports = mongoose.model('Field', fieldSchema)