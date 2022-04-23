export default () => ({
  port: parseInt(process.env.PORT, 10) || 3010,
  mail: {
    transport: process.env.MAIL_TRANSPORT,
    host: process.env.MAIL_HOST,
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
    from: process.env.MAIL_FROM,
  },
});
