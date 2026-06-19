import '@testing-library/jest-dom';

// Polyfill Request and Response for JSDOM environment because Next.js App Router API relies on them
if (typeof global.Request === 'undefined') {
  global.Request = class Request {
    public method: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private _body: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(input: string | Request, init?: any) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.method = (init as any)?.method || 'GET';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this._body = (init as any)?.body || '';
    }
    async json() {
      return JSON.parse(this._body);
    }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;
}

if (typeof global.Response === 'undefined') {
  global.Response = class Response {
    public status: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private _body: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(body?: any, init?: any) {
      this._body = body;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.status = (init as any)?.status || 200;
    }
    async json() {
      return typeof this._body === 'string' ? JSON.parse(this._body) : this._body;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static json(data: any, init?: any) {
      return new Response(JSON.stringify(data), init);
    }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;
}

// Mock matchMedia for testing responsive components if needed
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

