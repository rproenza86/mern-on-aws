export interface Todo {
    UpdatedAt: string;
    Title: string;
    TodoID: string;
    Description: string;
    Status: 'done' | 'pending';
    CreatedAt: string;
}

export type Todos = Todo[];