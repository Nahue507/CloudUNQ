const fs = require('fs');
const promisify = require('util').promisify;
const {google} = require('googleapis');
const getGmailClient = require('./gmailClient');


const gmailClient = getGmailClient();

let subscriptions = new Map();

class EmailHandler{

 

  sendEmails(artistId, subject, content){
    let subscribers = subscriptions.get(artistId)
    if (subscribers !== undefined){
      subscribers.forEach(subEmail => { 
      gmailClient.users.messages.send(
        {
          userId: 'me',
          requestBody: {
            raw: this.createMessage(subEmail, subject, content),
          },
        }
      )
      });
    }
  
}

createMessage(subEmail, subject, content){
  const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
  const messageParts = [
    `To: <${subEmail}>`,
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    `Subject: ${utf8Subject}`,
    '',
    content,
  ];
  const message = messageParts.join('\n');

    
    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, ''); 

    return encodedMessage;
}

}
module.exports = {EmailHandler : EmailHandler}