import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <h2 className="text-3xl bg-red-400 font-extralight my-3 mx-5">
        Hello Sansar

      </h2>
      <Button className="mt-4">Click me</Button>
    </div>
  );
}
