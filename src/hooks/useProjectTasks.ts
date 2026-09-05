import { useCallback, useEffect, useState } from 'react'
import { getProjects } from '../services/projectService'
import { getProjectTasks } from '../services/taskService'
import type { Task } from '../types'

export function useProjectTasks(projectId: number) {
    const [tasks, setTasks] = useState<Task[]>([])
    const [projectName, setProjectName] = useState<string>('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchTasks = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            // solo traemos las tareas del proyecto
            const [projectTasks, allProjects] = await Promise.all([
                getProjectTasks(projectId),
                getProjects()
            ])
            setTasks(projectTasks)

            const currentProject = allProjects.find((p) => p.id === projectId)
            if (currentProject) setProjectName(currentProject.name)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar los datos')
        } finally {
            setLoading(false)
        }
    }, [projectId])

    useEffect(() => {
        fetchTasks()
    }, [fetchTasks])

    return { tasks, projectName, loading, error, refetch: fetchTasks }
}