const wrapper = require('../../utils/wrapper');
const pool = require('./connection');
const validate = require('validate.js');

class Redis {

    constructor(config) {
        this.config = config.connection;
        this.index = config.index;
    }

    async selectDb(index) {
        let client = await pool.getConnection(this.config);
        if (validate.isEmpty(client)) {
            client = await pool.createConnectionPool(this.config);
        }
        const clientRedis = client[0].client;
        clientRedis.on('error', (err) => {
            return wrapper.error(err, 'Failed to select db on Redis');
        });

        clientRedis.select(index, async (err) => {
            if (err) {
                console.log( `change db to ${index}, : ${err}`);
                return wrapper.error(err, 'Failed to select db on Redis');
            }
        });
    }

    async setData(key, value) {
        let client = await pool.getConnection(this.config);
        if (validate.isEmpty(client)) {
            client = await pool.createConnectionPool(this.config);
        }
        const convertToString = JSON.stringify({
            data: value
        });
        const clientRedis = client[0].client;
        clientRedis.on('error', (err) => {
            return wrapper.error(err, 'Failed to set data on Redis');
        });
        clientRedis.select(this.index, async (err) => {
            if (err) {
                console.log(`change db to ${this.index}, : ${err}`);
                return wrapper.error(err, 'Failed to select db on Redis');
            }
            clientRedis.set(key, convertToString);
        });
    }

    async setDataEx(key, value, duration) {
        let client = await pool.getConnection(this.config);
        if (validate.isEmpty(client)) {
            client = await pool.createConnectionPool(this.config);
        }
        const convertToString = JSON.stringify({
            data: value
        });
        const clientRedis = client[0].client;
        clientRedis.on('error', (err) => {
            return wrapper.error(err, 'Failed to set data on Redis');
        });

        clientRedis.select(this.index, async (err) => {
            if (err) {
                console.log(`change db to ${this.index}, : ${err}`);
                return wrapper.error(err, 'Failed to select db on Redis');
            }
            clientRedis.set(key, convertToString, 'EX', duration);
        });
    }

    async getData(key) {
        let client = await pool.getConnection(this.config);
        if (validate.isEmpty(client)) {
            client = await pool.createConnectionPool(this.config);
        }
        const clientRedis = client[0].client;

        clientRedis.on('error', (err) => {
            return wrapper.error(err, 'Failed Get data From Redis');
        });
        return new Promise(((resolve, reject) => {
            clientRedis.select(this.index, async (err) => {
                if (err) {
                    console.log(`change db to ${this.index}, : ${err}`);
                    return wrapper.error(err, 'Failed to select db on Redis');
                }
                clientRedis.get(key, (err, replies) => {
                    if (err) {
                        reject(wrapper.error(err, '', 404));
                    }
                    resolve(wrapper.data(replies));
                });
            });

        }));
    }

    async getAllKeys(key) {
        let client = await pool.getConnection(this.config);
        if (validate.isEmpty(client)) {
            client = await pool.createConnectionPool(this.config);
        }
        const clientRedis = client[0].client;

        clientRedis.on('error', (err) => {
            return wrapper.error(err, 'Failed Get data From Redis');
        });
        return new Promise(((resolve, reject) => {
            clientRedis.select(this.index, async (err) => {
                if (err) {
                    console.log(`change db to ${this.index}, : ${err}`);
                    return wrapper.error(err, 'Failed to select db on Redis');
                }
                clientRedis.keys(key, (err, replies) => {
                    if (err) {
                        reject(wrapper.error(err, '', 404));
                    }
                    resolve(wrapper.data(replies));
                });
            });
        }));
    }

    async deleteKey(key) {
        let client = await pool.getConnection(this.config);
        if (validate.isEmpty(client)) {
            client = await pool.createConnectionPool(this.config);
        }
        const clientRedis = client[0].client;

        clientRedis.on('error', (err) => {
            return wrapper.error(err, 'Failed Get data From Redis');
        });
        return new Promise(((resolve, reject) => {
            clientRedis.select(this.index, async (err) => {
                if (err) {
                    console.log(`change db to ${this.index}, : ${err}`);
                    return wrapper.error(err, 'Failed to select db on Redis');
                }
                clientRedis.del(key, (err, replies) => {
                    if (err) {
                        reject(wrapper.error(err, '', 404));
                    }
                    resolve(wrapper.data(replies));
                });
            });
        }));
    }

    async setZeroAttemp(key, duration) {
        let client = await pool.getConnection(this.config);
        if (validate.isEmpty(client)) {
            client = await pool.createConnectionPool(this.config);
        }
        const clientRedis = client[0].client;

        clientRedis.on('error', (err) => {
            return wrapper.error(err, 'Failed Get data From Redis');
        });
        return new Promise(((resolve, reject) => {
            clientRedis.set(key, 0, 'EX', duration, (err, replies) => {
                if (err) {
                    reject(wrapper.error(err, '', 404));
                }
                resolve(wrapper.data(replies));
            });
        }));
    }

    async incrAttempt(key) {
        let client = await pool.getConnection(this.config);
        if (validate.isEmpty(client)) {
            client = await pool.createConnectionPool(this.config);
        }
        const clientRedis = client[0].client;

        clientRedis.on('error', (err) => {
            return wrapper.error(err, 'Failed Get data From Redis');
        });
        return new Promise(((resolve, reject) => {
            clientRedis.incr(key, (err, replies) => {
                if (err) {
                    reject(wrapper.error(err, '', 404));
                }
                resolve(wrapper.data(replies));
            });
        }));
    }

    async setReminder(key, value, expire, action) {
        let client = await pool.getConnection(this.config);
        if (validate.isEmpty(client)) {
            client = await pool.createConnectionPool(this.config);
        }
        const clientRedis = client[0].client;

        clientRedis.on('error', (err) => {
            return wrapper.error(err, 'Failed Get data From Redis');
        });
        return new Promise(((resolve, reject) => {
            clientRedis
                .multi()
                .set(`${action}-${key}`, value)
                .expire(`${action}-${key}`, expire)
                .exec((error, reply) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(wrapper.data(reply));
                    }
                });
        }));
    }
}


module.exports = Redis;
