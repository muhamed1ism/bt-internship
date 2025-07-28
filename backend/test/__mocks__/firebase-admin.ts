const mockUsers = new Map();

export type FirebaseUser = {
  displayName: string;
  email: string;
  password: string;
};

export const apps = [];
export const auth = jest.fn(() => ({
  verifyIdToken: jest.fn((token) => {
    const user = mockUsers.get(token);
    if (!user) throw new Error('Invalid token');

    return Promise.resolve({ uid: token, email: user.email });
  }),

  createUser: jest.fn((firebaseUser: FirebaseUser) => {
    const { displayName, email, password } = firebaseUser;
    if (!displayName || !email || !password)
      throw new Error('Invalid register DTO');

    const uid = `mock-uid-${mockUsers.size + 1}`;
    mockUsers.set(uid, { uid, displayName, email, password });

    return Promise.resolve({ uid, displayName, email });
  }),

  updateUser: jest.fn((uid: string, userUpdate: Partial<FirebaseUser>) => {
    const user = mockUsers.get(uid);
    if (!user) throw new Error('User not found');
    const updatedUser = { ...user, ...userUpdate };
    mockUsers.set(uid, updatedUser);
    return Promise.resolve({
      uid,
      displayName: updatedUser.displayName,
      email: updatedUser.email,
    });
  }),
}));

export const initializeApp = jest.fn();
export const credential = {
  cert: jest.fn(),
};
