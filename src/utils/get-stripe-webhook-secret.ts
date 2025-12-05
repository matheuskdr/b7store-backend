export const getStripeWebhookScret = () => {
    return process.env.STRIPE_WEBHOOK_SECRET || "";
};
