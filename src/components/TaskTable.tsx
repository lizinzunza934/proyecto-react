import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
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
import Typography from '@mui/material/Typography'
import type { Task, TaskStatus } from '../types'

interface TaskTableProps {
    tasks: Task[]
    loading: boolean
    error: string | null
    onStatusChange: (id: number, status: TaskStatus) => void
    onEdit: (task: Task) => void
    onDelete: (id: number) => void
}

export function TaskTable({ tasks, loading, error, onStatusChange, onEdit, onDelete }: TaskTableProps) {
    if (loading) return <Box p={3} component={Paper} elevation={0} sx={{ border: '1px solid #FCE4EC' }}><Typography color="text.secondary">Cargando tareas...</Typography></Box>
    if (error) return <Box p={3} component={Paper} elevation={0} sx={{ border: '1px solid #FCE4EC' }}><Alert severity="error">{error}</Alert></Box>
    if (tasks.length === 0) return <Box p={3} component={Paper} elevation={0} sx={{ border: '1px solid #FCE4EC' }}><Typography color="text.secondary">No hay tareas en este proyecto.</Typography></Box>

    return (
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #FCE4EC' }}>
            <Table>
                <TableHead sx={{ bgcolor: '#FFF5F7' }}>
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
                        <TableRow key={task.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell>{task.title}</TableCell>
                            <TableCell>
                                <Select
                                    value={task.status}
                                    size="small"
                                    onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
                                    sx={{ minWidth: 130, bgcolor: 'white' }}
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
                                    sx={{
                                        bgcolor: task.priority === 'HIGH' ? '#FFCDD2' : task.priority === 'MED' ? '#FFE082' : '#C8E6C9',
                                        color: task.priority === 'HIGH' ? '#B71C1C' : task.priority === 'MED' ? '#FF8F00' : '#2E7D32',
                                        fontWeight: 'bold'
                                    }}
                                />
                            </TableCell>
                            <TableCell>{task.dueDate || '—'}</TableCell>
                            <TableCell>{task.assigneeId ?? '—'}</TableCell>
                            <TableCell align="right">
                                <Stack direction="row" spacing={1} justifyContent="flex-end">
                                    <Button size="small" variant="outlined" color="primary" onClick={() => onEdit(task)} sx={{ textTransform: 'none' }}>
                                        Editar
                                    </Button>
                                    <Button size="small" variant="contained" color="primary" disableElevation onClick={() => onDelete(task.id)} sx={{ textTransform: 'none' }}>
                                        Borrar
                                    </Button>
                                </Stack>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}