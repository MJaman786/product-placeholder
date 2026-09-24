import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/Auth/useAuthStore";
import AdminLayoutWrapper from "./AdminLayout";

interface Props {
    activePage: string;
}

export default function DynamicRoleLayout({ activePage }: Props) {
    const { isLoggedIn } = useAuthStore();

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    // All users get the admin layout for this product dashboard
    return <AdminLayoutWrapper activePage={activePage} />;
}