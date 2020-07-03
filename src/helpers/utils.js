export default {
  handleError: (req, res, code, message, err, data = null) => res.status(parseInt(code, 10)).json({
    status: 'failed',
    message,
    data: {
      data,
    },
    // err
  }),

  handleSuccess: (req, res, code, data) =>
    // logger.logAPIResponse(req, res);
    res.status(parseInt(code, 10)).json({
      status: 'success',
      data,
    }),

  handleAuthSuccess: (req, res, code, token, data) =>
    // logger.logAPIResponse(req, res);
    res.status(parseInt(code, 10)).json({
      status: 'success',
      token,
      data,
    })
  ,
};
