const axios = require('axios');       
const express = require('express');
const line = require('@line/bot-sdk');
const PORT = process.env.PORT || 3000;

const config = {
    channelSecret: 'LINE botのチャンネルシークレット',
    channelAccessToken: 'LINE botのアクセストークン'
};

const app = express();

app.get('/', (req, res) => res.send('Hello LINE BOT!(GET)')); //ブラウザ確認用(無くても問題ない)
app.post('/webhook', line.middleware(config), (req, res) => {
    console.log(req.body.events);

    //ここのif文はdeveloper consoleの"接続確認"用なので後で削除して問題ないです。
    if(req.body.events[0].replyToken === '00000000000000000000000000000000' && req.body.events[1].replyToken === 'ffffffffffffffffffffffffffffffff'){
        res.send('Hello LINE BOT!(POST)');
        console.log('疎通確認用');
        return; 
    }

    Promise
      .all(req.body.events.map(handleEvent))
      .then((result) => res.json(result));
});

const client = new line.Client(config);


async function handleEvent(event) {
  var url
  var ramen_url;
  var hitnum;

  // 位置情報のみに入力制限
  if (event.type !== 'message' || event.message.type !== 'location') {
    return Promise.resolve(null);
  }

  // 取得した位置情報をログに表示
  console.log(event.message.latitude + ' : ' + event.message.longitude);

  // ぐるなびAPIを使うためのURLに経緯を加える
  url = 'https://api.gnavi.co.jp/RestSearchAPI/v3/?keyid=6eecd3af974fcc7fa63d6ab8139269e6&latitude=' + event.message.latitude + '&longitude=' + event.message.longitude + '&range=2&freeword=インドカレー';
  const encodeUrl = encodeURI(url);

  // ぐるなびAPIに問い合わせ
  const response = await axios.get(encodeUrl);

  //レスポンスの中からcategory"ラーメン"を探索
  for(var num = 0; num <= response.data.rest.length; num++){
    if(response.data.rest[num].category === 'インドカレー'){
//      console.log(response.data.rest[num]);
      hitnum = num;
      ramen_url = response.data.rest[num].url_mobile;
      break;
    }
  }

  // ヒットしたラーメン店の住所をLINE botに返す
  return client.replyMessage(event.replyToken, {
    type: 'location',
    title: response.data.rest[hitnum].name,
    address: response.data.rest[hitnum].address,
    latitude: response.data.rest[hitnum].latitude,
    longitude: response.data.rest[hitnum].longitude
  });
  }
  app.listen(PORT);
  console.log(`Server running at ${PORT}`);