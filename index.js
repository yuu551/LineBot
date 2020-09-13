const axios = require('axios');       
const express = require('express');
const line = require('@line/bot-sdk');
const PORT = process.env.PORT || 3000;

const config = {
    channelSecret:process.env.SECRET_KEY,
    channelAccessToken:process.env.ACCESS_TOKEN
};

const app = express();

app.get('/', (req, res) => res.send('Hello LINE BOT!(GET)')); //ブラウザ確認用(無くても問題ない)
app.post('/hook', line.middleware(config), (req, res) => {
    console.log(req.body.events);


    Promise
      .all(req.body.events.map(handleEvent))
      .then((result) => res.json(result));
});

const client = new line.Client(config);


async function handleEvent(event) {
  var url
  var ramen_url;
  var hitnum;

  ///メニューから位置情報で検索ボタンを押したとき
  if(event.message.text == '位置情報から検索'){
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: 'メニューから自分の位置情報を送信してください！'
    });
  }
  ///メニューから地名で検索を押したとき
  if(event.message.text == '地名から検索'){
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: '検索したい地名を入力してください。'
    });
  }
  ///位置情報が送信されたとき
  if(event.message.type == 'location'){
  // 取得した位置情報をログに表示
  console.log(event.message.latitude + ' : ' + event.message.longitude);

  // ぐるなびAPIを使うためのURLに経緯を加える
  url = 'https://api.gnavi.co.jp/RestSearchAPI/v3/?keyid=6eecd3af974fcc7fa63d6ab8139269e6&latitude=' + event.message.latitude + '&longitude=' + event.message.longitude + '&freeword=インドカレー&range=4';
  const encodeUrl = encodeURI(url);

  // ぐるなびAPIに問い合わせ
  const response = await axios.get(encodeUrl);

  if(response.data.rest.length ==0){
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: '該当店舗は存在しません。'
    });
  }


  //レスポンスの中からを探索
  for(var num = 0; num <= response.data.rest.length; num++){
   
    hitnum = num;
    shop_name = response.data.rest[num].name;
    shop_address = response.data.rest[num].address
    opentime = response.data.rest[num].opentime
    curry_url = response.data.rest[num].url_mobile;
    var curry_pic = response.data.rest[num].image_url.shop_image1;
    address = response.data.rest[num].address;
    phonenumber = response.data.rest[num].tel
    if(!curry_pic){
      curry_pic = 'https://tblg.k-img.com/restaurant/images/Rvw/18549/640x640_rect_18549970.jpg'
    }
    console.log(shop_name);
    console.log(curry_pic);
    console.log(curry_url);
      break;
    
  }

  // ヒットしたインドカレー店の住所をLINE botに返す
  return client.replyMessage(event.replyToken, [{
    type: 'text',
    text: '一番近くの店舗はこちらです！'
  },
  {
    "type": "flex",
  "altText": "#",
  "contents":{
    "type": "bubble",
  "hero": {
    "type": "image",
    "url": curry_pic,
    "size": "full",
    "aspectRatio": "20:13",
    "aspectMode": "cover",
    "action": {
      "type": "uri",
      "uri": curry_url
    }
  },
  "body": {
    "type": "box",
    "layout": "vertical",
    "contents": [
      {
        "type": "text",
        "text": shop_name,
        "weight": "bold",
        "size": "xl"
      },
      {
        "type": "box",
        "layout": "vertical",
        "margin": "lg",
        "spacing": "sm",
        "contents": [
          {
            "type": "box",
            "layout": "baseline",
            "spacing": "sm",
            "contents": [
              {
                "type": "text",
                "text": "Place",
                "color": "#aaaaaa",
                "size": "sm",
                "flex": 1
              },
              {
                "type": "text",
                "text": address,
                "wrap": true,
                "color": "#666666",
                "size": "sm",
                "flex": 5
              }
            ]
          },
          {
            "type": "box",
            "layout": "baseline",
            "spacing": "sm",
            "contents": [
              {
                "type": "text",
                "text": "Time",
                "color": "#aaaaaa",
                "size": "sm",
                "flex": 1
              },
              {
                "type": "text",
                "text": opentime,
                "wrap": true,
                "color": "#666666",
                "size": "sm",
                "flex": 5
              }
            ]
          }
        ]
      }
    ]
  },
  "footer": {
    "type": "box",
    "layout": "vertical",
    "spacing": "sm",
    "contents": [
      {
        "type": "button",
        "style": "link",
        "height": "sm",
        "action": {
          "type": "uri",
          "label": "CALL",
          "uri": curry_url
        }
      },
      {
        "type": "button",
        "style": "link",
        "height": "sm",
        "action": {
          "type": "uri",
          "label": "WEBSITE",
          "uri": curry_url
        }
      },
      {
        "type": "spacer",
        "size": "sm"
      }
    ],
    "flex": 0
  }
}
  }
]);
  }
if(event.type == 'message'){
  url = 'https://api.gnavi.co.jp/RestSearchAPI/v3/?keyid=6eecd3af974fcc7fa63d6ab8139269e6&freeword_condition=1&freeword=インドカレー,'+event.message.text
  const encodeUrl = encodeURI(url);

  // ぐるなびAPIに問い合わせ
  const response = await axios.get(encodeUrl);

  if(response.data.rest.length ==0){
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: '該当店舗は存在しません。'
    });
  }


  //レスポンスの中からを探索
  for(var num = 0; num <= response.data.rest.length; num++){
   
      var hitnum = num;
      var shop_name = response.data.rest[num].name;
      var shop_address = response.data.rest[num].address
      var opentime = response.data.rest[num].opentime
      var curry_url = response.data.rest[num].url_mobile;
      var curry_pic = response.data.rest[num].image_url.shop_image1;
      var address = response.data.rest[num].address;
      var phonenumber = response.data.rest[num].tel
      if(!curry_pic){
        curry_pic = 'https://tblg.k-img.com/restaurant/images/Rvw/18549/640x640_rect_18549970.jpg'
      }
      console.log(shop_address);
      console.log(opentime);
      console.log(curry_url);
      console.log(shop_name);
      console.log(curry_pic);
      console.log(curry_url);
      break;
    
  }

  // ヒットしたインドカレー店の住所をLINE botに返す
  return client.replyMessage(event.replyToken, 
  {
    "type": "flex",
  "altText": "#",
  "contents":{
    "type": "bubble",
  "hero": {
    "type": "image",
    "url": curry_pic,
    "size": "full",
    "aspectRatio": "20:13",
    "aspectMode": "cover",
    "action": {
      "type": "uri",
      "uri": curry_url
    }
  },
  "body": {
    "type": "box",
    "layout": "vertical",
    "contents": [
      {
        "type": "text",
        "text": shop_name,
        "weight": "bold",
        "size": "xl"
      },
      {
        "type": "box",
        "layout": "vertical",
        "margin": "lg",
        "spacing": "sm",
        "contents": [
          {
            "type": "box",
            "layout": "baseline",
            "spacing": "sm",
            "contents": [
              {
                "type": "text",
                "text": "Place",
                "color": "#aaaaaa",
                "size": "sm",
                "flex": 1
              },
              {
                "type": "text",
                "text": address,
                "wrap": true,
                "color": "#666666",
                "size": "sm",
                "flex": 5
              }
            ]
          },
          {
            "type": "box",
            "layout": "baseline",
            "spacing": "sm",
            "contents": [
              {
                "type": "text",
                "text": "Time",
                "color": "#aaaaaa",
                "size": "sm",
                "flex": 1
              },
              {
                "type": "text",
                "text": opentime,
                "wrap": true,
                "color": "#666666",
                "size": "sm",
                "flex": 5
              }
            ]
          }
        ]
      }
    ]
  },
  "footer": {
    "type": "box",
    "layout": "vertical",
    "spacing": "sm",
    "contents": [
      {
        "type": "button",
        "style": "link",
        "height": "sm",
        "action": {
          "type": "uri",
          "label": "WEBSITE",
          "uri": curry_url
        }
      },
      {
        "type": "spacer",
        "size": "sm"
      }
    ],
    "flex": 0
  }
}
  });
}
  }
  app.listen(PORT);
  console.log(`Server running at ${PORT}`);
  
