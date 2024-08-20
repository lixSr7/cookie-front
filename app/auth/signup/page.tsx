"use client";
import React, { useState } from "react";
import { Input, Checkbox, Image, Button, useDisclosure, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ScrollShadow } from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";

import { EyeSlashFilledIcon } from "../utils/EyeSlashFilledIcon";
import { EyeFilledIcon } from "../utils/EyeFilledIcon";
import "react-toastify/dist/ReactToastify.css";

export default function SIGNUP() {
  const [isVisible, setIsVisible] = React.useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();
  const [isSending, setIsSending] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleRegister = async () => {
    if (!username) {
      toast.error("Username is required.");

      return;
    }
    if (username.length < 8 || username.length > 20) {
      toast.error("Username must be between 8 and 20 characters long.");

      return;
    }
    if (!email) {
      toast.error("Email is required.");

      return;
    }
    if (!email.includes("@")) {
      toast.error("Email must include '@'.");

      return;
    }
    if (!email.includes(".")) {
      toast.error("Email must include '.'.");

      return;
    }
    if (!password) {
      toast.error("Password is required.");

      return;
    }
    if (!confirmPassword) {
      toast.error("Confirm password is required.");

      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");

      return;
    }
    if (password.length < 8 || password.length > 20) {
      toast.error("Password must be between 8 and 20 characters long.");

      return;
    }

    setIsSending(true);
    try {
      const response = await fetch(
        "https://rest-api-cookie-u-c.onrender.com/api/auth/signup?",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            username,
            password,
          }),
        }
      );

      if (response.ok) {
        toast.success("Registro exitoso");

        setTimeout(() => {
          router.push("/auth/signin");
        }, 1500);
      } else {
        toast.error("Error al registrar");
      }
    } catch (error) {
      toast.error("Error al registrar");
      setIsSending(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex flex-col items-center justify-center w-1/2 text-white bg-[#dd2525]">
        <Image alt="NextUI hero Image" className="p-1 bg-white rounded-full" height={250} src="/img/cookie_register.png" width={250} />
        <p className="font-bold">COOKIE, The new social network for people</p>
        <p className="font-bold">with visual disabilities.</p>
      </div>
      <div className="flex flex-col items-center justify-center w-1/2 text-black bg-white">
        <div className="flex flex-col items-center justify-center m-6 h-1/4 max-h-1/4 min-h-1/4">
          <h1 className="text-5xl font-bold text-[#dd2525] ">WELCOME</h1>
          <hr className="w-1/2" />
          <p className="text-xs text-gray-400">
            Sign up to access all features
          </p>
        </div>
        <div className="flex flex-col items-center justify-center gap-4 mb-4 h-2/3 max-h-2/3 min-h-2/3">
          <Input required isDisabled={isSending} label="Username" type="text" value={username} variant="bordered" onChange={(e) => setUsername(e.target.value)} />
          <Input required isDisabled={isSending} label="Email" type="text" value={email} variant="bordered" onChange={(e) => setEmail(e.target.value)} />
          <Input required className="text-black" endContent={
            <button className="focus:outline-none" type="button" onClick={toggleVisibility} >
              {isVisible ? (
                <EyeSlashFilledIcon className="text-2xl pointer-events-none text-default-400" />
              ) : (
                <EyeFilledIcon className="text-2xl pointer-events-none text-default-400" />
              )}
            </button>
          } isDisabled={isSending} label="Password" placeholder="Enter your password" type={isVisible ? "text" : "password"} value={password} variant="bordered" onChange={(e) => setPassword(e.target.value)} />
          <Input required className="text-black" endContent={
            <button className="focus:outline-none" type="button" onClick={toggleVisibility} >
              {isVisible ? (
                <EyeSlashFilledIcon className="text-2xl pointer-events-none text-default-400" />
              ) : (
                <EyeFilledIcon className="text-2xl pointer-events-none text-default-400" />
              )}
            </button>
          } isDisabled={isSending} label="Confirm Password" placeholder="Confirm your password" type={isVisible ? "text" : "password"} value={confirmPassword} variant="bordered" onChange={(e) => setConfirmPassword(e.target.value)} />
          <div className="w-full flex justify-start items-center gap-4">
            <div className="flex items-center justify-center gap-2 text-xs p-0 m-0">
              <Checkbox radius="sm" color="default" isSelected={isAccepted} onValueChange={setIsAccepted} />
              <p>I agree to the</p>
              <button className="font-bold text-[#dd2525]" onClick={onOpen}>Terms and Conditions</button>
            </div>
          </div>
          <Button className="w-1/2 font-bold text-white bg-[#dd2525]" isLoading={isSending} isDisabled={!isAccepted || isSending} onClick={handleRegister} >
            Register
          </Button>
          <div className="flex flex-col items-center justify-center gap-0 m-0">
            <p className="text-xs text-black">
              already have an account?{" "}
              <a className="font-bold text-[#dd2525]" href="/auth/signin">
                {" "}
                Login Now
              </a>
            </p>
          </div>
          <Link className="fixed top-0 flex items-center justify-center w-full h-full m-4 rounded-full cursor-pointer hover:bg-zinc-100 max-w-6 max-h-6 left-1/2" href="/" >
            <svg className="w-8 h-8 p-2 font-bold text-[#dd2525]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" >
              <path d="M15.75 19.5 8.25 12l7.5-7.5" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
        <div className="flex flex-col items-center justify-center mb-3 h-1/4 max-h-1/4 min-h-1/4">
          <hr className="w-1/5" />
          <p className="text-xs text-gray-400">
            politics of privacy and security - All rights reserved ©
          </p>
        </div>
      </div>
      <ToastContainer limit={5} />

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="inside">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Términos y Condiciones</ModalHeader>
              <ModalBody>
                <ScrollShadow hideScrollBar className="w-full h-full overflow-y-auto flex flex-col m-auto">
                  <h1 className="text-left mt-3 text-lg font-bold">1. Aceptación de los Términos</h1>
                  <p className="text-xs">
                    Al acceder y usar la plataforma de Cookie, aceptas cumplir con estos términos y condiciones. Si no estás de acuerdo con alguno de los términos aquí expuestos, te pedimos que no utilices la plataforma.
                  </p>

                  <h1 className="text-left mt-3 text-lg font-bold">2. Registro de Usuario</h1>
                  <p className="text-xs">
                    Para utilizar los servicios de Cookie, deberás crear una cuenta. Al registrarte, garantizas que la información proporcionada es precisa y completa. Eres responsable de mantener la confidencialidad de tus credenciales de acceso.
                  </p>

                  <h1 className="text-left mt-3 text-lg font-bold">3. Uso de la Plataforma</h1>
                  <h4 className="text-left font-semibold ml-4">3.1. Conducta del Usuario</h4>
                  <p className="text-xs ml-4">
                    Los usuarios deben utilizar la plataforma de manera ética y legal. Queda prohibido:
                    <ul className="ml-9 list-disc">
                      <li>Publicar contenido que sea ofensivo, amenazante, difamatorio, discriminatorio, o que infrinja derechos de terceros.</li>
                      <li>Participar en cualquier actividad que pueda interferir con el funcionamiento de la plataforma.</li>
                      <li>Usar la plataforma con fines fraudulentos.</li>
                    </ul>
                  </p>

                  <h4 className="text-left font-semibold  ml-4">3.2. Contenido Publicado</h4>
                  <p className="text-xs ml-4">
                    Eres el propietario de todo el contenido que publiques en Cookie. Sin embargo, al publicar contenido, otorgas a Cookie una licencia no exclusiva, gratuita y mundial para mostrar dicho contenido en la plataforma. Cookie no se responsabiliza por el contenido generado por los usuarios.
                  </p>

                  <h1 className="text-left mt-3 text-lg font-bold">4. Protección de Datos Personales</h1>
                  <p className="text-xs">
                    De acuerdo con la Ley 1581 de 2012 y el Decreto 1377 de 2013, Cookie se compromete a proteger la privacidad de tus datos personales. Al utilizar nuestra plataforma, aceptas que tus datos personales sean recolectados, almacenados y utilizados conforme a nuestra política de privacidad. Tienes derecho a conocer, actualizar, rectificar y suprimir tus datos personales, así como a revocar la autorización para su tratamiento.
                  </p>

                  <h1 className="text-left mt-3 text-lg font-bold">5. Derechos ARCO</h1>
                  <p className="text-xs">
                    Tienes derecho a ejercer los derechos de acceso, rectificación, cancelación y oposición (ARCO) sobre tus datos personales. Para ejercer estos derechos, puedes contactarnos a través de los canales indicados en nuestra política de privacidad.
                  </p>

                  <h1 className="text-left mt-3 text-lg font-bold">6. Recolección de Datos Sensibles</h1>
                  <p className="text-xs">
                    Cookie no recolectará datos sensibles sin tu consentimiento explícito. En caso de que sea necesario, se te informará de manera clara y específica sobre la finalidad de la recolección de dichos datos y los derechos que te asisten.
                  </p>

                  <h1 className="text-left mt-3 text-lg font-bold">7. Transferencia Internacional de Datos</h1>
                  <p className="text-xs">
                    En caso de que tus datos personales sean transferidos a terceros países, Cookie garantizará que se cumplan las disposiciones de protección de datos aplicables en Colombia, incluyendo la obtención de tu consentimiento previo cuando sea necesario.
                  </p>

                  <h1 className="text-left mt-3 text-lg font-bold">8. Modificaciones a los Términos y Condiciones</h1>
                  <p className="text-xs">
                    Cookie se reserva el derecho de modificar estos términos y condiciones en cualquier momento. Las modificaciones serán efectivas a partir de su publicación en la plataforma. Si continúas utilizando la plataforma después de la publicación de las modificaciones, se entenderá que aceptas los nuevos términos.
                  </p>

                  <h1 className="text-left mt-3 text-lg font-bold">9. Responsabilidad Limitada</h1>
                  <p className="text-xs">
                    Cookie no será responsable por daños directos, indirectos, incidentales o consecuentes que resulten del uso o la imposibilidad de uso de la plataforma. Esto incluye, sin limitarse a, daños por pérdida de datos o beneficios, interrupción de negocio o cualquier otro daño comercial.
                  </p>

                  <h1 className="text-left mt-3 text-lg font-bold">10. Ley Aplicable y Jurisdicción</h1>
                  <p className="text-xs">
                    Estos términos y condiciones se regirán e interpretarán de acuerdo con las leyes de la República de Colombia. Cualquier disputa que surja en relación con estos términos será sometida a la jurisdicción de los tribunales competentes en Colombia.
                  </p>
                </ScrollShadow>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <div className="w-content flex justify-start items-center gap-4">
                  <div className="flex items-center justify-center">
                    <Checkbox radius="sm" color="default" isSelected={isAccepted} onValueChange={(newValue) => { setIsAccepted(newValue); if (newValue) { onOpenChange(); } }} />
                    <p>Accept</p>
                  </div>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
} 