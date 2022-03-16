import {  Button, Card,  Grid, Link, List, ListItem, Rating, Typography ,Box} from '@mui/material';
import classes from '../../utils/classes';
import React, { useContext } from 'react'
import Layout from '../../components/Layout'
import NextLink from 'next/link'
import Image from 'next/image'
import Product from '../../models/Product';
import db from '../../utils/mongo';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Store } from '../../utils/Store';

export default function ProductScreen({ product }) {

  const {dispatch} = useContext(Store);
const router = useRouter()

  const addToCartHandler = async () => {
  
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock<=0) {
      window.alert("sorry no product")
    }
 
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity:1 } });
     router.push('/cart');
  };

  return (
    <Layout >
 
 
      <Box>
        <Box sx={classes.section}>
          <NextLink href="/" passHref>
            <Link>
              <Typography>back to result</Typography>
            </Link>
          </NextLink>
        </Box>
        <Grid container spacing={1}>
          <Grid item md={6} xs={12}>
            <Image
              src={product.image}
              alt={product.name}
              layout="responsive"
              width={640}
              height={640}
            />
          </Grid>
          <Grid item md={3} xs={12}>
            <List>
              <ListItem>
                <Typography component="h1" variant="h1">
                  {product.name}
                </Typography>
              </ListItem>
              <ListItem>Category: {product.category}</ListItem>
              <ListItem>Brand: {product.brand}</ListItem>
              <ListItem>
                <Rating value={product.rating} readOnly></Rating>
                <Typography sx={classes.smallText}>
                  ({product.numReviews} reviews)
                </Typography>
              </ListItem>
              <ListItem>
                <Typography>Description: {product.description}</Typography>
              </ListItem>
            </List>
          </Grid>
          <Grid item md={3} xs={12}>
            <Card>
              <List>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>Price</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography>${product.price}</Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>Status</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography>
                        {product.countInStock > 0
                          ? 'In stock'
                          : 'Unavailable'}
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Button
                     onClick={addToCartHandler}
                    fullWidth
                    variant="contained"
                  >
                    Add to cart
                  </Button>
                </ListItem>
              </List>
            </Card>
          </Grid>
        </Grid>
      </Box>

  </Layout>
);
}


export async function getServerSideProps({ params }) {
  const { slug } = params;

  await db.Connect();
  const product = await Product.findOne({slug}).lean();

  return {
    props: {
      product: db.convertDocToObj(product),
    },
  };
}
