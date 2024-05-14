import React, { useRef, useState, Fragment } from 'react';
import { ListBulletIcon } from '@heroicons/react/24/solid';
import { Dialog, Transition, Textarea } from '@headlessui/react';

import { Todo } from '../../types';
import SuccessToast from '../Toasts/SuccessToast';
import { createTodo, updateTodo } from '../../services/api';

interface AddTodoProps {
    isOpen: boolean;
    closeModal: () => void;
    todo?: Todo;
    refreshTodos: () => Promise<void>;
}

const AddTodo: React.FC<AddTodoProps> = ({ isOpen, closeModal, todo, refreshTodos }) => {
    const [title, setTitle] = useState(todo?.Title ?? '');
    const [description, setDescription] = useState(todo?.Description ?? '');
    const [status] = useState(todo?.Status ?? 'pending');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const todoPayload: any = {
                Title: title,
                Description: description,
                Status: status,
            };

            if (todo) {
                todoPayload['TodoID'] = todo.TodoID;
                todoPayload['CreatedAt'] = todo.CreatedAt;

                await updateTodo(todoPayload);
                setMessage('TODO updated successfully!');
            } else {
                await createTodo(todoPayload);
                setMessage('TODO added successfully!');
            }

            refreshTodos();

            setTitle('');
            setDescription('');

            closeModal();
        } catch (err) {
            setError('Failed to add TODO.');
        }
    };

    const cancelButtonRef = useRef(null)

    return (
        <>
            {message && <SuccessToast message={message} onClose={() => setMessage('')} />}
            <Transition.Root show={isOpen} as={Fragment}>
                <Dialog className="relative z-10" initialFocus={cancelButtonRef} onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                        <div className="sm:flex sm:items-start">
                                            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-300 shadow-lg shadow-lime-600/50 sm:mx-0 sm:h-10 sm:w-10">
                                                <ListBulletIcon className="h-6 w-6 text-red-600 text-black" aria-hidden="true" />
                                            </div>
                                            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                                <Dialog.Title as="h3" className="font-semibold leading-6 text-gray-900 text-xl pt-2">
                                                    {todo ? 'Edit' : 'Create'} TODO
                                                </Dialog.Title>

                                                <div className='mt-5 min-w-80'>
                                                    <div className="mb-4">
                                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">Title</label>
                                                        <input
                                                            id="title"
                                                            type="text"
                                                            value={title}
                                                            onChange={(e) => setTitle(e.target.value)}
                                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                            required
                                                        />
                                                    </div>
                                                    <div className="mb-4">
                                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">Description</label>
                                                        <Textarea
                                                            id="description"
                                                            value={description}
                                                            onChange={(e) => setDescription(e.target.value)}
                                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                        <button
                                            type="button"
                                            className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                                            onClick={handleSubmit}
                                        >
                                            Save
                                        </button>
                                        <button
                                            type="button"
                                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                            onClick={closeModal}
                                            ref={cancelButtonRef}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </>
    )
};

export default AddTodo;
