const db=require('../utils/db');
module.exports={
    allProduct: type => db.load(`SELECT * FROM product WHERE ID_category=${type}`),
    detailProduct:id=>db.load(`select * from product where ID=${id}`),
    categogy:_=> db.addload(`select * from category`)
};