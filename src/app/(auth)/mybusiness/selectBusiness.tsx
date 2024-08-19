'use client'
import {MapPinned} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import React from "react";
import {useMutation} from "@tanstack/react-query";
import {selectBusiness} from "@/app/actions/auth/login_actions";

type SelectBusinessCardProps = { business: any, businessLocal: any };

export default function SelectBusinessCard(props: SelectBusinessCardProps) {
    const {business, businessLocal} = props;
    const mutation = useMutation({
        mutationFn: selectBusiness
    })
    const handleSelectBusiness = () => {
        mutation.mutate(businessLocal.business_local_id);
    }

    return (
        <Card key={businessLocal.id}
              className={'bg-muted p-4 flex flex-col justify-between'}>
            <div>
                <h3 className="text-xl font-semibold">{business.name}</h3>
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