import '@testing-library/jest-dom';

// Polyfill Request and Response for JSDOM environment because Next.js App Router API relies on them
if (typeof global.Request === 'undefined') {
  global.Request = class Request {
    public method: string;
    private _body: string;
    constructor(input: string | Request, init?: any) {
      this.method = init?.method || 'GET';
      this._body = init?.body || '';
    }
    async json() {
      return JSON.parse(this._body);
    }
  } as any;
}

if (typeof global.Response === 'undefined') {
  global.Response = class Response {
    public status: number;
    private _body: any;
    constructor(body?: any, init?: any) {
      this._body = body;
      this.status = init?.status || 200;
    }
    async json() {
      return typeof this._body === 'string' ? JSON.parse(this._body) : this._body;
    }
    static json(data: any, init?: any) {
      return new Response(JSON.stringify(data), init);
    }
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

