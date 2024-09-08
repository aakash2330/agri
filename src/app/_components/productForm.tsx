"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { useState } from "react";
import _ from "lodash";

const createProductFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name of the product must be at least 2 characters.",
  }),

  description: z.string().min(2, {
    message: "description of the product must be at least 2 characters.",
  }),
});

type TcreateProductFormSchema = typeof createProductFormSchema;

export function ProfileForm() {
  const [fileUploadedUrl, setFileUploadedUrl] = useState<string | null>("");

  const utils = api.useUtils();
  const createProduct = api.product.create.useMutation({
    onSuccess: async () => {
      await utils.product.invalidate();
      form.reset();
    },
  });

  const form = useForm<z.infer<TcreateProductFormSchema>>({
    resolver: zodResolver(createProductFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  function onSubmit(values: z.infer<TcreateProductFormSchema>) {
    if (_.isEmpty(fileUploadedUrl)) {
      return alert("Please Upload a file to continue");
    }
    const { name, description } = values;
    createProduct.mutate({ name, description, image: fileUploadedUrl! });
  }
  return (
    <>
      <UploadDropzone
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          console.log("Files: ", res);
          alert("Upload Completed");
          const uploadedFile = res[0]?.url ?? null;
          setFileUploadedUrl(uploadedFile);
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
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </>
  );
}
