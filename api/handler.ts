import app from '../backend/src/app';

const getPathParam = (pathValue: string | string[] | undefined) => {
  if (Array.isArray(pathValue)) {
    return pathValue.join('/');
  }

  return pathValue || '';
};

export default function handler(request: any, response: any) {
  const path = getPathParam(request.query?.path);
  const queryEntries = Object.entries(request.query || {}).filter(([key]) => key !== 'path');
  const queryString = new URLSearchParams(
    queryEntries.flatMap(([key, value]) => {
      if (Array.isArray(value)) {
        return value.map((item) => [key, String(item)] as [string, string]);
      }

      if (value == null) {
        return [];
      }

      return [[key, String(value)] as [string, string]];
    }),
  ).toString();

  request.url = `/api${path ? `/${path}` : ''}${queryString ? `?${queryString}` : ''}`;

  return app(request, response);
}
