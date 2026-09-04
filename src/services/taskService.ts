import { httpClient } from './httpClient'
import type { Task, NewTask, TaskStatus } from '../types'

// GET: obtener todas las tareas
export async function getTasks(): Promise<Task[]> {
    const { data } = await httpClient.get<Task[]>('/tasks')
    return data
}

// POST: crear nueva tarea en un proyecto
export async function createTask(projectId: number, body: NewTask): Promise<Task> {
    const { data } = await httpClient.post<Task>(`/projects/${projectId}/tasks`, body)
    return data
}

// PUT: editar una tarea por completo
export async function updateTask(id: number, body: NewTask): Promise<Task> {
    const { data } = await httpClient.put<Task>(`/tasks/${id}`, body)
    return data
}

// PATCH: cambiar únicamente el estado de la tarea
export async function updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
    const { data } = await httpClient.patch<Task>(`/tasks/${id}/status`, { status })
    return data
}

// DELETE
export async function deleteTask(id: number): Promise<void> {
    await httpClient.delete(`/tasks/${id}`)
}