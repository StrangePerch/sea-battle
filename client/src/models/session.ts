export type Session = {
  isAuthenticated?: boolean;
  username?: string;
}

export const initialSession: Session = {
  isAuthenticated: undefined,
  username: undefined,
};