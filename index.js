const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const line = require("@line/bot-sdk"); // 追加
// 追加
const config = {
  channelAccessToken: process.env.ACCESS_TOKEN,
  channelSecret: process.env.SECRET_KEY
};
const client = new line.Client(config); // 追加


express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/g/', (req, res) => res.json({method: "こんにちは、getさん"}))
  .post('/p/', (req, res) => res.json({method: "こんにちは、postさん"}))
  .post("/hook/", line.middleware(config), (req, res) => lineBot(req, res)) // 変更、middlewareを追加
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

  function lineBot(req, res) {
    res.status(200).end(); // 変更
    const events = req.body.events;
    const promises = [];
    for (let i = 0, l = events.length; i < l; i++) {
      const ev = events[i];
      promises.push(
        echoman(ev)
      );
    }
    Promise.all(promises).then(console.log("pass"));
  }

  async function echoman(ev) {
    const pro =  await client.getProfile(ev.source.userId);
    return client.replyMessage(ev.replyToken, {
      type: "text",
      text: `${pro.displayName}さん、今「${ev.message.text}」って言いました？`
    })
  }
