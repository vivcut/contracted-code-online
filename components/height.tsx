import { useEffect, useState } from 'react';
import { ArrowLeft, Rainbow } from "lucide-react";
import { LoadingSpinner } from "./ui/spinner";
import FadeIn from "react-fade-in";
import { fetchAI, fetchAIFull } from '@/lib/fetch';
import { run } from 'node:test';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { ArrowLeftIcon, Bed, CaretLeftIcon, ChartLineUpIcon, Person, PersonSimple, PersonSimpleRunIcon } from '@phosphor-icons/react';

export default function Height({ data }: any) {
    if (!data) return <></>;

    const texts = [
        "Calculating your potential",
        "Analyzing your data",
        "Estimating your growth",
        "Unlocking your capabilities"
    ];

    const [currentText, setCurrentText] = useState(texts[0]);
    const [index, setIndex] = useState(0);

    const [verbana, setVerbana] = useState<any>(null);

    useEffect(() => {
        const run = async () => {

            const aiResponse = await fetchAI([
                {
                    role: "assistant",
                    content: "The user will provide you information about himself, and you should respond strictly with a JSON object containing these fields:  future_height (return a string in feet and inches), optimized_height (return a string in feet and inches), growth_completion_percentage (how much % of full growth is completed), dream_height_odds_ratio (as in 1 in X chance the user can achieve his dream height), and future_optimizations (what things the user needs to do to optimize his height). Don't include any other text or explanation.",
                },
                {
                    role: "user",
                    content: JSON.stringify(data)
                }
            ])

            if (!aiResponse) return;

            const sanitizedJson = aiResponse.replace(
                /"dream_height_odds_ratio":\s*([^,\n}]+)/g,
                '"dream_height_odds_ratio": "$1"'
            );


            // Parse the corrected JSON
            try {
                const parsedData = JSON.parse(sanitizedJson);
                console.log(parsedData)
                setVerbana(parsedData)
            } catch (error) {
                console.error("Failed to parse JSON:", error);
            }
        }


        run();
    }, [data])

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex(prevIndex => (prevIndex + 1) % texts.length);
            setCurrentText(texts[(index + 1) % texts.length]);
        }, 3000); // Change text every 3 seconds

        return () => clearInterval(interval);
    }, [index, texts]);

    if (!verbana) {
        return (
            <div className="w-full h-full border-dashed border-white/10 border-2 flex flex-col space-y-2 items-center justify-center rounded-3xl">
                <Rainbow className="animate-pulse size-14" />

                <FadeIn>
                    <p className="text-muted-foreground text-sm">{currentText}..</p>
                </FadeIn>
            </div>
        );
    } else {
        return <>
            <div className="w-full h-full grid gap-6 pb-6 bg-background text-foreground">

                {/* Metrics Grid */}
                <div className='flex w-full space-x-4 items-center'>
                    <Rainbow className='size-9' />

                    <div className='flex items-center space-x-2'>

                        <ArrowLeftIcon onClick={() => window.location.reload()} className='size-5 text-muted-foreground hover:text-white' />

                        <p className='text-xl'>Last report</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <FadeIn delay={400} className=''>
                        <Card className="from-white to-sky-200 h-[180px] bg-gradient-to-tr relative">
                            <CardHeader className="pb-12"> {/* Extra padding at bottom */}
                                <CardTitle className="text-sm font-medium text-muted">Future Height</CardTitle>
                                <CardDescription className="text-black font-bold text-4xl">
                                    {verbana?.future_height}
                                </CardDescription>
                            </CardHeader>
                            <PersonSimple weight='regular' className="absolute size-8 text-black/35 right-6 bottom-6" />
                        </Card>
                    </FadeIn>

                    <FadeIn delay={800} className=''>
                        <Card className="from-chart-1 to-blue-500 bg-gradient-to-r relative h-[180px]">
                            <CardHeader className="pb-12">
                                <CardTitle className="text-sm font-medium text-white/90">Optimized Potential</CardTitle>
                                <CardDescription className="text-3xl font-bold text-white">
                                    {verbana?.optimized_height}
                                </CardDescription>
                            </CardHeader>
                            <PersonSimpleRunIcon className="absolute size-8 text-black/35 right-6 bottom-6" />
                        </Card>
                    </FadeIn>

                    <FadeIn className="" delay={1200}>
                        <Card className="bg-muted border-border/50 relative h-[180px]">
                            <CardHeader className="pb-12">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Growth Percentage
                                </CardTitle>
                                <CardContent className="p-0 pt-2">
                                    <p className="text-2xl font-bold">
                                        {(verbana?.growth_completion_percentage).toFixed(1)}% done
                                    </p>
                                    <Progress
                                        value={verbana.growth_completion_percentage}
                                        className="h-3 rounded-xl bg-background mt-4"

                                    />
                                </CardContent>
                            </CardHeader>
                            <ChartLineUpIcon className="absolute size-7 text-muted-foreground/60 right-6 bottom-6" />
                        </Card>
                    </FadeIn>
                    <FadeIn className="w-full" delay={1600}>
                        <Card className="bg-muted border-border/50 relative h-[180px]">
                            <CardHeader className="pb-12">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Dream Height Odds
                                </CardTitle>
                                <CardDescription className="text-4xl mt-3 font-bold text-foreground">
                                    {verbana.dream_height_odds_ratio}
                                </CardDescription>
                            </CardHeader>
                            <Bed className="absolute size-7 text-muted-foreground/60 right-6 bottom-6" />
                        </Card>
                    </FadeIn>

                </div>

                {/* Optimization Steps */}
                <FadeIn delay={2000}>
                    <Card className="bg-muted border-border/50">
                        <CardHeader>
                            <CardTitle className="text-xl">Maximization Protocol</CardTitle>
                            <CardDescription>Actionable steps to reach your genetic potential</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {verbana?.future_optimizations?.map((step: any, index: any) => (<div
                                    key={index}
                                    className="flex items-start gap-3 p-4 rounded-lg bg-background border border-border/30 hover:border-primary/30 transition-colors"
                                >
                                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary mt-0.5 shrink-0">
                                        {index + 1}
                                    </div>
                                    <p className="text-sm leading-relaxed">{step}</p>
                                </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </FadeIn>
            </div>
        </>

    }
}