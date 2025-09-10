const nodemailer = require("nodemailer");

const sendEmail = (recipient, subject, message) => {
  
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "m.musharraf2k8@gmail.com",
      pass: "acdvqpupixgrmexf",
    },
  });
  const mailOptions = {
    from: "m.musharraf2k8@gmail.com",
    bcc: recipient,
    subject: subject,
    text: message,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error occurred:", error);
      res.status(500).send("Error in sending email. Please try again later.");
    } else {
      console.log("Email sent:", info.response);
      
    }
  });
};

module.exports = sendEmail
