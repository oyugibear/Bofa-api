const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    tax: {
        // required: true,
        type: String
    },
    extraServiceFees: {
        // required: true,
        type: String,
    },
    serviceCategories: {
        // required: true,
        type: Array,
    },
    blogCategories: {
        // required: true,
        type: Object,
    },
    serviceBreakdown: {
        type: [
            {
                title: {
                    type: String,
                },
                description: {
                    type: String,
                },
                imgPath: {
                    type: String,
                },
                imgAlt: {
                    type: String,
                },
                side: {
                    type: String,
                    enum: ['left', 'right'],
                },
                benefits: {
                    type: Array,
                },
                category: {
                    type: String,
                },
            },
        ],
    },

},
{ timestamps: true }
)

module.exports = mongoose.model('Settings', settingsSchema)