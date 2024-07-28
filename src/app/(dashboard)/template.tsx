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
import Link from "next/link";

export default function Template({children}: { children: ReactNode }) {
    const paths = usePathname();
    const pathNames = paths.split('/').filter(path => path);
    return (
        <>
            <Breadcrumb>
                <BreadcrumbList>
                    {
                        pathNames.map((path, index) => (
                                path !== "edit" && (
                                    <Fragment key={index}>
                                        <BreadcrumbItem className={"capitalize"}>
                                            <BreadcrumbLink>
                                                <Link href={'/' + pathNames.slice(0, index + 1).join('/')}>
                                                    {path}
                                                </Link>
                                            </BreadcrumbLink>
                                        </BreadcrumbItem>
                                        {pathNames.length !== index + 1 && <BreadcrumbSeparator/>}
                                    </Fragment>
                                )
                            )
                        )
                    }
                </BreadcrumbList>
            </Breadcrumb>
            {children}
        </>
    )
}