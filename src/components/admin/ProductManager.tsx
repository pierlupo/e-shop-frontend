import React, {useEffect, useMemo, useRef, useState} from "react";
import { productService } from "../../services/productService";
import type { Product } from "../../interfaces/Product";
import toast from "react-hot-toast";
import AdminProductDialog from "./AdminProductDialog.tsx";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    flexRender,
    type ColumnDef,
    type SortingState,
    getFilteredRowModel,
} from "@tanstack/react-table";
import {
    TrashIcon,
    PlusIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronUpIcon,
    ChevronDownIcon,
    ArrowDownTrayIcon,
    ViewColumnsIcon,
    MagnifyingGlassIcon,
    PencilSquareIcon
} from "@heroicons/react/24/outline";

const ProductManager: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selected, setSelected] = useState<Product | null>(null);
    const [columnsDropdownOpen, setColumnsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const tableRef = useRef<HTMLTableSectionElement>(null)
    const [globalFilter, setGlobalFilter] = useState("");
    const [loading, setLoading] = useState<boolean>(true);


    useEffect(() => {
        (async () => {
            try {
                await fetchProducts();
            } catch (error) {
                console.error(error);
            }
        })();
    }, []);

    const fetchProducts = async () => {
        try {
            const list = await productService.getAllProducts();
            setProducts(list);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch products");
        } finally {
            setLoading(false);
        }
    };

    const openCreate = () => {
        console.log("Open create clicked");
        setSelected(null);
        setIsDialogOpen(true);
    };

    const openEdit = (product: Product) => {
        console.log("Open edit clicked");
        setSelected(product);
        setIsDialogOpen(true);
    };

    const confirmDelete = () => {
        if (!selected?.productId) return;
        productService
            .deleteProduct(selected.productId)
            .then(() => {
                setProducts((p) => p.filter((x) => x.productId !== selected.productId));
                toast.success("Deleted successfully");
            })
            .catch(() => toast.error("Delete failed"))
            .finally(() => setIsDeleteOpen(false));
    };

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const target = event.target as Node;
            // Close column dropdown if needed
            if (dropdownRef.current && !dropdownRef.current.contains(target)) {
                setColumnsDropdownOpen(false);
            }
            if (isDialogOpen) return;
            const clickedOutsideTable = tableRef.current && !tableRef.current.contains(target);
            if (clickedOutsideTable) {
                setSelected(null);
            }
        }
        if (columnsDropdownOpen || selected !== null) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [columnsDropdownOpen, selected, isDialogOpen]);

    const columns = useMemo<ColumnDef<Product>[]>(
        () => [
            {
                accessorKey: "productName",
                header: "Name",
                cell: (info) => info.getValue(),
            },
            {
                accessorKey: "brand",
                header: "Brand",
                cell: (info) => info.getValue(),
            },
            {
                accessorKey: "category",
                header: "Category",
                cell: ({row}) => row.original.category?.name ?? "Uncategorized"
            },
            {
                accessorKey: "description",
                header: "Description",
                cell: (info) => info.getValue(),
            },
            {
                accessorKey: "inventory",
                header: "Inventory",
                cell: (info) => info.getValue(),
            },
            {
                accessorKey: "price",
                header: "Price",
                cell: (info) => `$${(info.getValue() as number).toFixed(2)}`,
            },
            {
                id: "actions",
                header: "Actions",
                cell: ({ row }) => (
                    <div className="flex space-x-4 items-center">
                        <button onClick={() => openEdit(row.original)}>
                            <PencilSquareIcon className="w-6 h-6 text-yellow-500 hover:text-yellow-400 transition" />
                        </button>
                        <button onClick={() => { setSelected(row.original); setIsDeleteOpen(true); }}>
                            <TrashIcon className=" w-6 h-6 text-red-500 hover:text-red-400 transition" />
                        </button>
                    </div>
                ),
            },
        ],
        []
    );

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 25,
    });

    const paginatedData = useMemo(() => {
        const start = pagination.pageIndex * pagination.pageSize;
        return products.slice(start, start + pagination.pageSize);
    }, [products, pagination]);

    const table = useReactTable({
        data: paginatedData,
        columns,
        pageCount: Math.ceil(products.length / pagination.pageSize),
        onSortingChange: setSorting,
        state: {
            pagination,
            globalFilter,
            sorting,
        },
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        manualPagination: true
    });

    const exportToCSV = () => {
        const csvContent = [
            ["ID", "productName", "brand", "price", "category","inventory"].join(","),
            ...products.map((p) =>
                [p.productId, p.productName, p.brand, p.price, p.category, p.inventory ? "Yes" : "No"].join(",")
            ),
        ].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "products.csv";
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="px-4 py-12 max-w-7xl mx-auto space-y-8">
            {loading ? (
                <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                </div>
            ) : (
                <>
                    {/* Controls: Search + Column Toggle */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 mb-4">
                        {/* Search Input */}
                        <div className="relative w-full max-w-md">
                            <MagnifyingGlassIcon
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-amber-50 pointer-events-none"
                            />
                            <input
                                type="text"
                                onChange={(e) => setGlobalFilter(e.target.value)}
                                placeholder="Search"
                                className="w-full pl-10 pr-4 py-2 border rounded-md shadow-sm dark:bg-gray-700 dark:text-amber-50 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-500"
                            />
                        </div>
                        {/* Buttons: New, Export, Column toggle */}
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={openCreate}
                                className="flex items-center gap-2 px-5 py-1.5 bg-blue-600 text-amber-50 rounded-md hover:bg-blue-700 transition font-semibold"
                            >
                                <PlusIcon className="w-5 h-5" />
                                Add Product
                            </button>
                            <div className="relative">
                            <button
                                onClick={exportToCSV}
                                className="w-60 text-amber-50 bg-blue-600 px-5 py-1.5 rounded-md hover:bg-blue-700 transition font-semibold relative"
                            >
                                <ArrowDownTrayIcon
                                    className="w-5 h-5 absolute top-1/2 transform -translate-y-1/2 ml-3 dark:text-amber-50"
                                />
                                Export CSV
                            </button>
                            </div>
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setColumnsDropdownOpen((open) => !open)}
                                    className="flex items-center gap-2 px-5 py-1.5 text-amber-50 bg-blue-600 rounded-md hover:bg-blue-700 dark:text-amber-50 dark:bg-gray-500 border-gray-300 dark:border-gray-600 shadow-sm dark:hover:bg-gray-600 transition font-semibold"
                                    aria-expanded={columnsDropdownOpen}
                                    aria-haspopup="true"
                                    title="Toggle columns"
                                >
                                    <ViewColumnsIcon className="w-5 h-5 dark:text-amber-50" />
                                    Columns
                                </button>
                                {columnsDropdownOpen && (
                                    <div
                                        className="absolute top-0 left-full ml-2 w-48 max-h-60 overflow-auto rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 shadow-lg p-3 animate-fade-slide-right z-10"
                                        role="menu"
                                        aria-orientation="vertical"
                                        aria-labelledby="columns-menu"
                                    >
                                        {table.getAllLeafColumns().map((column) => (
                                            <label
                                                key={column.id}
                                                className="flex items-center cursor-pointer select-none text-sm text-gray-700 dark:text-gray-200 mb-1 last:mb-0"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={column.getIsVisible()}
                                                    onChange={column.getToggleVisibilityHandler()}
                                                    className="mr-2 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-gray-200 dark:focus:ring-gray-500"
                                                />
                                                {column.id}
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* Table */}
                    <div className="overflow-x-auto rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-600">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 overflow-hidden">
                            <thead className="bg-gray-50 dark:bg-gray-500 text-gray-500 dark:text-gray-200 uppercase">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            aria-sort={
                                                header.column.getIsSorted() === "asc"
                                                    ? "ascending"
                                                    : header.column.getIsSorted() === "desc"
                                                        ? "descending"
                                                        : "none"
                                            }
                                            key={header.id}
                                            className="px-6 py-3 text-left text-gray-500 dark:text-gray-200 uppercase tracking-wider cursor-pointer select-none"
                                            onClick={header.column.getToggleSortingHandler()}
                                        >
                                            <div className="flex items-center justify-between w-full">
                        <span>
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </span>
                                                {header.column.getIsSorted() === "asc" && (
                                                    <ChevronUpIcon className="ml-2 w-5 h-5 text-gray-500 dark:text-gray-200 transition" />
                                                )}
                                                {header.column.getIsSorted() === "desc" && (
                                                    <ChevronDownIcon className="ml-2 w-5 h-5 text-gray-500 dark:text-gray-200 transition" />
                                                )}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            ))}
                            </thead>

                            <tbody ref={tableRef} className="bg-gray-100 dark:bg-gray-600 divide-y divide-gray-200 dark:divide-gray-700">
                            {table.getRowModel().rows.map((row) => (
                                <tr
                                    key={row.id}
                                    className="hover:bg-gray-200 dark:hover:bg-gray-500 transition-all cursor-pointer"
                                    onClick={() => setSelected(row.original)}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        {/* Pagination */}
                        <div className="flex flex-col md:flex-row justify-between items-center mt-6 px-4 pb-4 space-y-4 md:space-y-0 md:space-x-4">
                            <div className="text-sm text-gray-700 dark:text-gray-300">
                                Page {pagination.pageIndex + 1} of {table.getPageCount()}
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => table.previousPage()}
                                    disabled={!table.getCanPreviousPage()}
                                    className="px-3 py-1 rounded-md text-sm bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:text-amber-50 dark:hover:bg-gray-700 disabled:opacity-50 cursor-pointer"
                                >
                                    <ChevronLeftIcon className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() => table.nextPage()}
                                    disabled={!table.getCanNextPage()}
                                    className="px-3 py-1 rounded-md text-sm bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:text-amber-50 dark:hover:bg-gray-700 disabled:opacity-50 cursor-pointer"
                                >
                                    <ChevronRightIcon className="h-5 w-5" />
                                </button>
                                <select
                                    value={pagination.pageSize}
                                    onChange={(e) =>
                                        setPagination((prev) => ({
                                            ...prev,
                                            pageSize: Number(e.target.value),
                                            pageIndex: 0,
                                        }))
                                    }
                                    className="ml-2 bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-amber-50 border border-gray-300 dark:border-gray-700 dark:hover:bg-gray-700 rounded-md px-2 py-1 cursor-pointer"
                                >
                                    {[10, 25, 50, 100].map((size) => (
                                        <option key={size} value={size}>
                                            {size}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    <ConfirmationDialog
                        isOpen={isDeleteOpen}
                        title="Delete product?"
                        message="Are you sure you want to delete this product?"
                        onConfirm={confirmDelete}
                        onCancel={() => setIsDeleteOpen(false)}
                    />
                    {isDialogOpen && (
                        <AdminProductDialog
                            product={selected}
                            onClose={() => setIsDialogOpen(false)}
                            onSaved={async () => {
                                setIsDialogOpen(false);
                                await fetchProducts();
                            }}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default ProductManager;