const axios = require('axios');       
const express = require('express');
const line = require('@line/bot-sdk');
const curmsg =require('./cursel');
const makejson = require('./makejson');
const dao = require('./favdao');
const crypto = require('crypto');
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
      var msgs = [];
      console.log(event);
      console.log(event.source.userId);
      
  

  //ポストバック
  if(event.type == "postback"){
    const hashedid = crypto.createHash('sha256').update(event.source.userId, 'utf8').digest('hex');
    await dao.InsertRecord(hashedid,event.postback.data);
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: 'お気に入りに登録完了しました！'
    });
  }

  //ポストバックした時用
  if(event.type.message == "お気に入りに登録する。"){
    return null;
  }

  ///メニューから位置情報で検索ボタンを押したとき
  if(event.message.text == '位置情報から検索'){
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: '自分の位置情報を送信してください！'
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
  // 取得した位置情報をログに表示
  console.log(event.message.latitude + ' : ' + event.message.longitude);

  // ぐるなびAPIを使うためのURLに経緯を加える
  url = 'https://api.gnavi.co.jp/RestSearchAPI/v3/?keyid=6eecd3af974fcc7fa63d6ab8139269e6&latitude=' + event.message.latitude + '&longitude=' + event.message.longitude + '&freeword=インドカレー&range=4';
  const encodeUrl = encodeURI(url);

  //test
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
  shopid.push(response.data.rest[num].id)
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

  var arrnum = 0; 
  let Table;
  const hashedid = crypto.createHash('sha256').update(event.source.userId, 'utf8').digest('hex');
  await dao.GetFavCurry().then(result => {
        Table = result;
      });
    console.log(Table);
    console.log(Table.records.length);

  const FavGet = async()=>{
  for (var i = 0;i<Table.records.length;i++){
     if(Table.records[i].fields.UserId == hashedid)
     {  
        
          // ぐるなびAPIを使うためのURLに経緯を加える
         url = 'https://api.gnavi.co.jp/RestSearchAPI/v3/?keyid=6eecd3af974fcc7fa63d6ab8139269e6&id=' + Table.records[i].fields.ShopId;
         console.log(url);
         const encodeUrl = encodeURI(url);
         //test
            // ぐるなびAPIに問い合わせ
              await axios.get(encodeUrl)
              .then(res => 
            {
              console.log(res.data.rest[0]);
              console.log(res.data.rest[0].name);
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
  }
  const favresult = await FavGet().then( () => {
  msg = makejson.makeJson(curry_pic,curry_url,shop_name,address,opentime,shopid,arrnum);
  // ヒットしたインドカレー店の住所をLINE botに返す
  return client.replyMessage(event.replyToken,[{
    type: 'text',
    text: 'お気に入りの店舗です。'
  },msg
]);
    
  
  });

  return favresult;
}

if(event.type == 'message'){
  url = 'https://api.gnavi.co.jp/RestSearchAPI/v3/?keyid=6eecd3af974fcc7fa63d6ab8139269e6&freeword_condition=1&freeword=インドカレー,'+event.message.text
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
    shopid.push(response.data.rest[num].id)
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
  
