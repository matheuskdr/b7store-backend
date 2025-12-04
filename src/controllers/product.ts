import { RequestHandler } from "express";
import { getProductSchema } from "../schemas/get-product-schema";
import {
    getAllProducts,
    getProduct,
    incrementProductView,
} from "../services/product";
import { getAbsoluteImageUrl } from "../utils/get-absolute-image-urll";
import { error } from "node:console";
import { getOneProductSchema } from "../schemas/get-one-produc-schema";
import { getCategory } from "../services/category";

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

export const getOneProduct: RequestHandler = async (req, res) => {
    const paramsResult = getOneProductSchema.safeParse(req.params);
    if (!paramsResult.success) {
        res.status(400).json({ error: "Parâmetros inválidos" });
        return;
    }
    const { id } = paramsResult.data;

    const product = await getProduct(parseInt(id));
    if (!product) {
        res.json({ error: "Produto não encontrado" });
        return;
    }

    const productsWithAbsoluteImages = {
        ...product,
        images: product.images.map((img) => getAbsoluteImageUrl(img)),
    };

    const category = await getCategory(product.categoryId);

    await incrementProductView(product.id);

    res.json({ error: null, product: productsWithAbsoluteImages, category });
};
