const opencage = require('opencage-api-client');
const place=null;
const place1=null;

opencage
  .geocode({ q: 'Edayarpalayam,Coimbatore' })
  .then((data) => {
    // console.log(JSON.stringify(data));
    if (data.results.length > 0) {
      const place = data.results[0];
      //console.log(place.formatted);
      console.log(place.geometry.lat);
      console.log(place.geometry.lng);
      //console.log(place.annotations.timezone.name);
    } else {
      console.log('Status', data.status.message);
      console.log('total_results', data.total_results);
    }
  })
  .catch((error) => {
    // console.log(JSON.stringify(error));
    console.log('Error', error.message);
    // other possible response codes:
    // https://opencagedata.com/api#codes
    if (error.status.code === 402) {
      console.log('hit free trial daily limit');
      console.log('become a customer: https://opencagedata.com/pricing');
    }
  });
  