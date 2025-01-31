import { api } from './client';
export const getAllProducts = async () => {
    const response = await api.get('/products');
    return await response.data;
};
export const createProduct = async (data: FormData) => {
    const response = await api.post('/products', data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};
export const updateProduct = async(data:FormData, id: string)=>{
    const response = await api.put(`/products/${id}`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
}
export const getProductById = async (id: string) => {
    const response = await api.get(`/products/${id}`);
    return await response.data;
};

export const getAllCategories = async () => {
    const response = await api.get('/categories');
    return await response.data;
};
export const createCategory = async (data: FormData) => {
    const response = await api.post('/categories', data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};