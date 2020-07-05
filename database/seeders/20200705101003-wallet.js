/* eslint-disable implicit-arrow-linebreak */

import { v4 as uuidv4 } from 'uuid';

export default {
  up: async (queryInterface, Sequelize) =>
  /**
   * Add seed commands here.
   *
   * Example:
   * await queryInterface.bulkInsert('People', [{
   *   name: 'John Doe',
   *   isBetaMember: false
   * }], {});
   */

    queryInterface.bulkInsert(
      'Wallets',
      [
        {
          id: uuidv4(),
          userId: '5ed582b9-843e-4923-856b-458877b2096d',
          balance: 0,
          walletNo: Math.round(Date.now() + Math.random() * 100),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          userId: 'f6c169c5-07c2-46f5-9234-10e04afc8202',
          balance: 900000,
          walletNo: Math.round(Date.now() + Math.random() * 100),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          userId: '5d627e19-acf9-4586-9b58-1d9562bca766',
          balance: 30000,
          walletNo: Math.round(Date.now() + Math.random() * 100),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    ),

  down: async (queryInterface, Sequelize) =>
    queryInterface.bulkDelete('Wallets', null, {}),

  /**
   * Add commands to revert seed here.
   *
   * Example:
   * await queryInterface.bulkDelete('People', null, {});
   */
};
