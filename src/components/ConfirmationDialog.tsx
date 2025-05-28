import React, { Fragment } from "react";
import {Description, Dialog, DialogPanel, DialogTitle, Transition, TransitionChild} from "@headlessui/react";
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface ConfirmationDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
                                                                   isOpen,
                                                                   title,
                                                                   message,
                                                                   onConfirm,
                                                                   onCancel,
                                                               }) => {
    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onCancel}>
                {/* Overlay */}
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-6 scale-95"
                    enterTo="opacity-100 translate-y-0 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 scale-100"
                    leaveTo="opacity-0 translate-y-4 scale-95"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-30"/>
                </TransitionChild>

                {/* Modal panel container */}
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-200"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-150"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <DialogPanel className="bg-white dark:bg-gray-600 p-6 rounded-2xl shadow-2xl max-w-sm w-full space-y-4 transition-all">
                            <DialogTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                                <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500" />
                                {title}
                            </DialogTitle>
                            <Description className="text-sm text-gray-700 dark:text-gray-300">
                                {message}
                            </Description>
                            <div className="flex justify-end space-x-2 pt-2">
                                <button
                                    onClick={onCancel}
                                    className="px-4 py-2 rounded bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={onConfirm}
                                    className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                >
                                    Confirm
                                </button>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </Dialog>
        </Transition>
    );
};

export default ConfirmationDialog;