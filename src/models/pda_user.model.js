module.exports = (sequelize, DataTypes) => {
  const PdaUser = sequelize.define('PdaUser', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: true
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: false
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    role_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'pda_roles',
        key: 'id'
      },
      allowNull: true
    },
    otp_secret: {
      type: DataTypes.STRING(100)
    },
    otp_enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    last_login_at: {
      type: DataTypes.DATE
    },

    profile_image: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    dob: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    aadhaar_number: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: true
    },
    aadhaar_file: {
      type: DataTypes.JSON,
      allowNull: true
    },
    aadhaar_status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending'
    },
    device_token: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    device_type: {
      type: DataTypes.ENUM('ANDROID', 'IOS', 'WEB'),
      allowNull: true
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'pda_users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true
  });

  PdaUser.associate = (models) => {
    // ... other associations
  };

  return PdaUser;
};