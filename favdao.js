const Airtable = require('airtable-node');
var Airttable = require('airtable');
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

const InsertRecord = (userid,shopid) =>{
  const base = new Airttable({apiKey:AIRTABLE_API_KEY }).base(APP_ID);

base('FavTable1').create([
  {
    "fields": {
      "UserId": userid,
      "ShopId": shopid
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