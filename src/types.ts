/** User record as stored by the mock API (json-server). */
export interface User {
  id: number;
  fullName: string;
  email: string;
  password: string; // plaintext: demo only, see README security note
  createdAt: string;
}

export type NewUser = Omit<User, 'id'>;

/** What the browser keeps in localStorage. Never contains the password (SE-01). */
export interface SessionUser {
  id: number;
  fullName: string;
  email: string;
}
