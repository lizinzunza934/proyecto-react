import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Snackbar from '@mui/material/Snackbar'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { EditTaskModal } from '../components/EditTaskModal'
import { Navbar } from '../components/Navbar'
import { TaskForm } from '../components/TaskForm'
import { TaskTable } from '../components/TaskTable'
import { useProjectTasks } from '../hooks/useProjectTasks'
import { deleteTask, updateTask, updateTaskStatus } from '../services/taskService'
import type { Task, TaskStatus } from '../types'

export function ProjectTasksPage() {
    const { projectId } = useParams<{ projectId: string }>()
    const numericProjectId = Number(projectId)

    // ya no mas useState y useEffect, solo usamos el nuevo hook
    const { tasks, projectName, loading, error, refetch } = useProjectTasks(numericProjectId)

    const [editingTask, setEditingTask] = useState<Task | null>(null)

    // mejoramos para que exita confirmación
    const [toast, setToast] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' })
    const showToast = (message: string, severity: 'success' | 'error' = 'success') => {
        setToast({ open: true, message, severity })
    }

    async function handleDelete(id: number) {
        // pedimos confirmacipon
        if (!window.confirm('¿Estás seguro de que deseas eliminar esta tarea?')) return

        try {
            await deleteTask(id)
            showToast('Tarea eliminada correctamente', 'success')
            refetch()
        } catch (err) {
            showToast('No se pudo eliminar la tarea', 'error')
        }
    }

    async function handleStatusChange(taskId: number, newStatus: TaskStatus) {
        try {
            await updateTaskStatus(taskId, newStatus)
            refetch()
        } catch (err) {
            showToast('Error al cambiar el estado.', 'error')
        }
    }

    // aqui ya no usamos as any
    async function handleSaveEdit(id: number, data: Partial<Task>) {
        try {
            await updateTask(id, data)
            setEditingTask(null)
            showToast('Tarea actualizada correctamente', 'success')
            refetch()
        } catch (err) {
            showToast('No se pudo actualizar la tarea', 'error')
        }
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <Navbar />

            <Container maxWidth="lg" sx={{ mt: 4, pb: 6 }}>
                <Typography variant="h4" gutterBottom fontWeight="bold">
                    Gestor de Tareas
                </Typography>
                <Typography variant="h6" color="text.primary" sx={{ mb: 4, fontStyle: 'italic' }}>
                    Proyecto: {projectName ? projectName : `Cargando...`}
                </Typography>

                <TaskForm projectId={numericProjectId} onSuccess={refetch} />

                <TaskTable
                    tasks={tasks}
                    loading={loading}
                    error={error}
                    onStatusChange={handleStatusChange}
                    onEdit={(task) => setEditingTask(task)}
                    onDelete={handleDelete}
                />

                <EditTaskModal
                    task={editingTask}
                    onClose={() => setEditingTask(null)}
                    onSave={handleSaveEdit}
                />
            </Container>


            <Snackbar
                open={toast.open}
                autoHideDuration={4000}
                onClose={() => setToast({ ...toast, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setToast({ ...toast, open: false })}
                    severity={toast.severity}
                    sx={{ width: '100%' }}
                >
                    {toast.message}
                </Alert>
            </Snackbar>
        </Box>
    )
}