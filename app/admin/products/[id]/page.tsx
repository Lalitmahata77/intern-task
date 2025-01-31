"use client"
import  { useEffect } from 'react';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProductById, updateProduct } from '@/http/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { productSchema } from '@/lib/validators/productSchema';
import { Product } from '@/types';
// import { useParams } from 'next/navigation';
// import { error } from 'console';
import * as React from 'react'
type ProductFormValues = z.infer<typeof productSchema>;

// interface UpdateProductPageProps {
//     id: string;
// }

const UpdateProductPage = ({params}) => {
    const queryClient = useQueryClient();
    // const params = useParams();
    const { id } = React.use(params)
    
    // const id = params.id;
    const { data: product, isLoading } = useQuery<Product>({
        queryKey: ['product', id],
        queryFn: () => getProductById(id as string),
    });
   

    // Form setup
    const {
        register,
        handleSubmit,
        // setValue,
        reset,
        formState: { errors },
    } = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema)
    });

    // Prefill form with product data
    useEffect(() => {
        if (product) {
            reset({
                name: product.name,
                description: product.description || '',
                availabel_stock: product.availabel_stock, // Fixed typo
                initial_stock: product.initial_stock,
                categoryId: product.categoryId,
            });
        }
    }, [product, reset]);

    // Update mutation
    const { mutate, isLoading: isUpdating } = useMutation({
        mutationKey: ['update-product', id],
        mutationFn: (data: FormData) => updateProduct(id, data), // Fixed parameter order
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            alert('Product updated successfully!');
        },
        onError: () => {
            alert('Failed to update product. Please try again.');
        },
    });

    const onSubmit = (values: ProductFormValues) => {
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('description', values.description || '');
        formData.append('available_stock', String(values.availabel_stock)); // Fixed typo
        formData.append('initial_stock', String(values.initial_stock));
        formData.append('categoryId', String(values.categoryId));
        
        // Only append image if it exists
        if (values.image) {
            formData.append('image', (values.image as FileList)[0]);
        }

        mutate(formData);
    };

    if (isLoading) return <div>Loading...</div>;
    // if (error) return <div>Error loading product details.</div>;

    return (
        <Sheet>
            <SheetContent className="min-w-[28rem] space-y-4">
                <SheetHeader>
                    <SheetTitle>Update Product</SheetTitle>
                    <SheetDescription>Edit the details of this product</SheetDescription>
                </SheetHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Name Field */}
                    <div>
                        <label htmlFor="name">Name</label>
                        <Input
                            id="name"
                            {...register('name')}
                            placeholder="Enter product name"
                        />
                        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
                    </div>

                    {/* Description Field */}
                    <div>
                        <label htmlFor="description">Description</label>
                        <Textarea
                            id="description"
                            {...register('description')}
                            placeholder="Enter product description"
                        />
                        {errors.description && (
                            <p className="text-red-500">{errors.description.message}</p>
                        )}
                    </div>

                    {/* Available Stock Field */}
                    <div>
                        <label htmlFor="available_stock">Available Stock</label>
                        <Input
                            id="available_stock"
                            type="number"
                            {...register('availabel_stock', { valueAsNumber: true })} // Fixed typo
                            placeholder="Enter available stock"
                        />
                        {errors.availabel_stock && (
                            <p className="text-red-500">{errors.availabel_stock.message}</p>
                        )}
                    </div>

                    {/* Initial Stock Field */}
                    <div>
                        <label htmlFor="initial_stock">Initial Stock</label>
                        <Input
                            id="initial_stock"
                            type="number"
                            {...register('initial_stock', { valueAsNumber: true })}
                            placeholder="Enter initial stock"
                        />
                        {errors.initial_stock && (
                            <p className="text-red-500">{errors.initial_stock.message}</p>
                        )}
                    </div>

                    {/* Category ID Field */}
                    <div>
                        <label htmlFor="categoryId">Category ID</label>
                        <Input
                            id="categoryId"
                            type="number"
                            {...register('categoryId', { valueAsNumber: true })}
                            placeholder="Enter category ID"
                        />
                        {errors.categoryId && (
                            <p className="text-red-500">{errors.categoryId.message}</p>
                        )}
                    </div>

                    {/* Image Upload Field */}
                    <div>
                        <label htmlFor="image">Upload Image</label>
                        <Input
                            id="image"
                            type="file"
                            accept="image/*"
                            {...register('image')}
                        />
                        {errors.image && <p className="text-red-500">{errors.image.message}</p>}
                    </div>

                    {/* Submit Button */}
                    <Button type="submit" disabled={isUpdating}>
                        {isUpdating ? 'Updating...' : 'Update Product'}
                    </Button>
                </form>
            </SheetContent>
        </Sheet>
    );
};

export default UpdateProductPage;