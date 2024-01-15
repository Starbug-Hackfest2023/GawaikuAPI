const validate = require('validate.js');
const config = require('../config');
const MongoDb = require('../helpers/databases/mongodb/db');
const mongoDb = new MongoDb(config.get('/mongoDbUrl'));
const wrapper = require('../helpers/utils/wrapper');
const { NotFoundError, BadRequestError } = require('../helpers/error');
const { ObjectId } = require('mongodb');

module.exports.shopList = async (_filter, page, row) => {
    try {
        mongoDb.setCollection('shop');
        
        const result = await mongoDb.findAllData('speciality', row, page, {speciality : _filter});
        if (validate.isEmpty(result.data)){
            throw new NotFoundError(result.err);
        }
        result.data.forEach(shop => {
            shop.password = "****"
        })
        return result;
    } catch (error) {
        throw new BadRequestError(error.message);
    }
}

module.exports.viewShop = async (username) => {
    try {
        mongoDb.setCollection('shop');

        const result = await mongoDb.findOne({ username : username });
        if (validate.isEmpty(result.data)) {
            throw new NotFoundError('Data not found');
        }

        result.data = {...result.data, password : "***"};
        return result;
    } catch (error) {
        throw new BadRequestError(error.message);
    }
}