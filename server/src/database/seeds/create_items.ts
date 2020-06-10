import Knex from 'knex';

export async function seed(knex: Knex) {
  await knex('friends').insert([
    { species: 'Gato', image: 'cat.svg' },
    { species: 'Cachorro', image: 'dog.svg' },
    { species: 'Pássaro', image: 'bird.svg' },
    { species: 'Peixe', image: 'fish.svg' },
    { species: 'Coelho', image: 'rabbit.svg' },
    { species: 'Hamster', image: 'rat.svg' }
  ]);
}