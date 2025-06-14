import React, { useEffect, useState } from "react";
import {toast} from "react-hot-toast";
import {useTranslation} from "react-i18next";
import {categoryService} from "../../services/categoryService.ts";
import type {Category} from "../../interfaces/Category.ts";
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
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const {t} = useTranslation();

    useEffect(() => {
        (async () => {
            try {
                await fetchCategories();
            } catch (error) {
                console.error(error);
            }
        })();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await categoryService.getAllCategories();
            setCategories(res);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load categories");
        } finally {
            setLoading(false);
        }
    }


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

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm(f => ({
            ...f,
            [name]: name === "price" || name === "inventory" || name === "categoryId" ? Number(value) : value,
        }));
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
                {loading ? (
                    <div
                        className="bg-gray-100 dark:bg-gray-700 p-6 rounded shadow-md w-96"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="animate-pulse space-y-4">
                            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
                            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                        </div>
                    </div>
                ) : (
                <form onSubmit={handleSubmit}
                      className="bg-gray-100 dark:bg-gray-700 p-6 rounded shadow-md w-96"
                      onClick={(e) => e.stopPropagation()}>
                    <div className="space-y-4">
                        <div>
                            <label className="block mb-1 font-medium dark:text-amber-50">Product Name</label>
                            <input
                                type="text"
                                name="productName"
                                value={form.productName}
                                onChange={handleChange}
                                className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-amber-50 dark:placeholder-gray-400"
                            />
                        </div>

                        <div>
                            <label className="block mb-1 font-medium dark:text-amber-50">Brand</label>
                            <input
                                type="text"
                                name="brand"
                                value={form.brand}
                                onChange={handleChange}
                                className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-amber-50 dark:placeholder-gray-400"
                            />
                        </div>

                        <div>
                            <label className="block mb-1 font-medium dark:text-amber-50">Price</label>
                            <input
                                type="number"
                                name="price"
                                value={form.price}
                                onChange={handleChange}
                                className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-amber-50 dark:placeholder-gray-400"
                            />
                        </div>

                        <div>
                            <label className="block mb-1 font-medium dark:text-amber-50">Inventory</label>
                            <input
                                type="number"
                                name="inventory"
                                value={form.inventory}
                                onChange={handleChange}
                                className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-amber-50 dark:placeholder-gray-400"
                            />
                        </div>

                        <div>
                            <label className="block mb-1 font-medium dark:text-amber-50">Description</label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-amber-50 dark:placeholder-gray-400"
                            />
                        </div>

                        <div>
                            <label className="block mb-1 font-medium dark:text-amber-50">Categories</label>
                            <select
                                name="categoryId"
                                value={form.categoryId}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:text-white dark:border-gray-600"
                            >
                                <option value="">Select a category</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="mt-4 flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded font-medium border border-gray-300
                                                bg-gray-100 text-gray-800 hover:bg-gray-200
                                                focus:ring-2 focus:ring-gray-400
                                                dark:bg-gray-600 dark:text-amber-50 dark:hover:bg-gray-700"
                        >
                            {t("cancel_btn")}
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-amber-50 rounded hover:bg-blue-700"
                        >
                            {t("profile_save_changes_btn")}
                        </button>
                    </div>
                </form>
                )}
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