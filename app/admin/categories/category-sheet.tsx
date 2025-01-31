import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import React from 'react';
import CreateCategoryForm, { FormValues } from './create-category.form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCategory } from '@/http/api';
import { useNewProduct } from '@/store/product/product-store';
const ProductSheet = () => {
    const { isOpen, onClose } = useNewProduct();
    const queryClient = useQueryClient();
    const { mutate } = useMutation({
        mutationKey: ['create-category'],
        mutationFn: (data: FormData) => createCategory(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            alert('Category created!');
        },
    });
    const onSubmit = (values: FormValues) => {
        console.log('values', values);
        const formdata = new FormData();
        formdata.append('name', values.name);
        formdata.append('image', (values.image as FileList)[0]);
        mutate(formdata);
    };
    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="min-w-[28rem] space-y-4">
                <SheetHeader>
                    <SheetTitle>Create Category</SheetTitle>
                    <SheetDescription>Create a new Category</SheetDescription>
                </SheetHeader>
                <CreateCategoryForm onSubmit={onSubmit} />
            </SheetContent>
        </Sheet>
    );
};
export default ProductSheet;