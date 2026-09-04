import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import LogoutIcon from '@mui/icons-material/Logout'
import AppBar from '@mui/material/AppBar'
import Button from '@mui/material/Button'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function Navbar() {
    const { logout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    // detecta si la url actual incluye '/tasks'
    const isTaskPage = location.pathname.includes('/tasks')

    function handleLogout() {
        logout()
        navigate('/login')
    }

    return (
        <AppBar position="static" elevation={0} sx={{ borderBottom: '1px solid #FCE4EC', bgcolor: 'white', color: 'primary.main' }}>
            <Toolbar sx={{ position: 'relative', justifyContent: 'center' }}>
                {isTaskPage && (
                    <Button
                        startIcon={<ArrowBackIcon />}
                        color="inherit"
                        onClick={() => navigate('/dashboard')}
                        sx={{ position: 'absolute', left: 16, textTransform: 'none' }}
                    >
                        Volver
                    </Button>
                )}

                <Typography variant="h5" sx={{ fontWeight: 'bold', fontStyle: 'italic' }}>
                    Taskflow
                </Typography>

                <Button
                    startIcon={<LogoutIcon />}
                    color="inherit"
                    onClick={handleLogout}
                    sx={{ position: 'absolute', right: 16, textTransform: 'none' }}
                >
                    Cerrar sesión
                </Button>
            </Toolbar>
        </AppBar>
    )
}