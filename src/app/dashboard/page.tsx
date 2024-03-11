import Link from "next/link";

export default function dashboardPage() {
    return (
        <div className="flex justify-around">
            <Link href="/dashboard/loginOne">
                Login Example One
            </Link>
            <Link href="/dashboard/loginTwo">
                Login Example Two
            </Link>
        </div>
    )
}