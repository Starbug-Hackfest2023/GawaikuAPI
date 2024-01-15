const wrapper = require('../helpers/utils/wrapper');
const shopService = require('./shopServices');

module.exports.shopList = async (req, res) => {
    let _filter = req.query.filter? req.query.filter : '';
    let page = req.query.page? req.query.page : 1;
    let row = req.query.row? req.query.row : 12;

    shopService.shopList(_filter, page, row)
        .then(resp => {
            console.log('Shop list has been showed');
            wrapper.response(res, 'success', resp, 'Shop list has been showed', 201);
        })
        .catch(err => {
            console.log('Error while showing shop list', err);
            wrapper.response(res, 'fail', wrapper.error(err), `Error while showing shop list. Error: ${err}`, 401, 401);
        });
}