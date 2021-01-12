const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  auth: {
    user: "123456khj001@gmail.com",
    pass: "Panel213@@",
  },
});

const sendMail = async (to, subject, data, type) => {
  let htmlBody;
  switch (type) {
    case "register-success":
      htmlBody = `<b>${data}</b>`;
      break;
    case "new-subscribe":
      htmlBody = `<b>${data}</b>`;
      break;

    default:
      break;
    //   return;
  }

  const emailContent = {
    from: "Support@manuci.tk",
    to,
    subject,
    html: htmlBody,
  };

  const res = await transporter.sendMail(emailContent);
  console.log(res);
};

module.exports = {
  sendMail,
};
