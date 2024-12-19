"use client";
import AboutComp from "@/components/About/AboutComp";
import useGeneralStore from "@/stores/generalStore";
import { ClientMode } from "@/types/types";


const About = () => {
  const setClientMode = useGeneralStore((state) => state.setClientMode);
  const { clientMode } = useGeneralStore();

  if (clientMode == ClientMode.connection) setClientMode(ClientMode.general);

  return <AboutComp></AboutComp>;
};

export default About;
