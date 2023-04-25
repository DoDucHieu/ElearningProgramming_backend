import Stripe from "stripe";
import { Request, Response } from "express";
import env from "dotenv";
env.config();

const stripe = new Stripe(process.env.SECRET_KEY_STRIPE, {
  apiVersion: "2022-11-15",
});

const formatLineItem = (data: any) => {
  const arr = data.map((item: any) => {
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item?.productName,
          images: [item?.imgUrl],
        },
        unit_amount: item?.price,
      },
      quantity: item?.quantity,
    };
  });
  return arr;
};

const checkOut = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const session = await stripe.checkout.sessions.create({
      line_items: formatLineItem(data.listProduct),
      mode: "payment",
      success_url: `http://localhost:3000/payment-success/${data?.orderId}`,
      cancel_url: `http://localhost:3000/payment-cancel/${data?.orderId}`,
    });

    return res.status(200).json({
      errCode: 0,
      errMessage: "success",
      data: session,
    });
  } catch (error) {
    return res.status(500).json({
      errCode: 1,
      errMessage: "failed",
    });
  }
};

const paymentController = {
  checkOut,
};

export default paymentController;
