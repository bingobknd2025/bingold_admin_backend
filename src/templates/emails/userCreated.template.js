exports.userCreatedTemplate = ({
  name,
  email,
  password,
  sendPassword = false,
  isAdminNotification = false
}) => {

  if (isAdminNotification) {
    return `
    <div style="font-family:Arial,Helvetica,sans-serif;background:#f5f7fa;padding:30px">
      <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:8px;padding:30px">

        <h2>User Creation Notification</h2>

        <p>Hello <b>${name}</b>,</p>

        <p>A new user account has been successfully created in the system.</p>

        <p><b>User Email:</b> ${email}</p>

        <p style="margin-top:25px">Regards,<br/><b>System Notification</b></p>

      </div>
    </div>
    `;
  }

  return `
  <div style="font-family:Arial,Helvetica,sans-serif;background:#f5f7fa;padding:30px">
    <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:8px;padding:30px">

      <h2>Welcome to the Platform</h2>

      <p>Hello <b>${name}</b>,</p>

      <p>Your account has been successfully created. You can now log in using the following details:</p>

      <p><b>Email:</b> ${email}</p>

      ${sendPassword ? `
        <p><b>Temporary Password:</b> ${password}</p>
        <p style="color:#c0392b"><b>Important:</b> Please change your password immediately after logging in.</p>
      ` : ''}

      <hr style="margin:30px 0;border:none;border-top:1px solid #eee"/>

      <p>If you need assistance, feel free to contact our support team.</p>

      <p style="margin-top:20px">Regards,<br/><b>Admin Team</b></p>

    </div>
  </div>
  `;
};
