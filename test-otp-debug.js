// test-auth-fix.js
require("dotenv").config();
const { Sequelize, QueryTypes } = require("sequelize");
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");

async function testEverything() {
  console.log("🔧 COMPLETE AUTH FIX TEST\n");

  // 1. Database connection
  const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      dialect: "mysql",
      logging: false,
    }
  );

  try {
    await sequelize.authenticate();
    console.log("✅ Database connected\n");

    const testEmail = "aditya13@yopmail.com";

    // 2. Check user
    const [user] = await sequelize.query(
      `SELECT id, email, otp_secret, otp_enabled FROM pda_users WHERE email = ?`,
      { replacements: [testEmail], type: QueryTypes.SELECT }
    );

    if (!user) {
      console.log("❌ User not found");
      return;
    }

    console.log("📊 USER STATUS:");
    console.log(`ID: ${user.id}`);
    console.log(`Email: ${user.email}`);
    console.log(`OTP Secret: ${user.otp_secret || "NULL"}`);
    console.log(`OTP Enabled: ${user.otp_enabled}`);
    console.log("");

    // 3. Generate/fix secret
    let secret = user.otp_secret;
    if (!secret) {
      secret = "JBSWY3DPEHPK3PXPJBSWY3DPEHPK3PXP";
      console.log(`🔄 Setting new secret: ${secret}`);

      await sequelize.query(
        `UPDATE pda_users SET otp_secret = ?, otp_enabled = 0 WHERE id = ?`,
        { replacements: [secret, user.id] }
      );

      console.log("✅ Database updated");
    }

    // 4. Generate QR code for manual setup
    console.log("\n📱 GOOGLE AUTHENTICATOR SETUP:");

    const otpauth_url = `otpauth://totp/GTP-STS%20(${testEmail})?secret=${secret}&issuer=GTP-STS`;
    const qrCode = await QRCode.toDataURL(otpauth_url);

    console.log(`Secret: ${secret}`);
    console.log(`Manual entry key: ${secret}`);
    console.log(`QR Code (first 50 chars): ${qrCode.substring(0, 50)}...`);
    console.log("");

    // 5. Generate current valid token
    const currentToken = speakeasy.totp({
      secret: secret,
      encoding: "base32",
    });

    console.log("🔑 VALID OTPs RIGHT NOW:");
    console.log(`Current: ${currentToken}`);

    // Generate tokens for next 2 minutes
    const now = Math.floor(Date.now() / 1000);
    for (let i = 0; i < 4; i++) {
      const time = now + i * 30;
      const token = speakeasy.totp({
        secret: secret,
        encoding: "base32",
        time: time,
      });
      const mins = Math.floor((i * 30) / 60);
      const secs = (i * 30) % 60;
      console.log(`In ${mins}m ${secs}s: ${token}`);
    }
    console.log("");

    // 6. Test verification
    console.log("🧪 TEST VERIFICATION:");
    console.log(`Testing token: ${currentToken}`);

    const valid = speakeasy.totp.verify({
      secret: secret,
      encoding: "base32",
      token: currentToken,
      window: 2,
    });

    console.log(`Result: ${valid ? "✅ VALID" : "❌ INVALID"}`);
    console.log("");

    // 7. Instructions
    console.log("🎯 WHAT TO DO NEXT:");
    console.log("1. Open Google Authenticator");
    console.log('2. Tap "+" → "Enter a setup key"');
    console.log(`3. Enter Account: ${testEmail}`);
    console.log(`4. Enter Key: ${secret}`);
    console.log("5. Time-based, 6 digits");
    console.log("6. Wait for OTP to change (every 30 seconds)");
    console.log("7. Enter OTP in your app");
    console.log("");
    console.log("🔧 OR USE TEST OTP: 123456");
    console.log("");

    // 8. Check pda_user_tokens table
    console.log("🗄️  CHECKING PDA_USER_TOKENS TABLE:");
    try {
      const [tableInfo] = await sequelize.query(
        `SHOW COLUMNS FROM pda_user_tokens`
      );
      console.log(`Table exists with ${tableInfo.length} columns`);

      // Check if we can insert
      const testInsert = await sequelize.query(
        `INSERT INTO pda_user_tokens (pda_user_id, refresh_token_hash, expires_at) VALUES (?, ?, ?)`,
        {
          replacements: [
            user.id,
            "test_hash_" + Date.now(),
            new Date(Date.now() + 86400000),
          ],
        }
      );
      console.log("✅ Can insert into pda_user_tokens");

      // Cleanup
      await sequelize.query(
        `DELETE FROM pda_user_tokens WHERE refresh_token_hash LIKE 'test_hash_%'`
      );
    } catch (tableError) {
      console.log("❌ pda_user_tokens table issue:", tableError.message);
    }
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await sequelize.close();
  }
}

testEverything();
