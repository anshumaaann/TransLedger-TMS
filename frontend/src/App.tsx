import AppRouter from "./routes/AppRouter";
import { AuthProvider } from "./auth/AuthContext";

export default function App() {
  return <AuthProvider><AppRouter /></AuthProvider>;
}
