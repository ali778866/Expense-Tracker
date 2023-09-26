const Sib = require('sib-api-v3-sdk')  //sib-api-v3-sdk

require('dotenv').config()

const client = Sib.ApiClient.instance

const apiKey = client.authentications['api-key']

apiKey.apiKey = process.env.API_KEY

const transEmailApi = new Sib.TransactionalEmailsApi()

const sender = {
    email: 'mdali.ali1995@gmail.com',
    name: 'Md Ali Ansari'
}

const receivers = [
    {
        email: 'mdali.ali76@gmail.com',
    }
]

transEmailApi.sendTransacEmail({
    sender,
    to: receivers,
    subject: 'Hi this is a Sample mail',
    htmlContent: `<h1> Hii This Is Ali <h1>
    <a href="https://www.facebook.com/Mohammadali.Ali11">Facebook</a>`
})
.then(console.log)
.catch(console.log)