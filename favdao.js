const Airtable = require('airtable-node');
var Airtable = require('airtable');
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const APP_ID = process.env.APP_ID;


const getFav = () => {
  return new Promise((resolve, reject) => {
    console.log(AIRTABLE_API_KEY)
    console.log(APP_ID)
    const worksTable = new Airtable({ apiKey: AIRTABLE_API_KEY })
      .base(APP_ID)
      .table('FavTable1')
    
    return worksTable
      .list({
        view: 'Grid view' // 作成したAppで使用しているViewを指定
      })
      .then(response => {
        resolve(response)
      })
  })
}

const InsertRecord = () =>{
  var base = new Airtable({apiKey:AIRTABLE_API_KEY }).base(APP_ID);

base('FavTable1').create([
  {
    "id": "recTpUzIBx2Ty7",
    "fields": {
      "UserId": "1004",
      "CurryUrl": "Test2",
      "CurryPic": "Test1",
      "ShopName": "Tes3",
      "Address": "3",
      "OpenTime": "555"
    }
  }
], function(err, records) {
  if (err) {
    console.error(err);
    return;
  }
  records.forEach(function(record) {
    console.log(record.get('UserId'));
  });
});
}

exports.GetFavCurry = getFav;
exports.InsertRecord = InsertRecord;