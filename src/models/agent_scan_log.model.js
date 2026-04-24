// models/agent_scan_log.model.js
module.exports = (sequelize, DataTypes) => {
    const AgentScanLog = sequelize.define('AgentScanLog', {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        agent_id: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
            references: { model: 'agents', key: 'id' },
            onDelete: 'CASCADE'
        },
        ip: {
            type: DataTypes.STRING(45),
            allowNull: true
        },
        user_agent: {
            type: DataTypes.STRING(500),
            allowNull: true
        },
        scanned_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'agent_scan_logs',
        timestamps: false
    });

    return AgentScanLog;
};
