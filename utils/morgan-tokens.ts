import morgan from 'morgan'

export function extendMorganTokens() {
  morgan.token('errors', function(req, res) {
    // @ts-ignore
    if (res.locals.error) {
      // @ts-ignore
      return `error: ${JSON.stringify(res.locals.error, null, 2)}`
    }
    return ''
  })
}
