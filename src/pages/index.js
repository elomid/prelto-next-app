import { Inter, Nanum_Myeongjo, Aclonica } from "next/font/google";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });
const nanumMyeongjo = Nanum_Myeongjo({ subsets: ["latin"], weight: "800" });
const aclonica = Aclonica({ subsets: ["latin"], weight: "400" });

export default function Home() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Add actual endpoint for early access submission
    setSubmitted(true);
  };

  return (
    <>
      <main
        className={`${inter.className} antialiased max-w-[960px] mx-auto selection:bg-[#70F4EC] px-4`}
      >
        <header className="py-8">
          <div className="flex items-center justify-between">
            <Link href="/">
              <div
                className={`${aclonica.className} text-[20px] font-extrabold tracking-[-0.2px]`}
              >
                Prelto
              </div>
            </Link>

            <Link href="/auth/login">
              <Button variant="outline">Log in</Button>
            </Link>
          </div>
        </header>

        <div className="content flex flex-col gap-32 py-20">
          <section className="hero flex flex-col gap-20">
            <div className="hero-text-and-cta text-center flex flex-col items-center justify-center gap-8">
              <div className="hero-text-block flex flex-col items-center justify-center gap-3">
                <h1
                  className={`${nanumMyeongjo.className} text-[28px] font-extrabold tracking-[-0.2px] sm:text-[21px] md:text-[36px]`}
                >
                  Discover insights on Reddit
                </h1>
                <p className="mx-auto  md:max-w-[480px]">
                  Leverage AI to discover insights, patterns, and opportunities.
                  Gain a deeper understanding of your audience.
                </p>
              </div>

              <RequestAccessDialog
                open={open}
                setOpen={setOpen}
                email={email}
                setEmail={setEmail}
                submitted={submitted}
                setSubmitted={setSubmitted}
                message={message}
                setMessage={setMessage}
                handleSubmit={handleSubmit}
              />
            </div>

            <Image src="/hero.png" alt="Prelto" width={960} height={552} />
          </section>

          <Section
            title="Ask anything"
            description="Find the answers to your research questions, directly derived from the posts and comments of your choice."
            ImageSrc="/ask.png"
            ImageAlt="Screenshot of the Ask anything feature"
            ImageWidth={960}
            ImageHeight={443}
          />

          <Section
            title="Find emerging patterns"
            description="Detect emerging patterns from thousands of comments, giving you a comprehensive understanding of your audience."
            ImageSrc="/patterns.png"
            ImageAlt="Screenshot of the Ask anything feature"
            ImageWidth={960}
            ImageHeight={378}
          />

          <Section
            title="Automatic labeling"
            description="Categorize all posts automatically based on your custom-defined labels."
            ImageSrc="/labels.png"
            ImageAlt="Screenshot of the Ask anything feature"
            ImageWidth={960}
            ImageHeight={264}
          />

          <section className="cta-container flex justify-between items-center p-8 border rounded-3xl">
            <p className="font-medium">Get started with Prelto</p>
            <RequestAccessDialog
              open={open}
              setOpen={setOpen}
              email={email}
              setEmail={setEmail}
              submitted={submitted}
              setSubmitted={setSubmitted}
              message={message}
              setMessage={setMessage}
              handleSubmit={handleSubmit}
            />
          </section>
        </div>
      </main>
      <footer className="py-16 border-t bg-[#EFF1F1] px-4">
        <div className="max-w-[960px] mx-auto text-sm text-black/75">
          <p>Prelto © 2024</p>
        </div>
      </footer>
    </>
  );
}

function RequestAccessDialog({
  open,
  setOpen,
  email,
  setEmail,
  submitted,
  setSubmitted,
  message,
  setMessage,
  handleSubmit,
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="black">Request Early Access</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Request Early Access</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="col-span-3"
              disabled={submitted}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="message" className="text-right">
              What excited you about Prelto?
            </Label>
            <Input
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="col-span-3"
              disabled={submitted}
            />
          </div>
          <div className="text-right">
            {submitted ? (
              <Button type="submit" disabled>
                Check your email
              </Button>
            ) : (
              <Button type="submit" onClick={handleSubmit}>
                Submit
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Section({
  title,
  description,
  ImageSrc,
  ImageAlt,
  ImageWidth,
  ImageHeight,
}) {
  return (
    <section className="flex flex-col gap-12">
      <div className="flex flex-col gap-2 max-w-[670px] mx-auto w-[960px]">
        <h1
          className={`${nanumMyeongjo.className} text-[28px] font-extrabold tracking-[-0.2px] sm:text-[18px] md:text-[28px]`}
        >
          {title}
        </h1>
        <p className="">{description}</p>
      </div>
      <Image
        src={ImageSrc}
        alt={ImageAlt}
        width={ImageWidth}
        height={ImageHeight}
      />
    </section>
  );
}
