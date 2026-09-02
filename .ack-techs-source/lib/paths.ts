// This source is exported as a static site below the personal site's domain.
// Keep internal links inside the public /ack-techs route after export.
const basePath = '/ack-techs';

export function ackPath(pathname = '/') {
  return `${basePath}${pathname.startsWith('/') ? pathname : `/${pathname}`}`;
}
