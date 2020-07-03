/* eslint-disable implicit-arrow-linebreak */

export default {
  /**
   * @description handles converting amount to kobo before processing
   *
   * @param {Number} amount amount to be processed
   */
  normalizeAmount: amount => Math.round(amount * 100),

  /**
   * @description handles successful response for Authentication
   *
   * @param {Object} res -the response object
   * @param {Number} code - http status code
   * @param {String} token - Access Token
   * @param {Object} data - User Object
   */
  handleAuthSuccess: (res, code, token, data) =>
    res.status(parseInt(code, 10)).json({
      status: 'success',
      token,
      data,
    }),

  /**
   * @description handles paginating and filtering of results
   *
   * @param {Sequelize.Model} Model - Model to be queried
   * @param {Object} query - Query object
   * @param {Object} queryOptions - Query options such as filter, sort, etc.
   * @returns
   */
  paginate: async (Model, query, queryOptions) => {
    const {
      type,
      status,
      limit,
      page,
    } = queryOptions;
    let { sort } = queryOptions;

    // Filter by transaction type
    if (type) {
      query.where.type = type;
    }

    // Filter by transaction status
    if (status) {
      query.where.status = status;
    }

    // Sort by ascending or descending order
    if (sort) {
      let order = 'ASC';

      if (sort.startsWith('-')) {
        order = 'DESC';
        sort = sort.substr(1);
      }

      // Filter by creation date if 'sort' is set to date
      if (sort === 'date') {
        query.order.push(['createdAt', order]);
      } else {
        query.order.push([sort, order]);
      }
    }

    query.limit = +limit;
    query.offset = +((page - 1) * limit);

    // Return count and Results
    const records = await Model.findAndCountAll(query);
    return records;
  },
};
