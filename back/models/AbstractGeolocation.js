const { Model, DataTypes } = require('sequelize');

class AbstractGeolocation extends Model {
  static geolocationAttributes() {
    return {
      address:      { type: DataTypes.STRING },
      postale_code: { type: DataTypes.INTEGER },
      city:         { type: DataTypes.STRING },
      country:      { type: DataTypes.STRING },
      number_phone: { type: DataTypes.STRING },
      email:        { type: DataTypes.STRING }
    };
  }
}

module.exports = AbstractGeolocation;
