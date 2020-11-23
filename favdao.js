const Airtable = require('airtable-node');

const getWorks = () => {
    const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
    const APP_ID = process.env.APP_ID;
    console.log(AIRTABLE_API_KEY)
    console.log(APP_ID)
    const worksTable = new Airtable({ apiKey: AIRTABLE_API_KEY })
      .base(APP_ID)
      .table('FavTable1')
    return worksTable.list()
}

exports.Test = getWorks;