
import { fetchTodos as fetchTodosApi } from '../services/api';

export const fetchTodos = () => async (dispatch: React.Dispatch<any>) => {
    dispatch({ type: 'FETCH_TODOS_REQUEST' });
    try {
        const todos = await fetchTodosApi();
        dispatch({ type: 'FETCH_TODOS_SUCCESS', payload: todos });
    } catch (error: any) {
        dispatch({ type: 'FETCH_TODOS_FAILURE', payload: error.message });
    }
};