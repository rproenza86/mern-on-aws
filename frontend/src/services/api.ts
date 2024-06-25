import { v4 as uuidv4 } from 'uuid';
import { fetchAuthSession } from 'aws-amplify/auth';

import { Todos } from "../types";

const API_URL = "https://kraypxdw7f.execute-api.us-east-1.amazonaws.com/prod/todo";

const generateRequestConfig = async () => {
    const session = await fetchAuthSession();
    const traceId = `1-${Math.floor(Date.now() / 1000).toString(16)}-${uuidv4().replace(/-/g, '').substring(0, 24)}`;

    return {
        headers: {
            'Authorization': (session?.tokens?.idToken as unknown as string) ?? '',
            'X-Amzn-Trace-Id': `Root=${traceId}`
        }
    };
};

export const fetchTodos = async (): Promise<Todos> => {
    const response = await fetch(API_URL,{ ...await generateRequestConfig() });

    const todos: Todos = await response.json();
    return todos;
};

type PresignedUrlData = {
    presignedUrl: string;
    fileUrl: string;
};

export const fetchPresignedS3Url = async (): Promise<PresignedUrlData> => {
    const response = await fetch(API_URL + '/s3PresignedUrl',{ ...await generateRequestConfig() });

    const todos: PresignedUrlData = await response.json();
    return todos;
};

export const uploadFile = async (toPresignedUrl: string, file: File): Promise<void> => {
    await fetch(toPresignedUrl, { 
        method: 'PUT', 
        body: file,
    });
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