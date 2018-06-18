var TelegramBot = require('node-telegram-bot-api');
var http = require('http');
var iconv = require('iconv-lite');
 
var token = '340218839:AAELWARY-brV_WGOw7h4bIlCfD5KVSYsd1Q';
var botOptions = {
    polling: true
};
 
var bot = new TelegramBot(token, botOptions);
 
var options = {
    host: "bash.im",
    port: 80,
    path: "/forweb/"
};
 
bot.getMe().then(function(me)
{
    console.log('Hello! My name is %s!', me.first_name);
    console.log('My id is %s.', me.id);
    console.log('And my username is @%s.', me.username);
});
 
bot.on('text', function(msg)
{
    var messageChatId = msg.chat.id;
    var messageText = msg.text;
    var messageDate = msg.date;
    var messageUser = msg.from.username;
 
    if (messageText.indexOf('/bash') === 0) {
        sendRandomBashImQuote(messageChatId);
    }
});
 
function sendRandomBashImQuote(aMessageChatId)
{
    http.get(options, function(res) {
        res.pipe(iconv.decodeStream('win1251')).collect(function(err, decodedBody) {
            var content = getQuoteBlockFromContent(decodedBody);
            content = removeAllMarkUp(content[1]);
            sendMessageByBot(aMessageChatId, content);
        });
    });
}
 
function removeAllMarkUp(aString)
{
    var cleanQuote = replaceAll(aString, "<' + 'br>", '\n');
    cleanQuote = replaceAll(cleanQuote, "<' + 'br />", '\n');
    cleanQuote = replaceAll(cleanQuote, '"', '\"');
    cleanQuote = replaceAll(cleanQuote, '<', '<');
    cleanQuote = replaceAll(cleanQuote, '>', '>');
    return cleanQuote;
}
 
function replaceAll(aString, aFingString, aReplaceString)
{
    return aString.split(aFingString).join(aReplaceString);
}
 
function getQuoteBlockFromContent(aString)
{
    var quoteBlock = aString.replace('<\' + \'div id="b_q_t" style="padding: 1em 0;">', '__the_separator__');
    quoteBlock = quoteBlock.replace('<\' + \'/div><\' + \'small>', '__the_separator__');
    return quoteBlock.split('__the_separator__');
}
 
function sendMessageByBot(aChatId, aMessage)
{
    bot.sendMessage(aChatId, aMessage, { caption: 'I\'m a cute bot!' });
}