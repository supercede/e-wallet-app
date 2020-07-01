export default {
  up: async (queryInterface, Sequelize) => {
    queryInterface.createTable('Transactions', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM('credit', 'debit', 'self-fund'),
        allowNull: false,
      },
      amount: {
        type: Sequelize.INTEGER,
      },
      source: {
        type: Sequelize.STRING,
      },
      recipient: {
        type: Sequelize.STRING,
      },
      narration: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.ENUM('success', 'failed', 'pending'),
        allowNull: false,
      },
      walletBalance: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      denomination: {
        type: Sequelize.STRING,
        defaultValue: 'NGN',
      },
    });
  },

  down: (queryInterface, Sequelize) => queryInterface.dropTable('Transactions'),
};
