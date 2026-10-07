import { NextRequest } from 'next/server';
import { eventBus, LiveEvent } from '@/lib/event-bus';
import { requireWorkspaceAdmin } from '@/lib/workspace-guard';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const guard = await requireWorkspaceAdmin();
  if (!guard.ok) return guard.response; // Returns 401/403 if unauthorized

  const responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();
  const encoder = new TextEncoder();

  // Keep-alive interval
  const keepAliveId = setInterval(() => {
    writer.write(encoder.encode(': keep-alive\n\n')).catch(() => {});
  }, 15000);

  const listener = (event: LiveEvent) => {
    const data = `data: ${JSON.stringify(event)}\n\n`;
    writer.write(encoder.encode(data)).catch(() => {});
  };

  eventBus.on('live-event', listener);

  req.signal.addEventListener('abort', () => {
    clearInterval(keepAliveId);
    eventBus.off('live-event', listener);
    writer.close().catch(() => {});
  });

  return new Response(responseStream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    },
  });
}
