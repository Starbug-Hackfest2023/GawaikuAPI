const validate = require('validate.js');
const config = require('../config');
const MongoDb = require('../helpers/databases/mongodb/db');
const mongoDb = new MongoDb(config.get('/mongoDbUrl'));
const wrapper = require('../helpers/utils/wrapper');
const { NotFoundError, BadRequestError, ConflictError } = require('../helpers/error');
const { ObjectId } = require('mongodb');
const { STATUS } = require('../config/const/orderStatus');
const { viewUser } = require('./authService');
const { viewShop } = require('./shopServices');

module.exports.userOrder = async (orderData, userData, usernameToko) => {
    try {
        const pemesan = await viewUser(userData.id);
        const toko = await viewShop(usernameToko);

        if (pemesan.err || toko.err) {
            throw new NotFoundError('Data not Found');
        }

        orderData.pemesan.namaPemesan = pemesan.fullname;
        orderData.pemesan.noTelp = pemesan.phoneNumber;
        orderData.pemesan.alamat = pemesan.address;
        orderData.toko.namaToko = toko.data.shopName;
        orderData.toko.alamatToko = toko.data.address;
        orderData.toko.telpToko = toko.data.phone_number;
        mongoDb.setCollection('order');

        // diperlukan jika dibutuhkan untuk pembatasan 1 service dalam 1 waktu
        // const prevOrder = await mongoDb.findOne({ 
        //     pemesan : orderData.pemesan,
        //     toko : orderData.toko,
        // })

        // if ( prevOrder.data.status != STATUS.SELESAI || prevOrder.data.status != STATUS.PEMBATALAN) {
        //     throw new ConflictError('Sedang ada pesanan berjalan');
        // }

        // validasi speciality dari toko dengan pesanan
        if (!toko.data.speciality.includes(orderData.barang)) {
            throw new ConflictError('Barang tidak sesuai dengan spesialisasi toko');
        }

        const recordSet = await mongoDb.insertOne(orderData);

        return recordSet;
    } catch (error) {
        throw new BadRequestError(error.message);
    }
}