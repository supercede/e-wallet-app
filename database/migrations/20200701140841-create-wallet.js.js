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
    });
  },

  down: (queryInterface, Sequelize) => queryInterface.dropTable('Wallets'),
};
