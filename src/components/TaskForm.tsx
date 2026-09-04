import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { createTask } from '../services/taskService'
import type { TaskPriority } from '../types'

interface TaskFormProps {
    projectId: number
    onSuccess: () => void
}

export function TaskForm({ projectId, onSuccess }: TaskFormProps) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [priority, setPriority] = useState<TaskPriority>('HIGH')
    const [assigneeId, setAssigneeId] = useState<number>(1)
    const [dueDate, setDueDate] = useState('2026-12-31')

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!title.trim()) return
        try {
            await createTask(projectId, {
                title: title.trim(),
                description: description.trim() || 'Sin descripción',
                priority,
                assigneeId: Number(assigneeId),
                dueDate
            })
            // Limpiar formulario
            setTitle('')
            setDescription('')
            setPriority('HIGH')
            setAssigneeId(1)
            setDueDate('2026-12-31')
            // Avisar al componente padre que recargue la tabla
            onSuccess()
        } catch (err) {
            alert('No se pudo crear la tarea')
        }
    }

    return (
        <Paper elevation={0} sx={{ p: 3, mb: 4, border: '1px solid #FCE4EC' }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">Nueva Tarea</Typography>
            <form onSubmit={handleSubmit}>
                <Stack spacing={2}>
                    <TextField
                        label="Título "
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
                            label="Asignado "
                            type="number"
                            value={assigneeId}
                            onChange={(e) => setAssigneeId(Number(e.target.value))}
                            fullWidth
                            size="small"
                        />
                    </Stack>
                    <Button type="submit" variant="contained" disableElevation sx={{ alignSelf: 'flex-start' }}>
                        Crear Tarea
                    </Button>
                </Stack>
            </form>
        </Paper>
    )
}