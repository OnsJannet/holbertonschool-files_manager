import sha1 from 'sha1';
import DBClient from '../utils/db';
import RedisClient from '../utils/redis';

const { ObjectId } = require('mongodb');

class UsersController {
  static async postNew(req, res) {
    const {
      email,
      password,
    } = req.body;
    if (!email) return res.status(400).send({ error: 'Missing email' });
    if (!password) return res.status(400).send({ error: 'Missing password' });

    const previousEmail = await DBClient.db
      .collection('users')
      .findOne({ email });
    if (previousEmail) return res.status(400).send({ error: 'Already exist' });

    const shaPassword = sha1(password);
    const result = await DBClient.db
      .collection('users')
      .insertOne({ email, password: shaPassword });

    return res
      .status(201)
      .send({ id: result.insertedId, email });
  }

  static async getMe(req, res) {
    const userToken = req.header('X-Token') || null;
    if (!userToken) return res.status(401).send({ error: 'Unauthorized' });

    const tokenID = await RedisClient.get(`auth_${userToken}`);
    if (!tokenID) return res.status(401).send({ error: 'Unauthorized' });

    const user = await DBClient.users.findOne({ _id: ObjectId(tokenID) });

    if (!user) return res.status(401).send({ error: 'Unauthorized' });
    delete user.password;

    return res.status(200).send({ id: user._id, email: user.email });
  }
}

export default UsersController;
