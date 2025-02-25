const fetch = require('node-fetch');
const db = require('../models/bikeTrailsModels');

const moreInfoController = {};

moreInfoController.getMoreInfo = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { 
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': process.env.VITE_TRAILAPI_KEY,
        'X-RapidAPI-Host': process.env.VITE_TRAILAPI_HOST
      }
    };
    
    console.log("url: ", `https://trailapi-trailapi.p.rapidapi.com/trails/${id}`);
    const result = await fetch(`https://trailapi-trailapi.p.rapidapi.com/trails/${id}`, options);
    let resultJSON = await result.json();
    delete resultJSON['results']
    const getSQL = `
      SELECT r.*, a.name  
        FROM reviews r 
        LEFT JOIN accounts a
        ON r.user_id = a.user_id
        WHERE trail_id = $1
        `
    const params = [id]
    const getResp = await db.query(getSQL, params);
    resultJSON['data'] = resultJSON['data'].map(elem => {
      return {
      'id' : elem['id'],
      'name': elem['name'],
      'url': elem['url'],
      'length': elem['length'],
      'description': (elem['description']).replace(/<\/?[^>]+(>|$)/g, "").replace(/\n/g, '').replace(/\r/g, ''),
      'city': elem['city'],
      'state': elem['region'],
      'difficulty': elem['difficulty'],
      'thumbnail': elem['thumbnail'],
      'features': elem['features'],
      'trailEstimate': elem['length'] ? ((Number(elem['length'])/10)*60).toString() : '',
      'googleMapsURL': `https://www.google.com/maps/dir//${elem['lat']},${elem['lon']}`,
      'lat': elem['lat'],
      'lon': elem['lon'],
      'data': !getResp ? [] : getResp.rows.map(elem => {
        return {
          'name': elem['name'],
          'user_id': elem['user_id'],
          'review': elem['review'],
          'stars': elem['stars'],
          'date': elem['date'],
          'review_id': elem['review_id']
        }
      }),
      'averageStars': Math.round((getResp.rows.reduce((acc, curr) => {
        return acc + curr.stars;
      }, 0))*10/ getResp.rows.length)/10,
      'numberOfReviews': getResp.rows.length
      }
    });
    res.locals.moreInfo = resultJSON;
    return next();
  } catch(err) {
    console.log(err);
    return next({log: 'error at getMoreInfo middleware', message: 'fetch request to trail info API failed'})
  }
}

moreInfoController.getUserPhotos = async (req, res, next) => {
  const id = req.params.id;
  const getPhotoQuery = 'SELECT p.*, a.name FROM photos p LEFT JOIN accounts a ON p.user_id = a.user_id WHERE trail_id = $1'
  const params = [id];
  const userPhotoData = await db.query(getPhotoQuery, params);
  res.locals.moreInfo.data[0].photos = userPhotoData.rows
  for (let i = 0; i < res.locals.moreInfo.data[0].data.length; i++) {
    res.locals.moreInfo.data[0].data[i].photos = []
    for (let j = 0; j < userPhotoData.rows.length; j++) {
      if (res.locals.moreInfo.data[0].data[i].review_id === userPhotoData.rows[j].review_id) {
        res.locals.moreInfo.data[0].data[i].photos.push(userPhotoData.rows[j])
      }
    }
  }
  return next()
}

module.exports = moreInfoController;