module.exports = function(sequelize, DataTypes) {
    let cart = sequelize.define('cart', {
        id: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        count: {
            type: DataTypes.INTEGER(11),
            defaultValue: 1
        },
        price: {
            type: DataTypes.INTEGER(11),
            defaultValue: 0
        }
    }, {
    })
    ;
    cart.associate = function (models) {
        cart.belongsTo(models.clothes);
        cart.belongsTo(models.users);
    };
    return cart
};
