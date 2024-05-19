export default function MesasLayout({
                                        children,
                                    }: {
    children: React.ReactNode
}) {
    return (
        <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(100px,1fr))",
        }}>
            {children}
        </div>
    )
}