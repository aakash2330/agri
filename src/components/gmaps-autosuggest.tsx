import Script from "next/script";
import { Input } from "./ui/input";
import { useImperativeHandle, useRef } from "react";
import { env } from "@/env";

export type TgmapsAddress = { city: string; fullAddress: string };

export default function GmapsAutocompleteAddress({
  form,
  innerRef,
  placeholder,
}: {
  form: any;
  innerRef: any;
  placeholder: string;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useImperativeHandle(innerRef, () => {
    return {
      reset: () => {
        if (inputRef.current) {
          inputRef.current.value = "";
          form.setValue("address", "");
        }
      },
    };
  });

  let autocomplete: any = null;

  function onPlaceChanged() {
    const { formatted_address } = autocomplete.getPlace();
    form.setValue("address", formatted_address);
  }

  function initializeGmaps() {
    if ((window as any).google) {
      autocomplete = new (window as any).google.maps.places.Autocomplete(
        document.getElementById("autocomplete"),
        {
          types: ["(cities)"],
        },
      );
      autocomplete.addListener("place_changed", onPlaceChanged);
    }
  }
  return (
    <>
      <Script
        async
        src={`https://maps.googleapis.com/maps/api/js?key=${env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
        strategy="lazyOnload"
        onLoad={initializeGmaps}
      />

      <Input
        ref={inputRef}
        id="autocomplete"
        type="text"
        className="w-full border text-black"
        placeholder="Where are you located?"
      />
    </>
  );
}
