import { RequestHandler } from "express";
import { getOrderBySessionIdSchema } from "../schemas/get-order-by-session-id";
import { getOrderIdFromSession } from "../services/payment";

export const getOrderBySessionId: RequestHandler = async (req, res) => {
    const result = getOrderBySessionIdSchema.safeParse(req.query);
    if (!result.success) {
        res.status(400).json({ error: "Session ID não enviado" });
        return;
    }
    const { session_id } = result.data;

    const orderId = await getOrderIdFromSession(session_id);
    if (!orderId) {
        res.status(400).json({ error: "Ocorreu um erro" });
        return;
    }

    res.json({ error: null, orderId });
};
