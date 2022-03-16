import nextConnect from "next-connect";
import Product from "../../../../models/Product";
import db from "../../../../utils/mongo";



const handler = nextConnect();

handler.get(async(req,res)=>{
    db.Connect();
  const product =  await Product.findById(req.query.id)
    res.send(product)
})

export default handler