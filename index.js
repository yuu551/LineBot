const axios = require('axios');       
const express = require('express');
const line = require('@line/bot-sdk');
const curmsg =require('./cursel');
const makejson = require('./makejson');
const dao = require('./favdao');
const crypto = require('crypto');
const PORT = process.env.PORT || 3000;

//herokuの環境変数
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


//イベントハンドラー
async function handleEvent(event) {
  //各種アイテムを初期化
      var hitnum = [];
      var shop_name = [];
      var shop_address = [];
      var opentime =[];
      var curry_url = [];
      var curry_pic = [];
      var address = [];
      var phonenumber = [];
      var shopid = [];
      var msg;
      

  //ポストバックイベント(お気に入りに登録押下時)
  if(event.type == "postback"){

    //カンマ区切りで属性判断　ex.Delete or Insert
    let postbackdata = event.postback.data.split(',');
    
    //switch文で分岐
    switch(postbackdata[1]){
    
    case "Insert":
      //UserIdをハッシュ化
      const hashedid = crypto.createHash('sha256').update(event.source.userId, 'utf8').digest('hex');
      let InsertTable;
      let recordcount =0;

      //お気に入り情報を取得
      await dao.GetFavCurry().then(result => {
          InsertTable = result;
        });

      //すでに登録しているか確認
      for(var i = 0;i<InsertTable.records.length;i++){
        if(InsertTable.records[i].fields.UserId == hashedid && InsertTable.records[i].fields.ShopId == postbackdata[0])
        {
          //登録済みレコードがあった場合リターン
          return client.replyMessage(event.replyToken, {
            type: 'text',
            text: 'お気に入りに登録済みです。。。'
          });
        }
        //自分のIDとマッチしていたらレコードカウント追加
        if(InsertTable.records[i].fields.UserId == hashedid)
        {
          recordcount++;
        }
      }
      //10件より多く該当レコードがあった場合
      if(recordcount>10){
        return client.replyMessage(event.replyToken, {
          type: 'text',
          text: '10件より多くは登録できません。。。'
        });
      }

      //レコードをインサート
      await dao.InsertRecord(hashedid,postbackdata[0]);
      return client.replyMessage(event.replyToken, {
        type: 'text',
        text: 'お気に入りに登録完了しました！'
      });

      break;

    case "Delete":
      let DeleteTable;
      //UserIdをハッシュ化
      const hashedidfordelete = crypto.createHash('sha256').update(event.source.userId, 'utf8').digest('hex');
      //削除するために一旦テーブル情報を取得
      await dao.GetFavCurry().then(result => {
        DeleteTable = result;
        });
        for(var i = 0;i<DeleteTable.records.length;i++){
            if(DeleteTable.records[i].fields.UserId == hashedidfordelete && DeleteTable.records[i].fields.ShopId == postbackdata[0])
            {
              await dao.Deleterecord(DeleteTable.records[i].id);
            }
          }


      return client.replyMessage(event.replyToken, {
        type: 'text',
        text: 'お気に入りから削除しました！'
      });

  }
  }

  //ポストバックした時用　ポストバック時のメッセージに反応してしまうため
  if(event.message.text == "お気に入りに登録する。" || event.message.text == "お気に入りから削除する"){
    return null;
  }
  

  ///メニューから位置情報で検索ボタンを押したとき
  if(event.message.text == '位置情報から検索'){
    //位置情報を送信リンク付与　TODO　外だし希望
    return client.replyMessage(event.replyToken, {
      "type": "flex",
  "altText": "#",
  "contents":{
      "type": "bubble",
      "body": {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "text",
            "text": "位置情報を送信してください！",
            "align": "center"
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
              "label": "位置情報を送る",
              "uri": "line://nv/location"
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
  ///メニューから地名で検索を押したとき
  if(event.message.text == '地名から検索'){
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: '検索したい地名を入力してください!'
    });
  }

  ///位置情報が送信されたとき
  if(event.message.type == 'location'){
  
  // ぐるなびAPIを使うためのURLに経緯を加える
  url = 'https://api.gnavi.co.jp/RestSearchAPI/v3/?keyid=136eb2d39fbee1e355f582e1566a49b8&latitude=' + event.message.latitude + '&longitude=' + event.message.longitude + '&freeword=インドカレー&range=4';
  const encodeUrl = encodeURI(url);

  try{
    // ぐるなびAPIに問い合わせ
    var response = await axios.get(encodeUrl)
    } catch{
      return client.replyMessage(event.replyToken, {
        type: 'text',
        text: '申し訳ございません。該当店舗は存在しません。。。'
      });
    }      

 //レスポンスの中からを探索
 for(var num = 0; num < response.data.rest.length; num++){
   
  hitnum.push(num)
  shop_name.push(response.data.rest[num].name)
  shop_address.push(response.data.rest[num].address)
  opentime.push(response.data.rest[num].opentime)
  curry_url.push(response.data.rest[num].url_mobile);
  curry_pic.push(response.data.rest[num].image_url.shop_image1);
  address.push(response.data.rest[num].address);
  phonenumber.push(response.data.rest[num].tel)
  shopid.push(response.data.rest[num].id+","+"Insert")
  if(!curry_pic[num]){
    curry_pic[num] = 'https://tblg.k-img.com/restaurant/images/Rvw/18549/640x640_rect_18549970.jpg'
  }
  if(!opentime[num]){
    opentime[num] = '店舗へお尋ねください。'
  }
}


if(response.data.rest.length >2){
  msg = curmsg.replymessage(curry_pic,curry_url,shop_name,address,opentime,shopid);
  // ヒットしたインドカレー店の住所をLINE botに返す
  return client.replyMessage(event.replyToken,[{
    type: 'text',
    text: '検索結果付近の店舗はこちらです！'
  },msg
]);
  }
  else if(response.data.rest.length >1){
    msg = curmsg.replymessage2(curry_pic,curry_url,shop_name,address,opentime,shopid);
    // ヒットしたインドカレー店の住所をLINE botに返す
    return client.replyMessage(event.replyToken,[{
      type: 'text',
      text: '検索結果付近の店舗はこちらです！'
    },msg
  ]);
    }
    else if(response.data.rest.length >0){
      msg = curmsg.replymessage1(curry_pic,curry_url,shop_name,address,opentime,shopid);
      // ヒットしたインドカレー店の住所をLINE botに返す
      return client.replyMessage(event.replyToken,[{
        type: 'text',
        text: '検索結果付近の店舗はこちらです！'
      },msg
    ]);
  
}
  }

  ///お気に入りを表示
if(event.message.text == 'お気に入りを表示'){

  let arrnum = 0; 
  let Table;
  //ユーザーIDをハッシュ化
  const hashedid = crypto.createHash('sha256').update(event.source.userId, 'utf8').digest('hex');
  await dao.GetFavCurry().then(result => {
        Table = result;
      });
  //非同期で各IDに結び付く店舗情報を取得する関数
  const FavGet = async()=>{
  for (var i = 0;i<Table.records.length;i++){
     if(Table.records[i].fields.UserId == hashedid)
     {  
        
          // ぐるなびAPIを使うためのURLに経緯を加える
         url = 'https://api.gnavi.co.jp/RestSearchAPI/v3/?keyid=136eb2d39fbee1e355f582e1566a49b8&id=' + Table.records[i].fields.ShopId;
         const encodeUrl = encodeURI(url);
            // ぐるなびAPIに問い合わせ
              await axios.get(encodeUrl)
              .then(res => 
            {
              shop_name.push(res.data.rest[0].name)
              shop_address.push(res.data.rest[0].address)
              opentime.push(res.data.rest[0].opentime)
              curry_url.push(res.data.rest[0].url_mobile);
              curry_pic.push(res.data.rest[0].image_url.shop_image1);
              address.push(res.data.rest[0].address);
              phonenumber.push(res.data.rest[0].tel)
              shopid.push(res.data.rest[0].id)
              if(!curry_pic[arrnum]){
                curry_pic[arrnum] = 'https://tblg.k-img.com/restaurant/images/Rvw/18549/640x640_rect_18549970.jpg'
              }
              if(!opentime[arrnum]){
                opentime[arrnum] = '店舗へお尋ねください。'
              }
            });
            arrnum++;
     }
    }
    //　一件も登録されていない場合
    if(arrnum<1){
      return client.replyMessage(event.replyToken,[{
        type: 'text',
        text: 'お気に入り店舗が登録されていません。。。'
      },
    ]);
    }
  }
  //取得した情報でオブジェクトを生成
  const favresult = await FavGet().then( () => {
  msg = makejson.makeJson(curry_pic,curry_url,shop_name,address,opentime,shopid,arrnum);
  // ヒットしたインドカレー店の住所をLINE botに返す
  return client.replyMessage(event.replyToken,[{
    type: 'text',
    text: 'お気に入りの店舗です！'
  },msg
]);
    
  
  });

  return favresult;
}
//TODO　LIFF アプリ用
if(event.message.text == "liff")
{
  return client.replyMessage(event.replyToken,[{
    type: 'text',
    text: 'https://liff.line.me/1655284805-OjjNM1Xx'
  }
]);
}

//地名で検索時。基本的にメッセージをすべて拾ってしまうためイベントを発生したい場合はここより上で設定。
if(event.type == 'message'){
  url = 'https://api.gnavi.co.jp/RestSearchAPI/v3/?keyid=136eb2d39fbee1e355f582e1566a49b8&freeword_condition=1&freeword=インドカレー,'+event.message.text
  const encodeUrl = encodeURI(url);

  try{
  // ぐるなびAPIに問い合わせ
  var response = await axios.get(encodeUrl)
  } catch{
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: '申し訳ございません。該当店舗は存在しません。。。'
    });
  }                  

  //レスポンスの中からを探索
  for(var num = 0; num < response.data.rest.length; num++){
   
    hitnum.push(num)
    shop_name.push(response.data.rest[num].name)
    shop_address.push(response.data.rest[num].address)
    opentime.push(response.data.rest[num].opentime)
    curry_url.push(response.data.rest[num].url_mobile);
    curry_pic.push(response.data.rest[num].image_url.shop_image1);
    address.push(response.data.rest[num].address);
    phonenumber.push(response.data.rest[num].tel)
    shopid.push(response.data.rest[num].id+","+"Insert")
    if(!curry_pic[num]){
      curry_pic[num] = 'https://tblg.k-img.com/restaurant/images/Rvw/18549/640x640_rect_18549970.jpg'
    }
    if(!opentime[num]){
      opentime[num] = '店舗へお尋ねください。'
    }
    
  }
  if(response.data.rest.length >2){
    msg = curmsg.replymessage(curry_pic,curry_url,shop_name,address,opentime,shopid);
    // ヒットしたインドカレー店の住所をLINE botに返す
    return client.replyMessage(event.replyToken,[{
      type: 'text',
      text: '検索結果付近の店舗はこちらです！'
    },msg
  ]);
    }
    else if(response.data.rest.length >1){
      msg = curmsg.replymessage2(curry_pic,curry_url,shop_name,address,opentime,shopid);
      // ヒットしたインドカレー店の住所をLINE botに返す
      return client.replyMessage(event.replyToken,[{
        type: 'text',
        text: '検索結果付近の店舗はこちらです！'
      },msg
    ]);
      }
      else if(response.data.rest.length >0){
        msg = curmsg.replymessage1(curry_pic,curry_url,shop_name,address,opentime,shopid);
        // ヒットしたインドカレー店の住所をLINE botに返す
        return client.replyMessage(event.replyToken,[{
          type: 'text',
          text: '検索結果付近の店舗はこちらです！'
        },msg
      ]);
    
  }
  
}
  }
  app.listen(PORT);
  console.log(`Server running at ${PORT}`);
  
