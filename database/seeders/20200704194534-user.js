/* eslint-disable implicit-arrow-linebreak */
import bcrypt from 'bcrypt';

require('dotenv').config();

const salt = +process.env.SALT;

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
      'Users',
      [
        {
          id: '5ed582b9-843e-4923-856b-458877b2096d',
          name: 'Alan Shearr',
          email: 'alan@thebug.io',
          password: await bcrypt.hash('123456789', await bcrypt.genSalt(salt)),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'f6c169c5-07c2-46f5-9234-10e04afc8202',
          name: 'John Thomas',
          email: 'me@mail.com',
          password: await bcrypt.hash('123456789', await bcrypt.genSalt(salt)),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '5d627e19-acf9-4586-9b58-1d9562bca766',
          name: 'Akan Michael',
          email: 'me@othermail.io',
          password: await bcrypt.hash('123456789', await bcrypt.genSalt(salt)),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    ),

  down: async (queryInterface, Sequelize) =>
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    queryInterface.bulkDelete('Users', null, {}),
};
