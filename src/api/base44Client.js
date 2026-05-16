// Mocked base44 client to remove dependency on the SDK
export const base44 = {
  auth: {
    me: () => Promise.resolve({ id: 'mock-user-id', email: 'user@example.com' }),
    logout: () => console.log('Mocked logout'),
    redirectToLogin: () => console.log('Mocked redirect to login'),
  },
  api: {
    get: (url) => Promise.resolve({}),
    post: (url, data) => Promise.resolve({}),
    put: (url, data) => Promise.resolve({}),
    delete: (url) => Promise.resolve({}),
  },
  functions: {
    invoke: (name, data) => Promise.resolve({ data: {} }),
  },
  storage: {
    upload: () => Promise.resolve({ url: '' }),
    getPublicUrl: (path) => path,
  }
};
