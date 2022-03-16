/** @format */

import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from '@mui/material';

import React from 'react';

import NextLink from 'next/link';
import Layout from '../components/Layout';

// import db from '../utlis/mongo';

// import Product from '../models/productSchema';

import db from '../utils/mongo';
import Product from '../models/Product';

export default function Home({ products }) {

  return (
    <Layout>
      <Grid container spacing={2}>
        {products.map((product) => (
          <Grid item md={3} key={product.slug}>
            <Card>
              <NextLink href={`/product/${product.slug}`} passHref>
                <CardActionArea>
                  <CardMedia component="img" image={product.image} />

                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      price: $ {product.price}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </NextLink>
              <CardActions>
                <Button fullWidth variant="contained" color="primary">
                  Add to cart
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Layout>
  );
}

export async function getServerSideProps() {
  await db.Connect();
  const products = await Product.find({}).lean();

  return {
    props: {
      products: products.map(db.convertDocToObj),
    },
  };
}
