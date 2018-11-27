
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', (tbl) => {
    tbl.increments();
    tbl.string('username').unique().notNullable();
    tbl.string('password').notNullable();
  });
};

exports.down = function(knex, Promise) {
  knex.schema.dropTableIfExists('users');
};
