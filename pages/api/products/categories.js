import nc from 'next-connect';
import Product from '../../../models/Product';
import db from '../../../utils/mongo';


const handler = nc();

handler.get(async (req, res) => {
await db.Connect()
  const categories = await Product.find().distinct('category');

  res.send(categories);
});

export default handler;