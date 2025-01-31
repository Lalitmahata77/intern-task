'use client';
import { Button } from '@/components/ui/button';
import React from 'react';
import { DataTable } from './data-table';
import { columns } from './columns';
import { useQuery } from '@tanstack/react-query';
import { getAllCategories } from '@/http/api';
import { Category } from '@/types';
import ProductSheet from './category-sheet';
import { useNewProduct } from '@/store/product/product-store';
const ProductsPage = () => {
    const { onOpen } = useNewProduct();
    const { data: categories } = useQuery<Category[]>({
        queryKey: ['categories'],
        queryFn: getAllCategories,
    });
    console.log(categories);
    
    return (
        <>
            <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold tracking-tight">Categories</h3>
                <Button size={'sm'} onClick={onOpen}>Add Categories</Button>
                <ProductSheet />
            </div>
            <DataTable columns={columns} data={categories || []} />
        </>
    );
};
export default ProductsPage;