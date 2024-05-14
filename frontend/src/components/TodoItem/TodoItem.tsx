import React, { useState } from 'react';
import { Checkbox, Field, Label } from '@headlessui/react'

import { Todo } from '../../types';
import AddTodo from '../AddTodo/AddTodo';
import SuccessToast from '../Toasts/SuccessToast';
import { deleteTodo, updateTodo } from '../../services/api';

interface TodoItemProps {
    todo: Todo;
    refreshTodos: () => Promise<void>
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, refreshTodos }) => {
    const [enabled, setEnabled] = useState(todo.Status === 'done');
    const [isAddTodoOpen, setIsAddTodoOpen] = useState(false);
    const [message, setMessage] = useState('');

    const handleDeleteTodo = async () => {
        try {
            await deleteTodo(todo.TodoID, todo.CreatedAt);
            setMessage('TODO deleted successfully!');
            refreshTodos();
        } catch (err) {
            console.error(err);
        }
    };

    const handleToggleStatus = async () => {
        const newStatus = !enabled;
        setEnabled(newStatus);

        const Status = newStatus ? 'done' : 'pending';

        try {
            await updateTodo({...todo, Status });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
         {message && <SuccessToast message={message} onClose={() => setMessage('')} />}
        <div className="todo-item flex flex-col sm:flex-row justify-between items-start sm:items-center p- bg-white shadow-lg rounded-lg my-5 relative rounded-xl overflow-visible p-8">
            <div className="flex items-center space-x-2 mb-2 sm:mb-0 content-center">
                {enabled ?
                    <span className="material-symbols-outlined rounded-full p-2 bg-lime-600 text-white shadow-lg shadow-lime-600/50 text-5xl absolute -left-6 w-20 h-20 rounded-full content-center">
                        assignment_turned_in
                    </span>
                    :
                    <span className="material-symbols-outlined rounded-full p-2 bg-orange-600 text-white shadow-lg shadow-orange-600/50 text-5xl absolute -left-6 w-20 h-20 rounded-full content-center">
                        assignment_late
                    </span>}
            </div>
            <div className="sm:mb-0 text-left overflow-hidden w-full max-w-md ml-12">
                <h4 className="todo-text overflow-ellipsis overflow-hidden  line-clamp-2 max-w-xs">{todo.Title}</h4>
                <p className="text-sm text-gray-600 overflow-ellipsis overflow-hidden line-clamp-1 max-w-xs">{todo.Description}</p>
            </div>

            <Field className="flex items-center gap-2">
            <Checkbox
                checked={enabled}
                onChange={handleToggleStatus}
                className="group block size-4 rounded border bg-white data-[checked]:bg-blue-500 shadow-lg shadow-blue-600/60"
            >
                <svg className="stroke-white opacity-0 group-data-[checked]:opacity-100" viewBox="0 0 14 14" fill="none">
                    <path d="M3 8L6 11L11 3.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </Checkbox>
            <Label>Done</Label>
            </Field>

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <button type="button" className="inline-flex w-full sm:w-auto justify-center rounded-md px-3 py-2 text-sm font-semibold text-white bg-blue-600 shadow-lg shadow-blue-600/50 hover:bg-blue-500 sm:ml-3 min-w-20" onClick={() =>setIsAddTodoOpen(true)}>Edit</button>
                <button type="button" className="inline-flex w-full sm:w-auto justify-center rounded-md px-3 py-2 text-sm font-semibold text-white bg-red-600 shadow-lg shadow-red-500/50 hover:bg-red-500 sm:ml-3 min-w-20" onClick={() => handleDeleteTodo()}>Delete</button>
            </div>
        </div>
        <AddTodo isOpen={isAddTodoOpen} closeModal={() => setIsAddTodoOpen(false)} todo={todo} refreshTodos={refreshTodos} />
        </>
    );
};

export default TodoItem;
