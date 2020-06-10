import Knex from 'knex';

export async function up(knex: Knex) {
  return knex.schema.createTable('point_friends', table => {
    table.increments('id').primary();
    table.integer('point_id').notNullable().references('id').inTable('points');
    table.integer('friend_id').notNullable().references('id').inTable('friends');
  })
}

export async function down(knex: Knex) {
  return knex.schema.dropTable('point_friends');
}