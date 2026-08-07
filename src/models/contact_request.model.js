// models/contact_request.model.js
//
// "Contact us" submissions captured from any front-end (marketing site, app,
// or a third-party platform). The public submit endpoint is deliberately
// UNAUTHENTICATED — see routes/public/contact.public.routes.js — so everything
// user-supplied here is untrusted input and is length-capped at both the
// service and DB layer.
//
// This is a lightweight ticket log, not a helpdesk: the admin panel lists the
// requests and moves them through a status. All actual correspondence with the
// requester happens outside the system (email/phone), so there is no thread,
// no attachments and no reply storage by design.
module.exports = (sequelize, DataTypes) => {
    const ContactRequest = sequelize.define('ContactRequest', {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        // Human-quotable reference, e.g. CT-20260807-7F3A9C. Generated on insert
        // so support can refer to a request in out-of-system email replies.
        ticket_ref: {
            type: DataTypes.STRING(30),
            allowNull: false,
            unique: true
        },
        name: { type: DataTypes.STRING(150), allowNull: false },
        email: { type: DataTypes.STRING(255), allowNull: false },
        subject: { type: DataTypes.STRING(255), allowNull: false },
        message: { type: DataTypes.TEXT, allowNull: false },

        // NEW         → just submitted, nobody has picked it up
        // IN_PROGRESS → an admin is handling it (out of system)
        // RESOLVED    → dealt with
        // CLOSED      → no action needed / spam / duplicate
        status: {
            type: DataTypes.ENUM('NEW', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'),
            allowNull: false,
            defaultValue: 'NEW'
        },
        // Free-text internal note — what was done, who was contacted. Never
        // exposed on the public surface.
        admin_note: { type: DataTypes.TEXT, allowNull: true },

        // Which front-end submitted it, so several sites can share the table.
        source: { type: DataTypes.STRING(50), allowNull: false, defaultValue: 'website' },

        // Abuse triage only. The endpoint is open, so keep enough to spot a
        // flood without storing anything that needs a retention policy.
        ip_address: { type: DataTypes.STRING(45), allowNull: true },
        user_agent: { type: DataTypes.STRING(255), allowNull: true },

        resolved_at: { type: DataTypes.DATE, allowNull: true },
        resolved_by: { type: DataTypes.INTEGER, allowNull: true }
    }, {
        tableName: 'contact_requests',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            { fields: ['status'] },
            { fields: ['email'] },
            { fields: ['created_at'] }
        ]
    });

    return ContactRequest;
};
