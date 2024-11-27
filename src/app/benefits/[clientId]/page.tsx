'use client'
import useGeneralStore from "@/stores/generalStore";
import { ClientMode, PreMode } from "@/types/types";
export default function ClientId() {

    const setClientMode = useGeneralStore((state) => state.setClientMode);
    const setPreMode = useGeneralStore((state) => state.setPreMode);
    const { clientMode } = useGeneralStore();

    if (clientMode == ClientMode.connection) {
        setClientMode(ClientMode.general);
        setPreMode(PreMode.none);
    }


    return <div>clientId</div>

}