// utils/crypto.util.js
//
// Small reversible-encryption helper (AES-256-GCM) for short-lived secrets we
// must keep in plaintext-recoverable form — specifically the registration
// password held in `bingopay_pending_registrations` between the OTP-send step
// and OTP-verify (when it is forwarded to BinGold's register_user and the row is
// deleted). NOT for long-term storage; passwords at rest still use bcrypt.
const crypto = require('crypto');

// 32-byte key derived from a configured secret (falls back to the JWT secret so
// the app still boots in dev). Set PENDING_REG_ENC_KEY in production.
function key() {
    const secret = process.env.PENDING_REG_ENC_KEY || process.env.JWT_ACCESS_SECRET || 'bingopay-pending-reg-dev-secret';
    return crypto.createHash('sha256').update(String(secret)).digest();
}

// Returns "ivHex:tagHex:cipherHex".
function encrypt(plaintext) {
    if (plaintext == null) return null;
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', key(), iv);
    const enc = Buffer.concat([cipher.update(String(plaintext), 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    return `${iv.toString('hex')}:${tag.toString('hex')}:${enc.toString('hex')}`;
}

function decrypt(payload) {
    if (!payload) return null;
    const [ivHex, tagHex, dataHex] = String(payload).split(':');
    if (!ivHex || !tagHex || !dataHex) throw new Error('Malformed encrypted payload');
    const decipher = crypto.createDecipheriv('aes-256-gcm', key(), Buffer.from(ivHex, 'hex'));
    decipher.setAuthTag(Buffer.from(tagHex, 'hex'));
    return Buffer.concat([decipher.update(Buffer.from(dataHex, 'hex')), decipher.final()]).toString('utf8');
}

module.exports = { encrypt, decrypt };
