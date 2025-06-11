import i18n from "i18next";
import React, { useCallback, useEffect, useMemo, useState, useRef } from "react";
import type {User} from "../../interfaces/User";
import {
    useReactTable,
    type ColumnDef,
    getCoreRowModel,
    flexRender,
    getPaginationRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    type SortingState,
} from "@tanstack/react-table";
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    PencilSquareIcon,
    TrashIcon,
    ShieldCheckIcon,
    UserIcon,
    MagnifyingGlassIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    ArrowDownTrayIcon,
    ViewColumnsIcon
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import EditUserDialog from "../../components/admin/EditUserDialog.tsx";
import type { Role } from "../../interfaces/Role.ts";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import { userService } from "../../services/userService";

const UserManager: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [globalFilter, setGlobalFilter] = useState("");
    const [sorting, setSorting] = useState<SortingState>([]);
    const { t } = useTranslation();
    const [columnsDropdownOpen, setColumnsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const tableRef = useRef<HTMLTableSectionElement>(null);

    useEffect(() => {
        (async () => {
            try {
                await refreshUsers();
            } catch (error) {
                console.error(error);
            }
        })();
    }, []);

    const refreshUsers = async () => {
        try {
            const data = await userService.getAllUsers();
            setUsers(data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch users.");
        } finally {
            setLoading(false);
        }
    }

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setIsEditDialogOpen(true);
    };

    const submitEdit = async (updatedUserData: Partial<User>, updatedRoles: string[] | null) => {
        if (!editingUser) return;
        console.log("SubmitEdit: updated data", updatedUserData, "Roles:", updatedRoles);
        try {
            await userService.updateUser(editingUser.id, updatedUserData);

            // If roles changed, call the roles endpoint
            if (updatedRoles && updatedRoles.length > 0) {
                await userService.updateUserRoles(editingUser.id, updatedRoles);
            }

            toast.success("User updated successfully");
            setIsEditDialogOpen(false);
            setEditingUser(null);
            await refreshUsers();
        } catch {
            toast.error("Failed to update user");
        }
    };

    const handleDelete = (id: number) => {
        setSelectedUserId(id);
        setIsDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (selectedUserId == null) return;

        try {
            await userService.deleteUser(selectedUserId);
            setUsers((prev) => prev.filter((u) => u.id !== selectedUserId));
            toast.success("User deleted");
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete user.");
        } finally {
            setSelectedUserId(null);
            setIsDialogOpen(false);
        }
    };

    const getRoleColor = (role: string) => {
        switch (role.toLowerCase()) {
            case "admin":
                return "bg-red-500 text-white";
            case "user":
                return "bg-blue-500 text-white";
            default:
                return "bg-gray-400 text-white";
        }
    };

    const getRoleIcon = (role: string) => {
        switch (role.toLowerCase()) {
            case "admin":
                return <ShieldCheckIcon className="h-4 w-4 mr-1" />;
            case "user":
                return <UserIcon className="h-4 w-4 mr-1" />;
            default:
                return null;
        }
    };

    const isEmailVerified = useCallback(
        (emailVerified: boolean) => {
            return emailVerified ? (
                <span className="text-green-600 font-semibold inline-flex items-center gap-1">
          <span className="text-base">✅</span>
                    {t("profile_email_verif_yes")}
        </span>
            ) : (
                <span className="text-red-600 font-semibold inline-flex items-center gap-1">
          <span className="text-base">❌</span>
                    {t("profile_email_verif_no")}
        </span>
            );
        },
        [t]
    );

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const target = event.target as Node;
            if (dropdownRef.current && !dropdownRef.current.contains(target )
            ) {
                setColumnsDropdownOpen(false);
            }
            if (tableRef.current && !tableRef.current.contains(target)) {
                setSelectedUserId(null);
            }
        }
        if (columnsDropdownOpen || selectedUserId !== null) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [columnsDropdownOpen, selectedUserId]);

    const columns = useMemo<ColumnDef<User>[]>(
        () => [
            { accessorKey: "id", header: "ID" },
            { accessorKey: "firstname", header: "Firstname" },
            { accessorKey: "lastname", header: "Lastname" },
            { accessorKey: "email", header: "Email" },
            {
                accessorKey: "emailVerified",
                header: "Email checked",
                cell: ({ row }) => isEmailVerified(row.original.emailVerified),
            },
            {
                accessorKey: "registrationDate",
                header: "Registration date",
                cell: ({ row }) => {
                    const rawDate = row.original.registrationDate;
                    const date = new Date(rawDate);
                    const lang = i18n.language;

                    const formattedDate = new Intl.DateTimeFormat(
                        lang === "fr" ? "fr-FR" : "en-CA", // en-CA gives YYYY-MM-DD
                        { year: "numeric", month: "2-digit", day: "2-digit" }
                    ).format(date);

                    return <span>{formattedDate}</span>;
                },
            },
            {
                id: "roles",
                header: "Roles",
                cell: ({ row }) => (
                    <div className="flex flex-wrap gap-2">
                        {row.original.roles.map((role: Role) => {
                            const roleName = role.name.replace("ROLE_", "");
                            return (
                                <span
                                    key={role.id}
                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(
                                        roleName
                                    )} shadow-sm`}
                                >
                  {getRoleIcon(roleName)}
                                    {roleName}
                </span>
                            );
                        })}
                    </div>
                ),
            },
            {
                id: "actions",
                header: "Actions",
                cell: ({ row }) => (
                    <div className="flex space-x-4 items-center">
                        <button
                            onClick={() => handleEdit(row.original)}
                            className="text-yellow-500 hover:text-yellow-400 transition"
                            title="Edit"
                        >
                            <PencilSquareIcon className="h-6 w-6" />
                        </button>
                        <button
                            onClick={() => handleDelete(row.original.id)}
                            className="text-red-500 hover:text-red-400 transition"
                            title="Delete"
                        >
                            <TrashIcon className="h-6 w-6" />
                        </button>
                    </div>
                ),
            },
        ],
        [isEmailVerified]
    );

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 25,
    });

    const paginatedData = useMemo(() => {
        const start = pagination.pageIndex * pagination.pageSize;
        return users.slice(start, start + pagination.pageSize);
    }, [users, pagination]);

    const table = useReactTable({
        data: paginatedData,
        columns,
        pageCount: Math.ceil(users.length / pagination.pageSize),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        state: {
            pagination,
            globalFilter,
            sorting,
        },
        onPaginationChange: setPagination,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        manualPagination: true,
    });

    const exportToCSV = () => {
        const csvContent = [
            ["ID", "Firstname", "Lastname", "Email", "Verified"].join(","),
            ...users.map((u) =>
                [u.id, u.firstname, u.lastname, u.email, u.emailVerified, u.registrationDate, u.roles ? "Yes" : "No"].join(",")
            ),
        ].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "users.csv";
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
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-amber-50 pointer-events-none" />
                            <input
                                type="text"
                                onChange={(e) => setGlobalFilter(e.target.value)}
                                placeholder={t("search")}
                                className="w-full pl-10 pr-4 py-2 border rounded-md shadow-sm dark:bg-gray-700 dark:text-amber-50 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-500"
                            />
                        </div>
                        {/* Column Toggle Dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setColumnsDropdownOpen((open) => !open)}
                                className="flex items-center gap-2 px-5 py-1.5 text-amber-50 bg-blue-600 rounded-md hover:bg-blue-700 dark:text-amber-50 dark:bg-gray-500 border-gray-300 dark:border-gray-600 shadow-sm dark:hover:bg-gray-600 transition font-semibold"
                                aria-expanded={columnsDropdownOpen}
                                aria-haspopup="true"
                                title="Toggle columns"
                            >
                                <ViewColumnsIcon className="w-5 h-5 dark:text-amber-50 dark:hover:bg-gray-700"  />
                                {t("columns")}
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
                    {/* Table */}
                    <div className="overflow-x-auto rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-600">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 overflow-hidden">
                            <thead className="bg-gray-50 dark:bg-gray-500 text-gray-500 dark:text-gray-200 uppercase">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            aria-sort={header.column.getIsSorted() === "asc" ? "ascending" : header.column.getIsSorted() === "desc" ? "descending" : "none"}
                                            key={header.id}
                                            className="px-6 py-3 text-left text-gray-500 dark:text-gray-200 uppercase tracking-wider cursor-pointer select-none"
                                            onClick={header.column.getToggleSortingHandler()}
                                        >
                                            <div className="flex items-center justify-between w-full">
                                                <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
                                                {header.column.getIsSorted() === "asc" && (
                                                    <ChevronUpIcon className="ml-2 w-5 h-5 text-gray-500 dark:text-gray-200 group-hover:text-gray-600 transition" />
                                                )}
                                                {header.column.getIsSorted() === "desc" && (
                                                    <ChevronDownIcon className="ml-2 w-5 h-5 text-gray-500 dark:text-gray-200 group-hover:text-gray-600 transition" />
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
                                    className={`hover:bg-gray-200 dark:hover:bg-gray-500 transition-all cursor-pointer ${
                                        selectedUserId === row.original.id ? "bg-gray-300 dark:bg-gray-800" : ""
                                    }`}
                                    onClick={() => setSelectedUserId(row.original.id)}
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
                        <div className="flex flex-col md:flex-row justify-between items-center mt-6 px-4 pb-4 space-y-4 md:space-y-0 md:space-x-4 ">
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
                                    setPagination((prev) => ({...prev, pageSize: Number(e.target.value), pageIndex: 0}))}
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
                    <div className="relative">
                    <button
                        onClick={exportToCSV}
                        className="w-60 text-amber-50 bg-blue-600 py-2 rounded-md hover:bg-blue-700 transition mb-4 mx-auto block">
                        <ArrowDownTrayIcon className="w-5 h-5 absolute top-1/2 transform -translate-y-1/2  ml-3 dark:text-amber-50 dark:hover:bg-gray-700"  />
                        {t("export_csv_btn")}
                    </button>
                    </div>
                    <ConfirmationDialog
                        isOpen={isDialogOpen}
                        title={t("confirm_delete_user_title")}
                        message={
                            <>
                                {t("confirm_delete_user_msg_1")}
                                <br />
                                {t("confirm_delete_user_msg_2")}
                            </>
                        }
                        onConfirm={confirmDelete}
                        onCancel={() => setIsDialogOpen(false)}
                    />
                    {isEditDialogOpen && editingUser && (
                        <EditUserDialog
                            user={editingUser}
                            onClose={() => setIsEditDialogOpen(false)}
                            onSubmit={submitEdit}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default UserManager;