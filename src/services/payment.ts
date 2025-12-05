import { createStripeCheckoutSeesion } from "../libs/stripe";
import { CartItem } from "../types/cartItem";

type createPaymentLinkParams = {
    cart: CartItem[];
    shippingCost: number;
    orderId: number;
};

export const createPaymentLink = async ({
    cart,
    shippingCost,
    orderId,
}: createPaymentLinkParams) => {
    try {
        const session = await createStripeCheckoutSeesion({
            cart,
            shippingCost,
            orderId,
        });
        if (!session.url) return null;
        return session.url;
    } catch {
        return null;
    }
};
