/** @format */

import nextConnect from 'next-connect';
import db from '../../utils/mongo'
import User from '../../models/User'
import data from '../../utils/data';
import Product from  '../../models/Product'

const handler = nextConnect();

handler.get(async (req, res) => {
  db.Connect();
  await User.deleteMany()
  await User.insertMany(data.users);
  await Product.deleteMany()
  await Product.insertMany(data.products)
  res.send({message: 'Successful'});
});

export default handler;
