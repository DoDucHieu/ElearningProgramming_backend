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
          name: item?.name,
          images: [item?.img_url],
        },
        unit_amount: item?.price,
      },
      quantity: 1,
    };
  });
  return arr;
};

const checkOut = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    console.log("data:", data);

    const session = await stripe.checkout.sessions.create({
      line_items: formatLineItem(data.list_course),
      mode: "payment",
      success_url: `http://localhost:3000/payment-success/${data?.order_id}`,
      cancel_url: `http://localhost:3000/payment-cancel/${data?.order_id}`,
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
