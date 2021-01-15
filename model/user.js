const db=require('../utils/db');
module.exports={
    loadUserbyUsername:user => db.load(`select * from user where Username='${user}'`),
    loadUserbyID:id => db.load(`select * from user where ID=${id}`),
    adduser: entity => db.add('user', entity),
    patch: entity => {
        const condition = { ID: entity.ID };
        delete entity.ID;
        return db.patch('user', entity, condition);
      },
};