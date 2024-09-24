'use client'
import {MapPinned} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import React from "react";
import {useMutation} from "@tanstack/react-query";
import {selectBusiness} from "@/app/actions/auth/login_actions";
import {toast} from "sonner";

type SelectBusinessCardProps = { businessLocal: any };

export default function SelectBusinessCard(props: SelectBusinessCardProps) {
    const {businessLocal} = props;
    const mutation = useMutation({
        mutationFn: selectBusiness,
        onError: () => {
            toast.error('Ha ocurrido un error inesperado. Por favor, inténtelo de nuevo')
        }
    })
    const handleSelectBusiness = () => {
        mutation.mutate(businessLocal.id);
    }

    return (
        <Card key={businessLocal.id}
              className={'bg-muted p-4 flex flex-col justify-between'}>
            <div>
                <h3 className="text-xl font-semibold">{businessLocal.business.name}</h3>
                <p className="text-muted-foreground flex items-center">{businessLocal.address}
                    <MapPinned className={'text-xs'}/>
                </p>
            </div>
            <Button onClick={handleSelectBusiness} variant="outline"
                    className="mt-4">
                Select
            </Button>
        </Card>
    );
}