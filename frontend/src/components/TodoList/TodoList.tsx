import React, { useEffect, useState } from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/solid'

import { Todo, Todos } from '../../types';
import TodoItem from '../TodoItem/TodoItem';
import { fetchTodos } from '../../services/api';

const TodoList: React.FC = () => {
    const [todos, setTodos] = useState<Todos>([]);

    const refreshTodos = async () => {
        try {
            setTodos([]);
            const data = await fetchTodos();
            setTodos(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchTodos().then((data: Todos) => setTodos(data));
    }, []);

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-bold my-4">TODO List</h2>
            {todos.length === 0 && <div className="flex justify-center items-center text-2xl">
                <ArrowPathIcon className="animate-spin h-16 w-16" />
                Loading ...
            </div>}

            {todos.map((todo: Todo) => (
                <TodoItem key={todo.TodoID} todo={todo} refreshTodos={refreshTodos}/>
            ))}
        </div>
    );
};

export default TodoList;
