import { fetchAuthSession } from 'aws-amplify/auth';

import { Todos } from "../types";

const API_URL = "https://16i6n18c41.execute-api.us-east-1.amazonaws.com/prod/todo";

const generateRequestConfig = async () => {
    const session = await fetchAuthSession();

    return {
        headers: {
            'Authorization': (session?.tokens?.idToken as unknown as string) ?? '',
            'Content-Type': 'application/json'
        }
    };
};

export const fetchTodos = async (): Promise<Todos> => {
    const response = await fetch(API_URL);

    const todos: Todos = await response.json();
    return todos;
};

export const createTodo = async (todo: any): Promise<void> => {
    const response = await fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(todo),
        ...await generateRequestConfig()
    });
    if (!response.ok) {
        throw new Error('Failed to create TODO');
    }
};

export const deleteTodo = async (todoID: string, createdAt: string): Promise<void> => {
    const response = await fetch(`${API_URL}/${todoID}?createdAt=${createdAt}`, {
        method: 'DELETE',
        ...(await generateRequestConfig()),
    });

    if (!response.ok) {
        throw new Error('Failed to delete TODO');
    }
};

export const updateTodo = async (todo: any): Promise<void> => {
    const payload = {
        Title: todo.Title,
        Description: todo.Description,
        Status: todo.Status,
    };
    const response = await fetch(`${API_URL}/${todo.TodoID}?createdAt=${todo.CreatedAt}`, {
        method: 'PUT',
        ...(await generateRequestConfig()),
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new Error('Failed to update TODO');
    }
};