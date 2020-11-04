const db=require('../utils/db');
module.exports={
    loadWell: id => db.load(`select * from task where  IDboard =${id} and Type=1`),
    loadImprove:id=>db.load(`select * from task where  IDboard =${id} and Type=2`),
    loadAction:id=>db.load(`select * from task where  IDboard =${id} and Type=3`),
    add: entity => db.add('task', entity),
    del: id => db.del('task', { ID: id }),
    loadtask:idtask=>db.load(`select * from task where ID=${idtask}`),
    patch: entity => {
        const condition = { ID: entity.ID };
        delete entity.ID;
        return db.patch('task', entity, condition);
      },
}