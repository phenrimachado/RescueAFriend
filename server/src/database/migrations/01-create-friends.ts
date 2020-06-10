import Knex from 'knex';

export async function up(knex: Knex) {
  return knex.schema.createTable('friends', table => {
    table.increments('id').primary();
    table.string('image').notNullable();
    table.string('species').notNullable();
  })
}

export async function down(knex: Knex) {
  return knex.schema.dropTable('friends');
}