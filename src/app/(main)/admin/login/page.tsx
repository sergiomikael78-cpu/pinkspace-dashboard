import LoginForm from "./LoginForm";
import { ShieldAlert } from "lucide-react";

export default function AdminLoginPage() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[70vh] animate-in fade-in duration-500 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg mb-4" style={{ background: "linear-gradient(135deg, var(--pink-500), var(--pink-600))" }}>
            <ShieldAlert size={32} />
          </div>
          <h1 className="text-3xl font-extrabold text-ink-900 mb-2">Admin Panel</h1>
          <p className="text-ink-500">Masukkan kata sandi untuk mengakses area terlarang ini.</p>
        </div>

        <div className="glass-card p-6 md:p-8 rounded-3xl shadow-xl border border-pink-100/50">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
