import Airtable from 'airtable-node'


exports.Test = function(){

    const getWorks = () => {
        return new Promise((resolve, reject) => {
          const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
          const APP_ID = process.env.APP_ID;
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
      return getWorks;

}