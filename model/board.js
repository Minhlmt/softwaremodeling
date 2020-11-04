const db=require('../utils/db');
module.exports={
    single: id => db.load(`select * from board where  IDuser= ${id}`),
    add: entity => db.add('board', entity),
    del: id => db.del('board', { ID: id }),
    patch: entity => {
        const condition = { ID: entity.ID };
        delete entity.ID;
        return db.patch('board', entity, condition);
      },
};
