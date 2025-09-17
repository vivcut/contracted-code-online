"use client";

import { Button } from "@/components/ui/button";
import {
  ScanFace,
  Ruler,
  MessageSquare,
  ArrowRight,
  Sparkles,
  Gem,
  TrendingUp,
  ArrowDown
} from "lucide-react";
import Link from 'next/link'
import Navbar from "@/components/ui/navbar";
import LoginWrapper from "@/components/ui/login";
import FadeIn from "react-fade-in";
import { ArrowDownIcon, ChatsTeardropIcon, CheckCircle, CircleNotchIcon, PencilIcon, PersonArmsSpreadIcon, ScissorsIcon, SmileyWinkIcon } from "@phosphor-icons/react/dist/ssr";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { CardholderIcon, CreditCardIcon, PencilCircleIcon, PencilSimpleIcon, Quotes, Subtract, TrendDown } from "@phosphor-icons/react";
import { Cardholder } from "@solar-icons/react/ssr";
import { Safari } from "@/components/magicui/safari";
import HeroVideoDialog from "@/components/magicui/hero-video-dialog";
import { getUserCurrencyCode } from '../lib/currency';

export default function Page() {
  const [selectedGoal, setSelectedGoal] = useState("");
  const goalOptions = [
    "Running", "Reading", "Meditation", "Yoga", "Swimming", "Cycling", "Writing", "Drawing", "Coding", "Cooking", "Learning Spanish", "Learning French", "Learning German", "Learning Japanese", "Learning Chinese", "Photography", "Painting", "Singing", "Dancing", "Public Speaking", "Weightlifting", "Pilates", "Boxing", "Martial Arts", "Chess", "Guitar", "Piano", "Violin", "Drums", "Flute", "Gardening", "Volunteering", "Blogging", "Podcasting", "Investing", "Budgeting", "Saving Money", "Networking", "Journaling", "Mindfulness", "Stretching", "Jump Rope", "Pushups", "Situps", "Squats", "Plank", "HIIT", "Rowing", "Skating", "Surfing", "Climbing", "Traveling", "Camping"
  ];




  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currency, setCurrency] = useState(null);

  useEffect(() => {
    let mounted = true;
    getUserCurrencyCode().then(code => {
      if (mounted) setCurrency(code);
    });
    return () => { mounted = false; };
  }, []);
  const [customGoal, setCustomGoal] = useState("");
  const filteredGoals = goalOptions.filter(goal => goal.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="w-screen min-h-screen text-foreground">
      <Navbar />

      {/* Hero Section */}
      <section className="w-full relative overflow-hidden h-screen flex px-36 items- justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background z-10"></div>
        <div
          className="absolute inset-0 h-full object-cover bg-[url('/liglow.jpg')] saturate-50 bg-cover bg-center rounded-b-3xl"
          style={{
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div className="relative z-20 flex w-screen text-center space-y-4 justify-between items-center">

          <div className="flex flex-col items-start space-y-8">
           <FadeIn>
  <h1 className="text-6xl not-sm:text-5xl text-start tracking-tighter font-[400] leading-18 text-transparent bg-clip-text bg-gradient-to-r from-zinc-800 to-zinc-600 underline decoration-[#e3eff5]">
    Put a contract <br /> on your goals
  </h1>
</FadeIn>

            <p className="text-2xl text-start w-[450px] text-zinc-700 font-[500] mb-12">Bet your goals at stake; Achieve them and get your money back.</p>

            <LoginWrapper>
              <Button
                className="group h-14 sm:w-45 font-[600] transition-all duration-300 ease-out"
                size="lg"

              >
                <span className="text-[16px]">Create contract</span>
              </Button>
            </LoginWrapper>
          </div>

          <div className="p-8 w-[480px] rounded-3xl bg-white shadow-xs">
            <div className="w-full flex items-center justify-between">
              <h1 className="text-2xl font-[500] tracking-tight text-start">New contract</h1>
              <FadeIn><PencilSimpleIcon className="size-6 text-muted-foreground cursor-pointer" /></FadeIn>
            </div>
            <Input
              placeholder="Search for a goal"
              className="mt-4 bg-transparent border border-border bg-none h-10 px-4"
              value={"Go Running"}
            />

            <div>
              {(() => {
                const days = ["S", "M", "T", "W", "T", "F", "S"];
                const highlightCount = 5;

                // Get a shuffled list of indices and take the first 5
                const indices = [...Array(days.length).keys()];
                for (let i = indices.length - 1; i > 0; i--) {
                  const j = Math.floor(Math.random() * (i + 1));
                  [indices[i], indices[j]] = [indices[j], indices[i]];
                }
                const highlighted = new Set(indices.slice(0, highlightCount));

                return (
                  <div className="flex space-x-2 w-full my-4 justify-between">
                    {days.map((day, idx) => (
                      <div
                        key={idx}
                        className={`w-full h-8 w-8 flex font-[500] items-center justify-center ${highlighted.has(idx)
                          ? "bg-r text-black border-[1px] border-secondary rounded-full"
                          : "text-muted-foreground borde border-border rounded-full"
                          }`}
                      >
                        {day}
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>

            <div className="border w-full h-11 rounded-xl rounded-b-none border-border flex">
              <div className="w-[45%] h-full flex items-center px-4 font-[500]">
                Each failed day
              </div>
              <div className="border-l flex items-center w-[55%] space-x-3 px-4">
                <TrendDown weight="fill" className="size-5 text-red-500" />
                <span className="text-black">Lose {currency ?? "$"} 50 </span>
              </div>

            </div>

            <div className="border border-t-0 rounded-t-none w-full h-11 rounded-xl border-border flex">
              <div className="w-[45%] h-full flex items-center px-4 font-[500]">

                Refund deposit
              </div>
              <div className="border-l flex items-center px-4 w-[55%] space-x-3">
                <CheckCircle weight="fill" className="size-5 text-green-500" />
                <span className="text-black">After 14 checked days</span>
              </div>

            </div>

            <Button variant={"secondary"} className="text-black font-[500] w-full mt-4 h-12">
              <div className="flex items-center space-x-3">
                <CardholderIcon weight="fill" className="size-5.5" />
                <span className="text-[16px]">Pay {currency ?? "$"} 500</span>
              </div>
            </Button>
            {/* <Button className="mt-4 hover:bg-zinc-800 text-white font-[500] h-12 w-full text-[18px]">
              Bind contract
            </Button> */}
          </div>








        </div>

        <div className="md:hidden absolute bottom-10 left-0 right-0 flex justify-center z-20">
          <div className="animate-bounce text-white">
            <ArrowDown className="size-7" />
          </div>
        </div>

        {/* <div className="not-md:hidden absolute left-36 bottom-10 right-0 flex z-20">
          <div className="animate-bounce text-white flex items-center space-x-1">

            <ArrowDownIcon className="size-7" />
            {/* <h1 className="text-lg tracking-wider">SCROLL DOWN</h1> */}
        {/* </div>
        </div> */}


      </section>



      {/* Dashboard Preview */}
      <section className="py-20 not-sm:px-2 px-36 w-full flex flex-col items-center justify-center space-y-8">

        <div className="bg-gradient-to-tr rounded-xl from-primary to-violet-500 p-4 py-6 space-y-4 w-full flex flex-col">
          <span className="text-white text-lg w-full text-center font-[500]">Vivaan, Co-founder</span>
          <Quotes weight="fill" className="text-white size-8 mx-auto mb-4" />
          <h1 className="text-2xl px-20 tracking-tight text-center">Honestly, I was tired of my father making excuses. He just wouldn't stay consistent to his weight loss. Contracted solved his issue.</h1>
        </div>

        <div className="bg-gradient-to-tr rounded-xl from-purple-300 to-purple-500 p-4 py-6 space-y-4 w-full flex flex-col">

          <span className="text-white text-lg w-full text-center font-[500]">Dan, Co-founder</span>
          <Quotes weight="fill" className="text-white size-8 mx-auto mb-4" />
          <h1 className="text-2xl px-20 tracking-tight text-center">
            I set the goal of running everyday but it was hard man. Contracted helped me stay accountable.
          </h1>
        </div>
      </section>

      <section className="py-20 not-sm:px-2 px-36 w-full flex flex-col items-center justify-center space-y-8">
        <h3 id="how" className="text-4xl mb-3">How it works</h3>
        <div className="w-full"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-muted rounded-2xl p-6 flex flex-col items-center text-center">
            <h1 className="absolute h-7 w-7 bg-white/10 text-primary rounded-full -translate-x-32 -translate-y-2">
              <span className="font-semibold absolute translate-y-0.5 -translate-x-[3.5px]">
                1
              </span></h1>

            <CircleNotchIcon weight="fill" className="size-10 mb-4 text-primary" />
            <h3 className="text-xl mb-2">Set Your Goal</h3>
            <p className="text-muted-foreground">
              Choose any goal, from fitness to learning. No limits, just results.
            </p>
          </div>
          {/* Step 2 */}
          <div className="bg-muted rounded-2xl p-6 flex flex-col items-center text-center">
            <h1 className="absolute h-7 w-7 bg-white/10 text-primary rounded-full -translate-x-32 -translate-y-2">
              <span className="font-semibold absolute translate-y-0.5 -translate-x-[5px]">
                2
              </span></h1>
            <PencilCircleIcon weight="fill" className="size-10 mb-4 text-primary" />
            <h3 className="text-xl mb-2">Create a contract</h3>
            <p className="text-muted-foreground">
              Pay an amount of money as a deposit and set terms. If you fail, you lose it.
            </p>
          </div>
          {/* Step 3 */}
          <div className="bg-primary rounded-2xl p-6 scale-[1] flex flex-col items-center text-center">
            <h1 className="absolute h-7 w-7 bg-white/20 text-white rounded-full -translate-x-32 -translate-y-2">
              <span className="font-semibold absolute translate-y-0.5 -translate-x-[5px]">
                3
              </span></h1>
            <CreditCardIcon weight="fill" className="size-10 mb-4 text-white" />
            <h3 className="text-xl mb-2">Refund</h3>
            <p className="text-white">
              Refund your deposit once you achieve your goal.
            </p>
          </div>
        </div>

      </section>



      <section className="py-20  not-sm:px-2 px-36 flex justify-center flex-col items-center">
        <h2 className="text-4xl text-white mb-12">
          Demo
        </h2>
        <HeroVideoDialog
          className="block"
          animationStyle="from-center"
          videoSrc="/contracted.mp4"
          thumbnailSrc="/main1.png"
          thumbnailAlt="Hero Video"
        />
      </section>


      <section id="pricing" className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-4xl text-white mb-6">
            No subscription. No pricing.
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto px-5 py-4 bg-muted rounded-2xl w-fit border-border border">
            The only cost is your deposit as commitment. <br /> Achieve your goals and win it back.
          </p>
        </div>
      </section>



      <section className="py-20 px-4 flex justify-center flex-col items-center">
        {/* <h3 className="text-4xl mb-3">Facial Rating</h3>
        <p className="text-muted-foreground mb-6">
          Get a facial assessment with detailed scoring and improvement
        </p> */}
        <div className="sm:w-[80%] rounded-3xl p-12 bg-white/5">
          <Safari url="/dashboard/contract/xyz" imageSrc="/cont.jpg" className="size-full" />
          {/* <img
            src="/main1.png"
            alt="Dashboard Preview"
            className="w-full h-auto rounded-2xl object-contain"
          /> */}
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-4 bg-gradient-to-b from-accent/5 to-background">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl mb-6">
            Ready to Transform Yourself?
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Using money as motivation, Contracted helps you stay accountable to your goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <LoginWrapper>
              <Button size="lg" className="px-8 py-6 text-lg">
                Create contract
              </Button>
            </LoginWrapper>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12 not-sm:px-12 px-36 rounded-t-3xl">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl mb-4">Contracted</h3>
            <p className="text-muted-foreground">
              Put a contract on your goals
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-4">Contact</h4>
            <span>thewinnersface@gmail.com</span>
          </div>

          <div>
            <h4 className="font-medium mb-4">Legal</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link href="/privacypolicy.pdf" className="hover:text-foreground transition">Privacy</Link></li>
              <li><Link href="/tos.pdf" className="hover:text-foreground transition">Terms</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-border text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} Contracted. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}