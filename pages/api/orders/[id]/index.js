import nc from 'next-connect';
import Order from '../../../../models/Order';

import { isAuth } from '../../../../utils/auth';
import db from '../../../../utils/mongo';

const handler = nc();
handler.use(isAuth);
handler.get(async (req, res) => {
  await db.Connect();
  const order = await Order.findById(req.query.id);

  res.send(order);
});

export default handler;