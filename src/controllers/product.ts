import { RequestHandler } from "express";
import { getProductSchema } from "../schemas/get-product-schema";
import { getAllProducts } from "../services/product";
import { getAbsoluteImageUrl } from "../utils/get-absolute-image-urll";

export const getProducts: RequestHandler = async (req, res) => {
    const parseResult = getProductSchema.safeParse(req.query);
    if (!parseResult.success) {
        res.status(400).json({ error: "Parâmetros inválidos" });
        return;
    }
    const { metadata, orderBy, limit } = parseResult.data;

    const parsedLimit = limit ? parseInt(limit) : undefined;
    const parsedMetada = metadata ? JSON.parse(metadata) : undefined;

    const products = await getAllProducts({
        metadata: parsedMetada,
        order: orderBy,
        limit: parsedLimit,
    });

    const productsWithAbsoluteUrl = products.map((product) => ({
        ...product,
        image: product.image ? getAbsoluteImageUrl(product.image) : null,
        liked: false, // TODO
    }));

    res.json({ error: null, products: productsWithAbsoluteUrl });
};
