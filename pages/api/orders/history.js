import nc from 'next-connect';
import Order from '../../../models/Order';
import { isAuth } from '../../../utils/auth';

import { onError } from '../../../utils/error';
import db from '../../../utils/mongo';

const handler = nc({
  onError,
});
handler.use(isAuth);

handler.get(async (req, res) => {
  await db.Connect();
  const orders = await Order.find({ user: req.user._id });
  res.send(orders);
});

export default handler;