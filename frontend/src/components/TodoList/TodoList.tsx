import React, { useContext, useEffect } from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/solid'

import { Todo } from '../../types';
import TodoItem from '../TodoItem/TodoItem';
import { fetchTodos } from '../../state/ActionCreators';
import { GlobalContext, GlobalContextType } from '../../state/GlobalContext';

const TodoList: React.FC = () => {
    const { state, dispatch } = useContext(GlobalContext) as GlobalContextType;
    const { todos, loading } = state;

    useEffect(() => {
        fetchTodos()(dispatch)
    }, [dispatch]);

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-bold my-4">TODO List</h2>
            {loading && <div className="flex justify-center items-center text-2xl">
                <ArrowPathIcon className="animate-spin h-16 w-16" />
                Loading ...
            </div>}

            {todos.map((todo: Todo) => (
                <TodoItem key={todo.TodoID} todo={todo}/>
            ))}
        </div>
    );
};

export default TodoList;
