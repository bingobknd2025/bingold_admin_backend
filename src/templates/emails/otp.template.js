exports.otpTemplate = ({ name, otp }) => {
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;background:#f5f7fa;padding:30px">
    <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:8px;padding:30px">

      <h2 style="color:#222;margin-bottom:10px">Security Verification</h2>

      <p>Hello <b>${name || "User"}</b>,</p>

      <p>Your One-Time Password (OTP) for verification is:</p>

      <div style="text-align:center;margin:25px 0">
        <span style="font-size:28px;letter-spacing:6px;font-weight:bold;color:#2c3e50">
          ${otp}
        </span>
      </div>

      <p>This OTP is valid for <b>2 minutes</b>. Please do not share this code with anyone.</p>

      <hr style="margin:30px 0;border:none;border-top:1px solid #eee"/>

      <p style="font-size:13px;color:#888">
        If you did not request this verification, please ignore this email or contact support.
      </p>

      <p style="margin-top:20px">Regards,<br/><b>Security Team</b></p>

    </div>
  </div>
  `;
};
