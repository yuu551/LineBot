//ベースとなるオブジェクト contents.contentsにプッシュする。
const baseJson = 
{
    "type": "flex",
    "altText": "#",
    "contents":{
          "type": "carousel",
          "contents": []
    }
  }

exports.makeJson = function(curry_pic,curry_url,shop_name,address,opentime,shopid,arraylength){

  let contentpart = [];
  for(let i =0;i<arraylength;i++){
  //オブジェクトの値渡しが出来なかったためここで定義
  contentpart[i] = {
    "type": "bubble",
    "size": "kilo",
    "hero": {
      "type": "image",
      "url": "",
      "size": "full",
      "aspectMode": "cover",
      "aspectRatio": "20:13"
    },
    "body": {
      "type": "box",
      "layout": "vertical",
      "contents": [                   //body contents[0]
        {
          "type": "text",
          "text": "",                 //body contents[0].text
          "weight": "bold",
          "size": "xl",
          "wrap": true
        },
        {                             //body contents[1]
          "type": "box",
          "layout": "vertical",
          "contents": [               //body.contents[1].contents[0]
            {
              "type": "box",
              "layout": "baseline",
              "spacing": "sm",
              "contents": [
                {
                  "type": "text",
                  "text": "Place",
                  "wrap": true,
                  "color": "#aaaaaa",
                  "size": "sm",
                  "flex": 1
                },
                {               //body.contents[1].contents[0].contents[1].text
                  "type": "text",
                  "wrap": true,
                  "size": "sm",
                  "text": "",
                  "flex": 5,
                  "color": "#666666"
                }
              ]
            },
            {                   //body.contents[1].contents[1].contents
              "type": "box",
              "layout": "baseline",
              "contents": [
                {
                  "type": "text",
                  "text": "Time",
                  "flex": 1,
                  "size": "sm",
                  "color": "#aaaaaa"
                },
                {             //body.contents[1].contents[1].contents[1].text = opentime
                  "type": "text",
                  "wrap": true,
                  "text": "",
                  "flex": 5,
                  "size": "sm",
                  "color": "#666666"
                }
              ],
              "spacing": "sm"
            }
          ],
          "spacing": "sm",
          "margin": "lg"
        }
      ],
      "paddingAll": "13px"
    },                    
    "footer": {                         //footer.contents[0].action.uri
      "type": "box",
      "layout": "vertical",
      "contents": [
        {
          "type": "button",
          "action": {
            "type": "uri",
            "uri": "",                //footer.contents[0].action.uri
            "label": "WebSite"
          },
          "height": "sm",
          "style": "link"
        },
        {
          "type": "button",
          "action": {
            "type": "postback",
            "label": "お気に入りから削除する",
            "data": "",             //footer.contents[1].action.data
            "text":"お気に入りから削除する"
          },
          "height": "sm",
          "style": "link"
        }
      ],
      "flex": 0,
      "spacing": "sm"
    }
  };
  contentpart[i].hero.url = curry_pic[i];
  contentpart[i].body.contents[0].text = shop_name[i]
  contentpart[i].body.contents[1].contents[0].contents[1].text = address[i]
  contentpart[i].body.contents[1].contents[1].contents[1].text = opentime[i];
  contentpart[i].footer.contents[0].action.uri = curry_url[i]
  contentpart[i].footer.contents[1].action.data = shopid[i] + "," +"Delete"
  baseJson.contents.contents.push(contentpart[i])
  }
  return baseJson;
}