import sha1 from 'sha1';
import { v4 as uuidv4 } from 'uuid';
import DBClient from '../utils/db';
import RedisClient from '../utils/redis';

class AuthController {
  static async getConnect(req, res) {
    const authorization = req.header('Authorization') || '';
    if (!authorization) return res.status(401).send({ error: 'Unauthorized' });

    const decodCreds = Buffer.from(authorization.replace('Basic ', ''), 'base64');
    const creds = {
      email: decodCreds.toString('utf-8').split(':')[0],
      password: decodCreds.toString('utf-8').split(':')[1],
    };

    if (!creds.email || !creds.password) return res.status(401).send({ error: 'Unauthorized' });

    creds.password = sha1(creds.password);

    const previousUser = await DBClient.db
      .collection('users')
      .findOne(creds);
    if (!previousUser) return res.status(401).send({ error: 'Unauthorized' });

    const token = uuidv4();
    const key = `auth_${token}`;
    await RedisClient.set(key, previousUser._id.toString(), 86400);

    return res.status(200).send({ token });
  }

  static async getDisconnect(req, res) {
    const token = req.header('X-Token') || '';
    if (!token) return res.status(401).send({ error: 'Unauthorized' });

    const tokenId = await RedisClient.get(`auth_${token}`);
    if (!tokenId) return res.status(401).send({ error: 'Unauthorized' });

    await RedisClient.del(`auth_${token}`);
    return res.status(204).send();
  }
}

export default AuthController;
