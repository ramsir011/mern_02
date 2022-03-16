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
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      email_address: req.body.email_address,
    };
    const paidOrder = await order.save();

    res.send({ message: 'order paid', order: paidOrder });
  } else {
    res.status(404).send({ message: 'order not found' });
  }
});

export default handler;
