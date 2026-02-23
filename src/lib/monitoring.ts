/**
 * Application monitoring utilities.
 * Uses Vercel Analytics (Web Vitals) + console-based error logging.
 * Replace with Sentry when error volume warrants it.
 */

export function reportWebVitals(metric: {
  id: string
  name: string
  value: number
  label: string
}) {
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vital] ${metric.name}: ${metric.value.toFixed(2)}`)
  }

  // Send to Vercel Analytics (automatically handled by @vercel/analytics)
  // No additional code needed if @vercel/analytics is installed
}

/**
 * Structured error logger for API routes.
 * Captures context for debugging without exposing details to users.
 */
export function logError(
  context: string,
  error: unknown,
  meta?: Record<string, unknown>
) {
  const message = error instanceof Error ? error.message : String(error)
  const stack = error instanceof Error ? error.stack : undefined

  console.error(JSON.stringify({
    level: 'error',
    context,
    message,
    stack,
    ...meta,
    timestamp: new Date().toISOString(),
  }))
}
