const ShortUniqueId = require("short-unique-id");
const uid = new ShortUniqueId({ length: 10 });

exports.randomId = () => uid.rnd();

module.exports.USERTYPEADMIN = 'Super Admin';
module.exports.ADMINID = "3098339928"