require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });
const channel = process.env.CHANNEL_NAME;
const message = process.env.text_msg;


bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const user = msg.from.first_name;
    const formattedMessage = message.replace('%user%', user);
    test = formattedMessage, { parse_mode: 'HTML' };
    console.log(user);

    // Check if the user has joined your channel
    bot.getChatMember(`@${channel}`, msg.from.id)
      .then((res) => {
        // If the user is not a member, send a join button
        console.log(res.status);
        if (res.status === 'creator'){
          return
        }
        if (res.status !== 'member') {
        // mute user 
        bot.restrictChatMember(chatId, msg.from.id, { can_send_messages: false })
        // send join message
 
        bot.sendMessage(chatId,test, {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: 'Join channel',
                    url: `https://t.me/${channel}`
                  }
                ],
                [
                    {
                        text: 'I have joined Unmute me',
                        callback_data: 'unmute'
                    }
                ]
              ]
            }
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });


// Listen for callback queries
bot.on('callback_query', async (callbackQuery) => {

    
    //const message = callbackQuery.message;
    const groupChatId = callbackQuery.message.chat.id;
    const msg_id = callbackQuery.message.message_id

    if (callbackQuery.data === 'unmute') {
        const userId = callbackQuery.from.id;
        bot.getChatMember(`@${channel}`, userId)
        .then((res) => {

         if (res.status === 'member') {
          // User is a member of the channel
          console.log(`User ${userId} is a member of the channel`);
          bot.deleteMessage(groupChatId, msg_id)
          bot.restrictChatMember(groupChatId, userId, { can_send_messages: true })
          .then(() => {
          console.log(`User ${userId} has been unmuted.`);
          });
          // User is a admin,owner of the channel
          }else if (res.status === 'creator'){
            bot.deleteMessage(groupChatId, msg_id)
          }

          else {
          // User is not a member of the channel
          console.log(`User ${userId} is not a member of the channel`);
          }
  })
  .catch((err) => {
    console.log(err);
  });


}});
