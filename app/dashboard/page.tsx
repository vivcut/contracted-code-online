"use client";

import { cn, font } from "@/lib/utils";
import { ArrowClockwiseIcon, ArticleIcon, CalendarCheckIcon, CalendarX, ClockClockwiseIcon, ExclamationMarkIcon, PlusCircleIcon, Tag, Warning } from "@phosphor-icons/react";
import { CalendarMinus, ChatsTeardropIcon, CurrencyEthIcon, Info, Percent, PersonArmsSpreadIcon, SmileyWinkIcon } from "@phosphor-icons/react/dist/ssr";
import { AddCircle, AddSquare, AltArrowRight, ArrowRight, Bolt, BoltCircle, Card, Card2, ChecklistMinimalistic, FireMinimalistic, InfoCircle, LinkMinimalistic, ShieldPlus, Wallet } from "@solar-icons/react";
import { Shippori_Mincho } from "next/font/google";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../rootprovider";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createClientCall } from "@/supabase"; // Add this import at the top
import { LoadingSpinner } from "@/components/ui/spinner";
import { trackFallbackParamAccessed } from "next/dist/server/app-render/dynamic-rendering";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ArrowRightUp, Filter, Target } from "@solar-icons/react/ssr";
import { BanknoteArrowDown, Calendar, Check, ExternalLink, Goal, Route } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import FadeIn from "react-fade-in";
import { PolarEmbedCheckout } from '@polar-sh/checkout/embed'

const supabase = createClientCall();

const commonHabits = [
  "Smoking",
  "Drinking alcohol",
  "Eating junk food",
  "Procrastinating",
  "Nail biting",
  "Overspending",
  "Social media",
  "Video games",
  "Masturbating",
  "Skipping workouts",
  "Staying up late",
];

const commonPositiveHabits = [
  "Exercising",
  "Meditating",
  "Reading",
  "Journaling",
  "Drinking water",
  "Eating vegetables",
  "Learning a skill",
  "Practicing gratitude",
  "Waking up early",
  "Studying",
  "Running",
];

export default function Page() {
  const { user, setUser } = useContext<any>(UserContext);
  const [step, setStep] = useState(1);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [habits, setHabits] = useState<any>([]);
  const [id, setId] = useState<string | null>("");
  const [loadingHabits, setLoadingHabits] = useState(false);
  const [fade, setFade] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    habitType: "",
    actionType: "",
    habitName: "",
    customHabit: "",
    duration: 30,
    description: "",
    agreed: false,
    deposit: 50,
  });

  const [checkoutInstance, setCheckoutInstance] = useState<any>(null)

  // Clean up checkout instance on unmount
  useEffect(() => {
    return () => {
      if (checkoutInstance) {
        checkoutInstance.close()
      }
    }
  }, [checkoutInstance])

  const handleCheckout = async () => {
    setOpen(false);
    try {
      const checkout = await PolarEmbedCheckout.create(
        `${process.env.NEXT_PUBLIC_CHECKOUT}?customer_email=${user?.email}&customer_name=${user?.name || ""}` as string,
        'dark'
      )

      setCheckoutInstance(checkout)

      checkout.addEventListener('success', (event) => {
        // Track successful purchase


        // Show success message or redirect
        if (!event.detail.redirect) {
          // Handle success in your app
          toast.success('Deposit payed. Please wait.');

          router.push(`/dashboard/challenge/${(id)}`)
        }
      })

      checkout.addEventListener('close', (event) => {
        // Clean up our reference when checkout is closed
        setCheckoutInstance(null)
      })
    } catch (error) {
      console.error('Failed to open checkout', error)
    }
  }

  useEffect(() => {
    PolarEmbedCheckout.init()
  }, [])

  const calculateEndDate = (days: number) => {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);
    return endDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };



  const handleNext = () => {
    setFade(true);
    setTimeout(() => {
      setStep(step + 1);
      setFade(false);
    }, 300);
  };

  const handleBack = () => {
    setFade(true);
    setTimeout(() => {
      setStep(step - 1);
      setFade(false);
    }, 300);
  };
  const validateForm = (formData: any) => {
    if (
      !formData.actionType ||
      !formData.habitName ||
      (formData.habitName === "other" && !formData.customHabit) ||
      !formData.duration ||
      !formData.description ||
      !formData.agreed
    ) return false;
    if (formData.duration < 3 || formData.duration > 365) return false;
    return true;
  };

  const [cLoading, setCLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [openE, setOpenE] = useState(false);


  const handleSubmit = async () => {


    // if (!validateForm(formData)) {
    //   alert("Please fill all fields and ensure duration is between 3 and 365 days.");
    //   return;
    // }

    setCLoading(true);

    // Calculate percent per day
    const percentPerDay = Math.round(100 / formData.duration);

    // Prepare habit object
    const habit = {
      user_id: user?.email,
      actionType: formData.actionType,
      habitName: formData.habitName === "other" ? formData.customHabit : formData.habitName,
      duration: formData.duration,
      description: formData.description,
      checkin: [],
      status: null,
      deposit: 0,
      started: null,
    };

    // Insert into habits collection
    const { data, error } = await supabase
      .from("habits")
      .insert([habit])
      .select();

    if (error) {
      toast.error("Error: " + error.message);
      setCLoading(false);
      return;
    }

    // Update user XP
    // const { error: userError } = await supabase
    //   .from("users")
    //   .update({ points: (user?.points || 0) + 20 })
    //   .eq("id", user?.id)

    // if (userError) {
    //   toast.error("Error updating user XP: " + userError.message);
    //   setCLoading(true);
    //   return;
    // }

    // setUser({ ...user, xp: (user?.xp || 0) + 20 });

    setCLoading(false);


    setId((data as any)[0].id);
    // toast.success(`Challenge created: Now add a deposit to start`);
    // toast(
    //   <div className="flex items-center space-x-3">
    //     <Bolt weight="Bold" className="size-6 text-[#00a1d3]" />
    //     <h1>You gained +20 points</h1>
    //   </div>
    // );

    // setOpen(false);

    // router.push("/dashboard/habits/" + (data as any)[0].id);
    // // Optionally close dialog or reset form here

    handleNext();
  };

  const handleChange = (e: any) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };



  useEffect(() => {
    if (!user?.email) return;
    setLoadingHabits(true);
    supabase
      .from("habits")
      .select("*")
      .eq("user_id", user.email)
      .gt("deposit", 0)
      .then(({ data, error }) => {
        if (!error) setHabits(data || []);
        data?.forEach((d => {
          router.prefetch(`/dashboard/challenge/${d.id}`);
        }))
        setLoadingHabits(false);
      });
  }, [user, open]);

  return (
    <div className="space-y-6">




      <div className="w-full flex justify-between items-center">
        <h1 className={cn("text-3xl tracking-tighter")}>My Contracts</h1>


      </div>



      {/* <Dialog open={openE} onOpenChange={setOpenE}>
        <DialogContent className="w-[400px] h-[80vh] p-8 bg-muted">
          <DialogHeader>
            <DialogTitle className="text-2xl font-[400] tracking-tight">Add a deposit to start</DialogTitle>
            <DialogDescription>
              <ol className="list-disc pl-6 space-y-2 mt-3">
                <li>Check in everyday and refund your full deposit</li>
                <li>Check in occasionally and refund partially</li>
                <li>Add deposit between $5 and up</li>
                <li>Be accountable — $20 is recommended</li>
              </ol>
            </DialogDescription>
          </DialogHeader>
          <div className="">


            <Button onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setOpenE(false);

              if (!process.env.NEXT_PUBLIC_CHECKOUT) {
                toast.error("Please contact support.");
                return;
              }

              router.push(`${process.env.NEXT_PUBLIC_CHECKOUT}?customer_email=${user?.email}&customer_name=${user?.name || ""}`);
            }} className="w-full mb-6 rounded-2xl h-12 gap-1 group text-md">
              <Card2 weight="Bold" className="size-5 mr-2 group-hover:opacity-0 transition duration-300 ease-out" />
              <span className="group-hover:-translate-x-4 transition-all duration-300 ease-out">Pay a deposit</span>
              <LinkMinimalistic weight="Bold" className="size-5 absolute translate-x-[720%] opacity-0 group-hover:opacity-100 transition duration-300 ease-in" />
            </Button>

            <div className="flex items-center space-x-2 w-full justify-center items-center">
              <h1 className="text-sm"> Powered by</h1>
              <svg viewBox="0 0 80 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4"><path d="M31.1672 19.1539V4.18967H37.1316C37.9154 4.18967 38.628 4.38919 39.2694 4.78824C39.9107 5.17303 40.4166 5.70746 40.7871 6.39154C41.1719 7.07561 41.3643 7.83808 41.3643 8.67893C41.3643 9.54825 41.1719 10.3322 40.7871 11.0304C40.4166 11.7288 39.9107 12.2846 39.2694 12.6979C38.628 13.1112 37.9154 13.3178 37.1316 13.3178H33.0271V19.1539H31.1672ZM33.0271 11.5007H37.1743C37.6019 11.5007 37.9866 11.3796 38.3287 11.1373C38.6708 10.8808 38.9415 10.5387 39.1411 10.1113C39.3406 9.68368 39.4404 9.20623 39.4404 8.67893C39.4404 8.16586 39.3406 7.70982 39.1411 7.31077C38.9415 6.91173 38.6708 6.59106 38.3287 6.34878C37.9866 6.1065 37.6019 5.98537 37.1743 5.98537H33.0271V11.5007Z" fill="currentColor"></path><path d="M48.2523 19.3676C47.155 19.3676 46.1716 19.1182 45.3023 18.6194C44.4471 18.1064 43.7703 17.4152 43.2714 16.5458C42.7726 15.6622 42.5232 14.6575 42.5232 13.5316C42.5232 12.4058 42.7726 11.4081 43.2714 10.5387C43.7703 9.66937 44.4471 8.98533 45.3023 8.48653C46.1716 7.98771 47.155 7.73831 48.2523 7.73831C49.3497 7.73831 50.3259 7.98771 51.1811 8.48653C52.0504 8.98533 52.7273 9.66937 53.2119 10.5387C53.7107 11.4081 53.9601 12.4058 53.9601 13.5316C53.9601 14.6575 53.7107 15.6622 53.2119 16.5458C52.7273 17.4152 52.0504 18.1064 51.1811 18.6194C50.3259 19.1182 49.3497 19.3676 48.2523 19.3676ZM48.2523 17.7002C49.0077 17.7002 49.6775 17.5221 50.2618 17.1658C50.8461 16.7952 51.3022 16.2964 51.63 15.6694C51.972 15.0423 52.1359 14.3297 52.1217 13.5316C52.1359 12.7335 51.972 12.0281 51.63 11.4153C51.3022 10.7882 50.8461 10.2965 50.2618 9.94015C49.6775 9.58391 49.0077 9.40576 48.2523 9.40576C47.497 9.40576 46.82 9.58391 46.2214 9.94015C45.6372 10.2965 45.1811 10.7882 44.8534 11.4153C44.5255 12.0423 44.3617 12.7478 44.3617 13.5316C44.3617 14.3297 44.5255 15.0423 44.8534 15.6694C45.1811 16.2964 45.6372 16.7952 46.2214 17.1658C46.82 17.5221 47.497 17.7002 48.2523 17.7002Z" fill="currentColor"></path><path d="M55.9135 19.1539V3.33456H57.7092V19.1539H55.9135Z" fill="currentColor"></path><path d="M64.7936 19.3676C63.8388 19.3676 62.9694 19.1182 62.1856 18.6194C61.416 18.1064 60.8032 17.408 60.3471 16.5244C59.8911 15.6409 59.6631 14.6432 59.6631 13.5316C59.6631 12.4058 59.8982 11.4081 60.3685 10.5387C60.8388 9.66937 61.4659 8.98533 62.2497 8.48653C63.0478 7.98771 63.9386 7.73831 64.9219 7.73831C65.5062 7.73831 66.0407 7.82383 66.5252 7.99484C67.024 8.16586 67.4658 8.40814 67.8507 8.72167C68.2354 9.02096 68.5561 9.37725 68.8126 9.7905C69.0691 10.1896 69.2401 10.6171 69.3257 11.0732L68.8554 10.8594L68.8767 7.97347H70.6724V19.1539H68.8767V16.439L69.3257 16.2038C69.2259 16.617 69.0335 17.0161 68.7485 17.401C68.4777 17.7857 68.1357 18.1277 67.7224 18.427C67.3233 18.7121 66.8744 18.9401 66.3756 19.1111C65.8767 19.2821 65.3495 19.3676 64.7936 19.3676ZM65.2212 17.6788C65.9481 17.6788 66.5894 17.5007 67.1452 17.1444C67.701 16.7881 68.1428 16.3035 68.4706 15.6907C68.7983 15.0636 68.9623 14.3439 68.9623 13.5316C68.9623 12.7335 68.7983 12.0281 68.4706 11.4153C68.157 10.8025 67.7152 10.3178 67.1452 9.96161C66.5894 9.60528 65.9481 9.42711 65.2212 9.42711C64.4943 9.42711 63.853 9.60528 63.2973 9.96161C62.7414 10.3178 62.2996 10.8025 61.9718 11.4153C61.6583 12.0281 61.5016 12.7335 61.5016 13.5316C61.5016 14.3297 61.6583 15.0423 61.9718 15.6694C62.2996 16.2964 62.7414 16.7881 63.2973 17.1444C63.853 17.5007 64.4943 17.6788 65.2212 17.6788Z" fill="currentColor"></path><path d="M72.9796 19.1539V7.97346H74.7753L74.818 11.116L74.6257 10.5815C74.7824 10.0542 75.0389 9.57676 75.3953 9.14922C75.7515 8.72167 76.1719 8.37964 76.6565 8.1231C77.1553 7.86658 77.6826 7.73831 78.2384 7.73831C78.4807 7.73831 78.7088 7.7597 78.9225 7.80244C79.1506 7.83095 79.3358 7.8737 79.4783 7.93071L78.9866 9.91878C78.8014 9.83332 78.609 9.76914 78.4095 9.72641C78.2099 9.68368 78.0246 9.66231 77.8536 9.66231C77.3976 9.66231 76.9772 9.74777 76.5924 9.91878C76.2218 10.0898 75.9012 10.325 75.6304 10.6243C75.3738 10.9093 75.1672 11.2442 75.0104 11.629C74.8679 12.0138 74.7967 12.4271 74.7967 12.8689V19.1539H72.9796Z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M5.08734 21.1119C10.2671 24.6182 17.3085 23.2616 20.8148 18.0818C24.3211 12.9021 22.9645 5.86065 17.7848 2.35436C12.605 -1.15192 5.56353 0.204698 2.05724 5.38446C-1.44904 10.5642 -0.0924184 17.6057 5.08734 21.1119ZM6.58958 21.2045C11.3278 23.6286 17.3384 21.3531 20.0147 16.1221C22.6909 10.891 21.0194 4.68533 16.2811 2.2612C11.543 -0.162919 5.53235 2.11252 2.8561 7.34355C0.179842 12.5745 1.85138 18.7803 6.58958 21.2045Z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M7.93988 22.4416C12.2169 23.8337 17.2485 20.1561 19.1782 14.2276C21.1078 8.29898 19.2047 2.3644 14.9276 0.9723C10.6505 -0.419794 5.61905 3.25775 3.68942 9.18633C1.7598 15.1149 3.6628 21.0495 7.93988 22.4416ZM9.24825 21.991C12.868 22.7631 16.7819 18.796 17.9904 13.1305C19.1988 7.46494 17.244 2.24622 13.6243 1.47416C10.0046 0.702105 6.09064 4.66908 4.88222 10.3347C3.67381 16.0002 5.62854 21.2189 9.24825 21.991Z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M10.2406 22.9252C13.1024 23.2308 15.9585 18.4574 16.6199 12.2635C17.2812 6.06969 15.4974 0.800854 12.6356 0.495275C9.77386 0.189695 6.91772 4.96309 6.25634 11.157C5.59498 17.3508 7.37878 22.6196 10.2406 22.9252ZM11.5798 21.04C13.6508 21.0073 15.264 16.8146 15.1828 11.6754C15.1017 6.53608 13.3568 2.39642 11.2858 2.42914C9.21463 2.46187 7.60148 6.65457 7.68268 11.7939C7.76387 16.9331 9.50864 21.0727 11.5798 21.04Z" fill="currentColor"></path></svg>
            </div>

          </div>
        </DialogContent>
      </Dialog> */}

      <div className="flex items-center justify-between w-full">
        <Dialog open={open} onOpenChange={(open_) => {
          if (true) {
            setOpen(open_);
            // Reset form when dialog closes
            setStep(1);
            setFormData({
              habitType: "",
              actionType: "",
              habitName: "",
              customHabit: "",
              duration: 30,
              description: "",
              agreed: false,
              deposit: 50,
            });
          }
        }}>
          <DialogTrigger className="">
            <Button className="h-11 w-40 text-md text-black bg-white hover:bg-white/90">

              New Contract
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md h-[90vh] p-16 border border-border bg-muted">
            <DialogHeader>
              <DialogTitle className="text-3xl font-[400] tracking-tight">New contract</DialogTitle>
            </DialogHeader>

            <div className={`transition-opacity duration-300 ${fade ? 'opacity-0' : 'opacity-100'}`}>
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <FadeIn delay={300}>
                      <Label className="block font-[400] mb-2 text-lg">What type of goal are you setting?</Label>
                    </FadeIn>
                    {formData.actionType === 'quit' && <span className="text-muted-foreground">Stop smoking, masturbation, etc.</span>}
                    {formData.actionType === 'do' && <span className="text-muted-foreground">Running, Weight loss, etc.</span>}
                    <div className="flex space-x-4 mt-8">
                      <Button
                        variant={formData.actionType === 'quit' ? 'default' : 'outline'}
                        className="flex-1"
                        onClick={() => setFormData({ ...formData, actionType: 'quit' })}
                      >
                        Avoidance goal
                      </Button>
                      <Button
                        variant={formData.actionType === 'do' ? 'default' : 'outline'}
                        className="flex-1"
                        onClick={() => setFormData({ ...formData, actionType: 'do' })}
                      >
                        Approach goal
                      </Button>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    onClick={handleNext}
                    disabled={!formData.actionType}
                  >
                    Next
                  </Button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    {/* <Label className="block mb-2 font-[400]">Select your habit</Label> */}
                    <FadeIn delay={300}>
                      <Select
                        value={formData.habitName}
                        onValueChange={(value) => setFormData({ ...formData, habitName: value })}
                      >
                        <SelectTrigger className="bg-white border rounded-2xl cursor-pointer hover:bg-accent transition duration-300 ease-in-out shadow-none p-6 text-white text-lg">
                          <SelectValue className="text-white" placeholder="Select a goal" />
                        </SelectTrigger>
                        <SelectContent>
                          {(formData.actionType === 'quit' ? commonHabits : commonPositiveHabits).map((habit) => (
                            <SelectItem className="text-white" key={habit} value={habit}>{habit}</SelectItem>
                          ))}
                          <SelectItem value="other">Other (specify below)</SelectItem>
                        </SelectContent>
                      </Select>
                    </FadeIn>
                    {formData.habitName === 'other' && (
                      <Input
                        className="mt-2"
                        placeholder="Enter your goal"
                        name="customHabit"
                        value={formData.customHabit}

                        onChange={handleChange}
                      />
                    )}
                  </div>

                  <div className="flex space-x-4">
                    <Button variant="secondary" className="flex-1" onClick={handleBack}>
                      Back
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={handleNext}
                      disabled={!formData.habitName && !formData.customHabit}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">


                  <div>
                    <FadeIn delay={300}><Label className="block mb-2 text-xl font-[400]">Describe your habit goal</Label></FadeIn>
                    <Textarea
                      placeholder="Run 5km every day, or don't smoke the whole day, etc."
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="flex space-x-4">
                    <Button variant="secondary" className="flex-1" onClick={handleBack}>
                      Back
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={handleNext}
                      disabled={!formData.description}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6">
                  <div className="bg-card border border-primary p-6 px-7 rounded-2xl">
                    <h3 className="text-xl tracking-tighter mb-2">Your Contract</h3>
                    <p className="text-md">
                      You, {user?.name || 'User'}, will{' '}
                      {formData.actionType === 'quit' ? 'stop' : 'start'}{' '}
                      <span className="text-primary">
                        {formData.habitName === 'other' ? formData.customHabit : formData.habitName}
                      </span>.{' '}

                      Additionally, you must must complete this goal and report back to <span className="italic">Contracted</span> everyday to prevent your deposit from being subtracted each day.
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="agree"
                      name="agreed"
                      checked={formData.agreed as boolean}
                      onChange={handleChange}
                      className="h-4 w-4"
                    />
                    <label htmlFor="agree" className="text-sm">
                      I agree to the terms and conditions of this contract
                    </label>
                  </div>

                  <div className="flex space-x-4">
                    <Button variant="outline" className="flex-1" onClick={handleBack}>
                      Back
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={handleSubmit}
                      disabled={cLoading || !formData.agreed}
                    >
                      {cLoading && <LoadingSpinner />}
                      {cLoading ? "" : "Continue"}
                    </Button>
                  </div>
                </div>
              )}

              {step === 5 && (

                <div className="space-y-6 flex flex-col w-full">
                  <span className="text-muted-foreground">A payment gateway will open, and you will need to pay the amount you want to deposit.</span>

                  <p className="p-3 roudned-md">
                    <h1>
                      Use the <span className="underline">{user?.email}</span> as the email to pay the deposit
                    </h1>
                  </p>
                  <Button className="w-full h-13 text-lg bg-white hover:bg-white/90" onClick={handleCheckout}>
                    Pay deposit
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        <div className="flex items-center space-x-2">
          {/* <Button
            size={"icon"}
            variant="outline"
            onClick={() => setSortOrder(sortOrder === "newest" ? "oldest" : "newest")}
          >
            <InfoCircle className="size-4 text-primary" />
          </Button> */}
          <Button onClick={() => {
            setLoadingHabits(true);
            supabase
              .from("habits")
              .select("*")
              .eq("user_id", user.email)
              .gt("deposit", 0)
              .then(({ data, error }) => {
                if (!error) setHabits(data || []);
                setLoadingHabits(false);
              });
          }} disabled={loadingHabits} variant="outline" size={"icon"}>
            <ArrowClockwiseIcon className={loadingHabits ? "animate-spin" : ""} />
          </Button>

          <Button
            variant="outline"
            onClick={() => setSortOrder(sortOrder === "newest" ? "oldest" : "newest")}
          >
            <Filter className="size-4" />
            {sortOrder === "newest" ? "Newest" : "Oldest"}
          </Button>
        </div>


      </div>
      {/* 
      {habits.length == 0 && <div className="bg-card p-3 px-4 w-fit rounded-lg flex items-center space-x-3 border">
        <Info className="size-4.5" weight="fill" />
        <p className="text-md tracking-tight">How do challenges <u className="hover:text-muted-foreground cursor-pointer">work</u>?</p>
      </div>} */}



      {loadingHabits ? (
        <div className="w-full space-x-6 flex">
          <div className="w-full bg-white/5 rounded-xl h-44.5 animate-pulse">

          </div>
          <div className="w-full bg-white/5 rounded-xl h-44.5 animate-pulse">

          </div>
        </div>
      ) : habits.length === 0 ? (
        <div className="p-6 flex items-center space-x-4 bg-white/5 shadow-xs rounded-lg">
          <InfoCircle className="size-6 text-primary" weight="Bold" />
          <div className="flex flex-col space-y-2">
            <h1>You have no challenges. Remember <span className="font-[500]">{user?.name}</span>, you've got this.</h1>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {habits
            .slice()
            .sort((a: any, b: any) =>
              sortOrder === "newest"
                ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                : new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
            )
            .map((habit: any, i: number) => {
              // Calculate refund progress for each habit (match detail page logic)
              const today_ = new Date().toISOString().slice(0, 10);
              const today = new Date();
              let completed = 0, failed = 0, missed = 0;
              const checkinMap = new Map();
              if (habit && habit.checkin) {
                habit.checkin.forEach((c: string) => {
                  const [status, date] = c.split('_');
                  checkinMap.set(date, status);
                });
              }

              if (habit && habit.started && habit.duration) {
                const startDate = new Date(habit.started);
                for (let i = 0; i < habit.duration; i++) {
                  const dateObj = new Date(startDate);
                  dateObj.setDate(startDate.getDate() + i);
                  const dateStr = dateObj.toISOString().split('T')[0];
                  if (dateObj > today) continue; // skip future days
                  const status = checkinMap.get(dateStr);
                  if (status === 'Y') completed++;
                  else if (status === 'N') failed++;
                  else missed++;
                }
              }

              const missedPenalty = (missed + failed) * 0.05 * (habit?.deposit || 0);
              const refundableAmount = Math.max(Math.round((habit?.deposit || 0) - missedPenalty), 0);


              return (
                // <FadeIn delay={i * 400}>
                <div
                  key={habit.id}
                  className="flex flex-row group md:flex-row flex-col items-end justify-between rounded-xl p-8 border hover:bg-white/2 hover:bg-muted transition cursor-pointer w-full"
                  onClick={() => router.push(`/dashboard/challenge/${habit.id}`)}
                >

                  <div className="flex flex-col flex-1 min-w-0">
                    <h2 className="text-3xl mb-2 text-foreground flex items-center space-x-3">
                      {/* <Goal className="size-5 text-primary" /> */}
                      <h1 className="tracking-tight text-xl capitalize">{habit.habitName}</h1></h2>
                    <p className="text-muted-foreground text-xs tracking-[1px] mb-2 truncate font-[500]">{habit.description.toUpperCase()}</p>
                    <div className="flex flex-wrap items-center mt-1">
                      <div className="flex flex-col items-center">
                        <span className="text-sm font-semibold">
                          {/* {checkedInToday ? (
                <span className="inline-flex items-center text-primary">
                  <BoltCircle className="size-4 mr-1" weight="Bold" />
                  Checked
                </span>
              ) : (
                <span className="inline-flex items-center text-muted-foreground">
                  <BoltCircle className="size-4 mr-1" weight="Bold" />
                  Not yet
                </span>
              )} */}
                        </span>
                        {/* <span className="text-xs text-muted-foreground">Today's check-in</span> */}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center mt-4 gap-2">
                      {habit.deposit ? (
                        <span className="text-sm flex items-center bg-muted space-x-1.5 font-[500] w-35 rounded-md text-white relative overflow-hidden h-8">
                          <div
                            className="absolute left-0 top-0 h-full bg-white rounded-l-md rounded-r-md"
                            style={{
                              width: `${Math.max((refundableAmount / (habit.deposit || 1)) * 100, 0)}%`,
                              minWidth: "2rem",
                              transition: "width 0.6s",
                              zIndex: 1,
                            }}
                          />
                          <span
                            className="w-full text-center font-[400] text-white mix-blend-difference relative z-10 pointer-events-none"
                          >
                            USD {(habit.deposit / 100).toFixed(1)}
                          </span>
                        </span>
                      ) : (
                        <Button variant={"ghost"} onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setOpenE(true);
                        }} className="h-8 text-xs border-white/50 border">
                          {/* <Wallet weight="Bold" /> */}
                          No deposit
                        </Button>
                      )}
                      {/* {<span className="text-sm px-3 py-1 flex space-x-1.5 items-center rounded-full bg-primary/10 text-muted-foreground">
                        <Info />
                        <h1>{habit.started ? "Started" : "Add a deposit to start"}</h1>
                      </span>} */}
                    </div>
                  </div>

                  
                  
                  {/* Extra space for right side on desktop */}
                  <div className="h-full flex flex-col justify-between">
                    {habit.status == '""' && <Tooltip>
                      {/* <TooltipTrigger>
                        <div className="p-1 bg-white/10 rounded-md">
                          {/* {habit.checkin.some((d: string) => d.endsWith(today_))
                            ? habit.checkin.find((d: string) => d.endsWith(today_))?.startsWith("Y")
                              ? <CalendarCheckIcon weight="fill" className="size-5.5 text-green-500" />
                              : <CalendarX weight="fill" className="size-5.5 text-red-500" />
                            : <CalendarMinus weight="fill" className="size-5.5 text-amber-400" />
                          } */}
                      {/* </div>
                      </TooltipTrigger> */}
                      <TooltipContent>
                        {habit.checkin.some((d: string) => d.endsWith(today_))
                          ? habit.checkin.find((d: string) => d.endsWith(today_))?.startsWith("Y")
                            ? "Checked in today"
                            : "Failed today"
                          : "You have not checked in today."
                        }
                      </TooltipContent>
                    </Tooltip>}
                    <ArrowRightUp className="hidden group-hover:translate-x-1 group-hover:-translate-y-1 duration-200 group-hover:text-white ease-out md:block size-5 text-muted-foreground" />
                  </div>
                </div>
                // </FadeIn>
              );

            })}
        </div>
      )}


    </div>
  );
}