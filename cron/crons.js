const cron = require("node-cron")
const Vehicle = require("../models/vehicleModel.js")

const runCron = () => {
  cron.schedule("0 * * * *", async () => {
    try {
      // Find all vehicles
      const vehicles = await Vehicle.find()

      // Iterate over each vehicle and update the values
      for (const vehicle of vehicles) {
        // Get the current date in UTC
        const currentDate = new Date().getTime()

        // Check if the insurance payment date is defined
        if (vehicle.insurancePaymentDate) {
          const insurancePaymentDate = vehicle.insurancePaymentDate

          // Calculate the time difference in milliseconds between the current date and the vehicle's date
          const timeDiff = currentDate - insurancePaymentDate

          // Convert the time difference to days
          const daysDiff = Math.ceil(timeDiff / 1000 / 60 / 60 / 24)

          // Check if the number of days is greater than 1
          if (daysDiff > 28) {
            vehicle.insuranceIsActive = false
            await vehicle.save()
          }
        }

        // Check if the tracking payment date is defined
        if (vehicle.trackingPaymentDate) {
          const trackingPaymentDate = vehicle.trackingPaymentDate

          // Calculate the time difference in milliseconds between the current date and the vehicle's date
          const timeDiff = currentDate - trackingPaymentDate

          // Convert the time difference to days
          const daysDiff = Math.ceil(timeDiff / 1000 / 60 / 60 / 24)

          // Check if the number of days is greater than 1
          if (daysDiff > 28) {
            vehicle.trackingIsActive = false
            await vehicle.save()
          }
        }
      }
    } catch (error) {
      console.error("Error occurred while updating vehicle values:", error)
    }
  })
}

module.exports = runCron
