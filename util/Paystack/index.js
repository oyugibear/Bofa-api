const axios = require("axios")
const AppError = require("../../errors/app-error")

async function createPaymentLink(data, company){
    // const env = process.env.NODE_ENV === "development" ? true : false

    // let callback = "https://d386424e92f1.ngrok-free.app/api/v1/payments/confirm_payment/paystack"
    // let failedUrl = "http://localhost:3000/account"
    let callback = "https://bofa-api.onrender.com/api/v1/payments/confirm_payment/paystack" 
    let failedUrl = "https://bofa-eight.vercel.app/account" 

    const headers = {
        Authorization: `Bearer ${process.env.PAYSTACK_LOCAL_SECRET}`,
        "Content-Type": "application/json",
    }

    const metadata = JSON.stringify({
    ...data,
    })

    console.log("data", data)

    const payload = {
        currency: "KES",
        email: data.postedBy.email,
        name: data.postedBy.first_name + " " + data.postedBy.second_name ,
        phone: data.postedBy.phone_number,
        // amount: Math.round(data.final_amount_invoiced) * 100,
        amount: 20 * 100,
    };

    let response
    try {
        response = await axios.post(
        "https://api.paystack.co/transaction/initialize",
        {
            ...payload,
            callback_url: callback,
            metadata: metadata,
            reference: data?.payment_id,
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
        console.log("Error with paystack")
        console.log(error.response.data)
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
