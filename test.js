require('dotenv').config();

const message = process.env.text_msg;

  const user = "lahiru";
  const formattedMessage = message.replace('%user%', user);
  console.log(formattedMessage, { parse_mode: 'HTML' });
