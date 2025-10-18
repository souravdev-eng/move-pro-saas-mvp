import { createBrowserRouter } from 'react-router-dom'
import App from './App'
import RulesetList from '../pages/RulesetList/RulesetList'
import RulesetCreate from '../pages/RulesetCreate/RulesetCreate'
import RulesetDetail from '../pages/RulesetDetail/RulesetDetail'
import ResponseList from '../pages/ResponseList/ResponseList'
import ResponseDetail from '../pages/ResponseDetail/ResponseDetail'

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            { index: true, element: <RulesetList /> },
            { path: 'rulesets', element: <RulesetList /> },
            { path: 'rulesets/new', element: <RulesetCreate /> },
            { path: 'rulesets/:id', element: <RulesetDetail /> },
            { path: 'responses', element: <ResponseList /> },
            { path: 'responses/:id', element: <ResponseDetail /> },
        ],
    },
])

export default router


