import {
    createStripeCheckoutSeesion,
    getStripeCheckoutSession,
} from "../libs/stripe";
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

export const getOrderIdFromSession = async (sessionId: string) => {
    try {
        const session = await getStripeCheckoutSession(sessionId);
        const orderId = session.metadata?.orderId;

        if (!orderId) return null;

        return parseInt(orderId);
    } catch {
        return null;
    }
};
