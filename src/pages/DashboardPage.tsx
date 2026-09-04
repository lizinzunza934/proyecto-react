import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { ProjectForm } from '../components/ProjectForm'
import { ProjectList } from '../components/ProjectList'
import { Navbar } from '../components/Navbar'
import { useProjectForm } from '../hooks/useProjectForm'
import { useProjects } from '../hooks/useProjects'


export function DashboardPage() {
    const { projects, loading, error, refetch } = useProjects()
    const projectForm = useProjectForm({ onSuccess: refetch })


    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <Navbar />
            <Container maxWidth="lg" sx={{ mt: 4, pb: 6 }}>

            <Container maxWidth="lg" sx={{ mt: 4, pb: 6 }}>
                <Stack spacing={4}>
                    <Paper elevation={0} sx={{ p: 3, border: '1px solid #FCE4EC' }}>
                        <ProjectForm {...projectForm} />
                    </Paper>

                    <Box>
                        <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
                            Mis Proyectos
                        </Typography>
                        <ProjectList projects={projects} loading={loading} error={error} />
                    </Box>
                </Stack>
            </Container>
            </Container>
        </Box>
    )
}