const Airtable = require('airtable-node');
var Airttable = require('airtable');
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const APP_ID = process.env.APP_ID;

//お気に入り一覧を表示
const getFav = () => {
  return new Promise((resolve, reject) => {
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

//レコードをインサート
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

//todo 削除メソッド
const Deleterecord = (recordid) =>{

  const base = new Airtable({apiKey: AIRTABLE_API_KEY}).base(APP_ID);

  base('FavTable1').destroy([recordid], function(err, deletedRecords) {
  if (err) {
    console.error(err);
    return;
  }
  console.log('Deleted', deletedRecords.length, 'records');
});

}

exports.GetFavCurry = getFav;
exports.InsertRecord = InsertRecord;
exports.Deleterecord = Deleterecord;