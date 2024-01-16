const wrapper = require('../helpers/utils/wrapper');
const orderService = require('./orderService');
const moment = require('moment');
const { STATUS } = require('../config/const/orderStatus')
const { viewUser } = require('./authService');
const { viewShop } = require('./shopServices');

module.exports.userOrder = async (req, res) => {
    const userData = req.userData;
    let usernameToko = req.body.usernameToko;
    const orderData = {
        pemesan : {
            namaPemesan : '',
            noTelp : '',
            alamat : ''
        },
        toko : {
            namaToko : '',
            alamatToko : '',
            telpToko : '',
        },
        barang : req.body.barang,
        catatan : req.body.catatan? req.body.catatan : '',
        pembayaran : {
            metodePembayaran : null,
            subTotal : 0,
            pengiriman : 0,
            get total() {
                return this.subTotal + this.pengiriman;
            }
        },
        jenisPenjemputan : req.body.penjemputan? req.body.penjemputan : 'antar-jemput',
        status : STATUS.KONFIRMASI_TOKO,
        tanggalOrder : moment().local().format(),
        updatedAt : moment().local().format(),
    }

    orderService.userOrder(orderData, userData, usernameToko)
        .then(resp => {
            console.log('Order has been created');
            wrapper.response(res, 'success', resp, 'Order has been created', 200);
        })
        .catch(err => {
            console.log('Order cannot be created', err);
            wrapper.response(res, 'fail', wrapper.error(err), `Error while create order. Error: ${err}`, 404);
        });
}