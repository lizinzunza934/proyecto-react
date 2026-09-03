import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createTask, deleteTask, getTasks, updateTask, updateTaskStatus } from '../services/taskService'
import { getProjects } from '../services/projectService'
import type { Task, TaskPriority, TaskStatus } from '../types'

export function ProjectTasksPage() {
    const { projectId } = useParams<{ projectId: string }>()
    const navigate = useNavigate()

    const [tasks, setTasks] = useState<Task[]>([])
    const [projectName, setProjectName] = useState<string>('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Estados del formulario para crear tarea (POST)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [priority, setPriority] = useState<TaskPriority>('HIGH')
    const [assigneeId, setAssigneeId] = useState<number>(1)
    const [dueDate, setDueDate] = useState('2026-12-31')

    // Estados para el Modal de Edición (PUT)
    const [editingTask, setEditingTask] = useState<Task | null>(null)
    const [editTitle, setEditTitle] = useState('')
    const [editDescription, setEditDescription] = useState('')
    const [editPriority, setEditPriority] = useState<TaskPriority>('MED')
    const [editAssigneeId, setEditAssigneeId] = useState<number>(1)
    const [editDueDate, setEditDueDate] = useState('')

    const numericProjectId = Number(projectId)

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
            if (currentProject) {
                setProjectName(currentProject.name)
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar los datos')
        } finally {
            setLoading(false)
        }
    }

    // --- MÉTODOS CRUD ---

    async function handleCreate(e: React.FormEvent) {
        e.preventDefault()
        if (!title.trim()) return
        try {
            await createTask(numericProjectId, {
                title: title.trim(),
                description: description.trim() || 'Sin descripción',
                priority,
                assigneeId: Number(assigneeId),
                dueDate
            })
            setTitle('')
            setDescription('')
            setPriority('HIGH')
            setAssigneeId(1)
            setDueDate('2026-12-31')
            loadData()
        } catch (err) {
            alert('No se pudo crear la tarea')
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
            alert('Error al cambiar el estado. (Pasar a DONE requiere un responsable válido).')
        }
    }

    function handleOpenEdit(task: Task) {
        setEditingTask(task)
        setEditTitle(task.title)
        setEditDescription(task.description || '')
        setEditPriority(task.priority || 'MED')
        setEditAssigneeId(task.assigneeId || 1)
        setEditDueDate(task.dueDate || '2026-12-31')
    }

    async function handleSaveEdit(e: React.FormEvent) {
        e.preventDefault()
        if (!editingTask) return
        try {
            await updateTask(editingTask.id, {
                title: editTitle.trim(),
                description: editDescription.trim(),
                priority: editPriority,
                assigneeId: Number(editAssigneeId),
                dueDate: editDueDate
            })
            setEditingTask(null)
            loadData()
        } catch (err) {
            alert('No se pudo actualizar la tarea')
        }
    }

    return (
        <Box maxWidth={1024} mx="auto" mt={6} px={2}>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/dashboard')}
                sx={{ mb: 2 }}
            >
                Volver a Proyectos
            </Button>

            <Typography variant="h4" gutterBottom>
                Gestor de Tareas
            </Typography>
            <Typography variant="body1" color="text.primary" sx={{ mb: 3, fontWeight: 'bold' }}>
                Proyecto: {projectName ? `${projectName} (ID: ${numericProjectId})` : `ID: ${numericProjectId}`}
            </Typography>

            {/* Formulario completo para nueva tarea (POST) */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>Nueva Tarea</Typography>
                <form onSubmit={handleCreate}>
                    <Stack spacing={2}>
                        <TextField
                            label="Título *"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            fullWidth
                            size="small"
                            required
                        />
                        <TextField
                            label="Descripción"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            fullWidth
                            size="small"
                            multiline
                            rows={2}
                        />
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Prioridad</InputLabel>
                                <Select
                                    value={priority}
                                    label="Prioridad"
                                    onChange={(e) => setPriority(e.target.value as TaskPriority)}
                                >
                                    <MenuItem value="LOW">LOW</MenuItem>
                                    <MenuItem value="MED">MED</MenuItem>
                                    <MenuItem value="HIGH">HIGH</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField
                                label="Fecha límite"
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                size="small"
                            />
                            <TextField
                                label="Asignado (ID)"
                                type="number"
                                value={assigneeId}
                                onChange={(e) => setAssigneeId(Number(e.target.value))}
                                fullWidth
                                size="small"
                            />
                        </Stack>
                        <Button type="submit" variant="contained" sx={{ alignSelf: 'flex-start' }}>
                            Crear Tarea
                        </Button>
                    </Stack>
                </form>
            </Paper>

            {/* Tabla de tareas (GET, PATCH, DELETE) */}
            <TableContainer component={Paper}>
                {loading && <Box p={3}><Typography color="text.secondary">Cargando tareas...</Typography></Box>}
                {error && <Box p={3}><Alert severity="error">{error}</Alert></Box>}
                {!loading && !error && tasks.length === 0 && (
                    <Box p={3}><Typography color="text.secondary">No hay tareas en este proyecto.</Typography></Box>
                )}

                {!loading && !error && tasks.length > 0 && (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><b>Título</b></TableCell>
                                <TableCell><b>Estado</b></TableCell>
                                <TableCell><b>Prioridad</b></TableCell>
                                <TableCell><b>Fecha límite</b></TableCell>
                                <TableCell><b>Asignado</b></TableCell>
                                <TableCell align="right"><b>Acciones</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tasks.map((task) => (
                                <TableRow key={task.id}>
                                    <TableCell>{task.title}</TableCell>

                                    {/* Selector rápido de Estado (PATCH) */}
                                    <TableCell>
                                        <Select
                                            value={task.status}
                                            size="small"
                                            onChange={(e) => handleStatusChange(task.id, e.target.value as TaskStatus)}
                                            sx={{ minWidth: 130 }}
                                        >
                                            <MenuItem value="TODO">Por hacer</MenuItem>
                                            <MenuItem value="IN_PROGRESS">En curso</MenuItem>
                                            <MenuItem value="DONE">Hecha</MenuItem>
                                        </Select>
                                    </TableCell>

                                    <TableCell>
                                        <Chip
                                            label={task.priority}
                                            size="small"
                                            color={task.priority === 'HIGH' ? 'error' : task.priority === 'MED' ? 'warning' : 'default'}
                                        />
                                    </TableCell>
                                    <TableCell>{task.dueDate || '—'}</TableCell>
                                    <TableCell>{task.assigneeId ?? '—'}</TableCell>

                                    <TableCell align="right">
                                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                                            <Button size="small" variant="contained" color="inherit" onClick={() => handleOpenEdit(task)}>
                                                Editar
                                            </Button>
                                            <Button size="small" variant="contained" color="error" onClick={() => handleDelete(task.id)}>
                                                Borrar
                                            </Button>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </TableContainer>

            {/* Modal para Editar Tarea (PUT) */}
            <Dialog open={Boolean(editingTask)} onClose={() => setEditingTask(null)} fullWidth maxWidth="sm">
                <form onSubmit={handleSaveEdit}>
                    <DialogTitle>Editar Tarea</DialogTitle>
                    <DialogContent>
                        <Stack spacing={2} sx={{ mt: 1 }}>
                            <TextField
                                label="Título"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                fullWidth
                                required
                            />
                            <TextField
                                label="Descripción"
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                fullWidth
                                multiline
                                rows={2}
                            />
                            <FormControl fullWidth size="small">
                                <InputLabel>Prioridad</InputLabel>
                                <Select
                                    value={editPriority}
                                    label="Prioridad"
                                    onChange={(e) => setEditPriority(e.target.value as TaskPriority)}
                                >
                                    <MenuItem value="LOW">Baja (LOW)</MenuItem>
                                    <MenuItem value="MED">Media (MED)</MenuItem>
                                    <MenuItem value="HIGH">Alta (HIGH)</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField
                                label="Fecha Límite"
                                type="date"
                                value={editDueDate}
                                onChange={(e) => setEditDueDate(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                size="small"
                            />
                            <TextField
                                label="Asignado (ID de usuario)"
                                type="number"
                                value={editAssigneeId}
                                onChange={(e) => setEditAssigneeId(Number(e.target.value))}
                                fullWidth
                                size="small"
                            />
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setEditingTask(null)}>Cancelar</Button>
                        <Button type="submit" variant="contained">Guardar</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    )
}