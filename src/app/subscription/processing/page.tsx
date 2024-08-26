import {Card, CardContent} from "@/components/ui/card";
import {LoaderPinwheelIcon} from "lucide-react";
import {redirect} from "next/navigation";
import CountDownTimer from "@/app/subscription/processing/countdownTimer";

type PaymentProcessingProps = {
    searchParams: {
        token: string
    }
}

export default function PaymentProcessingPage({
                                                  searchParams,
                                              }: PaymentProcessingProps) {
    if (!searchParams.token) {
        redirect('/');
    }
    return (
        <div className="w-full max-w-6xl mx-auto py-12 px-4 md:px-6">
            <div className="text-center space-y-4 mb-12">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Pago en proceso de verificación</h1>
                <p className="text-muted-foreground text-lg md:text-xl">
                    Estamos verificando tu pago. Por favor, espera mientras procesamos tu solicitud.
                </p>
                <CountDownTimer token={searchParams.token}/>
            </div>
            <div className="flex justify-center">
                <Card className="w-full max-w-md">
                    <CardContent className="space-y-6 p-4">
                        <div className="flex items-center justify-center">
                            <LoaderPinwheelIcon className="h-12 w-12 animate-spin text-primary"/>
                        </div>
                        <p className="text-center text-muted-foreground">
                            Tu pago está siendo procesado. Te notificaremos cuando se complete la verificación.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
