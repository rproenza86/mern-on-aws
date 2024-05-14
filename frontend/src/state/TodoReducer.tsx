import { Todo } from "../types";

export type TodoState = { todos: Todo[], error: string, loading: boolean };
export const initialState: TodoState = {
    todos: [],
    error: '',
    loading: false,
};

export const reducer = (state: TodoState, action: any) => {
    switch (action.type) {
        case 'FETCH_TODOS_REQUEST':
            return { ...state, loading: true, error: '' };
        case 'FETCH_TODOS_SUCCESS':
            return { ...state, todos: action.payload, loading: false };
        case 'FETCH_TODOS_FAILURE':
            return { ...state, error: action.payload, loading: false };
        default:
            return state;
    }
}