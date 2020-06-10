import knex from '../database/connection';
import { Request, Response } from 'express';
import ipConnection from '../config/ipconnection';

class FriendsController {
  async index(request: Request, response: Response) {
    console.log("## Sending species images to frontend ##\n");
    const friends = await knex('friends').select('*');
  
    const serializedFriends = friends.map(friend => {
      return {
        id: friend.id,
        species: friend.species,
        image_url: `http://${ipConnection}/uploads/${friend.image}`
      }
    });
  
    return response.json(serializedFriends);
  }
}

export default FriendsController;