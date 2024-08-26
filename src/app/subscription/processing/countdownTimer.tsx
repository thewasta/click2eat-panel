'use client'

import {useEffect, useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {processingPayment} from "@/app/actions/stripe/stripe_actions";
import {useRouter} from "next/navigation";
import {toast} from "sonner";

type CountDownTimerProps = {
    token: string;
}
export default function CountDownTimer({token}: CountDownTimerProps) {
    const router = useRouter();
    const [time, setTime] = useState<number>(30);
    const {data, error} = useQuery({
        queryKey: ['processing-payment'],
        queryFn: () => processingPayment(token),
        refetchOnMount: true,
        staleTime: 300
    });
    if (error) {
        toast.error('Ha ocurrido un error al confirmar. Por favor, contáctanos');
    }
    if (data && !data.isPending) {
        router.replace('/');
    }
    useEffect(() => {
        if (time > 0 ) {
            let timer = setInterval(() => {
                setTime((time) => {
                    if (time === 0) {
                        clearInterval(timer);
                        return 0;
                    } else return time - 3;
                });
            }, 3000);
        }
    });

    return (
        <div className="text-4xl font-bold"> {`${Math.floor(time / 60)}`.padStart(2, "0")}:
            {`${time % 60}`.padStart(2, "0")}</div>
    );
}