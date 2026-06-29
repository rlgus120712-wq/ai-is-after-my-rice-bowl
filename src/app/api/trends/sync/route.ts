import { syncTrends } from '@/lib/trends'

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  const expectedToken = `Bearer ${process.env.CRON_SECRET}`

  if (process.env.CRON_SECRET && authHeader !== expectedToken) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const count = await syncTrends()
    return Response.json({ success: true, synced: count })
  } catch (error) {
    console.error('Sync error:', error)
    return Response.json({ error: 'Sync failed' }, { status: 500 })
  }
}
