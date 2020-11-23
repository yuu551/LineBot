exports.replymessage = function(curry_pic,curry_url,shop_name,address,opentime){
    return{
      "type": "flex",
      "altText": "#",
            "type": "carousel",
            "contents": [
              {
                "type": "bubble",
                "size": "kilo",
                "hero": {
                  "type": "image",
                  "url": curry_pic[0],
                  "size": "full",
                  "aspectMode": "cover",
                  "aspectRatio": "20:13"
                },
                "body": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "text",
                      "text": shop_name[0],
                      "weight": "bold",
                      "size": "xl",
                      "wrap": true
                    },
                    {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
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
                            {
                              "type": "text",
                              "wrap": true,
                              "size": "sm",
                              "text": address[0],
                              "flex": 5,
                              "color": "#666666"
                            }
                          ]
                        },
                        {
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
                            {
                              "type": "text",
                              "text": opentime[0],
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
                "footer": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "button",
                      "action": {
                        "type": "uri",
                        "uri": curry_url[0],
                        "label": "WebSite"
                      },
                      "height": "sm",
                      "style": "link"
                    }
                  ],
                  "flex": 0,
                  "spacing": "sm"
                }
              },
              {
                "type": "bubble",
                "size": "kilo",
                "hero": {
                  "type": "image",
                  "url": curry_pic[1],
                  "size": "full",
                  "aspectMode": "cover",
                  "aspectRatio": "20:13"
                },
                "body": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "text",
                      "text": shop_name[1],
                      "weight": "bold",
                      "size": "xl",
                      "wrap": true
                    },
                    {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
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
                            {
                              "type": "text",
                              "wrap": true,
                              "size": "sm",
                              "text": address[1],
                              "flex": 5,
                              "color": "#666666"
                            }
                          ]
                        },
                        {
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
                            {
                              "type": "text",
                              "text": opentime[1],
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
                "footer": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "button",
                      "action": {
                        "type": "uri",
                        "uri": curry_url[1],
                        "label": "WebSite"
                      },
                      "height": "sm",
                      "style": "link"
                    }
                  ],
                  "flex": 0,
                  "spacing": "sm"
                }
              },
              {
                "type": "bubble",
                "size": "kilo",
                "hero": {
                  "type": "image",
                  "url": curry_pic[2],
                  "size": "full",
                  "aspectMode": "cover",
                  "aspectRatio": "20:13"
                },
                "body": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "text",
                      "text": shop_name[2],
                      "weight": "bold",
                      "size": "xl",
                      "wrap": true
                    },
                    {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
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
                            {
                              "type": "text",
                              "wrap": true,
                              "size": "sm",
                              "text": address[2],
                              "flex": 5,
                              "color": "#666666"
                            }
                          ]
                        },
                        {
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
                            {
                              "type": "text",
                              "text": opentime[2],
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
                "footer": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "button",
                      "action": {
                        "type": "uri",
                        "uri": curry_url[2],
                        "label": "WebSite"
                      },
                      "height": "sm",
                      "style": "link"
                    }
                  ],
                  "flex": 0,
                  "spacing": "sm"
                }
              }
            ]
      }
    }