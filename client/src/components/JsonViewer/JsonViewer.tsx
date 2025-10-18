import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

export default function JsonViewer({ title, data }: { title?: string; data: unknown }) {
    return (
        <Card variant="outlined">
            {title ? <Typography variant="subtitle1" sx={{ px: 2, pt: 2 }}>{title}</Typography> : null}
            <CardContent>
                <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{JSON.stringify(data, null, 2)}</pre>
            </CardContent>
        </Card>
    )
}


