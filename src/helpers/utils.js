export default {
  handleError: (req, res, code, message, err) => res.status(parseInt(code, 10)).json({
    status: 'failed',
    message,
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
