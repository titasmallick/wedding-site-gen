"use client";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { HeartFilledIcon } from "@/components/icons";
const Sagun = () => {
  return (
    <main>
      <Button
        isExternal
        as={Link}
        className="text-sm font-normal text-default-600 bg-default-100"
        href={"/sagun"}
        startContent={<HeartFilledIcon className="text-danger" />}
        variant="flat"
      >
        Sagun
      </Button>
    </main>
  );
};

export default Sagun;
