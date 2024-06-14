"use client"
import {Fragment, ReactNode} from "react";
import {usePathname, useRouter} from "next/navigation";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

export default function Template({children}: { children: ReactNode }) {
    const paths = usePathname();
    const router = useRouter();
    const pathNames = paths.split('/').filter(path => path);
    return (
        <div className={"Example-template"}>
            <Breadcrumb>
                <BreadcrumbList>
                    {
                        pathNames.map((path, index) => (
                                path !== "edit" && (
                                    <Fragment key={index}>
                                        <BreadcrumbItem className={"capitalize"}>
                                            <BreadcrumbLink
                                                href={'/' + pathNames.slice(0, index + 1).join('/')}
                                                onClick={() => router.push('/' + pathNames.slice(0, index + 1).join('/'))}
                                            >
                                                {path}
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
        </div>
    )
}