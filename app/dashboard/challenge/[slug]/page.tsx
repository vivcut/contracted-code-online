"use client";

import { useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClientCall } from "@/supabase";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Goal, Info, Percent, Share2, XCircle, Wallet, ChevronLeft } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart, Sector } from "recharts"
import { PieSectorDataItem } from "recharts/types/polar/Pie"
import Moment from 'react-moment';
import { CircleNotchIcon } from "@phosphor-icons/react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CalendarCheck, CalendarX, Check } from "@phosphor-icons/react/dist/ssr";
import { toast } from "sonner";
import { FlagBannerFoldIcon } from "@phosphor-icons/react";
import { UserContext } from "@/app/rootprovider";
import { ArrowLeft, Bolt, Card2, LinkMinimalistic } from "@solar-icons/react";
import { ArrowRight } from "@solar-icons/react/ssr";

const supabase = createClientCall();



export default function Page() {
  const router = useRouter();
  const params = usePathname();
  const slug = params.replace("/dashboard/challenge/", "");
  const [habit, setHabit] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user, setUser } = useContext<any>(UserContext);
  const [openE, setOpenE] = useState(false);
  const [checkinLoading, setCheckinLoading] = useState(false);
  const [openRefund, setOpenRefund] = useState(false);
  const [openForfeit, setOpenForfeit] = useState(false);
  const [openShare, setOpenShare] = useState(false);
  const [creator, setCreator] = useState<any>(null);
  const now = new Date();
  const [calendarMonth, setCalendarMonth] = useState(now.getMonth());
  const [calendarYear, setCalendarYear] = useState(now.getFullYear());
  const id = "pie-interactive"
  const [showCount, setShowCount] = useState(5);
  const [checkins, setCheckins] = useState<string[]>([]);
  // Use pieData for interactive chart
  const today = new Date();
  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  // Map checkins by date for quick lookup
  const checkinMap = new Map();
  if (habit && habit.checkin) {
    habit.checkin.forEach((c: string) => {
      const [status, date] = c.split('_');
      checkinMap.set(date, status);
    });
  }

  let completed = 0, failed = 0, missed = 0;
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
  const pieData = [
    { name: 'Completed', value: completed, fill: '#34d399' },
    { name: 'Failed', value: failed, fill: '#ef4444' },
    { name: 'Missed', value: missed, fill: '#fee685' },
  ];
  const pieConfig = {
    Completed: { label: 'Completed', color: 'var(--chart-1)' },
    Failed: { label: 'Failed', color: 'var(--chart-2)' },
    Missed: { label: 'Missed', color: 'var(--chart-3)' },
  };
  const pieChartData = pieData;

  const [activeSegment, setActiveSegment] = useState(pieChartData[0]?.name || "Completed");
  const activeIndex = useMemo(
    () => pieChartData.findIndex((item) => item.name === activeSegment),
    [activeSegment, pieChartData]
  );
  const segments = useMemo(() => pieChartData.map((item) => item.name), [pieChartData]);
  // Calendar logic with month navigation



  // Find start and end dates
  const startDateStr = habit?.started ? habit.started.split('T')[0] : null;
  let endDateStr = null;
  if (habit?.started && habit?.duration) {
    const startDateObj = new Date(habit.started);
    // Add (duration - 1) days to start date for inclusive end
    startDateObj.setDate(startDateObj.getDate() + Number(habit.duration) - 1);
    // Format as YYYY-MM-DD
    endDateStr = startDateObj.toISOString().split('T')[0];
  }


  useEffect(() => {
    if (!habit?.user_id) return;
    supabase
      .from("users")
      .select("*")
      .eq("email", habit.user_id)
      .single()
      .then(({ data }: any) => {
        if (data) setCreator(data);
      });
  }, [habit?.user_id]);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    supabase
      .from("habits")
      .select("*")
      .eq("id", slug)
      .single()
      .then(({ data, error }: any) => {
        if (!error) setHabit(data);
        setCheckins(data.checkin.slice(-showCount).reverse())
        setLoading(false);
      });
  }, [slug]);



  // Progress calculations
  const todayIso = new Date().toISOString().split("T")[0];
  let completedDays = 0;
  let failedDays = 0;
  let forfeited = habit?.forfeited || false;
  if (habit && habit.checkin) {
    completedDays = habit.checkin.filter((c: string) => {
      const [status, date] = c.split("_");
      return status === "Y";
    }).length;
    failedDays = habit.checkin.filter((c: string) => {
      const [status, date] = c.split("_");
      return status === "N";
    }).length;
  }
  const totalDays = habit?.duration || 1;
  const total = completed + failed + missed;
  const percentCompleted = total > 0 ? completed / total : 0;
  const percentFailed = total > 0 ? failed / total : 0;
  const percentEmpty = total > 0 ? missed / total : 0;
  const deposit = habit?.deposit || 0;
  const startedDate = habit?.started ? new Date(habit.started) : null;
  const daysSinceStarted = startedDate ? Math.floor((new Date().getTime() - startedDate.getTime()) / (1000 * 60 * 60 * 24)) : 0;
  const daysLeft = totalDays - (completedDays + failedDays);

  // Check-in logic
  const handleCheckin = async (success: boolean) => {
    if (!habit) return;
    setCheckinLoading(true);
    const todayIso = new Date().toISOString().split("T")[0];
    if (habit.checkin.some((c: string) => c.endsWith(todayIso))) {
      setCheckinLoading(false);
      return;
    }
    const newCheckin = success ? `Y_${todayIso}` : `N_${todayIso}`;
    const updatedCheckin = [...habit.checkin, newCheckin];
    const { error } = await supabase
      .from("habits")
      .update({ checkin: updatedCheckin })
      .eq("id", habit.id);
    if (!error) setHabit({ ...habit, checkin: updatedCheckin });
    setCheckinLoading(false);
  };

  // Calculate current streak
  let streak = 0;
  if (habit && habit.checkin && habit.checkin.length > 0) {
    // Sort checkins by date ascending
    const sorted = [...habit.checkin].sort((a, b) => {
      const dateA = a.split('_')[1];
      const dateB = b.split('_')[1];
      return dateA.localeCompare(dateB);
    });
    // Go backwards from today, count consecutive 'Y' until first 'N' or missing day
    for (let i = sorted.length - 1; i >= 0; i--) {
      const [status, date] = sorted[i].split('_');
      if (status === 'Y') {
        streak++;
      } else if (status === 'N') {
        break;
      }
    }
    // If today is failed, streak is 0
    if (habit.checkin.some((c: string) => c === `N_${todayIso}`)) {
      streak = 0;
    }
  }

  // Forfeit logic
  const handleForfeit = async () => {
    if (!habit) return;
    await supabase
      .from("habits")
      .update({ status: "forfeited" })
      .eq("id", habit.id);
    setHabit({ ...habit, status: "forfeited" });
    setOpenForfeit(false);

    toast.info("You have forfeited your challenge. This challenge is now uneditable.", { duration: 10_000 });
  };

  const refundLogic = async () => {
    if (!habit) return;
    await supabase
      .from("habits")
      .update({ status: "refunded" })
      .eq("id", habit.id);
    setHabit({ ...habit, status: "refunded" });
    setOpenForfeit(false);

    toast.info("Refund initiated. You will recieve your refund via the same payment method within 3 - 10 day business days", { duration: 20_000 })
  };


  // Pie chart data for completed, failed, missed days (excluding future days)

  const hide = habit?.status === "forfeited" || habit?.status === "refunded"

  // Loader skeleton
  if (loading || !habit) return (
    <div></div>
  );

  // Calculate today's check-in status and refund logic for UI
  const todayCheckin = habit?.checkin?.find((c: string) => c.endsWith(todayIso));
  const missedPenalty = (failed + missed) * 0.05 * (habit?.deposit || 0);
  const refundableAmount = Math.max(Math.round((habit?.deposit || 0) - missedPenalty), 0);



  const chartConfig = {
    visitors: {
      label: "Visitors",
    },
    desktop: {
      label: "Desktop",
    },
    mobile: {
      label: "Mobile",
    },
    january: {
      label: "January",
      color: "var(--chart-1)",
    },
    february: {
      label: "February",
      color: "var(--chart-2)",
    },
    march: {
      label: "March",
      color: "var(--chart-3)",
    },
    april: {
      label: "April",
      color: "var(--chart-4)",
    },
    may: {
      label: "May",
      color: "var(--chart-5)",
    },
  } satisfies ChartConfig


  if (user?.email !== habit?.user_id) {
    return <p className="mt-6">This is not your habit</p>
  }



  return (
    <div className="w-full max-w-3xl mx-auto py-10">
      {/* Streak and today's check-in */}

      <Dialog open={openE} onOpenChange={setOpenE}>
        <DialogContent className="w-[400px] h-[80vh] p-8 bg-card">
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
      </Dialog>

      <p className="mb-3">Each day missed or failed is ${((habit.deposit/100)*0.05).toFixed(1)} lost</p>


      <div className="flex flex-row group md:flex-row flex-col items-center justify-between p-5 md:p-7 bg-white/5 rounded-xl hover:border-primary transition cursor-pointer w-full gap-6 md:gap-8 mb-8">
        <div className="flex flex-col flex-1 min-w-0 md:pl-6">
          <h2 className="text-2xl mb-1 text-foreground flex items-center space-x-3">
            <CircleNotchIcon weight="fill" className="size-6" />
            <h1 className="tracking-tighter">{habit.habitName}</h1>
          </h2>
          <p className="text-muted-foreground mb-1 truncate">{habit.description}</p>
            <div className="flex flex-wrap items-center gap-6 mt-1">
            <span className="text-sm flex items-center bg-muted space-x-1.5 font-[500] w-100 rounded-md text-white sticky top-4 z-10 relative overflow-hidden">
              <div
              className="bg-white h-7 rounded-l-md rounded-r-md flex items-center justify-center"
              style={{
                width: `${Math.max((refundableAmount / (habit.deposit || 1)) * 100, 0)}%`,
                minWidth: "2rem",
                transition: "width 0.6s"
              }}
              >
              <h1 className="font-[400] w-full text-center text-black">
                $ {(refundableAmount / 100).toFixed(2)} / {(habit.deposit / 100).toFixed(2)}
              </h1>
              </div>
            </span>
            </div>
          <div className="flex flex-wrap items-center mt-4 gap-2">
            {!hide && <span className="text-xs px-4 py-2 rounded-full bg-white text-black">
              {habit.started ? <span>Started <Moment fromNow>{new Date(habit.started)}</Moment></span> : "Not started"}
            </span>}
            {habit.status == "forfeited" && <span className="text-xs px-3 py-1 rounded-md bg-red-500 text-white">Forfeited challenge</span>}
            {habit.status == "refunded" && <span className="text-xs p-2 px-3 rounded-md bg-green-400 text-black">Refund processing... <br /> Approx. 3 - 10 business days to recieve via same payment method</span>}
            {habit.status == "done" && <span className="text-xs px-3 py-1 rounded-md bg-green-400 text-black">Refund has been sent to yo</span>}
            {/* {habit.status == "refund" && <span className="text-xs px-3 py-1 rounded-full bg-red-500 text-white">Refunded</span>} */}
          </div>
        </div>
        <div className="flex flex-col items-end justify-between h-full">
          <span className="text-sm text-muted-foreground mb-2">Created by</span>
          <div className="flex items-center gap-2">
            <Avatar className="rounded-md">
              <AvatarImage src={creator?.image || ""} alt={creator?.name.toUpperCase() || "U"} />
              <AvatarFallback className="rounded-md">
                {creator?.name.substring(0, 1).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <span className="">
              {creator?.email === habit?.user_id ? "You" : creator?.name || "Unknown"}
            </span>
          </div>


        </div>
      </div>

      <div className="flex flex-col items-center mb-8">
        {/* <img style={{ filter: streak > 0 ? "brightness(1.32)" : "saturate(0)" }} src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Fire.png" alt="Fire" width="80" height="80" /> */}

        {!hide && <span className="mt-2 text-3xl">{todayCheckin ? (todayCheckin.startsWith('Y') ? 'Checked in today' : 'Failed today') : 'Check in for today'}</span>}
        {(!hide && habit.deposit) ? <div className="flex gap-4 mt-4">
          <Button
            disabled={!!todayCheckin || forfeited}
            onClick={async () => {
              if (!habit) return;
              const newCheckin = `Y_${todayIso}`;
              const updatedCheckin = [...habit.checkin, newCheckin];
              const { error } = await supabase
                .from("habits")
                .update({ checkin: updatedCheckin })
                .eq("id", habit.id);
              if (!error) setHabit({ ...habit, checkin: updatedCheckin });

              // const { error: userError } = await supabase
              //   .from("users")
              //   .update({ points: (user?.points || 0) + 20 })
              //   .eq("id", user?.id)

              // if (userError) {
              //   toast.error("Error updating user XP: " + userError.message);

              //   return;
              // }

              // setUser({ ...user, xp: (user?.xp || 0) + 50 });


              toast.success("Keep it up! You checked in today.");

              // toast(
              //   <div className="flex items-center space-x-3">
              //     <Bolt weight="Bold" className="size-6 text-[#00a1d3]" />
              //     <h1>You gained +50 points</h1>
              //   </div>
              // );

              // setUser((prev: any) => ({ ...prev, points: (prev?.points || 0) + 50, xp: (prev?.xp || 0) + 50 }));
            }}
          >Completed</Button>
          <Button
            disabled={!!todayCheckin || forfeited}
            variant="outline"
            onClick={async () => {
              toast.success("You lost $ " + ((habit.deposit / 100) * 0.05).toFixed(2) + " for failing");
              if (!habit) return;
              const newCheckin = `N_${todayIso}`;
              const updatedCheckin = [...habit.checkin, newCheckin];
              const { error } = await supabase
                .from("habits")
                .update({ checkin: updatedCheckin })
                .eq("id", habit.id);
              if (!error) setHabit({ ...habit, checkin: updatedCheckin });



            }}
          >Failed</Button>
        </div> : null}
        {!habit.deposit && <span className="mt-2 text-muted-foreground">You must add a deposit first, and then start.</span>}
      </div>

      {/* Pie Chart */}
      <div className="mb-8">
        <Card className="flex flex-col border-none bg-white/5">
          <CardHeader className="items-center pb-0">
            <CardTitle className="font-normal">Progress Breakdown</CardTitle>
            <CardDescription>Up to today</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={pieConfig}
              className="mx-auto aspect-square max-h-[150px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie data={pieChartData} dataKey="value" nameKey="name" />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      {/* Border progress bar for refund */}
      <div className="w-full">
        <div className="flex w-full space-x-4 justify-center items-center">
          <div className="w-full h-8 flex relative">
            <div
              className="absolute left-0 top-0 h-full w-full rounded-lg"
              style={{ zIndex: 0, background: "repeating-linear-gradient(45deg, #171719 0px, #171719 8px, #1e1e20 8px, #1e1e20 16px)" }}
            />
            {(refundableAmount && habit.deposit) && <div
              className="h-full rounded-lg flex flex-col items-end justify-center px-1.5 bg-blue-500"
              style={{
                width: `${((habit?.deposit || 0) - missedPenalty) / (habit?.deposit || 1) * 100}%`,

                zIndex: 1,
                transition: "width 0.6s"
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="size-5" viewBox="0 0 24 24">
                {/* Icon from MingCute Icon by MingCute Design - https://github.com/Richard9394/MingCute/blob/main/LICENSE */}
                <g fill="white" fillRule="evenodd">
                  <path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z" />
                  <path fill="white" d="M18.089 2.624a1 1 0 0 0-1.099.155q-.149.135-.282.285c-.151.167-.35.407-.542.708c-.373.583-.79 1.5-.638 2.577c.151 1.077.804 1.844 1.324 2.301c.145.129.288.24.418.333c-.316.89-.193 1.761-.025 2.363q.06.21.125.389c-.787.548-1.193 1.344-1.403 1.94a5 5 0 0 0-.185.658c-.865.125-1.548.574-1.995.958c-.328.28-.654.61-.885.979c-.554.887-.615 1.996-.327 2.936c.292.952.99 1.87 2.109 2.243a1 1 0 0 0 .74-1.855l-.108-.043c-.312-.104-.573-.347-.736-.692c.46.25 1.023.44 1.67.44c1.088 0 1.938-.54 2.463-.99a5.3 5.3 0 0 0 .869-.955a1 1 0 0 0-.002-1.111l-.046-.067q.287-.098.57-.26c.943-.544 1.409-1.437 1.639-2.09c.094-.269.157-.518.197-.72l.047-.264l.024-.194l.007-.083a1 1 0 0 0-.555-.96l-.047-.023c.192-.221.365-.477.504-.774c.46-.986.329-1.984.143-2.651a4.8 4.8 0 0 0-.498-1.19a1.01 1.01 0 0 0-1.007-.47l-.071.013c.032-.27.034-.558-.008-.857c-.151-1.077-.805-1.843-1.324-2.301a4.8 4.8 0 0 0-1.066-.728m-12.178 0a1 1 0 0 1 1.099.155q.149.135.282.285c.151.167.35.407.542.708c.373.583.79 1.5.638 2.577c-.151 1.077-.804 1.844-1.324 2.301a5 5 0 0 1-.418.333c.316.89.193 1.761.025 2.363q-.06.21-.125.389c.786.548 1.193 1.344 1.403 1.94c.085.243.144.468.185.658c.865.125 1.548.574 1.995.958c.328.28.654.61.885.979c.554.887.615 1.996.327 2.936c-.292.952-.99 1.87-2.109 2.243a1 1 0 0 1-.74-1.855l.108-.043c.312-.104.573-.347.736-.692c-.46.25-1.023.44-1.67.44c-1.088 0-1.937-.54-2.463-.99a5.4 5.4 0 0 1-.625-.635a4 4 0 0 1-.244-.32a1 1 0 0 1 .002-1.111l.046-.067a3.3 3.3 0 0 1-.57-.26c-.943-.544-1.409-1.437-1.639-2.09a5 5 0 0 1-.197-.72l-.047-.264l-.024-.194a1 1 0 0 1 .547-1.044l.048-.022a3.3 3.3 0 0 1-.504-.774c-.46-.986-.329-1.984-.143-2.651a4.8 4.8 0 0 1 .498-1.19a1.01 1.01 0 0 1 1.007-.47l.071.013a3.3 3.3 0 0 1 .008-.857c.151-1.077.804-1.843 1.324-2.301a4.8 4.8 0 0 1 1.066-.728" />
                </g>
              </svg>
            </div>}
          </div>
          {(!hide && habit.deposit && refundableAmount) ? <Button className="" variant="secondary" onClick={() => {
            const MIN_COMPLETED_FOR_REFUND = 14;
            if (completed < MIN_COMPLETED_FOR_REFUND) {
              // Show toast error
              if (typeof window !== "undefined") {
                // Use native alert for simplicity, replace with your toast if available
                toast.error(`You need at least ${MIN_COMPLETED_FOR_REFUND} completed days to refund.`);
              }
              return;
            }
            setOpenRefund(true);

          }}>Refund</Button> : <>
           {!habit.deposit && <Button onClick={() => {
              setOpenE(true);
            }}>
              Add deposit</Button>}
          </>}
          <Dialog open={openRefund} onOpenChange={setOpenRefund}>

            <DialogTrigger asChild></DialogTrigger>
            <DialogContent className="h-[80vh] w-[400px]">

              <DialogHeader><DialogTitle>Refund</DialogTitle></DialogHeader>
              <div className="mt-4">You can refund ${refundableAmount} out of ${habit?.deposit || 0}.</div>
              <Button className="mt-4" variant="default" onClick={() => {
                setOpenRefund(false);
                refundLogic();

              }}>Refund</Button>
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex justify-between mt-2">

          <span className="text-md">${(habit.deposit / 100).toFixed(2)} Deposited</span>

          {(habit.deposit && refundableAmount > 0) ? (
            <span className="text-md">${(refundableAmount / 100).toFixed(2)} Refundable</span>
          ) : null}
        </div>





      </div>

      <div className="w-full mt-6">
        <div className="w-full h-8 flex gap-4 relative">
          <div
            className="h-full rounded-lg"
            style={{
              width: `${percentCompleted * 100}%`,
              background: `#34d399`,
              transition: "width 0.6s",
              zIndex: 1,
            }}
          />
          <div
            className="h-full rounded-lg"
            style={{
              width: `${percentFailed * 100}%`,
              background: '#ef4444',
              transition: "width 0.6s",
              zIndex: 1,
            }}
          />
          <div
            className="h-full rounded-lg bg-amber-200"
            style={{
              width: `${percentEmpty * 100}%`,
              transition: "width 0.6s",
              zIndex: 1,
            }}
          />
        </div>

      </div>
      <div className="mt-2 flex text-sm items-center space-x-4">
        <h1 className="text-[#34d399] font-">
          {completed} {completed === 1 ? "day" : "days"} completed
        </h1>
        <h1 className="text-[#ef4444] font-">
          {failed} {failed === 1 ? "day" : "days"} failed
        </h1>
        <h1 className="text-amber-200 font-">
          {missed} {missed === 1 ? "day" : "days"} missed
        </h1>
      </div>

      {/* Created by */}
      {/* Optionally display creator info here if needed */}
      {/* Golden refunded badge */}

      {/* Top bar: Back, Share, Forfeit */}
      <div className="flex items-center justify-between mb-8">
        {/* <Button variant="ghost" onClick={() => router.back()}><ArrowLeft className="mr-2" />Back</Button> */}
        <div className="flex gap-2">
          {/* <Dialog open={openShare} onOpenChange={setOpenShare}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={() => setOpenShare(true)}><Share2 className="mr-2" />Share</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Share Challenge</DialogTitle></DialogHeader>
              <div className="mt-4">Share this link with a friend:</div>
              <div className="mt-2 p-2 bg-gray-100 rounded">{typeof window !== "undefined" ? window.location.href : ""}</div>
            </DialogContent>
          </Dialog> */}
          
        </div>
      </div>

      {/* Segmented Progress Bar */}

      {/* Calendar for current month with navigation and tooltips */}
      <TooltipProvider>
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <Button variant="ghost" size="sm" onClick={() => {
              if (calendarMonth === 0) {
                setCalendarMonth(11);
                setCalendarYear(calendarYear - 1);
              } else {
                setCalendarMonth(calendarMonth - 1);
              }
            }}>
              <ArrowLeft /></Button>
            <h3 className="text-xl">{new Date(calendarYear, calendarMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
            <Button variant="ghost" size="sm" onClick={() => {
              if (calendarMonth === 11) {
                setCalendarMonth(0);
                setCalendarYear(calendarYear + 1);
              } else {
                setCalendarMonth(calendarMonth + 1);
              }
            }}>
              <ArrowRight />
            </Button>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {[...Array(daysInMonth)].map((_, i) => {
              const day = i + 1;
              const dateStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const status = checkinMap.get(dateStr);
              let bg = 'bg-white/5';
              if (status === 'Y') bg = 'bg-[#34d399]';
              else if (status === 'N') bg = 'bg-[#ef4444]';
              let border = '';
              // Always highlight start and end date if they appear in this month
              if (dateStr === startDateStr) border = 'border-2 border-white';
              // if (dateStr === endDateStr) border = 'border-2 border-yellow-500';
              return (
                <Tooltip key={dateStr}>
                  <TooltipTrigger asChild>
                    <div className={`relative h-6 w-full rounded-md flex items-center justify-center cursor-pointer ${bg} ${border}`}></div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs px-2 py-1">
                    <div>{dateStr}</div>
                    <div className="">
                      {dateStr === startDateStr ? 'Start of challenge' : status === 'Y' ? 'Completed' : status === 'N' ? 'Failed' : 'Empty'}
                    </div>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </div>
      </TooltipProvider>

      {/* Main card */}


      {/* Check-in history */}
      <div className="mt-10 w-full rounded-2xl p-6 border border-border space-y-2">
        <h3 className="text-lg mb-3">Check-in history</h3>
        <div className="flex flex-col w-full gap-1">
          {(() => {

            return (
              <>
                {checkins.map((entry: string, idx: number) => {
                  const [status, date] = entry.split("_");
                  const isFirst = idx === checkins.length - 1;
                  const isLast = idx === 0;
                  let roundedClass = "";
                  if (isFirst && isLast) {
                    roundedClass = "rounded-xl";
                  } else if (isFirst) {
                    roundedClass = "rounded-b-xl rounded-sm";
                  } else if (isLast) {
                    roundedClass = "rounded-t-xl rounded-sm";
                  } else {
                    roundedClass = "rounded-sm";
                  }
                  return (
                    <div
                      key={idx}
                      className={`w-full p-2.5 px-3 flex items-center gap-4 ${roundedClass} ${status === "Y" ? "bg-emerald-950" : "bg-red-950"}`}
                    >
                      <span className="text-2xl font-bold">{status === "Y" ? <CalendarCheck weight="fill" className="size-5 text-emerald-500" /> : <CalendarX weight="fill" className="size-5 text-red-500" />}</span>
                      <span className="text-sm">
                        {new Date(date).toLocaleDateString(undefined, {
                          weekday: "long",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <span className="ml-auto text-xs text-white/50">
                        {status === "Y" ? "Completed" : "Failed"}
                      </span>
                    </div>
                  );
                })}
                {showCount < habit.checkin.length && (
                  <Button
                    variant="outline"
                    className="mt-2"
                    onClick={() => setShowCount((c) => Math.min(c + 5, habit.checkin.length))}
                  >
                    Show more
                  </Button>
                )}
              </>
            );
          })()}
        </div>
      </div>

      <Dialog open={openForfeit} onOpenChange={setOpenForfeit}>
            <DialogTrigger asChild>
              {<Button className="mt-4 !bg-red-500 hover:!bg-red-400" variant="destructive" onClick={() => setOpenForfeit(true)}><XCircle className="mt-" />Forfeit</Button>}
            </DialogTrigger>
            <DialogContent>
               <DialogHeader><DialogTitle>Forfeit Challenge</DialogTitle></DialogHeader>
              <div className="mt-4">Your deposit will be deleted forever and you will no longer have access to this challenge.</div>
              {!habit.status && <Button className="mt-4" variant="destructive" onClick={handleForfeit}>Forfeit</Button>}
            </DialogContent>
          </Dialog>
    </div>
  );
}
