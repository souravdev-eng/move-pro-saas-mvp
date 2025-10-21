import { createBrowserRouter } from 'react-router-dom'
import App from './App'
import Dashboard from '../pages/Dashboard/Dashboard'
import RulesetList from '../pages/RulesetList/RulesetList'
import RulesetCreate from '../pages/RulesetCreate/RulesetCreate'
import RulesetDetail from '../pages/RulesetDetail/RulesetDetail'
import ResponseList from '../pages/ResponseList/ResponseList'
import ResponseDetail from '../pages/ResponseDetail/ResponseDetail'
import JobList from '../pages/JobList/JobList'
import JobCreate from '../pages/JobCreate/JobCreate'
import JobDetail from '../pages/JobDetail/JobDetail'

import TenantOnboarding from '../pages/TenantOnboarding/TenantOnboarding'

export const router = createBrowserRouter([
    {
        path: '/onboarding',
        element: <TenantOnboarding />,
    },
    {
        path: '/',
        element: <App />,
        children: [
            { index: true, element: <Dashboard /> },
            { path: 'rulesets', element: <RulesetList /> },
            { path: 'rulesets/new', element: <RulesetCreate /> },
            { path: 'rulesets/:id', element: <RulesetDetail /> },
            { path: 'responses', element: <ResponseList /> },
            { path: 'responses/:id', element: <ResponseDetail /> },
            { path: 'jobs', element: <JobList /> },
            { path: 'jobs/new', element: <JobCreate /> },
            { path: 'jobs/:id', element: <JobDetail /> },
        ],
    },
])

export default router


