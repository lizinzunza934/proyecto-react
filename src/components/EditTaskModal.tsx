import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { useEffect, useState } from 'react'
import type { Task, TaskPriority } from '../types'

interface EditTaskModalProps {
    task: Task | null
    onClose: () => void
    onSave: (id: number, data: Partial<Task>) => Promise<void>
}

export function EditTaskModal({ task, onClose, onSave }: EditTaskModalProps) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [priority, setPriority] = useState<TaskPriority>('MED')
    const [assigneeId, setAssigneeId] = useState<number>(1)
    const [dueDate, setDueDate] = useState('')

    // cada vez que se abre el modal con una nueva tarea llenamos el formulario
    useEffect(() => {
        if (task) {
            setTitle(task.title)
            setDescription(task.description || '')
            setPriority(task.priority || 'MED')
            setAssigneeId(task.assigneeId || 1)
            setDueDate(task.dueDate || '2026-12-31')
        }
    }, [task])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!task) return
        await onSave(task.id, {
            title: title.trim(),
            description: description.trim(),
            priority,
            assigneeId: Number(assigneeId),
            dueDate
        })
    }

    return (
        <Dialog open={Boolean(task)} onClose={onClose} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 4 } }}>
            <form onSubmit={handleSubmit}>
                <DialogTitle sx={{ fontWeight: 'bold' }}>Editar Tarea</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField label="Título" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth required />
                        <TextField label="Descripción" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth multiline rows={2} />
                        <FormControl fullWidth size="small">
                            <InputLabel>Prioridad</InputLabel>
                            <Select value={priority} label="Prioridad" onChange={(e) => setPriority(e.target.value as TaskPriority)}>
                                <MenuItem value="LOW">Baja (LOW)</MenuItem>
                                <MenuItem value="MED">Media (MED)</MenuItem>
                                <MenuItem value="HIGH">Alta (HIGH)</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField label="Fecha Límite" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} InputLabelProps={{ shrink: true }} fullWidth size="small" />
                        <TextField label="Asignado (ID)" type="number" value={assigneeId} onChange={(e) => setAssigneeId(Number(e.target.value))} fullWidth size="small" />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 0 }}>
                    <Button onClick={onClose} sx={{ textTransform: 'none', color: 'text.primary' }}>Cancelar</Button>
                    <Button type="submit" variant="contained" sx={{ textTransform: 'none', disableElevation: true }}>Guardar</Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}