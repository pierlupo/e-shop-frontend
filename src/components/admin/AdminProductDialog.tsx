import React, { useEffect, useState } from "react";
import {toast} from "react-hot-toast";
import type {ProductCreateRequest} from "../../interfaces/ProductCreateRequest.ts";
import type {ProductUpdateRequest} from "../../interfaces/ProductUpdateRequest.ts";
import ModalPortal from "../../components/ModalPortal";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import { productService } from "../../services/productService";
import type {Product} from "../../interfaces/Product";

interface AdminProductDialogProps {
    product: Product | null;
    onClose: () => void;
    onSaved: () => void;
}

export default function AdminProductDialog({ product, onClose, onSaved }: AdminProductDialogProps) {

    const [form, setForm] = useState<ProductCreateRequest>({ productName: "", brand:"", price:0, inventory:0, description:"", categoryId:0 });
    const [confirm, setConfirm] = useState(false);

    useEffect(() => {
        if (product) {
            setForm({
                productName: product.productName,
                brand: product.brand,
                price: product.price,
                inventory: product.inventory,
                description: product.description,
                categoryId: product.category.id!,
            });
        }
    }, [product]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: name==="price"||name==="inventory"? Number(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setConfirm(true);
    };

    const onConfirm = async () => {
        setConfirm(false);
        try {
            if (product) {
                await productService.updateProduct(product.productId, form as ProductUpdateRequest);
                toast.success("Product updated");
            } else {
                await productService.createProduct(form);
                toast.success("Product created");
            }
            onSaved();
            onClose();
        } catch {
            toast.error("Operation failed");
        }
    };

    return (
        <ModalPortal>
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
                 onClick={onClose}>
                <form onSubmit={handleSubmit}
                      className="bg-gray-100 dark:bg-gray-700 p-6 rounded shadow-md w-96"
                      onClick={(e) => e.stopPropagation()}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Product Name</label>
                            <input
                                type="text"
                                name="productName"
                                value={form.productName}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:text-white dark:border-gray-600"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Brand</label>
                            <input
                                type="text"
                                name="brand"
                                value={form.brand}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:text-white dark:border-gray-600"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Price</label>
                            <input
                                type="number"
                                name="price"
                                value={form.price}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:text-white dark:border-gray-600"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Inventory</label>
                            <input
                                type="number"
                                name="inventory"
                                value={form.inventory}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:text-white dark:border-gray-600"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Description</label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:text-white dark:border-gray-600"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Category ID</label>
                            <input
                                type="number"
                                name="categoryId"
                                value={form.categoryId}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:text-white dark:border-gray-600"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-amber-50 rounded hover:bg-blue-700"
                    >
                        Save
                    </button>
                </form>
            </div>
            {confirm && (
                <ModalPortal>
                    <ConfirmationDialog
                        isOpen={confirm}
                        title="Confirm"
                        message="Are you sure you want to save?"
                        onConfirm={onConfirm}
                        onCancel={() => setConfirm(false)}
                    />
                </ModalPortal>
            )}
        </ModalPortal>
    );
}