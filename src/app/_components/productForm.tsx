"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRef } from "react";
import { createProductZod, type TcreateProductZod } from "types/product";
import dynamic from "next/dynamic";

const DynamicGmapsAutosuggest = dynamic(
  () => import("../../components/gmaps-autosuggest"),
  {
    ssr: false,
  },
);

export function ProfileForm() {
  const gmapsInputRef = useRef<any>(null);

  const utils = api.useUtils();
  const createProduct = api.product.create.useMutation({
    onSuccess: async () => {
      await utils.product.invalidate();
      form.reset();
    },
  });

  const form = useForm<TcreateProductZod>({
    resolver: zodResolver(createProductZod),
    defaultValues: {
      name: "",
      description: "",
      address: "",
      image: [],
    },
  });

  function onSubmit(values: TcreateProductZod) {
    console.log("submitted", { values });
    const { name, description, address, image } = values;
    createProduct.mutate({
      name,
      description,
      image,
      address,
    });
  }
  return (
    <>
      <UploadDropzone
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          console.log("Files: ", res);
          alert("Upload Completed");
          const uploadedFileUrls = res.map((r) => r.url ?? "");
          form.setValue("image", uploadedFileUrls);
        }}
        onUploadError={(error: Error) => {
          alert(`ERROR! ${error.message}`);
        }}
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col items-center justify-center space-y-8"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Product Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="Product Description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <DynamicGmapsAutosuggest
            placeholder={"Where is the product located?"}
            innerRef={gmapsInputRef}
            form={form}
          ></DynamicGmapsAutosuggest>
          <Button
            type="submit"
            onClick={() => {
              //onSubmit(form.getValues());
              console.log(form.getValues());
            }}
          >
            Submit
          </Button>
        </form>
      </Form>
    </>
  );
}
