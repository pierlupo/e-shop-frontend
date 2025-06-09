import React, {useCallback, useEffect, useMemo, useState} from "react";
import {
    useReactTable,
    type ColumnDef,
    getCoreRowModel,
    flexRender,
    getPaginationRowModel,
} from "@tanstack/react-table";
import {ChevronLeftIcon, ChevronRightIcon, PencilSquareIcon, TrashIcon, ShieldCheckIcon, UserIcon,} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import {useTranslation} from "react-i18next";
import type {Role} from "../../interfaces/Role.ts";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import {userService} from "../../services/userService";

type User = {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    roles: Role[];
    emailVerified: boolean;
};

const UserManager: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const {t} = useTranslation();

    useEffect(() => {
        (async () => {
            try {
                const data = await userService.getAllUsers();
                setUsers(data);
            } catch (error) {
                console.error(error);
                toast.error("Failed to fetch users.");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const handleEdit = (user: User) => {
        console.log("Edit user", user);
        toast("Edit not implemented yet", {icon: "✏️"});
        // TODO: Open edit modal
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
            console.error(error)
            toast.error("Failed to delete user.");
        } finally {
            setSelectedUserId(null);
            setIsDialogOpen(false);
        }
    };

    const getRoleColor = (role: string) => {
        switch (role.toLowerCase()) {
            case 'admin':
                return 'bg-red-500 text-white';
            case 'user':
                return 'bg-blue-500 text-white';
            default:
                return 'bg-gray-400 text-white';
        }
    };

    const getRoleIcon = (role: string) => {
        switch (role.toLowerCase()) {
            case 'admin':
                return <ShieldCheckIcon className="h-4 w-4 mr-1"/>;
            case 'user':
                return <UserIcon className="h-4 w-4 mr-1"/>;
            default:
                return null;
        }
    };

    const isEmailVerified = useCallback((emailVerified: boolean) => {
        return emailVerified ? (
            <span className="text-green-600 font-semibold inline-flex items-center gap-1">
            <span className="text-base">✅</span>
                {t('profile_email_verif_yes')}
        </span>
        ) : (
            <span className="text-red-600 font-semibold inline-flex items-center gap-1">
            <span className="text-base">❌</span>
                {t('profile_email_verif_no')}
        </span>
        );
    }, [t]);

    const columns = useMemo<ColumnDef<User>[]>(
        () => [
            {accessorKey: "id", header: "ID"},
            {accessorKey: "firstname", header: "Firstname"},
            {accessorKey: "lastname", header: "Lastname"},
            {accessorKey: "email", header: "Email"},
            {
                accessorKey: "emailVerified",
                header: "Email checked",
                cell: ({row}) => isEmailVerified(row.original.emailVerified)
            },
            {
                id: "roles",
                header: "Roles",
                cell: ({row}) => (
                    <div className="flex flex-wrap gap-2">
                        {row.original.roles.map((role: Role) => {
                            const cleanName = role.name.replace("ROLE_", "");
                            return (
                                <span
                                    key={role.id}
                                    className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${getRoleColor(cleanName)}`}
                                >
                        {getRoleIcon(cleanName)}
                                    {cleanName}
                    </span>
                            );
                        })}
                    </div>
                ),
            },
            {
                id: "actions",
                header: "Actions",
                cell: ({row}) => (
                    <div className="flex space-x-8">
                        <button
                            onClick={() => handleEdit(row.original)}
                            className="text-yellow-500 hover:underline"
                            title="Edit"
                        >
                            <PencilSquareIcon className="h-5 w-5"/>
                        </button>
                        <button
                            onClick={() => handleDelete(row.original.id)}
                            className="text-red-600 hover:underline"
                            title="Delete"
                        >
                            <TrashIcon className="h-5 w-5"/>
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
        state: {
            pagination,
        },
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination: true,
    });

    return (
        <div className="px-4 py-12 max-w-7xl mx-auto space-y-8">
            {loading ? (
                <p className="text-gray-500 dark:text-gray-200">Loading users...</p>
            ) : (
                <div
                    className="overflow-x-auto rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-600">
                    <table
                        className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 rounded-xl overflow-hidden">
                        <thead className="bg-gray-100 dark:bg-gray-500">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className="px-6 py-3 text-left text-gray-500 dark:text-gray-200 uppercase tracking-wider"
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                        </thead>
                        <tbody className="bg-white dark:bg-gray-600 divide-y divide-gray-200 dark:divide-gray-700">
                        {table.getRowModel().rows.map((row) => (
                            <tr key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <td
                                        key={cell.id}
                                        className="px-6 py-4 whitespace-nowrap text-md text-gray-900 dark:text-gray-100"
                                    >
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>

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
            )}
            <ConfirmationDialog
                isOpen={isDialogOpen}
                title="Confirm Deletion"
                message="Are you sure you want to delete this user?"
                onCancel={() => {
                    setIsDialogOpen(false);
                    setSelectedUserId(null);
                }}
                onConfirm={confirmDelete}
            />
        </div>
    );
};

export default UserManager;