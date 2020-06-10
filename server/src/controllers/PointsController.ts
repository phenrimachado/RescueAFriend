import { Request, Response } from 'express';
import knex from '../database/connection';
import ipConnection from '../config/ipconnection';

class PointsController {
  async index(request: Request, response: Response) {
    console.log("## Sending all points to frontend ##\n");

    const { city, uf, friends } = request.query;
    
    const parsedFriends = String(friends)
    .split(',')
    .map(friend => Number(friend.trim()));
    
    console.log(parsedFriends);
    const points = await knex('points')
      .join('point_friends', 'points.id', '=', 'point_friends.point_id')
      .whereIn('point_friends.friend_id', parsedFriends)
      .where('city', String(city))
      .where('uf', String(uf))
      .distinct()
      .select('points.*');

    const serializedPoints = points.map(point => {
      return {
        ...point,
        image_url: `http://${ipConnection}/uploads/${point.image}`
      }
    });  
    return response.json(serializedPoints);
  }

  async show(request: Request, response: Response) {
    console.log("## Sending speficic point to frontend ##\n");

    const { id } = request.params;
    const point = await knex('points')
    .where('id', id)
    .first();

    console.log(point);

    if(!point) {
      return response.status(400).json({ message: 'Point not found.' });
    }

    const serializedPoint = {
        ...point,
        image_url: `http://${ipConnection}:3333/uploads/${point.image}`
    }

    const friends = await knex('friends')
    .join('point_friends', 'friends.id', '=', 'point_friends.friend_id')
    .where('point_friends.point_id', id)
    .select('friends.species');

    return response.json({
      point: serializedPoint,
      friends
    });
  }

  async create(request: Request, response: Response) {
    console.log("## Received a new point to save ##\n");
    const {
      name,
      email,
      age,
      description,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      friends
    } = request.body;

    const point = {
      name,
      email,
      age,
      description,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      friends
    };
  
    const trx = await knex.transaction();
  
    const insertedIds = await trx('points').insert({
      image: request.file.filename,
      name,
      age,
      description,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf
    });
  
    console.log(insertedIds[0]);

    const point_id = insertedIds[0];
  
    const pointFriends = friends
      .split(',')
      .map((friend: string) => Number(friend.trim()))
      .map((friend_id: number) => {
        return {
          friend_id,
          point_id
        };
      });
  
    await trx('point_friends').insert(pointFriends);

    await trx.commit();
    
    return response.json({ 
      id: point_id,
      ...point
     });
  }
}

export default PointsController;