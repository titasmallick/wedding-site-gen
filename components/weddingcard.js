"use client";

import {
  Card,
  CardFooter,
  Image,
  Button,
  CardHeader,
  CardBody,
  Link,
} from "@heroui/react";

const WeddingCard = () => {
  return (
    <section className="relative w-full h-[500px] overflow-hidden rounded-2xl bg-black">
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <iframe
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none border-none"
          style={{
            width: '100vw',
            height: '56.25vw', /* 16:9 Aspect Ratio */
            minHeight: '100%',
            minWidth: '177.77vh', /* 100 / 9 * 16 */
            transform: 'translate(-50%, -50%) scale(1.1)', /* Extra scale to ensure no edge bleed */
          }}
          src="https://www.youtube.com/embed/a_RV8HevyBE?autoplay=1&mute=1&loop=1&playlist=a_RV8HevyBE&controls=0&showinfo=0&modestbranding=1&rel=0"
          title="Pre Wedding Video"
          allow="autoplay; encrypted-media"
        />
      </div>

      {/* Soft overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Card */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <Card className="py-4">
          <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
            <p className="text-tiny uppercase font-bold">Social Marriage</p>
            <small className="text-default-500">23 January, 2026</small>
            <h4 className="font-bold text-large">
              Anandamoyee Bhawan, Serampore
            </h4>
          </CardHeader>
          <CardBody className="overflow-visible py-2">
            <Image
              alt="Card background"
              className="object-cover rounded-xl"
              src="/DCV2.gif"
              width={320}
            />
            <Link
              href="https://maps.app.goo.gl/G5R3bkcTwwa2d54R8"
              showAnchorIcon
              color="warning"
              className="w-full mx-auto text-center mt-2"
            >
              Location
            </Link>
          </CardBody>
        </Card>
      </div>
    </section>
  );
};

export default WeddingCard;
