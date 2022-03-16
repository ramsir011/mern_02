import nc from 'next-connect';
import Order from '../../../../models/Order';

import {onError} from '../../../../utils/error';
import { isAuth } from '../../../../utils/auth';
import db from '../../../../utils/mongo';

const handler = nc({
  onError,
});
handler.use(isAuth);
handler.put(async (req, res) => {
  await db.Connect();
  const order = await Order.findById(req.query.id);
  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const deliveredOrder = await order.save();

    res.send({ message: 'order delivered', order: deliveredOrder });
  } else {

    res.status(404).send({ message: 'order not found' });
  }
});


