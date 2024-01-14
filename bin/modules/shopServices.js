const validate = require('validate.js');
const config = require('../config');
const MongoDb = require('../helpers/databases/mongodb/db');
const mongoDb = new MongoDb(config.get('/mongoDbUrl'));
const wrapper = require('../helpers/utils/wrapper');
const { NotFoundError, ConflictError, BadRequestError } = require('../helpers/error');
const { ObjectId } = require('mongodb');

module.exports.shopList = async (_filter, page, row) => {
    try {
        mongoDb.setCollection('shop');
        
        const result = mongoDb.findAllData('', row, page, {speciality : _filter});
        if (validate.isEmpty(result)){
            throw new NotFoundError('No list of shop in database');
        }
        return result;
    } catch (error) {
        throw new BadRequestError(error.message);
    }
}