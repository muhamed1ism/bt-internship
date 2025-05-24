import { RegisterDto } from 'src/auth/dto';

const mockUsers = new Map();

export const apps = [];
export const auth = jest.fn(() => ({
  verifyIdToken: jest.fn((token) => {
    const user = mockUsers.get(token);
    if (!user) throw new Error('Invalid token');

    return Promise.resolve({ uid: token, email: user.email });
  }),

  createUser: jest.fn((registerDto: RegisterDto) => {
    const { email, password } = registerDto;
    if (!email || !password) throw new Error('Invalid register DTO');

    const uid = `mock-uid-${mockUsers.size + 1}`;
    mockUsers.set(uid, { uid, email, password });

    return Promise.resolve({ uid, email });
  }),
}));

export const initializeApp = jest.fn();
export const credential = {
  cert: jest.fn(),
};
