import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { EditTaskModal } from '../components/EditTaskModal'
import { Navbar } from '../components/Navbar'
import { TaskForm } from '../components/TaskForm'
import { TaskTable } from '../components/TaskTable'
import { getProjects } from '../services/projectService'
import { deleteTask, getTasks, updateTask, updateTaskStatus } from '../services/taskService'
import type { Task, TaskStatus } from '../types'

export function ProjectTasksPage() {
    const { projectId } = useParams<{ projectId: string }>()
    const numericProjectId = Number(projectId)

    const [tasks, setTasks] = useState<Task[]>([])
    const [projectName, setProjectName] = useState<string>('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [editingTask, setEditingTask] = useState<Task | null>(null)

    useEffect(() => {
        loadData()
    }, [numericProjectId])

    async function loadData() {
        setLoading(true)
        setError(null)
        try {
            const [allTasks, projects] = await Promise.all([getTasks(), getProjects()])
            setTasks(allTasks.filter((t) => t.projectId === numericProjectId))
            const currentProject = projects.find((p) => p.id === numericProjectId)
            if (currentProject) setProjectName(currentProject.name)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar los datos')
        } finally {
            setLoading(false)
        }
    }

    async function handleDelete(id: number) {
        try {
            await deleteTask(id)
            loadData()
        } catch (err) {
            alert('No se pudo eliminar la tarea')
        }
    }

    async function handleStatusChange(taskId: number, newStatus: TaskStatus) {
        try {
            await updateTaskStatus(taskId, newStatus)
            loadData()
        } catch (err) {
            alert('Error al cambiar el estado.')
        }
    }

    async function handleSaveEdit(id: number, data: Partial<Task>) {
        try {
            await updateTask(id, data as any)
            setEditingTask(null)
            loadData()
        } catch (err) {
            alert('No se pudo actualizar la tarea')
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
                    Proyecto: {projectName}
                </Typography>

                <TaskForm projectId={numericProjectId} onSuccess={loadData} />

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
        </Box>
    )
}