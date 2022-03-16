import nc from 'next-connect';
import { isAuth } from '../../../utils/auth';

const handler = nc();
handler.use(isAuth);
handler.get(async (req, res) => {
  res.send('AaSivbq5jZVzbhiSomRoXXh8Plu6o_CwX4YGT4xSSlPFG6wyrZdwwY3HintwAptOAk00gsDvlCgqXAAG' || 'sb');
});

export default handler;