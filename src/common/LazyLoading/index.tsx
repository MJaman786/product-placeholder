import { Suspense } from "react";

interface Prop {
    children: React.ReactNode;
}

export default function LazyLoadingWrapper({ children }: Prop) {
    return <Suspense fallback>{children}</Suspense>
}
