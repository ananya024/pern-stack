import {create} from "zustand";
import axios from "axios";
import {toast} from "react-hot-toast";


// eg: my-postgress-store.com
// const BASE_URL = "http://localhost:3000";
// base url wil be dynamic depending on environment (development or production)
const BASE_URL = import.meta.env.MODE ==="development" ? "http://localhost:3000" : ""

export const useProductStore = create((set, get) => ({
    // product starte
    products:[],
    loading:false,
    error: null,
    currentProduct:null,

    // form state
    formData:{
        name: "",
        price: "",
        image: "",
    },

    setFormData: (formData) => set({formData}),
    resetForm: () => set({formData: {name: "", price: "", image: ""}}),

    fetchProducts: async () => {
        set({loading: true});
        try 
        {
            const response = await axios.get(`${BASE_URL}/api/products`);
            set({products: response.data.data, error: null});
        }
        catch (error)
        {    
            console.log("Error fetching products:", error);
            if (error.status === 429) 
                set({error: "Too many requests", products: []});
            else 
                set({error: "An error occurred while fetching products", products: []});
        }
        finally
        {
            set({loading: false});
        }
    },

    fetchProduct: async (id) => {
        set({loading: true});
        try {
            const response = await axios.get(`${BASE_URL}/api/products/${id}`);
            set({currentProduct: response.data.data,
                formData: response.data.data, 
                error: null});
        } catch (error) {
            console.log("Error fetching product:", error);
            set({error: "An error occurred while fetching the product", currentProduct: null});
        } finally {
            set({loading: false});
        }
    },

    addProduct: async (e) => {
        e.preventDefault();
        set({loading: true});
        try {
            const {formData}= get();
            await axios.post(`${BASE_URL}/api/products`, formData);
            toast.success("Product added successfully");
            await get().fetchProducts();
            get().resetForm();
            
            // close modal x
            document.getElementById("add_product_modal").close();
        }
        catch (error) {
            console.log("Error adding product:", error);
            toast.error("Failed to add product. Please try again.");
        }
        finally {set({loading: false});}
    },

    deleteProduct: async (id) => {
        console.log("Deleting product with id:", id);
        set({loading: true});
        try {
            await axios.delete(`${BASE_URL}/api/products/${id}`);
            set(prev => ({products: prev.products.filter(product => product.id!==id)}));
            toast.success("Product deleted successfully");
            // After deletion, fetch the updated list of products
            get().fetchProducts();
        } catch (error) {
            console.log("Error deleting product:", error);
            toast.error("Failed to delete product. Please try again.");
        }
    },

    updateProduct: async (id, updatedData) => {
        set({loading: true});
        try {
            const {formData} = get();
            const response = await axios.put(`${BASE_URL}/api/products/${id}`, updatedData);
            toast.success("Product updated successfully");
            get().fetchProducts();
        } catch (error) {
            console.log("Error updating product:", error);
            toast.error("Failed to update product. Please try again.");
        } finally {
            set({loading: false});
        }
    }
}));
