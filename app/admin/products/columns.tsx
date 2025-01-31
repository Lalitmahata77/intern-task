import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { api } from '@/http/client';
import { Product } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
export const columns: ColumnDef<Product>[] = [
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'categoryId',
        header: 'CategoryId',
    },
    {
        id: 'actions',
        header: 'Action',
        cell: ({ row }) => {
            const product = row.original;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(String(row.id))}>
                            Copy payment ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-red-600 focus:bg-red-50"
                            onClick={async () => {
                                // Add delete confirmation modal
                                if (confirm('Are you sure you want to delete this product?')) {
                                    try {
                                        await api.delete(`/products/${product.id}`, {
                                            method: 'DELETE'
                                        });
                                        // Add refresh logic or state update
                                    } catch (error) {
                                        console.error('Delete failed:', error);
                                    }
                                }
                            }}
                        >
                            Delete Product
                        </DropdownMenuItem>
                        <Link href={`/admin/products/${product.id}`} passHref>
                            <DropdownMenuItem asChild>
                                <span className="cursor-pointer">Edit Product</span>
                            </DropdownMenuItem>
                        </Link>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];