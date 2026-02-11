import {sql} from  "../config/db.js";

// CRUD operations for products
// Create, Read, Update, Delete


export const getProducts = async (req, res) => {
    try
    {
        const products = await sql `select * from products order by created_at desc`;
        console.log("fetched products", products);
        res.status(200).json({success: true, data: products});
    }
    catch (error)
    {
        console.error("Error fetching products:", error);
        res.status(500).json({success: false, message: "Failed to fetch products"});
    }
};


export const createProduct = async (req, res) => {
    
    const {name, price, image} = req.body;
    // app.use(express.json()); // to parse the json data from the request body
    // this line is server.js helps us do {name,orice,image}
    if (!name||!price||!image)
    {
        return res.status(400).json({success: false, message: "Please provide name, price and image"});
    }
    try 
    { 
        const newProduct = await sql `insert into products (name, price, image) values (${name}, ${price}, ${image}) returning *`;
        console.log("created product", newProduct);
        res.status(201).json({success: true, data: newProduct[0]});
        // 201 when resourse has been created successfully
    }
    catch(error)
    {
        console.error("Error creating product:", error);
        res.status(500).json({success: false, message: "Failed to create product"});
    }

};

export const getProduct = async (req, res) => {
    const {id}=req.params;
    try {
        const product= await sql`select * from products where id=${id}`;
        if (product.length === 0)
        {
            return res.status(404).json({success: false, message: "Product not found"});
        }
        res.status(200).json({success: true, data: product[0]});
    }
    catch(error)
    {
        console.error("Error fetching product:", error);
        res.status(500).json({success: false, message: "Failed to fetch product"});
    }
};

export const updateProduct = async (req, res) => {
    const {id}=req.params;
    const {name, price, image} = req.body;
    try 
    {
        const updatedProd= await sql`update products set name=${name}, price=${price}, image=${image} where id=${id} returning *`;
        if (updatedProd.length === 0)
        {
            return res.status(404).json({success: false, message: "Product not found"});
        }
        res.status(200).json({success: true, data: updatedProd[0]});
    }
    catch(error)
    {
        console.error("Error updating product:", error);
        res.status(500).json({success: false, message: "Failed to update product"});
    }
};
export const deleteProduct = async (req, res) => {
    const {id}=req.params;
    try 
    {
        const deletedProd= await sql`delete from products where id=${id} returning *`;
        if (deletedProd.length === 0)
        {
            return res.status(404).json({success: false, message: "Product not found"});
        }
        res.status(200).json({success: true, data: deletedProd[0]});
    }
    catch(error)
    {
        console.error("Error deleting product:", error);
        res.status(500).json({success: false, message: "Failed to delete product"});
    }
};
