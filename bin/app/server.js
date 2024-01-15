const cors = require('cors');
const wrapper = require('../helpers/utils/wrapper');
const bodyParser = require('body-parser');
const mongoConnectionPooling = require('../helpers/databases/mongodb/connection');
const express = require('express');
const authRoutes = require('../routers/authRoutes');
const shopRoutes = require('../routers/shopRoutes');

function AppServer() {
    this.server = express();

    this.server.use(bodyParser.json());
    this.server.use(bodyParser.urlencoded({ extended: false }));

    this.server.use(cors());

    this.server.get('/', (req, res) => {
        wrapper.response(res, 'success', wrapper.data('Gawaiku API'), 'This services is running properly.');
    });

    //Routing
    this.server.use('/auth', authRoutes);
    this.server.use('/shop', shopRoutes);

    // exception handling
    this.server.use((error, req, res, next) => {
        res.status(error.status || 500).json({
            error: {
                message: error.message
            }
        });
    });

    mongoConnectionPooling.init();
}

module.exports = AppServer;