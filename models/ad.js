'use strict';

const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
    class Ad extends Model { }
    Ad.init({
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 20]
            }
        },
        desc: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: [0, 200]
            }
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {
                isFloat: { min: 0 }
            }
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                is: /^(|\d{2}-\d{7}|\d{3}-\d{7})$/
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                is: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
            }
        },
        approved: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    }, {
        sequelize,
        modelName: 'Ad',
    });
    return Ad;
};
