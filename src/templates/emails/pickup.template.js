exports.pickupCodeTemplate = ({
  recipientName,
  code,
  machineId,
  expiresAt,
  codeType // "PDA" | "OWNER"
}) => {

  const title =
    codeType === "PDA"
      ? "Pickup Code Generated"
      : "Owner Pickup Code";

  const codeLabel =
    codeType === "PDA"
      ? "Your PDA Pickup Code"
      : "Your Owner Pickup Code";

  return `
  <div style="font-family:Arial,Helvetica,sans-serif;background:#f5f7fa;padding:30px">
    <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:8px;padding:30px">

      <h2 style="color:#2c3e50;">${title}</h2>

      <p>Hello <b>${recipientName}</b>,</p>

      <p>The verification process has been successfully completed.</p>

      <hr style="margin:20px 0;border:none;border-top:1px solid #eee"/>

      <h3 style="color:#34495e;">${codeLabel}</h3>

      <p style="font-size:26px;font-weight:bold;color:#2c3e50;letter-spacing:3px;">
        ${code}
      </p>

      <p><b>Locker / Machine ID:</b> ${machineId}</p>

      <p><b>Valid Until:</b> ${new Date(expiresAt).toLocaleString()}</p>

      <p style="color:#c0392b;margin-top:15px;">
        ⚠ This code is valid for 10 minutes only.
      </p>

      <hr style="margin:30px 0;border:none;border-top:1px solid #eee"/>

      <p style="font-size:12px;color:#7f8c8d;">
        For security reasons, do not share this code with unauthorized individuals.
      </p>

      <p style="margin-top:20px">Regards,<br/><b>Pickup Operations Team</b></p>

    </div>
  </div>
  `;
};
