"use client"
import {Fragment, ReactNode} from "react";
import {usePathname} from "next/navigation";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import {toast} from "sonner";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {FaCopy} from "react-icons/fa";

const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
        .then(() => {
            toast.info('ID copiado', {
                description: "El ID ha sido copiado al portapapeles"
            });
        }).catch(err => {
        console.warn(err);
    });
};
export default function Template({children}: { children: ReactNode }) {
    const paths = usePathname();
    const pathNames = paths.split('/').filter(path => path);
    return (
        <>
            <Breadcrumb>
                <BreadcrumbList>
                    {
                        pathNames.map((path, index) => {
                                const isEditPage = pathNames[index - 1] === "edit";
                                const isLastItem = index === pathNames.length - 1;
                                if (path !== 'edit') {
                                    return (
                                        <Fragment key={index}>
                                            <BreadcrumbItem className={"capitalize"}>
                                                <BreadcrumbLink asChild>
                                                    <Link href={'/' + pathNames.slice(0, index + 1).join('/')}>
                                                        {path}
                                                    </Link>
                                                </BreadcrumbLink>
                                                {isEditPage && isLastItem && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="ml-1"
                                                        onClick={() => copyToClipboard(path)}
                                                        title="Copiar ID"
                                                    >
                                                        <FaCopy className="h-4 w-4"/>
                                                    </Button>
                                                )}
                                            </BreadcrumbItem>
                                            {pathNames.length !== index + 1 && <BreadcrumbSeparator/>}
                                        </Fragment>
                                    )
                                }
                                return null
                            }
                        )
                    }
                </BreadcrumbList>
            </Breadcrumb>
            {children}
        </>
    )
}