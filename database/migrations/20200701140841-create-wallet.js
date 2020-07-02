export default {
  up: async (queryInterface, Sequelize) => {
    queryInterface.createTable('Wallets', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      walletNo: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      denomination: {
        type: Sequelize.STRING,
        defaultValue: 'NGN',
      },
      balance: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      userId: {
        allowNull: true,
        type: Sequelize.UUID,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: (queryInterface, Sequelize) => queryInterface.dropTable('Wallets'),
};
