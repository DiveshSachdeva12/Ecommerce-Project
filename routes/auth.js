const express = require("express");
const passport = require("passport");
const router = express.Router();
const { isLoggedIn } = require("../middleware");
const User = require("../models/User"); 

router.get("/", (req, res) => {
  res.render("auth/signup");
});
router.get("/register", (req, res) => {
  res.render("auth/signup");
});

// to actually registe a user
router.post("/register", async (req, res) => {
  const { username, email, password, confirm_password, role } = req.body;

  if (password !== confirm_password) {
    req.flash("error", "Passwords do not match.");
    return res.redirect("/register");
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.flash("error", "This email is already registered.");
      return res.redirect("/register");
    }

    const user = new User({ username, email, role });
    await User.register(user, password);

    req.flash("success", "Registration successful. Please log in.");
    res.redirect("/login");
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/register");
  }
});

// to get login form

router.get("/login", (req, res) => {
  res.render("auth/login");
});

// to actually login via the db
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureMessage: true,
  }),
  function (req, res) {
    req.flash("success", `Hello ${req.user.username}`);
    res.redirect("/products");
  }
);

// logout
router.get("/logout", (req, res) => {
  () => {
    req.logout();
  };
  req.flash("success", "Good Bye , logged out successfully..!!");
  res.redirect(`/login`);
});

router.get("/user/profile", isLoggedIn, (req, res) => {
  res.render("user/profile", { user: req.user });
});

router.post("/user/profile", isLoggedIn, async (req, res) => {
  const { email, gender, username, phone, address } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { email, gender, username, phone, address },
      { new: true }
    );

    req.flash("success", "Profile updated successfully");
    res.redirect("/user/profile");
  } catch (err) {
    req.flash("error", "Error updating profile");
    res.redirect("/user/profile");
  }
});
router.get("/search", async (req, res) => {
  try {
    const query = req.query.q;

    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { desc: { $regex: query, $options: "i" } },
      ],
    });

    res.render("products/searchResults", { products });
  } catch (err) {
    console.error("Error searching products:", err);
    res.status(500).send("Error searching products");
  }
});
// =============================================================


const nodemailer = require("nodemailer");
require("dotenv").config();
router.get("/send-otp", (req, res) => {
  res.render("sendOtpForm");
});
router.post("/send-otp", async (req, res) => {
  const { email, name } = req.body; 

  if (!email || !name) {
    return res.status(400).send("Email and Name are required.");
  }

  const otp = Math.floor(100000 + Math.random() * 900000);

  const transporter = nodemailer.createTransport({
    host: "smtp.sendgrid.net",
    port: 587, 
    secure: false, 
    auth: {
      user: "apikey",
      pass: process.env.SENDGRID_API_KEY, 
    },
  });

  const mailOptions = {
    from: "Apnabazaaaar@gmail.com", 
    to: email, 
    subject: "Your OTP Code - ApnaBazaar",
    html: `
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Your OTP Code - ApnaBazaar</title>
                    <style>
                        body {
                            font-family: 'Arial', sans-serif;
                            background-color: #f4f7fc;
                            color: #333;
                            margin: 0;
                            padding: 0;
                            position:fixed;
                            }
                           email-container {
    position: fixed;
    top: 50%; 
    left: 50%; 
    transform: translate(-50%, -50%);
    width: 100%;
    max-width: 600px; /* Set a maximum width */
    margin: 0 auto; /* Auto margin to center */
    background-color: #ffffff;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); /* Subtle shadow */
    z-index: 1000; /* Ensure the container stays above other content */
}
                        .email-header {
                            text-align: center;
                            background-color: #0044cc;
                            color: #fff;
                            padding: 20px;
                            border-radius: 10px 10px 0 0;
                        }
                        .email-body {
                            padding: 20px;
                            text-align: left;
                            font-size: 16px;
                            line-height: 1.6;
                        }
                        .otp {
                            display: inline-block;
                            background-color: #007bff;
                            color: white;
                            font-size: 24px;
                            font-weight: bold;
                            padding: 10px 20px;
                            border-radius: 5px;
                            margin: 20px 0;
                        }
                        .cta-button {
                            display: inline-block;
                            background-color: #0044cc;
                            color: white;
                            font-size: 16px;
                            font-weight: bold;
                            padding: 12px 25px;
                            border-radius: 5px;
                            text-decoration: none;
                            margin: 20px 0;
                        }
                        .email-footer {
                            text-align: center;
                            font-size: 14px;
                            color: #888;
                            margin-top: 30px;
                        }
                        .email-footer a {
                            color: #0044cc;
                            text-decoration: none;
                        }
                        .footer-note {
                            font-size: 12px;
                            color: #aaa;
                            margin-top: 20px;
                        }
                    </style>
                </head>
                <body>
                    <div class="email-container">
                        <!-- Header -->
                        <div class="email-header">
                            <h1>Welcome to ApnaBazaar, ${name}!</h1>
                            <p>We are excited to have you on board</p>
                        </div>
                        <!-- Body -->
                        <div class="email-body">
                            <p>Hello ${name},</p>
                            <p>Thank you for choosing ApnaBazaar! We are here to help you with a smooth and secure shopping experience.</p>
                            <p>Your One-Time Password (OTP) is:</p>
                            <div class="otp">${otp}</div>
                            <p>This OTP will expire in 10 minutes. If you didn’t request this OTP, please ignore this message.</p>
                            <a href="https://ecommerce-project-1-vvyf.onrender.com" class="cta-button">Visit ApnaBazaar</a>
                        </div>
                        <!-- Footer -->
                        <div class="email-footer">
                            <p>Best regards,</p>
                            <p><strong>The ApnaBazaar Team</strong></p>
                            <p><a href="https://ecommerce-project-1-vvyf.onrender.com">www.apnabazaar.com</a></p>
                            <p class="footer-note">This is an automated message. Please do not reply to this email.</p>
                        </div>
                    </div>
                </body>
            </html>
        `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send(`
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>OTP Sent Successfully</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f4f7fc;
                color: #333;
                padding: 20px;
                text-align: center;
              }
              .container {
                background-color: #fff;
                padding: 40px;
                border-radius: 8px;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
              }
              .title {
                font-size: 24px;
                font-weight: bold;
                color: #0044cc;
              }
              .message {
                font-size: 16px;
                margin: 20px 0;
              }
              .otp {
                display: inline-block;
                background-color: #007bff;
                color: white;
                font-size: 22px;
                padding: 12px 25px;
                border-radius: 5px;
                margin: 20px 0;
              }
              .cta-button {
                background-color: #0044cc;
                color: white;
                padding: 12px 20px;
                border-radius: 5px;
                font-size: 16px;
                text-decoration: none;
              }
              .cta-button:hover {
                background-color: #0033a0;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h2 class="title">OTP Sent Successfully!</h2>
              <p class="message">We have successfully sent an OTP to <strong>${email}</strong>.</p>
              <p class="message">Please check your inbox and use the OTP to verify your account.</p>
              <div class="otp">Check Mail</div>
              <p>If you did not request this OTP, please ignore this message.</p>
              <a href="/" class="cta-button">Go Back</a>
            </div>
          </body>
        </html>
      `);
      
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send(`Failed to send OTP: ${error.message}`);
  }
});
router.get("/forgot-password", (req, res) => {
    res.render("forgot-password"); 
  });
  router.post("/forgot-password", async (req, res) => {
    const { email, name } = req.body; 
  
    if (!email || !name) {
      return res.status(400).send("Email and Name are required.");
    }
  
    const otp = Math.floor(100000 + Math.random() * 900000); 
  
    const transporter = nodemailer.createTransport({
      host: "smtp.sendgrid.net",
      port: 587, 
      secure: false, 
      auth: {
        user: "apikey",
        pass: process.env.SENDGRID_API_KEY, 
      },
    });
  
    const mailOptions = {
      from: "diveshkumarsachdeva85@gmail.com", 
      to: email, 
      subject: "Your OTP Code - ApnaBazaar",
      html: `
              <html lang="en">
                  <head>
                      <meta charset="UTF-8">
                      <meta name="viewport" content="width=device-width, initial-scale=1.0">
                      <title>Your OTP Code - ApnaBazaar</title>
                      <style>
                          body {
                              font-family: 'Arial', sans-serif;
                              background-color: #f4f7fc;
                              color: #333;
                              margin: 0;
                              padding: 0;
                              position:fixed;
                              }
                             email-container {
      position: fixed;
      top: 50%; 
      left: 50%; 
      transform: translate(-50%, -50%);
      width: 100%;
      max-width: 600px; /* Set a maximum width */
      margin: 0 auto; /* Auto margin to center */
      background-color: #ffffff;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); /* Subtle shadow */
      z-index: 1000; /* Ensure the container stays above other content */
  }
                          .email-header {
                              text-align: center;
                              background-color: #0044cc;
                              color: #fff;
                              padding: 20px;
                              border-radius: 10px 10px 0 0;
                          }
                          .email-body {
                              padding: 20px;
                              text-align: left;
                              font-size: 16px;
                              line-height: 1.6;
                          }
                          .otp {
                              display: inline-block;
                              background-color: #007bff;
                              color: white;
                              font-size: 24px;
                              font-weight: bold;
                              padding: 10px 20px;
                              border-radius: 5px;
                              margin: 20px 0;
                          }
                          .cta-button {
                              display: inline-block;
                              background-color: #0044cc;
                              color: white;
                              font-size: 16px;
                              font-weight: bold;
                              padding: 12px 25px;
                              border-radius: 5px;
                              text-decoration: none;
                              margin: 20px 0;
                          }
                          .email-footer {
                              text-align: center;
                              font-size: 14px;
                              color: #888;
                              margin-top: 30px;
                          }
                          .email-footer a {
                              color: #0044cc;
                              text-decoration: none;
                          }
                          .footer-note {
                              font-size: 12px;
                              color: #aaa;
                              margin-top: 20px;
                          }
                      </style>
                  </head>
                  <body>
                      <div class="email-container">
                          <!-- Header -->
                          <div class="email-header">
                              <h1>Welcome to ApnaBazaar, ${name}!</h1>
                              <p>We are excited to have you on board</p>
                          </div>
                          <!-- Body -->
                          <div class="email-body">
                              <p>Hello ${name},</p>
                              <p>Thank you for choosing ApnaBazaar! We are here to help you with a smooth and secure shopping experience.</p>
                              <p>Your One-Time Password (OTP) is:</p>
                              <div class="otp">${otp}</div>
                              <p>This OTP will expire in 10 minutes. If you didn’t request this OTP, please ignore this message.</p>
                              <a href="https://ecommerce-project-1-vvyf.onrender.com" class="cta-button">Visit ApnaBazaar</a>
                          </div>
                          <!-- Footer -->
                          <div class="email-footer">
                              <p>Best regards,</p>
                              <p><strong>The ApnaBazaar Team</strong></p>
                              <p><a href="https://ecommerce-project-1-vvyf.onrender.com">www.apnabazaar.com</a></p>
                              <p class="footer-note">This is an automated message. Please do not reply to this email.</p>
                          </div>
                      </div>
                  </body>
              </html>
          `,
    };
  
    try {
      await transporter.sendMail(mailOptions);
      res.status(200).send(`
          <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>OTP Sent Successfully</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f7fc;
                  color: #333;
                  padding: 20px;
                  text-align: center;
                }
                .container {
                  background-color: #fff;
                  padding: 40px;
                  border-radius: 8px;
                  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                  width: 100%;
                  max-width: 600px;
                  margin: 0 auto;
                }
                .title {
                  font-size: 24px;
                  font-weight: bold;
                  color: #0044cc;
                }
                .message {
                  font-size: 16px;
                  margin: 20px 0;
                }
                .otp {
                  display: inline-block;
                  background-color: #007bff;
                  color: white;
                  font-size: 22px;
                  padding: 12px 25px;
                  border-radius: 5px;
                  margin: 20px 0;
                }
                .cta-button {
                  background-color: #0044cc;
                  color: white;
                  padding: 12px 20px;
                  border-radius: 5px;
                  font-size: 16px;
                  text-decoration: none;
                }
                .cta-button:hover {
                  background-color: #0033a0;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <h2 class="title">OTP Sent Successfully!</h2>
                <p class="message">We have successfully sent an OTP to <strong>${email}</strong>.</p>
                <p class="message">Please check your inbox and use the OTP to verify your account.</p>
                <div class="otp">Check Mail</div>
                <p>If you did not request this OTP, please ignore this message.</p>
                <a href="/" class="cta-button">Go Back</a>
              </div>
            </body>
          </html>
        `);
        
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).send(`Failed to send OTP: ${error.message}`);
    }
  });
  

  
module.exports = router;

