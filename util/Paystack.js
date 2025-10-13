const axios = require("axios")
const AppError = require("../errors/app-error")

async function createPaymentLink(data, company){
    const env = process.env.NODE_ENV === "development" ? true : false

    // let callback = "https://7a0f-105-163-156-32.ngrok-free.app/api/v1/invoice/confirm_payment"
    // let failedUrl = "http://localhost:3000/Invoices"
    let callback = "https://bofa-api.onrender.com/api/v1/invoice/confirm_payment" 
    let failedUrl = "https://bofa-eight.vercel.app/account" 

    const headers = {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
        "Content-Type": "application/json",
    }
    const metadata = JSON.stringify(data)
    // console.log("Paystack Data", data)
    const email = data.client?.organization?.company_name === 'Sibowasco' ? "jroyugi@gmail.com" : "jroyugi@gmail.com";

    const payload = {
        currency: "KES",
        email: email,
        name: data.client.name,
        phone: `+254${data.client.phone_number}`,
        // First option for production
        // amount: data.final_amount * 100,
        amount: 20 * 100,
    };

    let response
    try {
        response = await axios.post(
        "https://api.paystack.co/transaction/initialize",
        {
            ...payload,
            callback_url: callback,
            metadata,
            reference: data._id,
            onClose: failedUrl,
            channels: [
            "card",
            "bank",
            "ussd",
            "qr",
            "mobile_money",
            "bank_transfer",
            ],
        },
        { headers }
        )

    } catch (error) {
        console.log(error)
    }

    if (!response) {
        throw new AppError("something went wrong, could not process payments", 500)
    }


    const payment_link = response?.data?.data?.authorization_url
    return payment_link
}


module.exports = {
    createPaymentLink
}
