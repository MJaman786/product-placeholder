import toast from "react-hot-toast"

interface Prop {
    msg: string,
    type: "success" | "error" | "loading"
}

export default function showToast({ msg, type }: Prop) {
    if (type === "success") {
        toast.success(msg)
    }
    if (type === "error") {
        toast.error(msg)
    }
    if (type === "loading") {
        toast.loading(msg)
    }
}
